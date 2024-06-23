import PageTitle from "@/app/admin/_components/PageTitle";
import { Card } from "@/components/UI/Card";
import CategoryForm from "../_components/CategoryForm";
import { db } from "@/lib/database/db";

export default async function NewCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const categories = await db.query.categoryTable.findMany({
    where: (categoryTable, { not, eq }) =>
      not(eq(categoryTable.slug, params.slug)),
  });
  const category = await db.query.categoryTable.findFirst({
    where: (categoryTable, { eq }) => eq(categoryTable.slug, params.slug),
    with: {
      parent: true,
    },
  });

  return (
    <>
      <PageTitle>Category: {category?.name}</PageTitle>
      <Card className="mt-4">
        <CategoryForm
          availableCategories={categories}
          currentCategory={category}
        />
      </Card>
    </>
  );
}
