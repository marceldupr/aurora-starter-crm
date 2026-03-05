#!/usr/bin/env node
/**
 * Seed script for aurora-starter-crm.
 * Run after schema provisioning.
 *
 * Usage:
 *   AURORA_API_URL=... AURORA_API_KEY=... node scripts/seed.mjs
 */

const apiUrl = process.env.AURORA_API_URL || process.env.NEXT_PUBLIC_AURORA_API_URL;
const apiKey = process.env.AURORA_API_KEY;

if (!apiUrl || !apiKey) {
  console.error("Set AURORA_API_URL and AURORA_API_KEY");
  process.exit(1);
}

const base = apiUrl.replace(/\/$/, "");

async function createRecord(table, data) {
  const res = await fetch(`${base}/v1/tables/${table}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`${table} create failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function seed() {
  console.log("Seeding aurora-starter-crm...");

  // 1. Pipeline stages (lead -> qualified -> proposal -> won/lost)
  const stages = [
    { name: "Lead", slug: "lead", sort_order: 1 },
    { name: "Qualified", slug: "qualified", sort_order: 2 },
    { name: "Proposal", slug: "proposal", sort_order: 3 },
    { name: "Negotiation", slug: "negotiation", sort_order: 4 },
    { name: "Won", slug: "won", sort_order: 5 },
    { name: "Lost", slug: "lost", sort_order: 6 },
  ];
  const createdStages = [];
  for (const s of stages) {
    const rec = await createRecord("pipeline_stages", s);
    createdStages.push(rec);
    console.log("  Created stage:", s.name);
  }

  // 2. Contacts
  const contacts = [
    { name: "Alice Johnson", email: "alice@techcorp.com", phone: "+44 20 7123 4567", company: "TechCorp Ltd" },
    { name: "Bob Smith", email: "bob@innovate.io", phone: "+44 20 7987 6543", company: "Innovate.io" },
    { name: "Carol Williams", email: "carol@global.co", company: "Global Solutions" },
    { name: "David Brown", email: "david@startup.ai", phone: "+44 7700 900123", company: "Startup AI" },
    { name: "Eva Martinez", email: "eva@design.studio", company: "Design Studio" },
  ];
  const createdContacts = [];
  for (const c of contacts) {
    const rec = await createRecord("contacts", c);
    createdContacts.push(rec);
    console.log("  Created contact:", c.name);
  }

  // 3. Deals
  const dealSpecs = [
    { name: "TechCorp Enterprise License", contact_id: createdContacts[0].id, pipeline_stage_id: createdStages[2].id, value: 45000, status: "open" },
    { name: "Innovate.io Integration", contact_id: createdContacts[1].id, pipeline_stage_id: createdStages[1].id, value: 12000, status: "open" },
    { name: "Global Solutions Retainer", contact_id: createdContacts[2].id, pipeline_stage_id: createdStages[3].id, value: 8000, status: "open" },
    { name: "Startup AI SaaS", contact_id: createdContacts[3].id, pipeline_stage_id: createdStages[4].id, value: 25000, status: "won" },
    { name: "Design Studio Project", contact_id: createdContacts[4].id, pipeline_stage_id: createdStages[0].id, value: 5500, status: "open" },
  ];
  const createdDeals = [];
  for (const d of dealSpecs) {
    const rec = await createRecord("deals", d);
    createdDeals.push(rec);
    console.log("  Created deal:", d.name);
  }

  // 4. Activities
  const activitySpecs = [
    { subject: "Initial discovery call with Alice", deal_id: createdDeals[0].id, type: "call" },
    { subject: "Sent proposal to Bob", deal_id: createdDeals[1].id, type: "email" },
    { subject: "Demo meeting with Carol", deal_id: createdDeals[2].id, type: "meeting" },
  ];
  for (const a of activitySpecs) {
    await createRecord("activities", a);
    console.log("  Created activity:", a.subject);
  }

  console.log("Seed complete.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
</think>

<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace