"use client";
import { PropsWithChildren, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import Icon from "../Icon";
import clsx from "clsx";
import { icons } from "lucide-react";

export default function FormInput({
  label,
  name,
  type,
  error,
  icon,
  isPassword,
  register,
}: PropsWithChildren<{
  label: string;
  name: string;
  type: string;
  error: any;
  icon?: keyof typeof icons;
  isPassword?: boolean;
  register?: UseFormRegister<any>;
}>) {
  const [isVisible, setIsVisible] = useState(false);
  const inputType = isPassword ? (isVisible ? "text" : "password") : type;

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="w-full relative">
        {icon && (
          <Icon
            name={icon}
            size={18}
            color="#565656"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        )}
        <input
          type={inputType}
          id={name}
          className={clsx("form-input", {
            "!pr-10": isPassword === true,
            "!pl-10": icon,
          })}
          {...register?.(name)}
        />
        {isPassword && (
          <div
            onClick={() => setIsVisible((state) => !state)}
            className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
          >
            {!isVisible && <Icon name="EyeOff" size={18} color="#565656" />}
            {isVisible && <Icon name="Eye" size={18} color="#565656" />}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
