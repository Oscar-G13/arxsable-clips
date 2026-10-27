import { redirect } from "next/navigation";

import { SignIn } from "@/components/auth/sign-in";
import { getServerSession } from "@/server/session";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignIn />;
}
