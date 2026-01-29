import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-parchment overflow-hidden flex h-screen`}>
        {/* Fixed Sidebar */}
        <Sidebar />
        
        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 pb-20 text-deepTeal">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}