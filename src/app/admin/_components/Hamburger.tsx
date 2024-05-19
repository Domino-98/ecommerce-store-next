"use client";

import { createQueryString } from "@/lib/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

export default function Hamburger(props: { className?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = searchParams?.get("nav") === "open";

  function handleNavToggle() {
    isOpen
      ? router.push(pathname)
      : router.push(pathname + "?" + createQueryString("nav", "open"));
  }

  return (
    <button
      onClick={handleNavToggle}
      className={clsx(
        "flex flex-col justify-center items-center",
        props.className
      )}
    >
      <span
        className={`bg-slate-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
          isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
        }`}
      ></span>
      <span
        className={`bg-slate-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      ></span>
      <span
        className={`bg-slate-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
          isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
        }`}
      ></span>
    </button>
  );
}
