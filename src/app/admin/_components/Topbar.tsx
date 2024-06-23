"use client";
import { logout } from "@/actions/auth/logout";
import Icon from "@/components/Icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";
import Hamburger from "./Hamburger";

export default function Topbar() {
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
    <header className="w-full flex flex-wrap gap-4 sm:flex-row justify-between z-10 px-4 sm:px-6 md:px-8 py-6">
      <Breadcrumbs
        separator={<span> / </span>}
        activeClasses="!text-indigo-600"
        listClasses="hover:underline not-first:ml-2 mr-2 font-bold text-slate-500"
        capitalizeLinks
      />

      <ul className="flex w-full sm:w-auto gap-12">
        <Hamburger className="block lg:hidden mr-auto" />

        <li className="group">
          <Link
            href={{ pathname: "/" }}
            className="font-medium flex items-center gap-2 group-hover:text-indigo-600"
          >
            <Icon
              name="Store"
              size={22}
              className="group-hover:stroke-indigo-600"
            />
          </Link>
        </li>
        <li className="group">
          <form action={handleLogout}>
            <button
              type="submit"
              className="font-medium flex items-center gap-3 group-hover:text-indigo-600"
            >
              <Icon
                name="LogOut"
                size={22}
                className="group-hover:stroke-indigo-600"
              />
            </button>
          </form>
        </li>
      </ul>
    </header>
  );
}
