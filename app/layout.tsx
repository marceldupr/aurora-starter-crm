import type { Metadata } from "next";
import Script from "next/script";
import { getHolmesScriptUrl } from "@aurora-studio/sdk";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo CRM";

export const metadata: Metadata = {
  title: siteName,
  description: "Sales pipeline, contacts & deals. Powered by Aurora Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-aurora-bg text-white flex flex-col"
        style={
          {
            "--aurora-accent": process.env.NEXT_PUBLIC_ACCENT_COLOR ?? "#6366f1",
          } as React.CSSProperties
        }
      >
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        {process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG && (
          <Script
            src={getHolmesScriptUrl(
              process.env.NEXT_PUBLIC_AURORA_API_URL,
              process.env.NEXT_PUBLIC_TENANT_SLUG
            )}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
