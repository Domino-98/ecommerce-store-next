import AuthBtn from "@/components/AuthBtn";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="mt-10">
      <h1 className="text-center text-xl">Sign in</h1>
      <div className="flex justify-center gap-4 mt-4">
        <AuthBtn provider={{ id: "github", name: "GitHub" }} />
        <AuthBtn provider={{ id: "google", name: "Google" }} />
      </div>
    </div>
  );
}
