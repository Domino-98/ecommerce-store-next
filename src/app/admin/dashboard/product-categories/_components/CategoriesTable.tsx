"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/Table";
import Link from "next/link";
import { Category } from "@/lib/database/types";
import Icon from "@/components/Icon";
import { useState, useTransition } from "react";
import Modal from "@/components/Modal";
import Action from "@/components/Action";
import { deleteCategory } from "@/app/admin/_actions/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategoy] = useState<Category | null>(null);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function openDeleteModal(category: Category) {
    setShowModal(true);
    setActiveCategoy(category);
  }

  async function handleCategoryDelete() {
    startTransition(async () => {
      const res = await deleteCategory(activeCategory as Category);

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(res?.success);
        router.refresh();
      }
      setShowModal(false);
    });
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-shadowBorder">
      <Table className=" min-w-[550px]">
        <TableHeader>
          <TableRow className="!bg-white">
            <TableHead className="w-24">Image</TableHead>
            <TableHead className="w-auto">Name</TableHead>
            <TableHead className="w-auto">Description</TableHead>
            <TableHead className="w-auto">Slug</TableHead>
            <TableHead className="w-auto text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="w-24 p-0" data-label="Image">
                <div className="relative h-16 w-16">
                  <Image
                    alt={category.name}
                    src={category.image || "/images/placeholder-image.jpg"}
                    fill
                    sizes="100%"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="w-auto">
                <Link
                  href={`/admin/dashboard/product-categories/${category.slug}`}
                >
                  {category.name}
                </Link>
              </TableCell>
              <TableCell className="w-auto max-w-48">
                <span>{category.description}</span>
              </TableCell>
              <TableCell className="w-auto">
                <span>{category.slug}</span>
              </TableCell>
              <TableCell className="w-auto text-right">
                <Link
                  className="inline-flex p-2 rounded-md bg-blue-500 hover:bg-blue-600 mr-2"
                  href={`/admin/dashboard/product-categories/${category.slug}`}
                >
                  <Icon name="Pen" size={18} color="white" />
                </Link>
                <button
                  onClick={() => openDeleteModal(category)}
                  className="inline-flex p-2 rounded-md bg-red-500 hover:bg-red-600"
                >
                  <Icon name="Trash2" size={18} color="white" />
                </button>
              </TableCell>
            </TableRow>
          ))}
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            heading={`Delete category`}
            action={
              <form action={handleCategoryDelete}>
                <Action
                  actiontype="button"
                  variant="danger"
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete category"}
                </Action>
              </form>
            }
          >
            {`Are you sure you want to delete "${activeCategory?.name}" category?`}
          </Modal>
        </TableBody>
      </Table>
    </div>
  );
}
