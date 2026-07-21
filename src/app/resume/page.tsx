"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  FileText,
  Trash2,
  Briefcase,
  Sparkles,
  ArrowRight,
  X,
  Loader2,
  Eye,
  Layers,
} from "lucide-react";

import {
  createResumeApi,
  deleteResumeApi,
  getAllResumesApi,
} from "@/apis/resume.api";

interface Resume {
  _id: string;
  title: string;
  jobTitle: string;
  experienceLevel: string;
}

export default function ResumePage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    jobTitle: "",
    experienceLevel: "Fresher",
  });

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getAllResumesApi();
      setResumes(data.resumes || []);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Resume Title is required");
      return;
    }

    try {
      setCreating(true);
      setFormError(null);
      const response = await createResumeApi({
        title: formData.title.trim(),
        jobTitle: formData.jobTitle.trim() || "Software Engineer",
        experienceLevel: formData.experienceLevel,
      });

      const resumeId = response.data._id;
      router.push(`/resume/${resumeId}`);
    } catch (error) {
      console.error("Error creating resume:", error);
      setFormError("Failed to create resume. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    try {
      setDeletingId(resumeId);
      await deleteResumeApi(resumeId);
      await fetchResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span>
              Resume<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <button
            onClick={() => {
              setFormData({ title: "", jobTitle: "", experienceLevel: "Fresher" });
              setFormError(null);
              setShowModal(true);
            }}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40"
          >
            <Plus className="w-4 h-4" />
            <span>Create Resume</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {/* Page Title & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Resumes
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage, edit, and optimize your ATS-friendly resume versions.
            </p>
          </div>

          {!loading && resumes.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium self-start sm:self-auto">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"} Total</span>
            </div>
          )}
        </div>

        {/* Skeleton Loader */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 animate-pulse space-y-4"
              >
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-6 bg-slate-800 rounded-full w-1/4 mt-4" />
                <div className="h-10 bg-slate-800 rounded-xl mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && resumes.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 sm:p-16 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-slate-800/80 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FileText className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">No resumes found</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              You haven&apos;t created any resumes yet. Start now and let Gemini AI guide your bullet points and ATS score.
            </p>

            <button
              onClick={() => {
                setFormData({ title: "", jobTitle: "", experienceLevel: "Fresher" });
                setFormError(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4 cursor-pointer" />
              <span className="cursor-pointer">Create Your First Resume</span>
            </button>
          </div>
        )}

        {/* Resume Grid */}
        {!loading && resumes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {resume.title}
                    </h2>

                    <button
                      onClick={() => handleDelete(resume._id)}
                      disabled={deletingId === resume._id}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-950/40 transition-colors shrink-0 disabled:opacity-50"
                      title="Delete Resume"
                    >
                      {deletingId === resume._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Job Title & Experience */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="line-clamp-1">{resume.jobTitle || "Not specified"}</span>
                    </div>

                    <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-medium">
                      {resume.experienceLevel}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/resume/${resume._id}`)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                  >
                    <span>Edit Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => router.push(`/resume/${resume._id}/preview`)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
                    title="Preview Resume"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Create New Resume</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateResume} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Resume Title <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer - 2026"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceLevel: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 text-sm outline-none transition-all"
                >
                  <option value="Fresher">Fresher / Graduate</option>
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (2-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span className="cursor-pointer">Create Resume</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}