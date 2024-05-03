"use client";
import { logout } from "@/actions/logout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export default function Topbar({
  title,
}: PropsWithChildren<{ title: string }>) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await logout();
      if (res?.error) {
        console.error(res.error);
      } else {
        router.push("/admin/auth");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="bg-surface1 w-full flex items-center justify-between">
      <h1 className="font-semibold text-2xl">{title}</h1>
      <ul className="flex gap-8">
        <li>
          <Link href={{ pathname: "/" }}>Shop</Link>
        </li>
        <li>
          <form action={handleLogout}>
            <button type="submit">Logout</button>
          </form>
        </li>
      </ul>
    </header>
  );
}
