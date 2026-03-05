import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuroraClient } from "@/lib/aurora";
import { Mail, Phone, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getContact(id: string) {
  const client = createAuroraClient();
  const record = await client.tables("contacts").records.get(id);
  return record as Record<string, unknown> | null;
}

async function getContactDeals(contactId: string) {
  const client = createAuroraClient();
  const { data } = await client.tables("deals").records.list({
    limit: 20,
    sort: "created_at",
    order: "desc",
  });
  return (data ?? []).filter((d) => String(d.contact_id) === String(contactId));
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format((cents ?? 0) / 100);
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let contact: Record<string, unknown> | null = null;
  let deals: Record<string, unknown>[] = [];

  try {
    contact = await getContact(id);
    if (contact) {
      deals = await getContactDeals(id);
    }
  } catch {
    notFound();
  }

  if (!contact) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/contacts" className="text-aurora-muted hover:text-white text-sm mb-6 inline-block">
        ← Back to contacts
      </Link>

      <div className="rounded-container bg-aurora-surface border border-aurora-border overflow-hidden">
        <div className="p-6 border-b border-aurora-border">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-aurora-accent/20 flex items-center justify-center shrink-0">
              <span className="text-2xl text-aurora-accent font-bold">
                {String(contact.name ?? "?")[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{String(contact.name ?? "")}</h1>
              {contact.company ? (
                <p className="text-aurora-muted flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4" />
                  {String(contact.company)}
                </p>
              ) : null}
              {contact.email ? (
                <a
                  href={`mailto:${String(contact.email)}`}
                  className="text-aurora-accent hover:underline flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {String(contact.email)}
                </a>
              ) : null}
              {contact.phone ? (
                <a
                  href={`tel:${String(contact.phone)}`}
                  className="text-aurora-muted hover:text-white flex items-center gap-2 mt-1"
                >
                  <Phone className="w-4 h-4" />
                  {String(contact.phone)}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-semibold mb-4">Deals</h2>
          {deals.length === 0 ? (
            <p className="text-aurora-muted text-sm">No deals yet.</p>
          ) : (
            <ul className="space-y-2">
              {deals.map((d) => (
                <li key={String(d.id)}>
                  <Link
                    href={`/deals/${d.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-component bg-aurora-bg/50 border border-aurora-border hover:border-aurora-accent/40 transition-colors"
                  >
                    <span className="font-medium truncate">{String(d.name ?? "")}</span>
                    <span className="text-aurora-accent font-semibold shrink-0 ml-4">
                      {d.value != null ? formatCurrency(Number(d.value)) : "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
