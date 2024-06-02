import { Fragment, ReactNode } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

type TBreadCrumbProps = {
  separator: ReactNode;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
  homeElement?: ReactNode;
};

export default function Breadcrumbs({
  homeElement,
  separator,
  listClasses,
  activeClasses,
  capitalizeLinks,
}: TBreadCrumbProps) {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <ul className="flex">
      {homeElement && (
        <li className={listClasses}>
          <Link href={"/"}>{homeElement}</Link>
        </li>
      )}
      {homeElement && pathNames.length > 0 && separator}
      {pathNames.map((link, index) => {
        let href = `/${pathNames.slice(0, index + 1).join("/")}`;
        let itemClasses =
          paths === href ? `${listClasses} ${activeClasses}` : listClasses;
        let itemLink = capitalizeLinks
          ? link[0].toUpperCase() + link.slice(1, link.length)
          : link;
        return (
          <Fragment key={index}>
            <li className={itemClasses}>
              <Link href={href}>{itemLink.replace("-", " ")}</Link>
            </li>
            {pathNames.length !== index + 1 && separator}
          </Fragment>
        );
      })}
    </ul>
  );
}
