import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PublicHeader } from "@/components/layout/public-header";
import { NoiseOverlay } from "@/components/layout/noise-overlay";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InkApp - Tattoo Booking Platform",
  description: "Gestiona tus citas de tatuaje profesionalmente. Conecta artistas con clientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground font-body antialiased">
        <NoiseOverlay />
        <PublicHeader />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
