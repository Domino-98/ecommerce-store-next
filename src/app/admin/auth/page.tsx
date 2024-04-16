import Auth from "@/components/Auth/Auth";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="flex justify-center gap-4 mt-4 px-4 container mx-auto">
        <Auth isAdmin={true} />
      </div>

      <Link href={{ pathname: "/" }} className="btn btn-primary-outline mt-10">
        Shop
      </Link>
    </div>
  );
}
