import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PicaPico",
  description: "하루 20분, 퀴즈와 섀도잉으로 익히는 여행 스몰토크 스페인어",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PicaPico",
  },
};

export const viewport: Viewport = {
  themeColor: "#262626",
  width: "device-width",
  initialScale: 1,
  // PicaPico only ships a light UI — this stops the browser from applying
  // its own automatic dark rendering (canvas/scrollbar/overscroll areas
  // turning black) when the OS is set to dark mode. Paired with
  // `color-scheme: light` in globals.css; the <meta> tag this generates
  // takes effect before CSS even loads, so it catches the initial paint too.
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        {children}
      </body>
    </html>
  );
}
