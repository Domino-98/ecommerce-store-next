import Auth from "@/components/Auth/Auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="mt-10">
      <div className="flex justify-center gap-4 mt-4 px-4 container mx-auto">
        <Auth />
      </div>
    </div>
  );
}
