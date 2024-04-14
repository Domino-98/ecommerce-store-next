import { PropsWithChildren } from "react";

export default function Submit(
  props: PropsWithChildren<{ disabled?: boolean }>
) {
  const { disabled } = props;

  return (
    <button
      className={`btn btn-primary mt-4 mx-auto ${
        disabled ? "opacity-50 cursor-not-allowed" : undefined
      }`}
      disabled={disabled}>
      {props.children}
    </button>
  );
}
