import { db } from "@/db";
import { timeLogsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, gte, lt } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { name, time_in } = await request.json();

    if (!name || !time_in) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const now = new Date(time_in);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existingEntry = await db
      .select()
      .from(timeLogsTable)
      .where(
        and(
          eq(timeLogsTable.name, name),
          gte(timeLogsTable.time_in, startOfDay),
          lt(timeLogsTable.time_in, endOfDay)
        )
      )
      .limit(1);

    if (existingEntry.length > 0) {
      return NextResponse.json(
        { message: "You already timed in today!" },
        { status: 409 }
      );
    }

    await db.insert(timeLogsTable).values({
      name,
      time_in: now,
    });

    return NextResponse.json({ message: "Time-in logged" }, { status: 200 });
  } catch (error) {
    console.error("Time-in API error:", error);
    return NextResponse.json(
      { message: "Failed to log time-in", error: String(error) },
      { status: 500 }
    );
  }
}
