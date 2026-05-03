import Link from "next/link";

import { FeedbackWizard } from "@/components/feedback/feedback-wizard";
import { AppNavbar } from "@/components/layout/app-navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Submit feedback — Amrita Food Feedback",
  description: "Anonymous, mobile-friendly mess feedback in four quick steps.",
};

export default function FeedbackPage() {
  return (
    <div className="min-h-svh bg-[#FAFAFA]">
      <AppNavbar />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-[#4285F4]">Voice without a footprint</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Whisper to the mess, loudly to the charts
          </h1>
          <p className="text-sm text-neutral-600">
            Need the overview? {" "}
            <Link href="/" className="font-semibold text-[#4285F4] hover:underline">
              Return home
            </Link>
            .
          </p>
        </div>
        <FeedbackWizard />
      </main>
      <Footer />
    </div>
  );
}
