import { IResume } from "@/types/resume.types";

type ResumeRecord = Record<string, unknown>;

export function getResumeFromResponse(responseData: {
  data?: ResumeRecord | IResume;
  resume?: ResumeRecord | IResume;
}): ResumeRecord | null {
  const resume = responseData.data ?? responseData.resume;
  if (!resume || typeof resume !== "object") return null;
  return resume as ResumeRecord;
}

export interface PersonalInfoFormValues {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export function mapPersonalInfoFromDb(
  personalInfo?: ResumeRecord | null
): PersonalInfoFormValues {
  const info = personalInfo ?? {};
  return {
    fullName: String(info.fullname ?? info.fullName ?? ""),
    email: String(info.email ?? ""),
    phone: String(info.mobile ?? info.phone ?? ""),
    location: String(info.location ?? ""),
    linkedin: String(info.linkedin ?? ""),
    github: String(info.github ?? ""),
    portfolio: String(info.portfolio ?? ""),
  };
}

export function mapPersonalInfoToDb(values: PersonalInfoFormValues) {
  return {
    fullname: values.fullName,
    email: values.email,
    mobile: values.phone,
    location: values.location,
    linkedin: values.linkedin,
    github: values.github,
    portfolio: values.portfolio,
  };
}

export interface ExperienceFormItem {
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export function mapWorkExperienceFromDb(
  workExperience?: ResumeRecord[] | null
): ExperienceFormItem[] {
  if (!workExperience?.length) return [];

  return workExperience.map((exp) => ({
    company: String(exp.company ?? ""),
    role: String(exp.position ?? exp.role ?? ""),
    employmentType: String(exp.employmentType ?? "Full Time"),
    startDate: String(exp.startDate ?? ""),
    endDate: String(exp.endDate ?? ""),
    currentlyWorking: Boolean(exp.currentlyWorking ?? exp.endDate === "Present"),
    description: String(exp.description ?? ""),
  }));
}

export function mapWorkExperienceToDb(experience: ExperienceFormItem[]) {
  return experience.map((exp) => ({
    company: exp.company,
    position: exp.role,
    startDate: exp.startDate,
    endDate: exp.currentlyWorking ? "Present" : exp.endDate,
    description: exp.description,
  }));
}

export function formatResumeDate(date?: string | Date | null): string {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
