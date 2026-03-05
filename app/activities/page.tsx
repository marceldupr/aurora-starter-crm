import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { Activity as ActivityIcon, Phone, Mail, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  activity: ActivityIcon,
};

async function getActivities() {
  const client = createAuroraClient();
  const { data } = await client.tables("activities").records.list({
    limit: 50,
    sort: "created_at",
    order: "desc",
  });
  return data ?? [];
}

export default async function ActivitiesPage() {
  const studioUrl =
    process.env.NEXT_PUBLIC_AURORA_API_URL && process.env.NEXT_PUBLIC_TENANT_SLUG
      ? `${process.env.NEXT_PUBLIC_AURORA_API_URL.replace("/api", "")}/${process.env.NEXT_PUBLIC_TENANT_SLUG}/app/sections/activities`
      : null;

  let activities: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    activities = await getActivities();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load activities";
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Activities</h1>

      {error ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <ActivityIcon className="w-16 h-16 text-aurora-muted/50 mx-auto mb-4" />
          <p className="text-aurora-muted mb-2">No activities yet</p>
          <p className="text-sm text-aurora-muted mb-6">
            Log calls, emails and meetings in Aurora Studio.
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
        <div className="space-y-4">
          {activities.map((a) => {
            const type = String(a.type ?? "activity");
            const Icon = typeIcons[type] ?? ActivityIcon;
            return (
              <div
                key={String(a.id)}
                className="rounded-container bg-aurora-surface border border-aurora-border p-5 flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-aurora-accent/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-aurora-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{String(a.subject ?? "")}</p>
                  <p className="text-sm text-aurora-muted mt-1 uppercase tracking-wide">
                    {type}
                  </p>
                  {a.created_at ? (
                    <p className="text-xs text-aurora-muted mt-2">
                      {new Date(String(a.created_at)).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
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
