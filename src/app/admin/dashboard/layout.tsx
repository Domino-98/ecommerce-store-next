import { validateRequest } from "@/lib/auth";
import Sidebar from "../_components/Sidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  if (user?.role !== "ADMIN") redirect("/admin/auth");

  return (
    <main className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1 p-10">{children}</div>
    </main>
  );
}
