import type { Metadata } from "next";
import "@/styles/globals.css";
import { SideBar } from "@/components/SideBar";

export const metadata: Metadata = {
  title: "Polyglot Penman",
  description: "Polyglot Penman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <div className="flex flex-row h-screen">
          <SideBar />
          {children}
        </div>

      </body>
    </html>
  );
}
