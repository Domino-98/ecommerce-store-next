"use client";
import { signIn } from "next-auth/react";

export default function AuthBtn({
  provider,
}: {
  provider: { id: string; name: string };
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
        className="px-4 py-2 btn bg-surface2 text-sm">
        Sign in with {provider.name}
      </button>
    </>
  );
}
