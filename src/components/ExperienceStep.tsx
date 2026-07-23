"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, UseFormRegisterReturn } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  AlertCircle,
  X,
  Building2,
  UserCheck,
  Calendar,
} from "lucide-react";
import {
  getResumeFromResponse,
  mapWorkExperienceFromDb,
  mapWorkExperienceToDb,
} from "@/lib/resume-api-utils";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
  onClose?: () => void;
}

interface ExperienceItem {
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface FormValues {
  experience: ExperienceItem[];
}

export default function ExperienceStep({
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
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      experience: [
        {
          company: "",
          role: "",
          employmentType: "Full Time",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
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
      const experience = mapWorkExperienceFromDb(
        resume?.workExperience as Record<string, unknown>[] | undefined
      );

      if (experience.length > 0) {
        reset({ experience });
      }
    } catch (error) {
      console.error("Failed to fetch experience details:", error);
      setErrorMessage("Could not load saved work experience. You can still fill out the form.");
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async (index: number) => {
    try {
      setGeneratingIndex(index);
      setErrorMessage(null);

      const exp = watch(`experience.${index}`);
      const { data: resumeData } = await axios.get(`/api/resume/${resumeId}`);
      const resume = getResumeFromResponse(resumeData) ?? {};

      const { data } = await axios.post("/api/ai/generate-experience", {
        jobRole: exp.role || String(resume.jobTitle ?? "Software Engineer"),
        experienceLevel: String(resume.experienceLevel ?? "Mid-Level"),
        company: exp.company || "",
      });

      if (data?.description) {
        setValue(`experience.${index}.description`, data.description);
      }
    } catch (error: any) {
      console.error("Failed to generate experience description:", error);
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

      await axios.patch(`/api/resume/${resumeId}`, {
        workExperience: mapWorkExperienceToDb(values.experience),
      });

      onNext();
    } catch (error: any) {
      console.error("Failed to save experience details:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to save work experience. Please try again."
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
      <div className="relative z-10 bg-slate-900/90 border border-slate-800/80 w-full max-w-xl rounded-2xl shadow-2xl shadow-indigo-950/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Work Experience
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
          {/* Scrollable Container with Ultra-thin Custom Scrollbar */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-indigo-600/50 pr-2">
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
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const currentlyWorking = watch(`experience.${index}.currentlyWorking`);

                  return (
                    <div
                      key={field.id}
                      className="relative p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3.5 group hover:border-slate-700/80 transition-all duration-200"
                    >
                      {/* Entry Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Experience #{index + 1}
                        </span>

                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-950/40 transition-colors"
                            title="Remove experience"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3.5">
                        {/* Company Name */}
                        <InputField
                          label="Company Name"
                          placeholder="e.g. Google / Microsoft"
                          icon={<Building2 size={16} />}
                          register={register(`experience.${index}.company` as const, {
                            required: "Company name is required",
                          })}
                          error={errors.experience?.[index]?.company?.message}
                        />

                        {/* Job Title */}
                        <InputField
                          label="Job Title / Role"
                          placeholder="e.g. Senior Frontend Engineer"
                          icon={<UserCheck size={16} />}
                          register={register(`experience.${index}.role` as const, {
                            required: "Job title is required",
                          })}
                          error={errors.experience?.[index]?.role?.message}
                        />

                        {/* Employment Type */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                            Employment Type
                          </label>
                          <select
                            {...register(`experience.${index}.employmentType` as const)}
                            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 text-sm outline-none transition-all"
                          >
                            <option value="Full Time">Full Time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Part Time">Part Time</option>
                          </select>
                        </div>

                        {/* Dates Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <InputField
                            label="Start Date"
                            type="date"
                            placeholder="YYYY-MM-DD"
                            icon={<Calendar size={16} />}
                            register={register(`experience.${index}.startDate` as const)}
                          />

                          <InputField
                            label="End Date"
                            type="date"
                            placeholder="YYYY-MM-DD"
                            disabled={currentlyWorking}
                            icon={<Calendar size={16} />}
                            register={register(`experience.${index}.endDate` as const)}
                          />
                        </div>

                        {/* Currently Working Checkbox */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`currentlyWorking-${index}`}
                            {...register(`experience.${index}.currentlyWorking` as const)}
                            className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                          />
                          <label
                            htmlFor={`currentlyWorking-${index}`}
                            className="text-xs text-slate-300 font-medium cursor-pointer"
                          >
                            I am currently working in this role
                          </label>
                        </div>

                        {/* Description with AI Helper */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              Responsibilities
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
                            rows={3}
                            {...register(`experience.${index}.description` as const)}
                            placeholder="Detail key impacts, tools used, and key metric improvements..."
                            className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add More Experience Button */}
                <button
                  type="button"
                  onClick={() =>
                    append({
                      company: "",
                      role: "",
                      employmentType: "Full Time",
                      startDate: "",
                      endDate: "",
                      currentlyWorking: false,
                      description: "",
                    })
                  }
                  className="w-full py-2.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-indigo-400 hover:text-indigo-300 font-semibold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  <span>Add Another Experience</span>
                </button>
              </div>
            )}
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
  disabled?: boolean;
  icon: React.ReactNode;
  register: UseFormRegisterReturn;
  error?: string;
}

function InputField({
  label,
  placeholder,
  type = "text",
  disabled = false,
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
          disabled={disabled}
          {...register}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-2.5 bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-950 ${
            disabled ? "opacity-50 cursor-not-allowed bg-slate-900" : ""
          } ${
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