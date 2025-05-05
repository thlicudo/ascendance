"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const time = searchParams.get("time_in");

  // Handle case if the parameters are missing
  if (!name || !time) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <p className="text-lg text-red-500">Missing required parameters!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8">
      <Image src="/bg-logo.png" height={120} width={250} alt="logo" />
      <Card className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%]">
        <CardContent className="space-y-3 text-center">
          <p className="text-lg">
            Welcome, <span className="font-semibold">{name}</span>!
          </p>
          <p className="text-sm text-muted-foreground">
            You clocked in at: <strong>{time}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Wrap your component in Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
