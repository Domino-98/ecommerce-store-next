import NavLink from "./NavLink";
import { logout } from "@/actions/auth/logout";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export async function Navbar() {
  const { user, session } = await validateRequest();

  const isAdmin = user?.role === "ADMIN";

  async function handleLogout() {
    "use server";
    const res = await logout();
    if (res?.error) {
      toast.error(res.error);
      console.error(res.error);
    } else {
      redirect("/auth?type=login");
    }
  }

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
            <form action={handleLogout}>
              <button
                type="submit"
                className="p-4 text-white block hover:bg-surface1 hover:text-black"
              >
                Logout
              </button>
            </form>
          </li>
        )}
      </ul>
    </nav>
  );
}
