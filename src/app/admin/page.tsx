import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") redirect("/admin/auth");

  return (
    <div className="flex-1 mt-10 p-5">
      <h1 className="text-xl">Dashboard</h1>
    </div>
  );
}
