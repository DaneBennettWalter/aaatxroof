import { readAppointments } from "@/lib/admin-data";
import { AppointmentsView } from "./appointments-view";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const appointments = await readAppointments();
  return <AppointmentsView appointments={appointments} />;
}
