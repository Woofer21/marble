"use client";

import { Badge } from "@marble/ui/components/badge";
import type { ColumnDef } from "@tanstack/react-table";
import TableActions from "./table-actions";

export enum InvoiceStatus {
  PAID = 0,
  PENDING = 1,
  PARTIALLY_REFUNDED = 2,
  REFUNDED = 3,
}

export type Invoice = {
  id: string;
  plan: string;
  amount: number;
  status: InvoiceStatus;
  date: Date;
};

export const invoiceTableColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount / 100);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusToType(status)}>{statusToString(status)}</Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: () => <div className="flex justify-end">Actions</div>,
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="flex justify-end">
          <TableActions {...invoice} />
        </div>
      );
    },
  },
];

function statusToType(
  status: InvoiceStatus,
): "positive" | "negative" | "neutral" | "pending" {
  switch (status) {
    case InvoiceStatus.PAID:
      return "positive";
    case InvoiceStatus.PENDING:
      return "neutral";
    case InvoiceStatus.PARTIALLY_REFUNDED:
      return "pending";
    case InvoiceStatus.REFUNDED:
      return "negative";
  }
}

export function statusToString(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.PAID:
      return "Paid";
    case InvoiceStatus.PENDING:
      return "Pending";
    case InvoiceStatus.PARTIALLY_REFUNDED:
      return "Partially Refunded";
    case InvoiceStatus.REFUNDED:
      return "Refunded";
  }
}
