import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NoiseOverlay } from "@/components/layout/noise-overlay";
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
    <ClerkProvider>
      <div className="min-h-screen bg-background text-foreground font-body antialiased">
        <NoiseOverlay />
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </ClerkProvider>
  );
}
