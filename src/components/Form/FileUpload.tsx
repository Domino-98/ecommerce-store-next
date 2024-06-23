"use client";

import {
  ChangeEvent,
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import clsx from "clsx";
import Image from "next/image";
import Icon from "../Icon";

export default function FileUpload({
  label,
  name,
  register,
  error,
  multiple = false,
  imageUrl,
  onImageChange,
}: PropsWithChildren<{
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  multiple?: boolean;
  imageUrl?: string | null;
  onImageChange?: () => void;
}>) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState(imageUrl);

  const imagePreview = useMemo(() => {
    return selectedImage
      ? URL.createObjectURL(selectedImage)
      : currentImage
      ? currentImage
      : "";
  }, [selectedImage, currentImage]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register(name);

  function imageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = (e.target as HTMLInputElement).files;
    files && files.length > 0
      ? setSelectedImage(files[0])
      : setSelectedImage(null);
    onImageChange?.();
  }

  function removeSelectedImage() {
    imageInputRef.current!.value = "";
    setSelectedImage(null);
    setCurrentImage(null);
    onImageChange?.();
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
          <div className="relative w-[200px] h-[150px]">
            <Image
              src={imagePreview}
              alt="Category thumb"
              className="rounded-lg"
              fill
              style={{ objectFit: "cover" }}
              sizes="100%"
              priority
            />
            <button
              type="button"
              className="flex items-center justify-center w-6 h-6 absolute top-2 right-2 rounded-full cursor-pointer bg-white group"
            >
              <Icon
                size={16}
                className="group-hover:text-red-500"
                onClick={removeSelectedImage}
                name="X"
              />
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
