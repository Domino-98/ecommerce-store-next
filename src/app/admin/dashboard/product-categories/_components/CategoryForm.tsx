"use client";

import { createCategory, editCategory } from "@/app/admin/_actions/categories";
import { categorySchema } from "@/app/admin/_lib/validation-schemas";
import Action from "@/components/Action";
import FileUpload from "@/components/Form/FileUpload";
import FormInput from "@/components/Form/Input";
import FormSelect from "@/components/Form/Select";
import FormTextarea from "@/components/Form/Textarea";
import { Category, CategoryWithParent } from "@/lib/database/types";
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
  availableCategories,
  currentCategory,
}: {
  availableCategories: Category[];
  currentCategory?: CategoryWithParent;
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
      slug: currentCategory?.slug || "",
      description: currentCategory?.description || "",
      name: currentCategory?.name || "",
      parentId: currentCategory?.parent?.id || "",
    },
  });
  const [isSlugFocused, setIsSlugFocused] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const router = useRouter();

  async function handleCategory(formData: FormData) {
    startTransition(async () => {
      const res = !currentCategory
        ? await createCategory(formData)
        : await editCategory(formData, isImageChanged, currentCategory);
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
    handleCategory(formData);
  };

  const categoriesOptions = [
    { value: "", label: "None" },
    ...availableCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const selectedParentIndex = categoriesOptions.findIndex(
    (cat) => cat.value === currentCategory?.parent?.id
  );

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
        defaultValue={
          categoriesOptions[selectedParentIndex] || categoriesOptions[0]
        }
      />
      <FileUpload
        name="image"
        label="Image"
        register={register}
        error={errors.image}
        imageUrl={currentCategory?.image}
        onImageChange={() => setIsImageChanged(true)}
      />

      <Action
        actiontype="button"
        type="submit"
        variant="primary"
        className="mt-4"
        disabled={isPending}
      >
        {isPending
          ? `${currentCategory ? "Editing" : "Adding"} category...`
          : `${currentCategory ? "Edit" : "Add"} category`}
      </Action>
    </form>
  );
}
