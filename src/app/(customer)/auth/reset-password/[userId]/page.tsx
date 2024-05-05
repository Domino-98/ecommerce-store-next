import { redirect } from "next/navigation";
import ResetPasswordForm from "../_components/ResetPasswordForm";
import { canResetPassword } from "../_lib/canResetPassword";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { token: string };
}) {
  const valid = await canResetPassword(params.userId, searchParams.token);

  if (!valid.ok) {
    redirect("/");
  }

  return (
    <div className="mt-10">
      <div className="flex justify-center gap-4 mt-4 px-4 container mx-auto">
        <div className="mt-10 shadow-lg bg-surface rounded-lg p-4 md:p-8 max-w-[400px] w-full">
          <ResetPasswordForm
            userId={params.userId}
            token={searchParams.token}
          />
        </div>
      </div>
    </div>
  );
}
