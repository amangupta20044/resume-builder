<div align="center">

  # 📄 ResumeCraft AI — Next-Gen Resume Engine

  An intelligent, AI-driven resume creation platform built with **Next.js 16 (App Router)**, **MongoDB Atlas**, and **Google Gemini AI**. Offers a step-by-step resume wizard, automated bullet generation, content optimization, ATS scoring, live real-time previewing, and PDF export.

  ![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
  ![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
  ![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=for-the-badge&logo=googlegemini)

</div>

---

<!-- Previews: place screenshots at public/resume-preview.png and public/resume.png -->
<p align="center">
  <img src="./public/resume-preview.png" alt="Builder Preview" width="48%" />
  <img src="./public/resume.png" alt="Editor Preview" width="48%" />
</p>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [3D Architecture & Workflow Pipeline](#3d-architecture--workflow-pipeline)
- [Data Pipeline Flow](#data-pipeline-flow)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Development Commands](#development-commands)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## 🚀 Overview

**ResumeCraft AI** transforms resume drafting into an effortless, AI-enhanced experience. Whether you are building from scratch or refining an existing profile, ResumeCraft AI leverages Google Gemini to score your resume against Applicant Tracking Systems (ATS), craft compelling work experience bullets, draft summaries, and render beautiful PDF-ready resumes in real time.

---

## ✨ Key Features

- 🧙‍♂️ **Multi-Step Resume Wizard**: Intuitive step-by-step workflow covering Personal Info, Professional Summary, Work Experience, Education, Projects, Skills, and Certifications.
- 🤖 **Google Gemini AI Engine**:
  - **ATS Score & Feedback**: Analyzes resumes for ATS compatibility, keyword density, and actionable improvements.
  - **AI Bullet Generation**: Auto-generates high-impact experience bullets and project descriptions.
  - **AI Professional Summary**: Generates tailored summaries based on career target and background.
  - **Smart Skills Suggestion**: Recommends top industry skills matching job titles.
  - **Content Polishing**: Instant grammar improvement and professional tone adjustment.
- 🔐 **Custom Authentication**: JWT-based session security with bcrypt password hashing and auth middleware.
- 🎨 **Modern Design & Live Preview**: Built with Tailwind CSS v4 and Lucide React Icons for a responsive, clean UI alongside live canvas previewing.
- 📄 **PDF Export Engine**: Pixel-perfect layout rendering ready for client-side PDF downloads.

---

## 🏗️ 3D Architecture & Workflow Pipeline

Below is the layered architectural representation demonstrating how client interactions flow down to API logic, storage, and external AI services.

```text
  ┌──────────────────────────────────────────────────────────────────────────┐╗
  │  LAYER 1: CLIENT / UI LAYER                                              ║║
  │  ┌────────────────────────────────────────────────────────────────────┐  ║║
  │  │ Next.js 16 (App Router)  │  Tailwind CSS v4  │  Lucide React     │  ║║
  │  │ Multi-Step Form Wizard   │ Live Preview Pane │ PDF Export Engine │  ║║
  │  └────────────────────────────────────────────────────────────────────┘  ║║
  └──────────────────────────────────────────────────────────────────────────┘║
   ╚══════════════════════════════════════════════════════════════════════════╝
                                 │ ▲
        (Client State / HTTP)    │ │ (Server Actions / JSON APIs)
                                 ▼ │
  ┌──────────────────────────────────────────────────────────────────────────┐╗
  │  LAYER 2: API & LOGIC LAYER                                              ║║
  │  ┌────────────────────────────────────────────────────────────────────┐  ║║
  │  │ Next.js Server Actions & REST API Routes (/api/resume, /api/ai)    │  ║║
  │  │ ATS Scoring Logic  │ Custom JWT Auth & Middleware │ Schema Validation│  ║║
  │  └────────────────────────────────────────────────────────────────────┘  ║║
  └──────────────────────────────────────────────────────────────────────────┘║
   ╚══════════════════════════════════════════════════════════════════════════╝
                                 │ ▲
        (Mongoose ODM Queries)   │ │ (Gemini AI SDK Prompts)
                                 ▼ │
  ┌──────────────────────────────────────────────────────────────────────────┐╗
  │  LAYER 3: SERVICES & STORAGE                                             ║║
  │  ┌────────────────────────────────────────────────────────────────────┐  ║║
  │  │ MongoDB Atlas (Database)   │   Google Gemini API (@google/genai)   │  ║║
  │  │ User & Resume Collections │   ATS Scoring & Content Generation    │  ║║
  │  └────────────────────────────────────────────────────────────────────┘  ║║
  └──────────────────────────────────────────────────────────────────────────┘║
   ╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 🔄 Data Pipeline Flow

The sequential lifecycle of user data from input to AI processing and final document export:

```text
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
 │  1. USER INPUT  │ ────> │2. STATE STORAGE │ ────> │   3. DB SYNC    │ ────> │4. AI PROCESSING │ ────> │  5. PDF RENDER  │
 ├─────────────────┤       ├─────────────────┤       ├─────────────────┤       ├─────────────────┤       ├─────────────────┤
 │ Step Forms:     │       │ React State /   │       │ Mongoose API    │       │ Google Gemini   │       │ Live Preview &  │
 │ Personal, Work, │       │ Form Context    │       │ syncs document  │       │ ATS scoring &   │       │ Client PDF      │
 │ Skills, Projects│       │ update in-memory│       │ to MongoDB      │       │ text enhancement│       │ export canvas   │
 └─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **User Input**: User populates fields in the multi-step builder (personal details, experience, education, etc.).
2. **State Storage**: React state and form contexts capture and normalize data real-time on the client side.
3. **DB Sync**: REST endpoints (`/api/resume/[resumeId]`) sync draft data into MongoDB Atlas via Mongoose.
4. **AI Processing**: Triggered AI requests query `@google/genai` to score ATS compatibility, draft bullet points, and polish phrasing.
5. **PDF Render**: Real-time preview component renders styled templates and handles pixel-perfect PDF rendering.

---

## 📂 Project Structure

Key directories and top-level files:

```text
resume-builder/
├── src/
│   ├── apis/                   # Client-side API request wrappers (resume.api.ts)
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── api/                # Backend API endpoints
│   │   │   ├── ai/             # Gemini AI routes (ats-score, generate-summary, etc.)
│   │   │   ├── auth/           # Login, Signup, Logout, Profile handlers
│   │   │   └── resume/         # CRUD operations for resumes
│   │   ├── auth/               # Login & Register pages
│   │   ├── resume/             # Dashboard and builder pages
│   │   │   └── [resumeId]/     # Multi-step editor & preview wrapper
│   │   ├── globals.css         # Global Tailwind styles
│   │   └── layout.tsx          # Root app layout
│   ├── components/             # Step-by-step form wizard components
│   │   ├── PersonalInfoStep.tsx
│   │   ├── SummaryStep.tsx
│   │   ├── ExperienceStep.tsx
│   │   ├── EducationStep.tsx
│   │   ├── ProjectSetup.tsx
│   │   ├── SkillsStep.tsx
│   │   └── CertificationsStep.tsx
│   ├── lib/                    # Server utilities (mongodb.ts, gemini.ts, jwt.ts)
│   ├── middlewares/            # Auth & route protection middleware
│   ├── models/                 # Mongoose models (User.model.ts, Resume.model.ts)
│   └── types/                  # Shared TypeScript interfaces & types
├── public/                     # Static assets & preview screenshots
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js**: v18.18+ or v20+
- **npm** or **pnpm**
- **MongoDB**: Local instance or MongoDB Atlas cluster
- **Google Gemini API Key**: Obtainable via [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/resume-builder.git
cd resume-builder
npm install
```

### 2. Configure Environment

Create `.env.local` in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/resume-db?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI Integration
GEMINI_API_KEY=your_gemini_api_key_here

# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Development Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server with hot reload |
| `npm run build` | Builds optimized production bundle |
| `npm start` | Starts production server |
| `npm run lint` | Runs ESLint for code formatting and error checks |
| `npx tsc --noEmit` | Performs full TypeScript type check |

---

## 🔌 API Endpoints Summary

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` — Register new user account
- `POST /api/auth/login` — User login & JWT cookie set
- `POST /api/auth/logout` — Clear session authentication
- `GET /api/auth/profile` — Fetch current user profile

### Resume Routes (`/api/resume`)
- `POST /api/resume/create` — Initialize new resume draft
- `GET /api/resume/[resumeId]` — Retrieve full resume document
- `PATCH /api/resume/[resumeId]` — Partial update of resume sections
- `DELETE /api/resume/[resumeId]` — Delete resume draft

### AI Engine Routes (`/api/ai`)
- `POST /api/ai/ats-score` — Calculate ATS score & feedback for resume
- `POST /api/ai/generate-summary` — Draft tailored professional summary
- `POST /api/ai/generate-skills` — Generate recommended skills list
- `POST /api/ai/generate-experience-description` — Generate work bullet points
- `POST /api/ai/generate-project-description` — Draft project descriptions
- `POST /api/ai/improve-content` — Rephrase and polish existing content

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub / GitLab / Bitbucket.
2. Import the repository in [Vercel Dashboard](https://vercel.com).
3. Set your environment variables (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `NEXT_PUBLIC_APP_URL`).
4. Click **Deploy**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License & Contact

Distributed under the MIT License. See `LICENSE` for more information.

Questions or feedback? Feel free to open an issue or reach out to the project maintainer.
