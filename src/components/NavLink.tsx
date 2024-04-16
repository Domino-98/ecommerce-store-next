"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { Url } from "url";

export default function NavLink(
  props: Omit<ComponentProps<typeof Link>, "className">
) {
  const pathname = usePathname();
  const url = props.href as Url;
  return (
    <Link
      {...props}
      className={`p-4 text-white block hover:bg-surface1 hover:text-gray-950 ${
        pathname === url.pathname && "bg-surface1 !text-gray-950"
      }`}
    />
  );
}
