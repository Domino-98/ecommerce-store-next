import Sidebar from "../_components/Sidebar";

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1 p-10">{children}</div>
    </main>
  );
}
