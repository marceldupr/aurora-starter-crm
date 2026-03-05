import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format((cents ?? 0) / 100);
}

async function getDeals() {
  const client = createAuroraClient();
  const { data } = await client.tables("deals").records.list({
    limit: 50,
    sort: "created_at",
    order: "desc",
  });
  return data ?? [];
}

export default async function DealsPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/deals`
      : null;

  let deals: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    deals = await getDeals();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load deals";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Deals</h1>
        <Link href="/pipeline" className="text-aurora-accent hover:underline text-sm">
          View pipeline →
        </Link>
      </div>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <Briefcase className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No deals yet</p>
          <p className="text-sm text-aurora-muted mb-6">
            Add deals in Aurora Studio or run the seed script.
          </p>
          {studioUrl && (
            <a
              href={studioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-component bg-aurora-accent text-aurora-bg font-semibold hover:opacity-90"
            >
              Add in Aurora Studio →
            </a>
          )}
        </div>
      ) : (
        <div className="rounded-container bg-aurora-surface border border-aurora-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-aurora-border">
                <th className="text-left py-4 px-4 font-semibold">Deal</th>
                <th className="text-left py-4 px-4 font-semibold">Value</th>
                <th className="text-left py-4 px-4 font-semibold">Status</th>
                <th className="text-left py-4 px-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={String(d.id)} className="border-b border-aurora-border last:border-0 hover:bg-aurora-surface-hover">
                  <td className="py-4 px-4">
                    <span className="font-medium">{String(d.name ?? "")}</span>
                  </td>
                  <td className="py-4 px-4 text-aurora-accent font-semibold">
                    {d.value != null ? formatCurrency(Number(d.value)) : "—"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-component text-xs font-medium ${
                        String(d.status ?? "") === "won"
                          ? "bg-green-500/20 text-green-400"
                          : String(d.status ?? "") === "lost"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-aurora-accent/20 text-aurora-accent"
                      }`}
                    >
                      {String(d.status ?? "open").replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-aurora-muted text-sm">
                    {d.created_at
                      ? new Date(String(d.created_at)).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {studioUrl && (
        <div className="mt-6">
          <a href={studioUrl} target="_blank" rel="noopener noreferrer" className="text-aurora-accent hover:underline text-sm">
            Manage in Aurora Studio →
          </a>
        </div>
      )}
    </div>
  );
}
