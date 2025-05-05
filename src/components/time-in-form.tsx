"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Loader } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useRouter } from "next/navigation";

const NameSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function TimeInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof NameSchema>>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      name: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Check if name exists in the database before submitting
  const handleSubmit = async (values: z.infer<typeof NameSchema>) => {
    const { name } = values;

    // If the name doesn't exist, log time-in
    const phTime = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );

    try {
      const response = await fetch("/api/time-in", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, time_in: phTime }),
      });

      const data = await response.json();

      if (!response.ok) {
        form.setError("name", {
          type: "manual",
          message: data.message || "Something went wrong",
        });
      } else {
        // ✅ Redirect with query params
        router.push(
          `/success?name=${encodeURIComponent(
            name
          )}&time_in=${encodeURIComponent(phTime.toLocaleTimeString())}`
        );
      }
    } catch (error) {
      console.error("❌ Error inserting:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Image src="/bg-logo.png" height={120} width={250} alt="logo" />

      <Card className="w-[80%] md:w-[30%]">
        <CardContent className="text-center space-y-4">
          <h1 className="font-bold">You are...?</h1>
          {/* Form handling */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <Button
                size="sm"
                className="font-semibold w-full text-sm"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin duration-300" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
