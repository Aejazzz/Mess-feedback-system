import Link from "next/link";

import { FeedbackWizard } from "@/components/feedback/feedback-wizard";
import { AppNavbar } from "@/components/layout/app-navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Submit feedback — Amrita Food Feedback",
  description: "Submit anonymous mess feedback in a few short steps.",
};

export default function FeedbackPage() {
  return (
    <div className="min-h-svh min-w-0 bg-[#FAFAFA]">
      <AppNavbar />
      <main className="mx-auto min-w-0 max-w-3xl space-y-6 px-3 py-8 sm:px-4 sm:py-12">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-[#4285F4]">Anonymous feedback</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Submit mess feedback
          </h1>
          <p className="text-sm text-neutral-600">
            Your responses are anonymous. For the dashboard,{" "}
            <Link href="/" className="font-semibold text-[#4285F4] hover:underline">
              go to home
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
