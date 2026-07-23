"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ResumePreviewClient from "./preview-client";

function PreviewContent() {
  const { resumeId } = useParams();
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("print") === "true";

  if (!resumeId || typeof resumeId !== "string") {
    return null;
  }

  return (
    <ResumePreviewClient resumeId={resumeId} autoPrint={autoPrint} />
  );
}

export default function ResumePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col justify-center items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="text-sm font-medium text-zinc-400">
            Loading Resume Preview...
          </span>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
