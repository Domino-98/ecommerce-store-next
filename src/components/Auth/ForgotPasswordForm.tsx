import { useEffect, useTransition } from "react";
import Link from "next/link";
import FormInput from "@/components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Action from "../Action";
import { toast } from "sonner";
import { createResetPasswordToken } from "@/actions/auth/create-reset-password-token";
import { useCountdown } from "usehooks-ts";
import { userEmailSchema } from "@/lib/auth/validation-schemas";

type AuthInputs = {
  email: string;
};

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInputs>({
    resolver: zodResolver(userEmailSchema),
  });

  function handleResetPassword(formData: FormData) {
    const email = formData.get("email") as string;

    startTransition(async () => {
      const res = await createResetPasswordToken(email);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        startCountdown();
      }
    });
  }

  useEffect(() => {
    if (count === 0) {
      resetCountdown();
    }
  }, [count, resetCountdown]);

  const processForm: SubmitHandler<AuthInputs> = async (data) => {
    let formData = new FormData();
    for (let [key, val] of Object.entries(data)) {
      formData.append(key, val);
    }
    handleResetPassword(formData);
  };

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <h1 className="text-center text-3xl mb-5 font-bold text-indigo-500">
        Forgot password
      </h1>
      <FormInput
        name="email"
        label="E-mail"
        type="email"
        icon="Mail"
        register={register}
        error={errors.email}
      />
      <Action
        actiontype="button"
        type="submit"
        variant="primary"
        className="mx-auto mt-4"
        disabled={isPending || (count > 0 && count < 60)}
      >
        Send Email {count > 0 && count < 60 && `in ${count}s`}
      </Action>

      <div className="flex gap-2 mt-4 justify-center">
        <Link href={{ query: { type: "login" } }} className="text-indigo-500">
          Sign in
        </Link>
        /
        <Link href={{ query: { type: "signup" } }} className="text-indigo-500">
          Sign up
        </Link>
      </div>
    </form>
  );
}
