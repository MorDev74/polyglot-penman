import type { Metadata } from "next";
import "@/styles/globals.css";
import { SideBar } from "@/components/SideBar";
import { DevContextProvider } from "@/hooks/context";

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
        <DevContextProvider>

        <div className="flex flex-row h-screen">
          <SideBar />
          {children}
        </div>

        </DevContextProvider>
      </body>
    </html>
  );
}
