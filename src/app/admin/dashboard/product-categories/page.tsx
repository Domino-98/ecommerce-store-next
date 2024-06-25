import Action from "@/components/Action";
import { Metadata } from "next";
import PageTitle from "../../_components/PageTitle";
import Icon from "@/components/Icon";
import { db } from "@/lib/database/db";
import { CategoriesTable } from "./_components/CategoriesTable";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const categories = await db.query.categoryTable.findMany({
    orderBy: (categoryTable, { asc }) => [asc(categoryTable.name)],
  });

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

      <CategoriesTable categories={categories} />
    </div>
  );
}
