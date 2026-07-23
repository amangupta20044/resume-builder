"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import {
  getResumeFromResponse,
} from "@/lib/resume-api-utils";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
  onClose?: () => void;
}

export default function SummaryStep({
  resumeId,
  onNext,
  onBack,
  onClose,
}: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    } else {
      setLoading(false);
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/resume/${resumeId}`);
      const resume = getResumeFromResponse(data);
      setSummary(String(resume?.summary ?? ""));
    } catch (error) {
      console.error("Failed to fetch summary:", error);
      setErrorMessage("Could not load saved summary. You can still write one.");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      setAiLoading(true);
      setErrorMessage(null);

      const { data } = await axios.post("/api/ai/generate-summary", {
        resumeId,
      });

      const generated =
        data?.data?.summary ?? data?.summary ?? data?.data?.professionalSummary;

      if (generated) {
        setSummary(generated);
      }
    } catch (error: unknown) {
      console.error("Failed to generate summary:", error);
      setErrorMessage("Failed to generate summary via AI. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);

      await axios.patch(`/api/resume/${resumeId}`, { summary });

      onNext();
    } catch (error: unknown) {
      console.error("Failed to save summary:", error);
      setErrorMessage("Failed to save summary. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xl backdrop-saturate-150 transition-all" />
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 bg-slate-900/90 border border-slate-800/80 w-full max-w-xl rounded-2xl shadow-2xl shadow-indigo-950/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Professional Summary
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

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
            <div>
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                AI Assistant
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Generate a tailored professional summary from your resume data.
              </p>
            </div>
            <button
              type="button"
              onClick={generateSummary}
              disabled={aiLoading || loading}
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
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>

          {loading ? (
            <div className="h-40 bg-slate-950/80 border border-slate-800 rounded-xl animate-pulse" />
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Summary
              </label>
              <textarea
                rows={8}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a concise professional summary highlighting your strengths and career goals..."
                className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}
        </div>

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
            onClick={handleSave}
            disabled={saving || loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
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
