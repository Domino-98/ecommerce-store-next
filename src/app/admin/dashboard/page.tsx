import { Metadata } from "next";
import PageTitle from "../_components/PageTitle";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <>
      <PageTitle>Dashboard</PageTitle>
    </>
  );
}
