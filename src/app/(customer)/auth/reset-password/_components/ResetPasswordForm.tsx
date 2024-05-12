"use client";

import { useTransition } from "react";
import FormInput from "@/components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Action from "@/components/Action";
import { resetPassword } from "../_actions/reset-password";
import { userResetPasswordSchema } from "@/lib/auth/validation-schemas";

type AuthInputs = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordForm({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInputs>({
    resolver: zodResolver(userResetPasswordSchema),
  });

  function handleResetPassword(formData: FormData) {
    startTransition(async () => {
      const res = await resetPassword(formData, userId, token);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        router.push("/auth?type=login");
      }
    });
  }

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
        Reset password
      </h1>
      <FormInput
        name="newPassword"
        label="New password"
        type="password"
        icon="Lock"
        register={register}
        error={errors.newPassword}
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
        actiontype="button"
        type="submit"
        variant="primary"
        className="mx-auto mt-4"
        disabled={isPending}
      >
        Reset password
      </Action>
    </form>
  );
}
