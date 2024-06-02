import Action from "@/components/Action";
import { Metadata } from "next";
import PageTitle from "../../_components/PageTitle";
import { Card } from "../../_components/ui/Card";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Products",
};

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Product categories</PageTitle>

      <Card>
        <Action
          className="w-fit"
          actiontype="link"
          href={{ pathname: "/admin/dashboard/product-categories/new" }}
          variant="primary"
        >
          <Icon name="Plus" />
          New category
        </Action>
      </Card>
    </div>
  );
}
