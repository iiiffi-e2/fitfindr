import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function ProfileRedirectPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/auth/login");
  }

  redirect(`/profile/${session.user.id}`);
}


