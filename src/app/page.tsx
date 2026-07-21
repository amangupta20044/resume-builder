import Link from "next/link";
import { ArrowRight, Sparkles, FileText, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span>Resume<span className="text-indigo-400">AI</span></span>
          </Link>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by Gemini AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Craft Standout Resumes in Minutes with <span className="text-indigo-400">AI</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Create, optimize, and score your professional resume using smart AI assistance. Tailored for software engineers, designers, and job seekers.
        </p>

        {/* CTA Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            Create Your Resume Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-xl transition-all text-center"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <CheckCircle className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">AI Content Generation</h3>
            <p className="text-sm text-slate-400">Generate professional summaries, experience bullet points, and skills automatically.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <CheckCircle className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">ATS Optimization</h3>
            <p className="text-sm text-slate-400">Get an instant ATS compatibility score to ensure your resume gets past recruiter screens.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <CheckCircle className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Live Preview</h3>
            <p className="text-sm text-slate-400">Real-time preview step-by-step as you build and update your details.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Resume Builder AI. All rights reserved.
      </footer>
    </div>
  );
}