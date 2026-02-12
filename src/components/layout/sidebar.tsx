"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  DollarSign,
  Handshake,
  Calendar,
  Target,
  FileText,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Revenue", href: "/revenue", icon: DollarSign },
  { label: "Partnerships", href: "/partnerships", icon: Handshake },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Goals", href: "/goals", icon: Target },
];

const secondaryNavItems: NavItem[] = [
  { label: "Media Kit", href: "/media-kit", icon: FileText, external: true },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  const linkContent = (
    <span
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#1a1d27] text-[#6bd9c5]"
          : "text-[#9ca3af] hover:bg-[#1a1d27] hover:text-[#E0D8CC]"
      )}
    >
      <Icon className="size-5 shrink-0" />
      {item.label}
    </span>
  );

  if (item.external) {
    return (
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {linkContent}
      </Link>
    );
  }

  return (
    <Link href={item.href} onClick={onClick}>
      {linkContent}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col bg-[#0f1117]">
      {/* Brand */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <span className="font-heading text-2xl tracking-wide text-[#6bd9c5]">
            alsokal
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            onClick={onNavigate}
          />
        ))}

        <Separator className="my-4 bg-[#2a2d37]" />

        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#2a2d37] px-6 py-4">
        <p className="text-xs text-[#6B7C6B]">creator dashboard</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#2a2d37] bg-[#0f1117] lg:block">
      <div className="sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 border-r border-[#2a2d37] bg-[#0f1117] p-0"
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
