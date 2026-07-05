import DashboardClient from "@/components/dashboard/DashboardClient";

export default function AdminDashboardPage() {
  // TODO auth:
  // const session = await auth.api.getSession(...)
  // if (!session) redirect("/login")
  // if (!session.user.role === "admin") redirect("/dashboard")

  return (
    <DashboardClient
      role="admin"
      currentUserId="admin-ghost"
      pageLabel="Admin Dashboard"
    />
  );
}