import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo CRM";

export function Footer() {
  return (
    <footer className="border-t border-aurora-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-aurora-muted text-sm">{siteName} — Sales pipeline & contacts</p>
          <div className="flex gap-6 text-sm text-aurora-muted">
            <Link href="/pipeline" className="hover:text-white">Pipeline</Link>
            <Link href="/deals" className="hover:text-white">Deals</Link>
            <Link href="/contacts" className="hover:text-white">Contacts</Link>
            <Link href="/activities" className="hover:text-white">Activities</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
