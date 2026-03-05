# Aurora Starter — CRM

A SugarCRM-style demo: sales pipeline, contacts, deals and activities. Powered by [Aurora Studio](https://github.com/marceldupr/aurora-studio).

## Features

- **Dashboard** — KPIs (contacts, deals, revenue), pipeline summary, recent activity
- **Pipeline** — Kanban board by stage, move deals between stages
- **Deals** — List with value and status
- **Contacts** — Card grid with company, email, phone
- **Activities** — Calls, emails, meetings log
- **Holmes** — AI-ready (script included when configured)

## Setup

1. Clone and install: `pnpm install`
2. Copy `.env.example` to `.env.local`
3. Set `AURORA_API_URL`, `AURORA_API_KEY`, `NEXT_PUBLIC_TENANT_SLUG`
4. Provision schema: `pnpm schema:provision`
5. (Optional) Seed data: `pnpm seed`
6. Run: `pnpm dev` (port 3002)

## Tables

- **contacts** — name, email, phone, company
- **pipeline_stages** — name, slug, sort_order
- **deals** — name, contact, pipeline_stage, value, status (open/won/lost)
- **activities** — subject, deal, type (call/email/meeting)

## Workflows

- `deal.won` → email to owner
- `contact.created` → (placeholder assign)
