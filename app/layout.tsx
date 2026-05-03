import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-app",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase:
    siteUrl && siteUrl.length > 0 ? new URL(siteUrl) : undefined,
  title: {
    default: "Amrita Food Feedback System",
    template: "%s — Amrita Food Feedback",
  },
  description:
    "Anonymous hostel mess feedback with live, gentle analytics for Amrita campuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-dvh bg-[#FAFAFA] antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
