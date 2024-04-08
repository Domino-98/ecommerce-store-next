"use client";
import { signIn } from "next-auth/react";

export default function AuthBtn({
  provider,
}: {
  provider: { id: string; name: string };
}) {
  return (
    <>
      <button onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
        Sign in with {provider.name}
      </button>
    </>
  );
}
