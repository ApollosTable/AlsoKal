import type { Metadata } from "next";
import { Assistant, Bayon } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { cookies } from "next/headers";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  display: "swap",
});

const bayon = Bayon({
  variable: "--font-bayon",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "alsokal | Creator Dashboard",
  description:
    "Business dashboard for the AlsoKal creator brand - analytics, revenue tracking, partnerships, and content planning.",
  keywords: ["creator", "dashboard", "analytics", "skoolie", "vanlife"],
};

async function getIsAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("alsokal-auth");
  const secret = process.env.DASHBOARD_SECRET;
  return !!authCookie && !!secret && authCookie.value === secret;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await getIsAuthenticated();

  return (
    <html lang="en">
      <body
        className={`${assistant.variable} ${bayon.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          {isAuthenticated ? (
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 overflow-x-hidden">{children}</main>
            </div>
          ) : (
            <>{children}</>
          )}
        </TooltipProvider>
      </body>
    </html>
  );
}
