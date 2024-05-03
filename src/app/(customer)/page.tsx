import { validateRequest } from "@/lib/auth";

export default async function HomePage() {
  const { user } = await validateRequest();

  console.log({ user });

  return (
    <main className="mt-10">
      <h1 className="text-center text-xl">Home Page</h1>
    </main>
  );
}
