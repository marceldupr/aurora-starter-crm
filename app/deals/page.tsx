import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DealsPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL &&
    process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/deals`
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Link
          href="/"
          className="text-aurora-muted hover:text-white transition-colors"
        >
          ← Home
        </Link>
      </div>
      <div className="rounded-container bg-aurora-surface p-8 border border-aurora-border">
        <p className="text-aurora-muted mb-4">
          Manage your deals in Aurora Studio ( pipeline stages, values, activities ).
        </p>
        {studioUrl ? (
          <a
            href={studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-component bg-aurora-accent text-aurora-bg font-medium hover:opacity-90 transition-opacity"
          >
            View in Aurora Studio →
          </a>
        ) : (
          <p className="text-aurora-muted text-sm">
            Set NEXT_PUBLIC_AURORA_API_URL and NEXT_PUBLIC_TENANT_SLUG to enable the link.
          </p>
        )}
      </div>
    </div>
  );
}
