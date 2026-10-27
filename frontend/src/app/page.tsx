import { redirect } from "next/navigation";

import { getServerSession } from "@/server/session";

export default async function HomePage() {
  const session = await getServerSession();
  redirect(session?.user ? "/dashboard" : "/sign-in");
}
