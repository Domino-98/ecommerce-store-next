import { Navbar } from "@/components/Navbar";
import { auth } from "@/lib/auth";

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
