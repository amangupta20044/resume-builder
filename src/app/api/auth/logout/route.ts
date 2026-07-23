import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";

export async function POST() {
  try {
    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the authentication cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Instantly expires the cookie
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to log out",
      },
      { status: 500 }
    );
  }
}