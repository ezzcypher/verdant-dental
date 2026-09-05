import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { AdminDashboard } from "./_components/admin-dashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  // Middleware already bounced anyone without a plausible cookie; this is the
  // real cryptographic + database check.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <AdminDashboard />;
}
