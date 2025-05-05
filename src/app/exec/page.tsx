import TimeTrackingTable from "@/components/time-tracking-table";
import { db } from "@/db";
import { timeLogsTable } from "@/db/schema";

export default async function Exec() {
  const logs = await db
    .select()
    .from(timeLogsTable)
    .orderBy(timeLogsTable.time_in);

  return <TimeTrackingTable logs={logs} />;
}
