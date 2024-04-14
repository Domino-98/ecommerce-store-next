import { PropsWithChildren } from "react";
import { UseFormRegister } from "react-hook-form";

export default function FormInput({
  label,
  name,
  type,
  error,
  register,
}: PropsWithChildren<{
  label: string;
  name: string;
  type: string;
  error: any;
  register: UseFormRegister<any>;
}>) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input type={type} id={name} className="form-input" {...register(name)} />
      {error && <p className="text-sm text-red-400">{error.message}</p>}
    </div>
  );
}
