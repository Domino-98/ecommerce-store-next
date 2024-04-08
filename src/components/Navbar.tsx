"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-center shadow-md p-4">
      <ul className="flex justify-center gap-6">
        <li>
          <Link href="/">Home</Link>
        </li>
        {!session && (
          <li>
            <Link href="/login">Login</Link>
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
