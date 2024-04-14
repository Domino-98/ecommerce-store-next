import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Auth from "./_components/Auth";

export default async function LoginPage() {
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
