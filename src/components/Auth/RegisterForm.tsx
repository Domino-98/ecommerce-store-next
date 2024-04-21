import { useState, useTransition } from "react";
import Link from "next/link";
import FormInput from "@/components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignupSchema } from "@/lib/validationSchema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signup } from "@/actions/signup";
import Action from "../Action";

type AuthInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInputs>({
    resolver: zodResolver(userSignupSchema),
  });

  function handleSignUp(formData: FormData) {
    startTransition(async () => {
      const signupRes = await signup(formData);
      if (signupRes?.error) {
        setError(signupRes.error);
        setTimeout(() => setError(""), 5000);
        return;
      }
      const signinRes = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (!signinRes?.error) {
        router.push("/");
      } else {
        setError("Error signing in");
      }
    });
  }

  const processForm: SubmitHandler<AuthInputs> = async (data) => {
    let formData = new FormData();
    for (let [key, val] of Object.entries(data)) {
      formData.append(key, val);
    }
    handleSignUp(formData);
  };

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <h1 className="text-center text-3xl mb-5 font-bold text-indigo-500">
        Sign Up
      </h1>
      {error && (
        <div className="py-2 px-4 mb-3 text-white rounded font-medium text-center bg-red-500">
          {error}
        </div>
      )}
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
      <FormInput
        name="confirmPassword"
        label="Confirm password"
        type="password"
        icon="Lock"
        register={register}
        error={errors.confirmPassword}
        isPassword={true}
      />
      <Action
        btnType="button"
        type="submit"
        variant="primary"
        className="mx-auto mt-4"
        disabled={isPending}
      >
        Sign Up
      </Action>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href={{ query: { type: "login" } }} className="text-indigo-500">
          Sign in
        </Link>
      </div>
    </form>
  );
}
