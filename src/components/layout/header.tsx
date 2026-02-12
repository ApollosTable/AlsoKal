"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileSidebar } from "@/components/layout/sidebar";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <MobileSidebar />

      <h1 className="font-heading text-xl tracking-wide text-foreground md:text-2xl">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#6bd9c5]" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Avatar size="default">
          <AvatarFallback className="bg-[#6bd9c5] text-[#0f1117] font-semibold">
            K
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
