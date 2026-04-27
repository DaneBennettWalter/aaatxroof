import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated, getAdminPassword } from "@/lib/admin-auth";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!getAdminPassword()) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Admin disabled</h1>
        <p className="mt-2 text-muted-foreground">
          Set <code className="rounded bg-muted px-1">ADMIN_PASSWORD</code> in{" "}
          <code className="rounded bg-muted px-1">.env.local</code> to enable
          the admin dashboard.
        </p>
      </div>
    );
  }

  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold">
              AAA TX Roof Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground"
              >
                Overview
              </Link>
              <Link
                href="/admin/leads"
                className="text-muted-foreground hover:text-foreground"
              >
                Leads
              </Link>
              <Link
                href="/admin/appointments"
                className="text-muted-foreground hover:text-foreground"
              >
                Appointments
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
