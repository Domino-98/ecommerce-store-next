"use client";

import { createCategory } from "@/app/admin/_actions/categories";
import { categorySchema } from "@/app/admin/_lib/validation-schemas";
import Action from "@/components/Action";
import FileUpload from "@/components/Form/FileUpload";
import FormInput from "@/components/Form/Input";
import FormSelect from "@/components/Form/Select";
import FormTextarea from "@/components/Form/Textarea";
import { Category } from "@/lib/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export type CategoryInputs = {
  name: string;
  description: string;
  slug: string;
  parentId: string;
  image: FileList;
};

export default function CategoryForm({
  categories,
}: {
  categories: Category[];
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CategoryInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      parentId: "",
    },
  });
  const [isSlugFocused, setIsSlugFocused] = useState(false);
  const router = useRouter();

  async function handleCategoryAdd(formData: FormData) {
    startTransition(async () => {
      const res = await createCategory(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        router.push("/admin/dashboard/product-categories");
      }
    });
  }

  const processForm: SubmitHandler<CategoryInputs> = async (data) => {
    let formData = new FormData();
    for (let [key, val] of Object.entries(data)) {
      if (val instanceof FileList) {
        for (let i = 0; i < val.length; i++) {
          const updatedName = `category-${val[i].name}`;
          formData.append("image", val[i], updatedName);
        }
      } else {
        formData.append(key, val);
      }
    }
    handleCategoryAdd(formData);
  };

  const categoriesOptions = [
    { value: "", label: "None" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  function handleSlugChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isSlugFocused) {
      const value = event.target.value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setValue("slug", value);
    }
  }

  function handleSlugFocus() {
    setIsSlugFocused(true);
  }

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <FormInput
        name="name"
        label="Name"
        type="text"
        register={register}
        error={errors.name}
        onInput={handleSlugChange}
      />
      <FormTextarea
        name="description"
        label="Description"
        register={register}
      />
      <FormInput
        name="slug"
        label="Slug"
        type="text"
        register={register}
        error={errors.slug}
        onFocus={handleSlugFocus}
      />
      <FormSelect
        label="Parent Category"
        name="parentId"
        options={categoriesOptions}
        control={control}
        defaultValue={categoriesOptions[0]}
      />
      <FileUpload
        name="image"
        label="Image"
        register={register}
        error={errors.image}
      />

      <Action
        actiontype="button"
        type="submit"
        variant="primary"
        className="mt-4"
        disabled={isPending}
      >
        {isPending ? "Adding category..." : "Add category"}
      </Action>
    </form>
  );
}
