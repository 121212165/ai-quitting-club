import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getValidAccessToken } from '@/lib/auth';
import { callAI, addNote } from '@/lib/secondme';

export async function POST(request: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mood, note, didDrink } = body;

    if (!mood) {
      return NextResponse.json({ error: '请选择心情' }, { status: 400 });
    }

    // 创建打卡记录
    const checkIn = await prisma.checkIn.create({
      data: {
        userId: user.id,
        mood,
        note,
        didDrink: didDrink || false,
      },
    });

    // 更新用户的最后打卡时间
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastCheckIn: new Date(),
      },
    });

    // 如果没有喝酒，增加戒酒天数
    if (!didDrink) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          soberDays: {
            increment: 1,
          },
        },
      });
    }

    // 获取有效的 access token
    const token = await getValidAccessToken(user.id);

    // 如果有备注，发送给 AI 并保存为笔记
    if (note && token) {
      try {
        // 调用 AI 聊天
        await callAI(token, `我今天打卡了，心情${mood}，想分享一下：${note}`);

        // 保存为笔记
        await addNote(token, `打卡记录：${note}`);
      } catch (error) {
        console.error('调用 AI 失败:', error);
        // 不影响打卡流程，继续执行
      }
    }

    // 创建打卡消息
    await prisma.message.create({
      data: {
        userId: user.id,
        content: `完成今日打卡，心情：${mood}${note ? `，备注：${note}` : ''}`,
        messageType: 'check_in',
        aiGenerated: false,
      },
    });

    return NextResponse.json({
      success: true,
      checkIn,
    });
  } catch (error) {
    console.error('打卡失败:', error);
    return NextResponse.json({ error: '打卡失败，请重试' }, { status: 500 });
  }
}
