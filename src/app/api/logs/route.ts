import { db } from "@/db";
import { timeLogsTable } from "@/db/schema";

export async function GET() {
  try {
    const result = await db.select().from(timeLogsTable);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch logs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
