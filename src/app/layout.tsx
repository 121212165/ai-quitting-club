import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "戒酒互助会",
  description: "记录每一天，度过危机时刻，和其他人一起坚持戒酒",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
