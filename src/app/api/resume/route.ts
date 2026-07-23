import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const userId = await getCurrentUser();

    const resumes = await ResumeModel.find({ user_id: userId })
      .sort({ updatedAt: -1 })
      .select("title jobTitle experienceLevel createdAt updatedAt")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Resumes fetched successfully",
        resumes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in get all resumes api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
