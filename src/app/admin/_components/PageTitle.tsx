export default function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl md:text-3xl font-medium">{children}</h1>;
}
