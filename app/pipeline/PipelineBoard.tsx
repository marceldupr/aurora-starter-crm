"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format((cents ?? 0) / 100);
}

export function PipelineBoard({
  stages,
  deals,
  contactMap,
}: {
  stages: Record<string, unknown>[];
  deals: Record<string, unknown>[];
  contactMap: Record<string, Record<string, unknown>>;
}) {
  const router = useRouter();
  const [moving, setMoving] = useState<string | null>(null);

  const moveDeal = async (dealId: string, stageId: string) => {
    setMoving(dealId);
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipeline_stage_id: stageId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setMoving(null);
    }
  };

  const dealsByStage: Record<string, Record<string, unknown>[]> = {};
  for (const s of stages) {
    const id = String(s.id ?? "");
    dealsByStage[id] = deals.filter((d) => String(d.pipeline_stage_id ?? "") === id);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6">
      {stages.map((stage) => {
        const stageId = String(stage.id ?? "");
        const stageDeals = dealsByStage[stageId] ?? [];
        return (
          <div
            key={stageId}
            className="flex-shrink-0 w-72 rounded-container bg-aurora-surface border border-aurora-border flex flex-col"
          >
            <div className="p-4 border-b border-aurora-border">
              <h2 className="font-semibold">{String(stage.name ?? "")}</h2>
              <p className="text-sm text-aurora-muted">{stageDeals.length} deals</p>
            </div>
            <div className="p-3 flex-1 min-h-[200px] space-y-3">
              {stageDeals.map((deal) => {
                const contact = deal.contact_id
                  ? contactMap[String(deal.contact_id)]
                  : null;
                const contactName = contact ? String(contact.name ?? "") : "—";
                const value = deal.value != null ? Number(deal.value) : 0;
                const isMoving = moving === String(deal.id);

                return (
                  <Link
                    key={String(deal.id)}
                    href={`/deals/${deal.id}`}
                    className="block rounded-component bg-aurora-bg/60 border border-aurora-border p-4 group hover:border-aurora-accent/40 transition-colors"
                  >
                    <p className="font-medium mb-1">{String(deal.name ?? "")}</p>
                    <p className="text-sm text-aurora-muted mb-2">{contactName}</p>
                    {value > 0 ? (
                      <p className="text-aurora-accent font-semibold text-sm mb-3">
                        {formatCurrency(value)}
                      </p>
                    ) : null}
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        className="w-full text-xs px-2 py-1.5 rounded-component bg-aurora-surface border border-aurora-border text-aurora-muted"
                        defaultValue=""
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v) moveDeal(String(deal.id), v);
                        }}
                        disabled={isMoving}
                      >
                        <option value="">Move to...</option>
                        {stages
                          .filter((s) => String(s.id) !== stageId)
                          .map((s) => (
                            <option key={String(s.id)} value={String(s.id)}>
                              {String(s.name ?? "")}
                            </option>
                          ))}
                      </select>
                    </div>
                  </Link>
                );
              })}
              {stageDeals.length === 0 ? (
                <p className="text-aurora-muted/60 text-sm py-8 text-center">No deals</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
