import clsx from "clsx";
import React, { HTMLAttributes } from "react";
import { Ref } from "../types";

const Table = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableElement> & Ref<HTMLTableElement>) => (
  <table
    border={0}
    ref={ref}
    className={clsx("w-full bg-white table-fixed", className)}
    {...props}
  />
);

const TableHeader = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & Ref<HTMLTableSectionElement>) => (
  <thead ref={ref} className={clsx("border-b", className)} {...props} />
);

const TableBody = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & Ref<HTMLTableSectionElement>) => (
  <tbody ref={ref} {...props} />
);

const TableFooter = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & Ref<HTMLTableSectionElement>) => (
  <tfoot ref={ref} className={clsx("font-medium", className)} {...props} />
);

const TableRow = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & Ref<HTMLTableRowElement>) => (
  <tr
    ref={ref}
    className={clsx(
      "transition-colors not-last:border-b border-slate-100 hover:bg-slate-50",
      className
    )}
    {...props}
  />
);

const TableHead = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableCellElement> & Ref<HTMLTableCellElement>) => (
  <th
    ref={ref}
    className={clsx(
      "h-12 px-4 text-left align-middle font-medium border-gray-300 bg-slate-50 whitespace-nowrap overflow-hidden text-ellipsis",
      className
    )}
    {...props}
  />
);

const TableCell = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableCellElement> & Ref<HTMLTableCellElement>) => (
  <td
    ref={ref}
    className={clsx(
      "p-4 align-middle border-gray-300 whitespace-nowrap overflow-hidden text-ellipsis",
      className
    )}
    {...props}
  />
);

const TableCaption = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableCellElement> & Ref<HTMLTableCellElement>) => (
  <caption ref={ref} className={clsx("mt-4 text-sm", className)} {...props} />
);

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
