import { NextResponse } from "next/server";
export const handleDBError = (error: unknown) => {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Database operation failed" },
      { status: 500 }
    );
  };