"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { registerApi } from "@/apis/auth.api";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);
      await registerApi(data);
      router.push("/auth/login?registered=true");
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-indigo-500 selection:text-white">
      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between overflow-hidden">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-xl text-white">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <span>
              Resume<span className="text-indigo-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Feature Highlights Hero Box */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Career Tools</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Build production-ready resumes in minutes.
          </h1>

          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Leverage Gemini AI to craft high-impact summaries, fine-tune key skills, and achieve top ATS compatibility scores effortlessly.
          </p>

          <div className="space-y-3.5 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Real-time ATS score analyzer & suggestions</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Tailored experience descriptions using modern AI</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Instant step-by-step live preview</span>
            </div>
          </div>
        </div>

        {/* Bottom Micro Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Resume Builder AI. All rights reserved.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          {/* Header text */}
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Create an account
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Get started for free and craft your resume with AI assistance.
            </p>
          </div>

          {/* Inline Error Alert */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  placeholder="e.g. John Doe"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900 border rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-900/80 ${
                    errors.name
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900 border rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-900/80 ${
                    errors.email
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 bg-slate-900 border rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:bg-slate-900/80 ${
                    errors.password
                      ? "border-red-500/80 focus:ring-2 focus:ring-red-500/30"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}