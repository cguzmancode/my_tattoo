import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InkApp - Tattoo Booking Platform",
  description: "Gestiona tus citas de tatuaje profesionalmente. Conecta artistas con clientes.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground font-body antialiased">
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
