import clsx from "clsx";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx("bg-surface shadow-primary rounded-lg p-8", className)}
    >
      {children}
    </div>
  );
}
