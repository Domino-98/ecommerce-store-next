import { validateRequest } from "@/lib/auth";
import Sidenav from "../_components/Sidenav";
import { redirect } from "next/navigation";
import Topbar from "../_components/Topbar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  if (user?.role !== "ADMIN") redirect("/admin/auth");

  return (
    <main className="flex">
      <Sidenav />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </main>
  );
}
