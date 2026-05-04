"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Footer } from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function QrPage() {
  const url = React.useSyncExternalStore(
    () => () => {},
    () => `${window.location.origin}/feedback`,
    () => `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "") || "http://localhost:3000"}/feedback`
  );

  return (
    <div className="min-h-svh bg-[#FAFAFA]">
      <AppNavbar />
      <main className="mx-auto max-w-xl space-y-8 px-4 py-14">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-[#4285F4]">QR access</p>
          <h1 className="text-3xl font-semibold tracking-tight">Mess feedback QR code</h1>
          <p className="text-sm text-neutral-600">
            Scan to open the anonymous feedback form. Link uses {url ? "this site's address" : "this device"}.
          </p>
        </div>
        <Card className="border-black/[0.06] bg-white/85 backdrop-blur">
          <CardHeader>
            <CardTitle>Feedback QR</CardTitle>
            <CardDescription>Opens the same multi-step feedback form as on the website.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-10">
            {url ? (
              <div className="rounded-3xl bg-white p-6 shadow-xl shadow-black/[0.05] ring-1 ring-black/[0.05]">
                <QRCodeSVG value={url} size={236} fgColor="#1f1f1f" bgColor="#ffffff" />
              </div>
            ) : (
              <div className="h-[236px] w-[236px] animate-pulse rounded-3xl bg-neutral-100" />
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
