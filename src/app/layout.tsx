import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });
const display = Syne({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Raj Mahajan — AI & Robotics",
  description:
    "Raj Mahajan builds intelligent systems where machine learning meets real-world robotics. Edge AI, computer vision, ROS2 and SLAM.",
  openGraph: {
    title: "Raj Mahajan — AI & Robotics",
    description:
      "Looking for an R&D team where my next robot gets built, tested and deployed.",
    type: "website",
  },
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('raj-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${sans.variable} ${display.variable} ${mono.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
