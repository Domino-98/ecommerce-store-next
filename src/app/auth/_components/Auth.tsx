"use client";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Auth() {
  const searchParams = useSearchParams();
  const authType = searchParams.get("type");

  return (
    <div className="mt-10 shadow-lg bg-surface rounded-lg p-8 max-w-[400px] w-full">
      {authType === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
