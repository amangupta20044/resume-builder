"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getResumeFromResponse } from "@/lib/resume-api-utils";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  X,
  Plus,
  Wrench,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
  onClose?: () => void;
}

export default function SkillsStep({
  resumeId,
  onNext,
  onBack,
  onClose,
}: Props) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    } else {
      setFetching(false);
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      setFetching(true);
      const { data } = await axios.get(`/api/resume/${resumeId}`);
      const resume = getResumeFromResponse(data);
      setSkills((resume?.skills as string[]) || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setErrorMessage("Could not load saved skills. You can still add them manually.");
    } finally {
      setFetching(false);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const cleanSkill = skillInput.trim();
    if (!skills.includes(cleanSkill)) {
      setSkills((prev) => [...prev, cleanSkill]);
    }
    setSkillInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((item) => item !== skillToRemove));
  };

  const generateSkills = async () => {
    try {
      setAiLoading(true);
      setErrorMessage(null);

      const { data: resumeData } = await axios.get(`/api/resume/${resumeId}`);
      const resume = getResumeFromResponse(resumeData) ?? {};

      const { data } = await axios.post("/api/ai/generate-skills", {
        jobTitle: String(resume.jobTitle ?? "Software Engineer"),
        experienceLevel: String(resume.experienceLevel ?? "Mid-Level"),
      });

      if (data?.data?.skills && Array.isArray(data.data.skills)) {
        // Merge generated skills without duplicates
        setSkills((prev) => Array.from(new Set([...prev, ...data.data.skills])));
      }
    } catch (error: any) {
      console.error("AI Skill generation failed:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to generate skills via AI. Please try adding manually."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const saveSkills = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      await axios.patch(`/api/resume/${resumeId}`, {
        skills,
      });

      onNext();
    } catch (error: any) {
      console.error("Failed to save skills:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to save skills. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. Frosted Backdrop + Vignette Overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xl backdrop-saturate-150 transition-all" />

      {/* 2. Ambient Light Orbs */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* 3. Centered Modal Card */}
      <div className="relative z-10 bg-slate-900/90 border border-slate-800/80 w-full max-w-xl rounded-2xl shadow-2xl shadow-indigo-950/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Key Skills & Competencies
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* AI Helper Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
            <div>
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                AI Assistant
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Generate job-relevant technical and soft skills automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={generateSkills}
              disabled={aiLoading || fetching}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Suggest Skills</span>
                </>
              )}
            </button>
          </div>

          {/* Manual Input Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Add Custom Skill
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. React, TypeScript, Docker"
                className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
              />

              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Active Skills Pill Container */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Selected Skills ({skills.length})
            </label>

            {fetching ? (
              <div className="flex flex-wrap gap-2 animate-pulse py-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-20 bg-slate-800 rounded-full" />
                ))}
              </div>
            ) : skills.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-500 text-xs">
                  No skills added yet. Use the AI suggestion button or type custom skills above.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 border border-indigo-800/60 text-indigo-200 text-xs font-medium rounded-full transition-all hover:border-indigo-600/80"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-indigo-400 hover:text-red-400 p-0.5 rounded-full hover:bg-red-950/40 transition-colors"
                      title={`Remove ${skill}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800/80 bg-slate-900/50 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={saveSkills}
            disabled={loading || fetching}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save & Continue</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}