import PageTitle from "@/app/admin/_components/PageTitle";
import { Card } from "@/app/admin/_components/ui/Card";
import CategoryForm from "../_components/CategoryForm";
import { db } from "@/lib/database/db";

export default async function NewCategoryPage() {
  const categories = await db.query.categoryTable.findMany();

  return (
    <>
      <PageTitle>New category</PageTitle>
      <Card className="mt-4">
        <CategoryForm categories={categories} />
      </Card>
    </>
  );
}
