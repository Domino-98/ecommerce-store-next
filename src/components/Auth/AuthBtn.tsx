"use client";
import {
  createGithubAuthorizationURL,
  createGoogleAuthorizationURL,
} from "@/actions/signin-provider";
import Image from "next/image";
import { toast } from "sonner";

export default function AuthBtn({
  provider,
}: {
  provider: { id: "github" | "google"; name: string };
}) {
  function getIcon(providerId = "") {
    switch (providerId) {
      case "google":
        return "/providers/google-icon.svg";
      case "github":
        return "/providers/github-icon.svg";
      default:
        return "";
    }
  }

  async function handleSigninProvider() {
    if (provider?.id === "google") {
      const response = await createGoogleAuthorizationURL();
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        window.location.href = response.data;
      }
    } else if (provider?.id === "github") {
      const response = await createGithubAuthorizationURL();
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        window.location.href = response.data;
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSigninProvider}
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
