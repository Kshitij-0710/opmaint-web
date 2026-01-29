import type { Metadata } from "next";
import localFont from "next/font/local"; // <--- 1. Import localFont
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";

// 2. Configure the local font with your specific files
const standard = localFont({
  src: [
    {
      path: "./fonts/Standerd-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Standerd-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Standerd-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Standerd-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-standard", // <--- 3. Define the CSS variable
});

export const metadata: Metadata = {
  title: "OpMaint Dashboard",
  description: "Maintenance Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 4. Use standard.variable instead of inter.className */}
      <body className={`${standard.variable} bg-parchment overflow-hidden flex h-screen font-sans`}>
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8 pb-20 text-deepTeal">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}