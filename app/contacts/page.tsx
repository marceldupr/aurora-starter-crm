import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Users, Mail, Phone, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getContacts() {
  const client = createAuroraClient();
  const { data } = await client.tables("contacts").records.list({
    limit: 50,
    sort: "name",
    order: "asc",
  });
  return data ?? [];
}

export default async function ContactsPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/contacts`
      : null;

  let contacts: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    contacts = await getContacts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load contacts";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Contacts</h1>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <Users className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No contacts yet</p>
          <p className="text-sm text-aurora-muted mb-6">
            Add contacts in Aurora Studio or run the seed script.
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <div
              key={String(c.id)}
              className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-aurora-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-aurora-accent font-bold text-lg">
                    {String(c.name ?? "?")[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{String(c.name ?? "")}</p>
                  {c.company ? (
                    <p className="text-sm text-aurora-muted flex items-center gap-1.5 mt-1">
                      <Building2 className="w-4 h-4 shrink-0" />
                      {String(c.company)}
                    </p>
                  ) : null}
                  {c.email ? (
                    <p className="text-sm text-aurora-muted flex items-center gap-1.5 mt-1 truncate">
                      <Mail className="w-4 h-4 shrink-0" />
                      <a href={`mailto:${c.email}`} className="hover:text-aurora-accent truncate">
                        {String(c.email)}
                      </a>
                    </p>
                  ) : null}
                  {c.phone ? (
                    <p className="text-sm text-aurora-muted flex items-center gap-1.5 mt-1">
                      <Phone className="w-4 h-4 shrink-0" />
                      {String(c.phone)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {studioUrl && (
        <div className="mt-8">
          <a href={studioUrl} target="_blank" rel="noopener noreferrer" className="text-aurora-accent hover:underline text-sm">
            Manage in Aurora Studio →
          </a>
        </div>
      )}
    </div>
  );
}
