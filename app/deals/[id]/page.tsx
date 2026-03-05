import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuroraClient } from "@/lib/aurora";
export const dynamic = "force-dynamic";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format((cents ?? 0) / 100);
}

async function getDealAndRelated(id: string) {
  const client = createAuroraClient();
  const [dealRes, contactsRes, stagesRes, activitiesRes] = await Promise.all([
    client.tables("deals").records.get(id),
    client.tables("contacts").records.list({ limit: 200 }),
    client.tables("pipeline_stages").records.list({ limit: 20 }),
    client.tables("activities").records.list({ limit: 20, sort: "created_at", order: "desc" }),
  ]);

  const deal = dealRes as Record<string, unknown> | null;
  const contacts = (contactsRes as { data?: Record<string, unknown>[] }).data ?? [];
  const stages = (stagesRes as { data?: Record<string, unknown>[] }).data ?? [];
  const activities = (activitiesRes as { data?: Record<string, unknown>[] }).data ?? [];

  const contact = deal?.contact_id
    ? contacts.find((c) => String(c.id) === String(deal.contact_id))
    : null;
  const stage = deal?.pipeline_stage_id
    ? stages.find((s) => String(s.id) === String(deal.pipeline_stage_id))
    : null;
  const dealActivities = activities.filter((a) => String(a.deal_id) === String(id));

  return { deal, contact, stage, dealActivities };
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let deal: Record<string, unknown> | null = null;
  let contact: Record<string, unknown> | null | undefined;
  let stage: Record<string, unknown> | null | undefined;
  let dealActivities: Record<string, unknown>[] = [];

  try {
    const data = await getDealAndRelated(id);
    deal = data.deal;
    contact = data.contact;
    stage = data.stage;
    dealActivities = data.dealActivities;
  } catch {
    notFound();
  }

  if (!deal) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/deals" className="text-aurora-muted hover:text-white text-sm mb-6 inline-block">
        ← Back to deals
      </Link>

      <div className="rounded-container bg-aurora-surface border border-aurora-border overflow-hidden">
        <div className="p-6 border-b border-aurora-border">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{String(deal.name ?? "")}</h1>
              {deal.created_at ? (
                <p className="text-sm text-aurora-muted">
                  Created {new Date(String(deal.created_at)).toLocaleDateString()}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <span
                className={`px-3 py-1 rounded-component text-sm font-medium ${
                  String(deal.status ?? "") === "won"
                    ? "bg-green-500/20 text-green-400"
                    : String(deal.status ?? "") === "lost"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-aurora-accent/20 text-aurora-accent"
                }`}
              >
                {String(deal.status ?? "open").replace("_", " ")}
              </span>
              {deal.value != null && Number(deal.value) > 0 ? (
                <span className="text-aurora-accent font-bold text-lg">
                  {formatCurrency(Number(deal.value))}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <h2 className="font-semibold mb-3">Activities</h2>
            {dealActivities.length === 0 ? (
              <p className="text-aurora-muted text-sm">No activities yet.</p>
            ) : (
              <ul className="space-y-2">
                {dealActivities.map((a) => (
                  <li
                    key={String(a.id)}
                    className="flex items-center gap-3 py-2 px-3 rounded-component bg-aurora-bg/50 border border-aurora-border"
                  >
                    <span className="text-aurora-accent text-sm font-medium uppercase">
                      {String(a.type ?? "activity")}
                    </span>
                    <span className="flex-1">{String(a.subject ?? "")}</span>
                    <span className="text-aurora-muted text-xs">
                      {a.created_at
                        ? new Date(String(a.created_at)).toLocaleDateString()
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-4">
            {contact ? (
              <div>
                <h3 className="text-sm font-medium text-aurora-muted mb-1">Contact</h3>
                <Link
                  href={`/contacts/${contact.id}`}
                  className="font-medium text-aurora-accent hover:underline"
                >
                  {String(contact.name ?? "")}
                </Link>
                {contact.email ? (
                  <a
                    href={`mailto:${String(contact.email)}`}
                    className="block text-aurora-muted text-sm hover:text-white"
                  >
                    {String(contact.email)}
                  </a>
                ) : null}
              </div>
            ) : null}
            {stage ? (
              <div>
                <h3 className="text-sm font-medium text-aurora-muted mb-1">Pipeline stage</h3>
                <p>{String(stage.name ?? "")}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
