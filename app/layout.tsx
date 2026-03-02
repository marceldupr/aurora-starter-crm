import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM",
  description: "CRM powered by Aurora Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-aurora-bg text-white"
        style={
          {
            "--aurora-accent": process.env.NEXT_PUBLIC_ACCENT_COLOR ?? "#38bdf8",
          } as React.CSSProperties
        }
      >
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
