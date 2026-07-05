import DashboardClient from "@/components/dashboard/DashboardClient";

export default function UserDashboardPage() {
  // TODO auth:
  // const session = await auth.api.getSession(...)
  // if (!session) redirect("/login")
  // const userId = session.user.id

  return (
    <DashboardClient
      role="user"
      currentUserId="user-ana"
      pageLabel="User Dashboard"
    />
  );
}