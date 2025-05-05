import TimeTrackingTable from "@/components/time-tracking-table";

export default async function Exec() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/logs`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch logs");
  }

  const logs = await res.json();

  return <TimeTrackingTable logs={logs} />;
}
