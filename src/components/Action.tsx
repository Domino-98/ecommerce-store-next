import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "primary-outline";
  className?: string;
  onClick?: () => void;
};

type ActionProps = BaseProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
        actiontype: "button";
      })
    | (LinkProps & {
        actiontype: "link";
      })
  );

export default function Action({
  children,
  className,
  onClick,
  variant,
  ...props
}: PropsWithChildren<ActionProps>) {
  const classNames =
    "flex px-5 py-[6px] rounded border border-gray-900 shadow-sm hover:bg-gray-900 hover:text-white cursor-pointer transition-all";
  const variants = {
    "border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-700":
      variant === "primary",
    "border-indigo-500 bg-transparent text-indigo-500 hover:bg-indigo-500 hover:text-white":
      variant === "primary-outline",
  };

  if (props.actiontype === "link") {
    return (
      <Link {...props} className={clsx(classNames, variants, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      onClick={onClick}
      className={clsx(
        classNames,
        {
          ...variants,
          "opacity-50 !cursor-not-allowed": props.disabled,
        },
        className
      )}
    >
      {children}
    </button>
  );
}
