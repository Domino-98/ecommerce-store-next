"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function Topbar({
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <header className="bg-surface1 w-full flex items-center justify-between">
      <h1 className="font-semibold text-2xl">{title}</h1>
      <ul className="flex gap-8">
        <li>
          <Link href={{ pathname: "/" }}>Shop</Link>
        </li>
        <li>
          <button onClick={() => signOut()}>Logout</button>
        </li>
      </ul>
    </header>
  );
}
