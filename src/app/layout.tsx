import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";


const inter = Inter({
  subsets: ["latin"],
  display: "auto",
  variable: "--font-inter"
})
export const metadata: Metadata = {
  title: "PacR, Your Runs, Your Way",
  description: "PacR is a web application that allows you to upload and view your runs."
}

export default function RootLayout({children,}: Readonly<{ children: ReactNode }>) {
  return (
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </html>
  )
}
