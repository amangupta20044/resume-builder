"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";

interface Props {
  resumeId: string | null;
  onNext: () => void;
  onClose?: () => void;
}

interface PersonalInfoForm {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
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

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function PersonalInfoStep({ resumeId, onNext, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoForm>();

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
      if (data?.resume?.personalInfo) {
        reset(data.resume.personalInfo);
      }
    } catch (error) {
      console.error("Failed to fetch personal info:", error);
      setErrorMessage("Could not load saved data. You can still fill out the form.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: PersonalInfoForm) => {
    try {
      setErrorMessage(null);
      await axios.patch(`/api/resume/${resumeId}`, {
        personalInfo: values,
      });

      onNext();
    } catch (error: any) {
      console.error("Error saving personal info:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to save information. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. Frosted Backdrop + Vignette Overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xl backdrop-saturate-150 transition-all" />

      {/* 2. Ambient Light Orbs for Rich Glowing Blur effect */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-600/25 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* 3. Centered Modal Card */}
      <div className="relative z-10 bg-slate-900/90 border border-slate-800/80 w-full max-w-xl rounded-2xl shadow-2xl shadow-indigo-950/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Personal Information
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

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-4 py-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 bg-slate-800 rounded w-1/4" />
                  <div className="h-10 bg-slate-950/80 border border-slate-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Full Name */}
              <InputField
                label="Full Name"
                placeholder="e.g. John Doe"
                icon={<User size={16} />}
                register={register("fullName", {
                  required: "Full name is required",
                })}
                error={errors.fullName?.message}
              />

              {/* Email */}
              <InputField
                label="Email Address"
                placeholder="e.g. john@example.com"
                icon={<Mail size={16} />}
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email?.message}
              />

              {/* Phone */}
              <InputField
                label="Phone Number"
                placeholder="e.g. +1 (555) 000-0000"
                icon={<Phone size={16} />}
                register={register("phone", {
                  required: "Phone number is required",
                })}
                error={errors.phone?.message}
              />

              {/* Location */}
              <InputField
                label="Location"
                placeholder="e.g. New York, NY"
                icon={<MapPin size={16} />}
                register={register("location")}
              />

              {/* Grid for Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="LinkedIn Profile"
                  placeholder="linkedin.com/in/username"
                  icon={<LinkedinIcon className="w-3.5 h-3.5" />}
                  register={register("linkedin")}
                />

                <InputField
                  label="GitHub Profile"
                  placeholder="github.com/username"
                  icon={<GithubIcon className="w-3.5 h-3.5" />}
                  register={register("github")}
                />
              </div>

              {/* Portfolio */}
              <InputField
                label="Portfolio / Website"
                placeholder="https://yourportfolio.com"
                icon={<Globe size={16} />}
                register={register("portfolio")}
              />
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}

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