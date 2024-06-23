import Action from "@/components/Action";
import { Metadata } from "next";
import PageTitle from "../../_components/PageTitle";
import Icon from "@/components/Icon";
import { db } from "@/lib/database/db";
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

export const metadata: Metadata = {
  title: "Categories",
};

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Product categories</PageTitle>

      <Action
        className="w-fit mb-4"
        actiontype="link"
        href={{ pathname: "/admin/dashboard/product-categories/new" }}
        variant="primary"
      >
        <Icon name="Plus" />
        New category
      </Action>

      <CategoriesTable />
    </div>
  );
}

async function CategoriesTable() {
  const categories = await db.query.categoryTable.findMany({
    orderBy: (categoryTable, { asc }) => [asc(categoryTable.name)],
  });

  return (
    <div className="overflow-x-auto border rounded-lg shadow-shadowBorder">
      <Table className=" min-w-[550px]">
        <TableHeader>
          <TableRow className="!bg-white">
            <TableHead className="w-24">Image</TableHead>
            <TableHead className="w-auto">Name</TableHead>
            <TableHead className="w-auto">Description</TableHead>
            <TableHead className="w-auto">Slug</TableHead>
            <TableHead className="w-16"></TableHead>
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
              {/* <TableCell className="w-16">
                <span>...</span>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
