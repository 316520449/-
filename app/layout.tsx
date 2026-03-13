import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "星梦AI写作 - 网文创作者专属AI助手",
  description: "对标星月写作、白梦写作，专为网文作者打造的AI写作工具，大纲生成、章节扩写、情节续写、AI消痕，轻松日更过万",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
