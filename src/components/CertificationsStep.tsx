"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getResumeFromResponse } from "@/lib/resume-api-utils";

interface Props {
  resumeId: string;
  onBack: () => void;
  onClose?: () => void;
}

export default function CertificationsStep({
  resumeId,
  onBack,
  onClose,
}: Props) {
  const router = useRouter();
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const saved = resume?.certifications;
      setCertifications(Array.isArray(saved) ? (saved as string[]) : []);
    } catch (error) {
      console.error("Failed to fetch certifications:", error);
      setErrorMessage("Could not load saved certifications.");
    } finally {
      setLoading(false);
    }
  };

  const addCertification = () => {
    const value = certInput.trim();
    if (!value || certifications.includes(value)) return;
    setCertifications((prev) => [...prev, value]);
    setCertInput("");
  };

  const removeCertification = (cert: string) => {
    setCertifications((prev) => prev.filter((item) => item !== cert));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);

      await axios.patch(`/api/resume/${resumeId}`, { certifications });

      router.push(`/resume/${resumeId}/preview`);
    } catch (error: unknown) {
      console.error("Failed to save certifications:", error);
      setErrorMessage("Failed to save certifications. Please try again.");
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
            <Award className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Certifications
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Add Certification
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCertification();
                  }
                }}
                placeholder="e.g. AWS Certified Developer"
                className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
              />
              <button
                type="button"
                onClick={addCertification}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-slate-800 rounded-xl" />
              ))}
            </div>
          ) : certifications.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl">
              <p className="text-slate-500 text-xs">
                No certifications added yet. Add any relevant credentials above.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-200"
                >
                  <span>{cert}</span>
                  <button
                    type="button"
                    onClick={() => removeCertification(cert)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-950/40 transition-colors"
                    title={`Remove ${cert}`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
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
                <span>Finish & Preview</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
