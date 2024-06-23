import { PropsWithChildren, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthBtn from "./AuthBtn";
import Action from "../Action";
import { signin } from "@/actions/auth/signin";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/actions/auth/resend-verification-email";
import { useCountdown } from "usehooks-ts";
import { userSigninSchema } from "@/lib/auth/validation-schemas";

type AuthInputs = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function LoginForm({
  isAdmin = false,
}: PropsWithChildren<{ isAdmin?: boolean }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [needsVerification, setNeedsVeritfication] = useState(false);
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  async function handleVerificationEmail() {
    const email = getValues().email;
    const res = await resendVerificationEmail(email);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success(res.success);
    startCountdown();
  }

  useEffect(() => {
    if (count === 0) {
      resetCountdown();
    }
  }, [count, resetCountdown]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<{ email: string; password: string; confirmPassword?: string }>({
    resolver: zodResolver(userSigninSchema),
  });

  async function handleSignIn(formData: FormData) {
    startTransition(async () => {
      const res = await signin(formData, isAdmin);

      res?.key === "emailVerification"
        ? setNeedsVeritfication(true)
        : setNeedsVeritfication(false);

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        isAdmin ? router.push("/admin/dashboard") : router.push("/");
      }
      if (res?.key !== "emailVerification") {
        reset();
      }
    });
  }

  const processForm: SubmitHandler<AuthInputs> = async (data) => {
    let formData = new FormData();
    for (let [key, val] of Object.entries(data)) {
      formData.append(key, val);
    }
    handleSignIn(formData);
  };

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <h1 className="text-center text-3xl mb-5 font-bold text-indigo-500">
        Sign In
      </h1>
      <FormInput
        name="email"
        label="E-mail"
        type="email"
        icon="Mail"
        register={register}
        error={errors.email}
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        icon="Lock"
        register={register}
        error={errors.password}
        isPassword={true}
      />
      <button
        type="button"
        onClick={() => router.push("/auth?type=reset")}
        className="text-gray-700 underline hover:text-indigo-700 text-sm flex ml-auto"
      >
        Forgot password?
      </button>
      {needsVerification && (
        <Action
          onClick={handleVerificationEmail}
          actiontype="button"
          type="button"
          variant="primary-outline"
          className="mx-auto mt-4 text-sm"
          disabled={isPending || (count > 0 && count < 60)}
        >
          Send verification email {count > 0 && count < 60 && `in ${count}s`}
        </Action>
      )}
      <Action
        actiontype="button"
        type="submit"
        variant="primary"
        className="mx-auto mt-4"
        disabled={isPending}
      >
        Sign In
      </Action>

      {!isAdmin && (
        <>
          <div className="text-with-lines mt-2">or</div>
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <AuthBtn provider={{ id: "github", name: "GitHub" }} />
            <AuthBtn provider={{ id: "google", name: "Google" }} />
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={{ query: { type: "signup" } }}
              className="text-indigo-500"
            >
              Sign up
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
