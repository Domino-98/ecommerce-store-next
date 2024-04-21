"use client";
import { AppProvider } from "next-auth/providers";
import { signIn } from "next-auth/react";
import Image from "next/image";

type ProviderProps = Partial<AppProvider>;

export default function AuthBtn({ provider }: { provider: ProviderProps }) {
  function getIcon(providerId: AppProvider["id"]) {
    switch (providerId) {
      case "google":
        return "/providers/google-icon.svg";
      case "github":
        return "/providers/github-icon.svg";
      default:
        return "";
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
        className="grow flex justify-center gap-2 items-center px-4 py-2 bg-surface2 hover:bg-surface3 text-sm rounded-md transition-all"
      >
        {getIcon(provider?.id!) && (
          <Image
            priority
            src={getIcon(provider?.id!)}
            alt={provider.name!}
            width={24}
            height={24}
          />
        )}{" "}
        {provider.name}
      </button>
    </>
  );
}
