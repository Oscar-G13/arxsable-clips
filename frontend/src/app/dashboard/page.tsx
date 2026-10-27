import { redirect } from "next/navigation";

import HomeApp from "@/components/home-app";
import { noIndexMetadata } from "@/lib/seo";
import { getServerSession } from "@/server/session";

export const metadata = noIndexMetadata;

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?next=/dashboard");
  }

  return <HomeApp />;
}
