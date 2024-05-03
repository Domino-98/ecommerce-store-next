import { PropsWithChildren, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSigninSchema } from "@/lib/validationSchema";
import AuthBtn from "./AuthBtn";
import Action from "../Action";
import { signin } from "@/actions/signin";
import { toast } from "sonner";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ email: string; password: string; confirmPassword?: string }>({
    resolver: zodResolver(userSigninSchema),
  });

  async function handleSignIn(formData: FormData) {
    startTransition(async () => {
      const res = await signin(formData, isAdmin);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("You are successfully logged in!");
        isAdmin ? router.push("/admin/dashboard") : router.push("/");
      }
      reset();
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
            Don't have an account?{" "}
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
