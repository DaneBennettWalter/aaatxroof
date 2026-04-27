import { readLeads } from "@/lib/admin-data";
import { LeadsView } from "./leads-view";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await readLeads();
  return <LeadsView leads={leads} />;
}
