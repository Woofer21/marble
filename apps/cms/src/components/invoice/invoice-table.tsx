import type { CustomerOrder } from "@polar-sh/sdk/models/components/customerorder.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { authClient } from "@/lib/auth/client";
import { QUERY_KEYS } from "@/lib/queries/keys";
import { type Invoice, InvoiceStatus, invoiceTableColumns } from "./columns";
import { InvoiceDataTable } from "./data-table";

const statusMap = Object.freeze({
  paid: InvoiceStatus.PAID,
  pending: InvoiceStatus.PENDING,
  partially_refunded: InvoiceStatus.PARTIALLY_REFUNDED,
  refunded: InvoiceStatus.REFUNDED,
});

export default function InvoiceTable() {
  // biome-ignore lint/style/noNonNullAssertion: Known to have value
  const workspaceId = useWorkspaceId()!;
  const [formattedData, setFormattedData] = useState<Invoice[]>([]);

  const { data, isLoading } = useQuery<{ items: CustomerOrder[] }>({
    queryKey: QUERY_KEYS.ORDERS(workspaceId),
    queryFn: async () => {
      const res = await authClient.customer.orders.list();

      if (!res.data) {
        return { items: [] };
      }

      return res.data.result;
    },
  });

  useEffect(() => {
    if (data && !isLoading) {
      setFormattedData(
        data.items.map((item) => {
          return {
            id: item.id,
            plan: item.product.name,
            amount: item.totalAmount,
            status: statusMap[item.status],
            date: item.createdAt,
          };
        }),
      );
    }
  }, [data, isLoading]);

  return (
    <InvoiceDataTable columns={invoiceTableColumns} data={formattedData} />
  );
}
