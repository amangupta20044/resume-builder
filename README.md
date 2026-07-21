# Resume Builder

A Next.js 16 app for building AI-assisted resumes with authentication, step-by-step resume creation, and preview capabilities.

## Project Architecture

### Root folders

- `src/app/`
  - App Router pages, layouts, and server/client route handling
  - `app/resume/page.tsx` - resume dashboard and creation flow entry point
  - `app/resume/[resumeId]/page.tsx` - active resume builder page for one resume
  - `app/resume/[resumeId]/preview/page.tsx` - resume preview page
  - `app/auth/login/page.tsx` and `app/auth/register/page.tsx` - auth pages
  - `app/api/` - Next.js API routes for resumes, auth, profiles, and AI helpers

- `src/apis/`
  - frontend API client wrappers using `axios`
  - `resume.api.ts` - functions for list, create, delete operations

- `src/components/`
  - reusable resume builder components for each step
  - `PersonalInfoStep.tsx`, `EducationStep.tsx`, `SkillsStep.tsx`, `ProjectSetup.tsx`, `ExperienceStep.tsx`

- `src/lib/`
  - shared backend utilities
  - `getCurrentUser.ts` - current user helper
  - `mongodb.ts` - MongoDB connection
  - `jwt.ts` - JWT helpers
  - `gemini.ts` - AI helper integration

- `src/models/`
  - database schema models
  - `Resume.model.ts`, `User.model.ts`

- `src/types/`
  - TypeScript type definitions
  - `ai.types.ts`, `api.types.ts`, `resume.types.ts`, `user.types.ts`

## Folder and Route Structure

### `src/app`

- `app/layout.tsx` - root app layout
- `app/page.tsx` - homepage or dashboard entry
- `app/resume/page.tsx` - resume dashboard and create modal
- `app/resume/[resumeId]/layout.tsx` - layout wrapper for single resume routes
- `app/resume/[resumeId]/page.tsx` - resume builder flow component
- `app/resume/[resumeId]/preview/page.tsx` - preview wrapper for rendered resume

### API routes

- `app/api/resume/create/route.ts` - POST to create a new resume
- `app/api/resume/[resumeId]/route.ts` - GET/PATCH for a specific resume
- `app/api/auth/login/route.ts` - login route
- `app/api/auth/register/route.ts` - register route
- `app/api/ai/` - AI generation helpers for summary, skills, projects, experience, and ATS score

## Detailed Workflow

### 1. User authentication

- Users register using `app/auth/register/page.tsx`
- Users log in with `app/auth/login/page.tsx`
- JWT or session helpers under `src/lib/jwt.ts` manage user state for API requests
- `src/lib/getCurrentUser.ts` retrieves the logged-in user on the server side for protected routes

### 2. Resume dashboard and creation

- User lands on `src/app/resume/page.tsx`
- The page fetches resume list data using `src/apis/resume.api.ts`
- When the user clicks `Create Resume`, frontend posts to `/api/resume/create`
- The API route creates a resume document in MongoDB with initial default values
- After creation, the app navigates to `/resume/[resumeId]`

### 3. Resume builder flow

- `src/app/resume/[resumeId]/page.tsx` renders the builder UI and manages step state
- Each builder step component fetches resume details from `/api/resume/[resumeId]`
- Form values are submitted to the same resume route via PATCH
- Step components:
  - `PersonalInfoStep.tsx`
  - `EducationStep.tsx`
  - `SkillsStep.tsx`
  - `ProjectSetup.tsx`
  - `ExperienceStep.tsx`

### 4. AI-powered content generation

- AI routes live under `app/api/ai/`
- These endpoints generate:
  - summary
  - project descriptions
  - experience descriptions
  - skills
  - ATS score
- Client components call these endpoints directly with `axios`

### 5. Resume preview

- `/resume/[resumeId]/preview` renders a preview of the resume data
- `src/app/resume/[resumeId]/preview/page.tsx` is a server page wrapper
- `src/app/resume/[resumeId]/preview/preview-client.tsx` performs client-side data fetch and renders the preview UI

## Data and Models

- `src/models/Resume.model.ts` defines the resume schema stored in MongoDB
- `src/models/User.model.ts` defines the user schema
- Resume documents include:
  - `title`, `summary`, `personalInfo`, `workExperience`, `projects`, `education`, `certifications`, `skills`

## Technologies

- Next.js 16 App Router
- React 19
- TypeScript
- Axios
- Mongoose
- Tailwind CSS
- lucide-react icons
- MongoDB backend

## Running the project

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to use the app.

## Notes

- The app uses `src/` as the source folder and the `@/*` path alias configured in `tsconfig.json`
- API route handlers use `NextRequest` and `NextResponse` from `next/server`
- Client-side pages and components use `"use client"` where needed
- Server wrappers remain plain exports to satisfy Next.js App Router expectations
