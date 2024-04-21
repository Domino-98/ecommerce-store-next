"use client";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { PropsWithChildren } from "react";

export default function Auth({
  isAdmin = false,
}: PropsWithChildren<{ isAdmin?: boolean }>) {
  const searchParams = useSearchParams();
  const authType = searchParams.get("type");

  console.log({ isAdmin });

  return (
    <div className="mt-10 shadow-lg bg-surface rounded-lg p-4 md:p-8 max-w-[400px] w-full">
      {authType === "login" || isAdmin ? (
        <LoginForm isAdmin={isAdmin} />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
}
