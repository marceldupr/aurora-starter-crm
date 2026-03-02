import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL &&
    process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app`
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">CRM</h1>
      <p className="text-aurora-muted mb-8">
        Manage your contacts and deals. Powered by Aurora Studio.
      </p>
      <nav className="flex flex-wrap gap-4">
        <Link
          href="/deals"
          className="inline-block px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90 transition-opacity"
        >
          Deals
        </Link>
        <Link
          href="/contacts"
          className="inline-block px-6 py-3 rounded-component border border-aurora-border text-white font-semibold hover:bg-aurora-surface transition-colors"
        >
          Contacts
        </Link>
        {studioUrl && (
          <a
            href={studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-component border border-aurora-accent/50 text-aurora-accent font-semibold hover:bg-aurora-accent/10 transition-colors"
          >
            View in Aurora Studio →
          </a>
        )}
      </nav>
    </div>
  );
}
