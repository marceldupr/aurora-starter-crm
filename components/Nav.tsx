"use client";

import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo CRM";
const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL ?? "https://vnawbscpsiwkqniibyya.supabase.co/storage/v1/object/public/placeholders/hippo-crm.png";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-aurora-border bg-aurora-bg/95 backdrop-blur supports-[backdrop-filter]:bg-aurora-bg/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-component p-1 -m-1 ring-2 ring-transparent hover:ring-aurora-accent/30 focus:ring-aurora-accent/50 focus:outline-none transition-all"
            aria-label={`${siteName} home`}
          >
            <img
              src={logoUrl}
              alt=""
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold hidden sm:inline">{siteName}</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/pipeline"
              className="text-sm text-aurora-muted hover:text-white transition-colors"
            >
              Pipeline
            </Link>
            <Link
              href="/deals"
              className="text-sm text-aurora-muted hover:text-white transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/contacts"
              className="text-sm text-aurora-muted hover:text-white transition-colors"
            >
              Contacts
            </Link>
            <Link
              href="/activities"
              className="text-sm text-aurora-muted hover:text-white transition-colors"
            >
              Activities
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
