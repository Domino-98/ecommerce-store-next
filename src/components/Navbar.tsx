"use client";
import { signOut, useSession } from "next-auth/react";
import NavLink from "./NavLink";

export function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <nav className="flex justify-center bg-gray-900">
      <ul className="flex justify-center">
        <li>
          <NavLink href={{ pathname: "/" }}>Home</NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink href={{ pathname: "/admin/dashboard" }}>Dashboard</NavLink>
          </li>
        )}
        {!session && (
          <li>
            {!session && (
              <NavLink href={{ pathname: "/auth", query: "type=login" }}>
                Login
              </NavLink>
            )}
          </li>
        )}
        {session && (
          <li>
            <button
              onClick={() => signOut()}
              className="p-4 text-white block hover:bg-surface1 hover:text-black"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
