"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, UseFormRegisterReturn } from "react-hook-form";
import {
  getResumeFromResponse,
} from "@/lib/resume-api-utils";
import {
  GraduationCap,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  X,
  Calendar,
  Building2,
  BookOpen,
} from "lucide-react";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
  onClose?: () => void;
}

interface EducationForm {
  education: {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
}

export default function EducationStep({
  resumeId,
  onNext,
  onBack,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationForm>({
    defaultValues: {
      education: [
        {
          institute: "",
          degree: "",
          startDate: "",
          endDate: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
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
      const education = resume?.education as EducationForm["education"] | undefined;

      if (education && education.length > 0) {
        reset({ education });
      }
    } catch (error) {
      console.error("Failed to fetch education data:", error);
      setErrorMessage("Could not load saved education history. You can still fill out the form.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: EducationForm) => {
    try {
      setErrorMessage(null);
      await axios.patch(`/api/resume/${resumeId}`, {
        education: values.education,
      });

      onNext();
    } catch (error: any) {
      console.error("Error saving education details:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to save information. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. Frosted Backdrop + Vignette Overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xl backdrop-saturate-150 transition-all" />

      {/* 2. Ambient Light Orbs for Glassmorphism Effect */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* 3. Centered Modal Card */}
      <div className="relative z-10 bg-slate-900/90 border border-slate-800/80 w-full max-w-2xl rounded-2xl shadow-2xl shadow-indigo-950/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Education Background
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

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
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
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-4 group hover:border-slate-700/80 transition-all duration-200"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Education #{index + 1}
                    </span>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-colors"
                        title="Remove entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Institute */}
                    <InputField
                      label="Institute / University"
                      placeholder="e.g. Guru Ghasidas Vishwavidyalaya"
                      icon={<Building2 size={16} />}
                      register={register(`education.${index}.institute` as const, {
                        required: "Institute name is required",
                      })}
                      error={errors.education?.[index]?.institute?.message}
                    />

                    {/* Degree */}
                    <InputField
                      label="Degree / Major"
                      placeholder="e.g. B.Tech Computer Science"
                      icon={<BookOpen size={16} />}
                      register={register(`education.${index}.degree` as const, {
                        required: "Degree name is required",
                      })}
                      error={errors.education?.[index]?.degree?.message}
                    />

                    {/* Start Date & End Date Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Start Date"
                        type="date"
                        placeholder="YYYY-MM-DD"
                        icon={<Calendar size={16} />}
                        register={register(`education.${index}.startDate` as const)}
                      />

                      <InputField
                        label="End Date (or Expected)"
                        type="date"
                        placeholder="YYYY-MM-DD"
                        icon={<Calendar size={16} />}
                        register={register(`education.${index}.endDate` as const)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={() =>
                  append({
                    institute: "",
                    degree: "",
                    startDate: "",
                    endDate: "",
                  })
                }
                className="w-full py-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-indigo-400 hover:text-indigo-300 font-semibold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Add Another Education</span>
              </button>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl"
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
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
  type?: string;
  icon: React.ReactNode;
  register: UseFormRegisterReturn;
  error?: string;
}

function InputField({
  label,
  placeholder,
  type = "text",
  icon,
  register,
  error,
}: InputFieldProps) {
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
          type={type}
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