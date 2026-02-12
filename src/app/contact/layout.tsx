import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — AlsoKal",
  description: "Business inquiries and collaboration opportunities with AlsoKal.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
