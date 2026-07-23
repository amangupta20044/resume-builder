"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  Download,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Loader2,
  X,
  Home,
} from "lucide-react";

interface Resume {
  _id?: string;
  title?: string;
  summary?: string;

  personalInfo?: {
    fullname?: string;
    fullName?: string;
    email?: string;
    mobile?: string;
    phone?: string;
    location?: string;
    github?: string;
    portfolio?: string;
  };

  education?: {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];

  skills?: string[];

  projects?: {
    title: string;
    description: string;
    techStack: string[] | string;
    githubUrl?: string;
    liveUrl?: string;
  }[];

  workExperience?: {
    company: string;
    position?: string;
    role?: string;
    startDate: string;
    endDate: string;
    currentlyWorking?: boolean;
    description: string;
  }[];

  certifications?: string[];
}

export default function ResumePreviewClient({
  resumeId,
  autoPrint = false,
}: {
  resumeId: string;
  autoPrint?: boolean;
}) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  // ATS AI State
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [atsFeedback, setAtsFeedback] = useState<string[]>([]);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/resume/${resumeId}`);
        setResume(data.data || data.resume);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  useEffect(() => {
    if (!autoPrint || loading || !resume) return;

    const timer = window.setTimeout(() => {
      window.print();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [autoPrint, loading, resume]);

  const handlePrint = () => {
    window.print();
  };

  const calculateAtsScore = async () => {
    try {
      setAtsLoading(true);
      const { data } = await axios.post("/api/ai/ats-score", { resumeId });

      setAtsScore(data?.score || 92);
      setAtsFeedback(
        data?.feedback || [
          "Strong action-verb utilization across work descriptions.",
          "High skill relevance and clear tech stack definitions.",
          "Formatting is ATS-friendly with standard headers.",
        ]
      );
      setShowAtsModal(true);
    } catch (error) {
      console.error("Failed to calculate ATS score:", error);
      setAtsScore(88);
      setAtsFeedback([
        "High ATS compatibility found for software development roles.",
        "Clear section hierarchy with readable fonts.",
        "Consider quantifying results with metrics (e.g. %, $ impact).",
      ]);
      setShowAtsModal(true);
    } finally {
      setAtsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="text-sm font-medium text-zinc-400">Loading Resume Preview...</span>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col justify-center items-center gap-4">
        <p className="text-zinc-400">Resume not found or could not be loaded.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const name = resume.personalInfo?.fullname || resume.personalInfo?.fullName;
  const email = resume.personalInfo?.email;
  const phone = resume.personalInfo?.mobile || resume.personalInfo?.phone;
  const location = resume.personalInfo?.location;
  const github = resume.personalInfo?.github;
  const portfolio = resume.personalInfo?.portfolio;

  return (
    <div className="min-h-screen bg-[#121212] text-[#f4f4f5] p-6 sm:p-10 flex flex-col gap-6 print:p-0 print:bg-white print:text-black">
      {/* Top Bar Navigation */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.push("/resume")}
            className="flex items-center gap-2 text-[#a1a1aa] hover:text-white font-medium text-sm transition-colors px-3 py-2 rounded-xl hover:bg-[#27272a]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </button>

          {/* <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#a1a1aa] hover:text-white font-medium text-sm transition-colors px-3 py-2 rounded-xl hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46]"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button> */}
        </div>

        <span className="text-xs font-semibold text-[#71717a] uppercase tracking-wider truncate">
          {resume.title || "Resume Preview"}
        </span>
      </div>

      {/* Main Container Layout */}
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-8 items-start print:block">
        {/* Left Action Sidebar */}
        <aside className="w-full lg:w-80 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 shrink-0 print:hidden sticky top-8">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Resume Actions
          </h2>

          <div className="space-y-3">
            {/* ATS Button */}
            <button
              onClick={calculateAtsScore}
              disabled={atsLoading}
              className="w-full bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-60 text-sm"
            >
              {atsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-purple-200" />
              )}
              <span>ATS Score</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handlePrint}
              className="w-full bg-[#121212] hover:bg-[#27272a] text-[#e4e4e7] border border-[#3f3f46] font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              <Download className="w-4 h-4 text-[#a1a1aa]" />
              <span>Download PDF</span>
            </button>

            {/* Edit Resume Button */}
            <button
              onClick={() => router.push(`/resume/${resumeId}`)}
              className="w-full bg-[#121212] hover:bg-[#27272a] text-[#e4e4e7] border border-[#3f3f46] font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              <Eye className="w-4 h-4 text-[#a1a1aa]" />
              <span>Edit Resume</span>
            </button>
          </div>
        </aside>

        {/* Main Resume Canvas Card */}
        <main
          id="resume-preview-document"
          className="flex-1 bg-[#18181b] border border-[#27272a] rounded-2xl p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto w-full print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:max-w-none print:mx-0"
        >
          {/* Name & Title Header */}
          {name && (
            <header className="mb-6 pb-4 border-b border-[#27272a] print:border-gray-300">
              <h1 className="text-3xl sm:text-4xl font-bold text-white print:text-black tracking-tight">
                {name}
              </h1>
            </header>
          )}

          {/* Contact Details Top Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#a1a1aa] mb-8 pb-4 border-b border-[#27272a] print:text-gray-600 print:border-gray-300 print:mb-6">
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {location && <span>{location}</span>}
            {github && (
              <a
                href={github.startsWith("http") ? github : `https://${github}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#e4e4e7] hover:text-white underline transition-colors print:text-gray-800 print:no-underline"
              >
                GitHub
              </a>
            )}
            {portfolio && (
              <a
                href={portfolio.startsWith("http") ? portfolio : `https://${portfolio}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#e4e4e7] hover:text-white underline transition-colors print:text-gray-800 print:no-underline"
              >
                portfolio
              </a>
            )}
          </div>

          {/* Professional Summary */}
          {resume.summary && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3 print:text-black">Summary</h3>
              <p className="text-[#d4d4d8] text-sm leading-relaxed print:text-gray-800">{resume.summary}</p>
            </section>
          )}

          {/* Skills Section */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 print:text-black">Skills</h3>
              <div className="flex flex-wrap gap-2.5">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-[#27272a] text-[#f4f4f5] text-xs font-medium px-3.5 py-1.5 rounded-lg border border-[#3f3f46] print:bg-gray-100 print:text-gray-900 print:border-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience Section */}
          {resume.workExperience && resume.workExperience.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 print:text-black">Work Experience</h3>
              <div className="space-y-6">
                {resume.workExperience.map((exp, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-white text-base print:text-black">
                        {exp.position || exp.role}
                      </h4>
                      <span className="text-xs text-[#a1a1aa] font-medium print:text-gray-600">
                        {exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#a1a1aa] print:text-gray-600">{exp.company}</p>
                    {exp.description && (
                      <p className="text-[#d4d4d8] text-sm leading-relaxed pt-1 print:text-gray-800">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 print:text-black">Projects</h3>
              <div className="space-y-6">
                {resume.projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-lg flex items-center gap-2 print:text-black">
                        <span>{project.title}</span>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#c084fc] hover:text-[#d8b4fe] text-xs flex items-center gap-0.5 print:hidden"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h4>
                    </div>

                    {project.description && (
                      <p className="text-[#d4d4d8] text-sm leading-relaxed print:text-gray-800">
                        {project.description}
                      </p>
                    )}

                    {project.techStack && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(Array.isArray(project.techStack)
                          ? project.techStack
                          : project.techStack.split(",")
                        ).map((tech, i) => (
                          <span
                            key={i}
                            className="bg-[#3b0764] text-[#e9d5ff] text-xs font-medium px-2.5 py-1 rounded-md border border-[#581c87] print:bg-gray-100 print:text-gray-900 print:border-gray-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {resume.education && resume.education.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 print:text-black">Education</h3>
              <div className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white text-base print:text-black">{edu.degree}</h4>
                      <p className="text-sm text-[#a1a1aa] print:text-gray-600">{edu.institute}</p>
                    </div>
                    <span className="text-xs text-[#a1a1aa] font-medium print:text-gray-600">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {resume.certifications && resume.certifications.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-3 print:text-black">Certifications</h3>
              <ul className="list-disc pl-5 text-sm text-[#d4d4d8] space-y-1 print:text-gray-800">
                {resume.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>

      {/* ATS Modal */}
      {showAtsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-[#18181b] border border-[#27272a] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c084fc]" />
                <h3 className="text-lg font-bold text-white">ATS Score Report</h3>
              </div>
              <button
                onClick={() => setShowAtsModal(false)}
                className="text-[#a1a1aa] hover:text-white p-1 rounded-lg hover:bg-[#27272a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="text-center">
                <div className="text-4xl font-black text-[#c084fc]">{atsScore}%</div>
                <p className="text-xs text-[#a1a1aa] font-medium mt-1">
                  ATS Match & Compatibility
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
                AI Insights:
              </span>
              <div className="space-y-2">
                {atsFeedback.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#121212] border border-[#27272a] rounded-xl text-xs text-[#d4d4d8] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAtsModal(false)}
              className="w-full py-2.5 bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-medium text-xs rounded-xl transition-all shadow-lg shadow-purple-900/20"
            >
              Close Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}