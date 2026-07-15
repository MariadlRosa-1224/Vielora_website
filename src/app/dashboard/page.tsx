// src/app/dashboard/page.tsx

import DashboardClient from "@/components/dashboard/DashboardClient";
import { verifySession } from "@/lib/dal";

export default async function DashboardPage() {
  const { user } = await verifySession();

  return (
    <DashboardClient
      role={user.role}
      currentUserId={user.id}
      pageLabel={`Signed in as ${user.email}`}
    />
  );
}