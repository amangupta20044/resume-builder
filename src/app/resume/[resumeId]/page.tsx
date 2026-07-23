"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PersonalInfoStep from "@/components/PersonalInfoStep";
import SummaryStep from "@/components/SummaryStep";
import EducationStep from "@/components/EducationStep";
import SkillsStep from "@/components/SkillsStep";
import ProjectsStep from "@/components/ProjectSetup";
import ExperienceStep from "@/components/ExperienceStep";
import CertificationsStep from "@/components/CertificationsStep";

const TOTAL_STEPS = 7;

const STEP_LABELS = [
  "Personal Info",
  "Summary",
  "Education",
  "Skills",
  "Projects",
  "Experience",
  "Certifications",
];

export default function ResumeBuilderPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;
  const [step, setStep] = useState(1);

  const goBack = () => setStep((prev) => Math.max(1, prev - 1));
  const goNext = () => setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));

  return (
    <div className="relative min-h-screen">
      {/* Step progress — hidden while modal steps are open */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-4 pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>
              Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step - 1]}
            </span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Keep all steps mounted so form state persists when navigating back */}
      <div className={step === 1 ? "block" : "hidden"}>
        <PersonalInfoStep resumeId={resumeId} onNext={goNext} />
      </div>

      <div className={step === 2 ? "block" : "hidden"}>
        <SummaryStep resumeId={resumeId} onBack={goBack} onNext={goNext} />
      </div>

      <div className={step === 3 ? "block" : "hidden"}>
        <EducationStep resumeId={resumeId} onBack={goBack} onNext={goNext} />
      </div>

      <div className={step === 4 ? "block" : "hidden"}>
        <SkillsStep resumeId={resumeId} onBack={goBack} onNext={goNext} />
      </div>

      <div className={step === 5 ? "block" : "hidden"}>
        <ProjectsStep resumeId={resumeId} onBack={goBack} onNext={goNext} />
      </div>

      <div className={step === 6 ? "block" : "hidden"}>
        <ExperienceStep resumeId={resumeId} onBack={goBack} onNext={goNext} />
      </div>

      <div className={step === 7 ? "block" : "hidden"}>
        <CertificationsStep resumeId={resumeId} onBack={goBack} />
      </div>
    </div>
  );
}
