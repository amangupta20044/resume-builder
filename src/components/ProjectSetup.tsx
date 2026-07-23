"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getResumeFromResponse } from "@/lib/resume-api-utils";
import { useFieldArray, useForm, UseFormRegisterReturn } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  FolderGit2,
  Loader2,
  AlertCircle,
  X,
  Code2,
  Globe,
  FileText,
} from "lucide-react";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
  onClose?: () => void;
}

interface Project {
  title: string;
  techStack: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
}

interface FormValues {
  projects: Project[];
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function ProjectsStep({
  resumeId,
  onNext,
  onBack,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      projects: [
        {
          title: "",
          techStack: "",
          description: "",
          githubUrl: "",
          liveUrl: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

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
      const projects = resume?.projects as FormValues["projects"] | undefined;

      if (projects?.length) {
        reset({
          projects: projects.map((project) => ({
            ...project,
            techStack: Array.isArray(project.techStack)
              ? project.techStack.join(", ")
              : project.techStack || "",
          })),
        });
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setErrorMessage("Could not load saved projects. You can still fill out the form.");
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async (index: number) => {
    try {
      setGeneratingIndex(index);
      setErrorMessage(null);

      const project = watch(`projects.${index}`);
      const { data: resumeData } = await axios.get(`/api/resume/${resumeId}`);
      const resume = resumeData?.resume || {};

      const techArray = project.techStack
        ? project.techStack.split(",").map((t) => t.trim())
        : ["React", "Node.js"];

      const { data } = await axios.post(
        "/api/ai/generate-project-description",
        {
          jobTitle: resume.jobTitle || "Full Stack Developer",
          experienceLevel: resume.experienceLevel || "Mid-Level",
          projectTitle: project.title || "Web Application",
          techStack: techArray,
        }
      );

      if (data?.data?.projectDescription) {
        setValue(`projects.${index}.description`, data.data.projectDescription);
      }
    } catch (error: any) {
      console.error("Failed to generate project description:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to generate AI description. Try entering it manually."
      );
    } finally {
      setGeneratingIndex(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setErrorMessage(null);
      const formattedProjects = values.projects.map((project) => ({
        ...project,
        techStack: project.techStack
          ? project.techStack.split(",").map((tech) => tech.trim()).filter(Boolean)
          : [],
      }));

      await axios.patch(`/api/resume/${resumeId}`, {
        projects: formattedProjects,
      });

      onNext();
    } catch (error: any) {
      console.error("Failed to save projects:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to save projects. Please try again."
      );
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
      <div className="relative z-10 bg-slate-900/90 border border-slate-800/80 w-full max-w-2xl rounded-2xl shadow-2xl shadow-indigo-950/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Projects Showcase
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col overflow-hidden flex-1">
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {loading ? (
              <div className="space-y-4 py-6 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border border-slate-800 rounded-xl space-y-3 bg-slate-950/40">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-10 bg-slate-950/80 border border-slate-800 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 pr-1">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-4 group hover:border-slate-700/80 transition-all duration-200"
                  >
                    {/* Entry Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        Project #{index + 1}
                      </span>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-colors"
                          title="Remove project"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Title & Tech Stack Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                          label="Project Title"
                          placeholder="e.g. AI Resume Builder"
                          icon={<FileText size={16} />}
                          register={register(`projects.${index}.title` as const, {
                            required: "Project title is required",
                          })}
                          error={errors.projects?.[index]?.title?.message}
                        />

                        <InputField
                          label="Technologies Used"
                          placeholder="e.g. Next.js, React, MongoDB"
                          icon={<Code2 size={16} />}
                          register={register(`projects.${index}.techStack` as const)}
                        />
                      </div>

                      {/* GitHub & Live URL Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                          label="GitHub URL"
                          placeholder="github.com/user/project"
                          icon={<GithubIcon className="w-3.5 h-3.5" />}
                          register={register(`projects.${index}.githubUrl` as const)}
                        />

                        <InputField
                          label="Live Demo URL"
                          placeholder="https://myproject.com"
                          icon={<Globe size={16} />}
                          register={register(`projects.${index}.liveUrl` as const)}
                        />
                      </div>

                      {/* Description with AI Helper */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Description
                          </label>

                          <button
                            type="button"
                            onClick={() => generateDescription(index)}
                            disabled={generatingIndex === index}
                            className="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-300 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {generatingIndex === index ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                <span>AI Generate</span>
                              </>
                            )}
                          </button>
                        </div>

                        <textarea
                          rows={4}
                          {...register(`projects.${index}.description` as const)}
                          placeholder="Describe key features, optimizations, and impact..."
                          className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Projects */}
                <button
                  type="button"
                  onClick={() =>
                    append({
                      title: "",
                      techStack: "",
                      description: "",
                      githubUrl: "",
                      liveUrl: "",
                    })
                  }
                  className="w-full py-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-indigo-400 hover:text-indigo-300 font-semibold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  <span>Add Another Project</span>
                </button>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between p-5 border-t border-slate-800/80 bg-slate-900/50 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
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
        </form>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  register: UseFormRegisterReturn;
  error?: string;
}

function InputField({ label, placeholder, icon, register, error }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          {icon}
        </div>

        <input
          {...register}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-950 ${
            error
              ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
              : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          }`}
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}