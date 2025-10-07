import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner" 
import { Providers } from "./providers"
import { SessionProvider } from 'next-auth/react';  // ← NOUVEAU : Import Provider
import { auth } from '@/lib/auth';  // ← NOUVEAU : Import votre NextAuth config (ex. : app/api/auth/[...nextauth]/route.ts export { auth })

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: false, 
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  preload: false,
})

export const metadata: Metadata = {
  title: "AgriManager - Smart Agricultural Management",
  description: "AI-powered agricultural management platform for modern farmers",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
        {children}
        <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
