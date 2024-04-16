import { PropsWithChildren, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/Form/Input";
import Submit from "@/components/Form/Submit";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSigninSchema } from "@/lib/validationSchema";
import AuthBtn from "./AuthBtn";

type AuthInputs = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function LoginForm({
  isAdmin = false,
}: PropsWithChildren<{ isAdmin?: boolean }>) {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ email: string; password: string; confirmPassword?: string }>({
    resolver: zodResolver(userSigninSchema),
  });

  async function handleSignIn(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        email,
        password,
        type: "admin",
        redirect: false,
      });
      if (!response?.error) {
        isAdmin ? router.push("/admin/dashboard") : router.push("/");
      } else {
        setError("error");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      setError("error");
      setTimeout(() => setError(""), 5000);
      console.log({ err });
    } finally {
      setIsSubmitting(false);
      reset();
    }
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
      <h1 className="text-center text-3xl mb-5 font-bold text-blue-500">
        Sign In
      </h1>
      {error && (
        <div className="py-2 px-4 mb-3 text-white rounded font-medium text-center bg-red-500">
          Invalid credentials!
        </div>
      )}
      <FormInput
        name="email"
        label="E-mail"
        type="email"
        register={register}
        error={errors.email}
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password}
      />
      <Submit disabled={isSubmitting}>Sign In</Submit>

      {!isAdmin && (
        <>
          <div className="flex gap-3 mt-5">
            <AuthBtn provider={{ id: "github", name: "GitHub" }} />
            <AuthBtn provider={{ id: "google", name: "Google" }} />
          </div>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link
              href={{ query: { type: "signup" } }}
              className="text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </>
      )}
    </form>
  );
}
