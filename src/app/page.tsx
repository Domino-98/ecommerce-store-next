import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  console.log({ session });

  return (
    <main className="mt-10">
      <h1 className="text-center text-xl">Home Page</h1>
    </main>
  );
}
