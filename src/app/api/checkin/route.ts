import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getValidAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callAI, addNote } from '@/lib/secondme';

export async function POST(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { didDrink, note } = body;

    if (typeof didDrink !== 'boolean') {
      return NextResponse.json({ error: '请选择今天的状态' }, { status: 400 });
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: user.id,
        didDrink,
        note,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastCheckIn: new Date(),
        ...(didDrink
          ? { soberDays: 0 }
          : { soberDays: { increment: 1 } }),
      },
    });

    const token = await getValidAccessToken(user.id);

    if (note && token) {
      try {
        await callAI(token, `我今天打卡了，${didDrink ? '喝了酒' : '没有喝酒'}，想分享一下：${note}`);
        await addNote(token, `打卡记录：${note}`);
      } catch {
        // AI call is non-critical
      }
    }

    await prisma.message.create({
      data: {
        userId: user.id,
        content: didDrink
          ? '今天喝了酒，但不会放弃。'
          : `又坚持了一天！已戒 ${user.soberDays + 1} 天。`,
        messageType: 'check_in',
        aiGenerated: false,
      },
    });

    return NextResponse.json({ success: true, checkIn });
  } catch (error) {
    console.error('打卡失败:', error);
    return NextResponse.json({ error: '打卡失败，请重试' }, { status: 500 });
  }
}
