import { useTransition } from "react";
import Link from "next/link";
import FormInput from "@/components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignupSchema } from "@/lib/validationSchema";
import { useRouter } from "next/navigation";
import { signup } from "@/actions/signup";
import Action from "../Action";
import { toast } from "sonner";

type AuthInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();

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
      const res = await signup(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(
          "You have successfully registered. We've sent you a verification email."
        );
        router.push("/auth?type=login");
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
        actiontype="button"
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
