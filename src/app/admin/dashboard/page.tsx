import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "../_components/Topbar";

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") redirect("/admin/auth");

  return (
    <>
      <Topbar title="Dashboard" />
    </>
  );
}
