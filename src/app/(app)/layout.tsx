import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import "../globals.css";

export const metadata: Metadata = {
  title: "InkApp - Dashboard",
  description: "Gestiona tus citas de tatuaje",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <Header />
      <main className="relative z-10 pt-16">
        {children}
      </main>
    </div>
  );
}
