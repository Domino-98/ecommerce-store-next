"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Auth from "@/app/auth/page";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-center shadow-md p-4 bg-surface1">
      <ul className="flex justify-center gap-6">
        <li>
          <Link href="/">Home</Link>
        </li>
        {!session && (
          <li>
            <Link
              href={{
                pathname: "/auth",
                query: { type: "login" },
              }}>
              Login
            </Link>
          </li>
        )}
        {session && (
          <li>
            <button onClick={() => signOut()}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
