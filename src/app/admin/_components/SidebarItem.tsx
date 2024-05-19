"use client";
import Icon from "@/components/Icon";
import { icons } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { UrlObject } from "url";

export default function SidebarItem({
  children,
  href,
  icon,
}: PropsWithChildren & {
  href: UrlObject;
  icon?: keyof typeof icons;
}) {
  const pathname = usePathname();

  return (
    <li className="py-2 px-6 group w-full">
      <Link
        href={href}
        className={`group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md flex items-center gap-4 px-4 py-3 font-medium mx-auto rounded-lg transition-colors duration-200 ${
          pathname === href.pathname && "bg-indigo-600 text-white shadow-md"
        }`}
      >
        {icon && (
          <Icon
            name={icon}
            size={22}
            color="#565656"
            className={`group-hover:stroke-white transition-colors duration-200 ${
              pathname === href.pathname && "stroke-white"
            }`}
          />
        )}
        {children}
      </Link>
    </li>
  );
}
