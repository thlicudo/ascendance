"use client";

import { useEffect, useState } from "react";
import { format, differenceInMinutes, isAfter } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type Logs = {
  id: number;
  name: string;
  time_in: Date;
};

export default function TimeTrackingTable({ logs }: { logs: Logs[] }) {
  const [data, setData] = useState<Logs[]>(logs);
  const [callTime, setCallTime] = useState("19:30");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [penaltyRate, setPenaltyRate] = useState(1);

  useEffect(() => {
    setData(logs);
  }, [logs]);

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  const filteredData = date
    ? data.filter(
        (item) =>
          format(new Date(item.time_in), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      )
    : data;

  // Calculate minutes late and total penalty
  const processedData = filteredData.map((item) => {
    const timeInDate = new Date(item.time_in);
    const [hours, minutes] = callTime.split(":").map(Number);

    const callTimeDate = new Date(timeInDate);
    callTimeDate.setHours(hours, minutes, 0);

    const minutesLate = isAfter(timeInDate, callTimeDate)
      ? differenceInMinutes(timeInDate, callTimeDate)
      : 0;

    const totalPenalty = minutesLate * penaltyRate;

    return {
      ...item,
      minutesLate,
      totalPenalty,
    };
  });

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Image
        src="/bg-logo.png"
        height={120}
        width={250}
        alt="logo"
        className="mx-auto"
      />

      <Card className="mb-8">
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="callTime" className="font-bold">
                Call Time
              </Label>
              <Input
                id="callTime"
                type="time"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Filter by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="penaltyRate" className="font-bold">
                Penalty Rate (PHP/minute)
              </Label>
              <Input
                id="penaltyRate"
                type="number"
                value={penaltyRate}
                onChange={(e) => setPenaltyRate(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold border px-2 py-0.5 rounded-lg">
              RECORDS
            </CardTitle>
            {date && (
              <Button variant="outline" onClick={() => setDate(undefined)}>
                <Filter className="mr-2 h-4 w-4" /> Clear Filter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table className="min-w-full overflow-x-auto">
            <TableCaption>
              {date
                ? `Attendance for ${format(date, "MMMM d, yyyy")}`
                : "All attendance records"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Time-in</TableHead>
                <TableHead className="font-bold">Minutes Late</TableHead>
                <TableHead className="font-bold">Penalty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {format(new Date(item.time_in), "h:mm a")}
                  </TableCell>
                  <TableCell>{item.minutesLate}</TableCell>
                  <TableCell>₱{item.totalPenalty.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {processedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
