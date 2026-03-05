import Link from "next/link";
import { createAuroraClient } from "@/lib/aurora";
import { PipelineBoard } from "./PipelineBoard";

export const dynamic = "force-dynamic";

async function getPipelineData() {
  const client = createAuroraClient();
  const [stagesRes, dealsRes, contactsRes] = await Promise.all([
    client.tables("pipeline_stages").records.list({
      limit: 20,
      sort: "sort_order",
      order: "asc",
    }),
    client.tables("deals").records.list({ limit: 200 }),
    client.tables("contacts").records.list({ limit: 200 }),
  ]);

  const stages = (stagesRes as { data?: Record<string, unknown>[] }).data ?? [];
  const deals = (dealsRes as { data?: Record<string, unknown>[] }).data ?? [];
  const contacts = (contactsRes as { data?: Record<string, unknown>[] }).data ?? [];
  const contactMap = Object.fromEntries(contacts.map((c) => [String(c.id), c]));

  return { stages, deals, contactMap };
}

export default async function PipelinePage() {
  let stages: Record<string, unknown>[] = [];
  let deals: Record<string, unknown>[] = [];
  let contactMap: Record<string, Record<string, unknown>> = {};
  let error: string | null = null;

  try {
    const data = await getPipelineData();
    stages = data.stages;
    deals = data.deals;
    contactMap = data.contactMap;
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load pipeline";
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-8 text-center">
          <p className="text-aurora-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/" className="text-aurora-muted hover:text-white text-sm mb-6 inline-block">← Dashboard</Link>
        <div className="rounded-container bg-aurora-surface border border-aurora-border p-12 text-center">
          <p className="text-aurora-muted mb-2">No pipeline stages</p>
          <p className="text-sm text-aurora-muted">Add pipeline stages in Aurora Studio, then add deals to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="text-aurora-muted hover:text-white text-sm mb-6 inline-block">← Dashboard</Link>
      <h1 className="text-3xl font-bold mb-8">Sales Pipeline</h1>
      <PipelineBoard stages={stages} deals={deals} contactMap={contactMap} />
    </div>
  );
}
