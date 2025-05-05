"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const time = searchParams.get("time_in");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Image src="/bg-logo.png" height={120} width={250} alt="logo" />
      <Card className="w-[80%]">
        <CardContent className="space-y-3 text-center">
          <p className="text-base">
            Welcome, <span className="font-semibold">{name}</span>!
          </p>
          <p className="text-sm text-muted-foreground">
            You clocked in at: <strong>{time}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
