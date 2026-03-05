import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { BarChart3, Users, Briefcase, Activity, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format((cents ?? 0) / 100);
}

async function getDashboardData() {
  const client = createAuroraClient();
  const [contactsRes, dealsRes, activitiesRes, stagesRes] = await Promise.all([
    client.tables("contacts").records.list({ limit: 1 }),
    client.tables("deals").records.list({ limit: 200 }),
    client.tables("activities").records.list({ limit: 5, sort: "created_at", order: "desc" }),
    client.tables("pipeline_stages").records.list({ limit: 20, sort: "sort_order", order: "asc" }),
  ]);

  const contactsCount = (contactsRes as { total?: number }).total ?? 0;
  const deals = (dealsRes as { data?: Record<string, unknown>[] }).data ?? [];
  const dealsCount = (dealsRes as { total?: number }).total ?? deals.length;
  const activities = (activitiesRes as { data?: Record<string, unknown>[] }).data ?? [];
  const stages = (stagesRes as { data?: Record<string, unknown>[] }).data ?? [];

  const wonDeals = deals.filter((d) => String(d.status ?? "") === "won");
  const totalRevenue = wonDeals.reduce((sum, d) => sum + (Number(d.value ?? 0) || 0), 0);

  const dealsByStage: Record<string, number> = {};
  for (const s of stages) {
    const id = String(s.id ?? "");
    dealsByStage[id] = deals.filter((d) => String(d.pipeline_stage_id ?? "") === id).length;
  }

  return {
    contactsCount,
    dealsCount,
    totalRevenue,
    stages,
    dealsByStage,
    activities,
  };
}

export default async function HomePage() {
  let data: Awaited<ReturnType<typeof getDashboardData>>;
  let error: string | null = null;

  try {
    data = await getDashboardData();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load dashboard";
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
          <p className="text-sm text-aurora-muted mt-2">
            Configure AURORA_API_URL and AURORA_API_KEY, then run pnpm schema:provision
          </p>
        </div>
      </div>
    );
  }

  const { contactsCount, dealsCount, totalRevenue, stages, dealsByStage, activities } = data!;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden min-h-[320px]">
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-surface/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(https://picsum.photos/seed/aurora-crm-hero/1920/1080)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">
            Sales pipeline
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 drop-shadow max-w-2xl">
            Manage deals, contacts, and close more revenue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pipeline"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-component bg-aurora-surface border border-aurora-border hover:bg-aurora-surface-hover hover:border-aurora-accent/30 transition-all font-semibold"
            >
              View pipeline
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-component border-2 border-aurora-accent/50 text-aurora-accent font-semibold hover:bg-aurora-accent/10 transition-all"
            >
              All deals
            </Link>
          </div>
        </div>
      </section>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link
          href="/contacts"
          className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-aurora-muted text-sm">Contacts</p>
              <p className="text-2xl font-bold">{contactsCount}</p>
            </div>
            <Users className="w-10 h-10 text-aurora-accent/60" />
          </div>
        </Link>
        <Link
          href="/deals"
          className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-aurora-muted text-sm">Active Deals</p>
              <p className="text-2xl font-bold">{dealsCount}</p>
            </div>
            <Briefcase className="w-10 h-10 text-aurora-accent/60" />
          </div>
        </Link>
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-aurora-muted text-sm">Won Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-green-500/60" />
          </div>
        </div>
        <Link
          href="/pipeline"
          className="rounded-container bg-aurora-surface border border-aurora-border p-5 hover:border-aurora-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-aurora-muted text-sm">Pipeline</span>
            <ArrowRight className="w-5 h-5 text-aurora-accent" />
          </div>
        </Link>
      </div>

      {/* Pipeline summary */}
      <div className="rounded-container bg-aurora-surface border border-aurora-border p-6 mb-10">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-aurora-accent" />
          Deals by stage
        </h2>
        <div className="flex flex-wrap gap-4">
          {stages.map((s) => (
            <div
              key={String(s.id)}
              className="flex items-center gap-3 px-4 py-2 rounded-component bg-aurora-bg/50 border border-aurora-border"
            >
              <span className="text-sm font-medium">{String(s.name ?? "")}</span>
              <span className="text-aurora-accent font-bold">
                {dealsByStage[String(s.id)] ?? 0}
              </span>
            </div>
          ))}
          {stages.length === 0 ? (
            <p className="text-aurora-muted text-sm">No pipeline stages. Add stages and deals in Aurora Studio.</p>
          ) : null}
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-container bg-aurora-surface border border-aurora-border p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-aurora-accent" />
          Recent activity
        </h2>
        {activities.length === 0 ? (
          <div>
            <p className="text-aurora-muted text-sm mb-2">No activities yet.</p>
            <Link href="/activities" className="text-aurora-accent hover:underline text-sm font-medium">
              View activities →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li key={String(a.id)} className="flex items-start gap-3 py-2 border-b border-aurora-border last:border-0">
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
    </div>
    </div>
  );
}
