import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Kit — AlsoKal",
  description:
    "Collaborate with AlsoKal — skoolie life, family travel, and outdoor adventure content creator with 500K+ combined followers.",
};

export default function MediaKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
