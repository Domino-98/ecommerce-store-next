"use client";

import {
  ChangeEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import clsx from "clsx";
import Image from "next/image";
import Action from "../Action";
import { CategoryInputs } from "@/app/admin/dashboard/products/_components/CategoryForm";

export default function FileUpload({
  label,
  name,
  register,
  error,
  multiple = false,
}: PropsWithChildren<{
  label: string;
  name: keyof CategoryInputs;
  register: UseFormRegister<CategoryInputs>;
  error?: FieldError;
  multiple?: boolean;
}>) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register(name);

  useEffect(() => {
    selectedImage
      ? setImagePreview(URL.createObjectURL(selectedImage))
      : setImagePreview("");
  }, [selectedImage]);

  function imageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
    } else {
      setSelectedImage(null);
    }
  }

  function removeSelectedImage() {
    imageInputRef.current!.value = "";
    setSelectedImage(null);
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="w-full relative">
        <input
          {...rest}
          ref={(e) => {
            ref(e);
            imageInputRef.current = e;
          }}
          type="file"
          id={name}
          multiple={multiple}
          onChange={imageChange}
          className={clsx(
            "form-input block !w-auto text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 !bg-transparent !px-0 !pt-0"
          )}
        />
      </div>
      {imagePreview && (
        <div className="flex flex-col gap-2 items-start">
          <div className="relative w-[150px] h-[150px]">
            <Image
              src={imagePreview}
              alt="Category thumb"
              className="rounded-md border border-gray-500"
              fill
              objectFit="cover"
            />
          </div>
          <Action
            className="text-sm"
            variant="primary-outline"
            actiontype="button"
            onClick={removeSelectedImage}
            type="button"
          >
            Remove image
          </Action>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
