"use client";

import Icon from "@/components/Icon";
import SidebarItem from "./SidebarItem";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Sidenav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = searchParams?.get("nav") === "open";

  function handleNavClose() {
    router.push(pathname);
  }

  return (
    <aside
      className={`min-h-[calc(100vh-48px)] fixed transform w-[calc(100%-32px)] lg:translate-x-0 lg:sticky lg:max-w-[250px] z-[100] top-0 shrink-0 rounded-2xl overflow-hidden my-6 lg:ml-8 bg-surface shadow-primary transition ${
        isOpen ? "translate-x-0 mx-4" : "-translate-x-full"
      }`}
    >
      {isOpen}
      <div className="relative flex items-center justify-center my-5">
        <span className="text-2xl font-semibold">Admin</span>
        <Icon
          onClick={handleNavClose}
          name="X"
          className="absolute right-4 cursor-pointer block lg:hidden"
        />
      </div>

      <hr className="bg-horizontal-rule bg-transparent border-t-0 h-[1px]" />

      <ul className="pt-4 transform transition ease-in-out px-6shadow-b-2 bg-surface h-full">
        <SidebarItem href={{ pathname: "/admin/dashboard" }} icon="PieChart">
          Dashboard
        </SidebarItem>
        <SidebarItem
          href={{ pathname: "/admin/dashboard/products" }}
          icon="PackageSearch"
        >
          Products
        </SidebarItem>
        <SidebarItem
          href={{ pathname: "/admin/dashboard/product-categories" }}
          icon="Layers3"
        >
          Categories
        </SidebarItem>
        {/* <SidebarItem
          href={{ pathname: "/admin/dashboard/orders" }}
          icon="BaggageClaim"
        >
          Orders
        </SidebarItem>
        <SidebarItem
          href={{ pathname: "/admin/dashboard/customers" }}
          icon="Users"
        >
          Customers
        </SidebarItem> */}
      </ul>
    </aside>
  );
}
