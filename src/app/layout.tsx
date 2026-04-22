import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
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
<ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    >
    <html lang="es" className={`${inter.variable} dark`}>
        <body className="min-h-screen bg-background text-foreground font-body antialiased">
          <NoiseOverlay />
          <Header />
          <main className="relative z-10">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
