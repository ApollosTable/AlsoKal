"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      budgetRange: (form.elements.namedItem("budgetRange") as HTMLInputElement)
        ?.value,
      campaignType: (
        form.elements.namedItem("campaignType") as HTMLInputElement
      )?.value,
      timeline: (form.elements.namedItem("timeline") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F1] px-6">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-4xl text-[#1A2E1A]">
            thank you!
          </h1>
          <p className="mt-4 text-muted-foreground">
            Your inquiry has been received. We&apos;ll get back to you within 48
            hours.
          </p>
          <Link
            href="/media-kit"
            className="mt-6 inline-block text-sm font-medium text-[#6bd9c5] hover:underline"
          >
            &larr; Back to Media Kit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] px-6 py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-4">
          <Link
            href="/media-kit"
            className="text-sm text-muted-foreground hover:text-[#6bd9c5]"
          >
            &larr; Media Kit
          </Link>
        </div>
        <h1 className="font-heading text-4xl text-[#1A2E1A]">
          business inquiries
        </h1>
        <p className="mt-2 text-muted-foreground">
          Interested in collaborating? Fill out the form below and we&apos;ll be
          in touch.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              tell us about your project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company / Brand *</Label>
                <Input
                  id="company"
                  name="company"
                  required
                  placeholder="Brand name"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select name="budgetRange">
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1k">Under $1,000</SelectItem>
                      <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k+">$25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Campaign Type</Label>
                  <Select name="campaignType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sponsored-post">
                        Sponsored Post
                      </SelectItem>
                      <SelectItem value="content-series">
                        Content Series
                      </SelectItem>
                      <SelectItem value="brand-ambassador">
                        Brand Ambassador
                      </SelectItem>
                      <SelectItem value="event">Event / Appearance</SelectItem>
                      <SelectItem value="product-review">
                        Product Review
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="e.g., March 2026, Q2, flexible"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell us about your campaign, goals, and what you're looking for..."
                  className="min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-[#1A2E1A] hover:bg-[#1A2E1A]/90"
              >
                {sending ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
