"use client";

import { useEffect, useMemo, useState } from "react";
import { ReceiptText, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { formatCurrency, formatDateTime } from "@/utils/admin";
import { getOrderItems, getOrders, OrderItemRow, OrderRow } from "@/services/admin";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);

    try {
      const [orderData, itemData] = await Promise.all([getOrders(), getOrderItems()]);
      setOrders(orderData);
      setOrderItems(itemData);
      setSelectedOrderId((current) => current || orderData[0]?.id || "");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const selectedItems = useMemo(
    () => orderItems.filter((item) => item.order_id === selectedOrder?.id),
    [orderItems, selectedOrder?.id]
  );

  return (
    <AdminShell
      title="Orders"
      description="Inspect placed orders, shipping details, and the item rows without mutating fulfillment state yet."
      actions={
        <button
          type="button"
          onClick={() => void reload()}
          className="inline-flex items-center gap-2 rounded-xl border border-black bg-black px-4 py-3 text-sm text-white transition-colors hover:bg-black/90"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-black">Placed orders</h3>
              <p className="mt-1 text-sm text-black/60">Read-only order operations with totals, statuses, and timestamps.</p>
            </div>
            <div className="text-sm text-black/60">{orders.length} orders</div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-black/10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-black/10 text-left text-sm">
                <thead className="bg-black/5 text-black">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 bg-white">
                  {loading ? (
                    <tr>
                      <td className="px-4 py-6 text-black/60" colSpan={5}>Loading orders...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-black/60" colSpan={5}>No orders found.</td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const active = order.id === selectedOrder?.id;

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className={`cursor-pointer transition-colors ${active ? "bg-black/5" : "hover:bg-black/5"}`}
                        >
                          <td className="px-4 py-4">
                            <div className="font-medium text-black">{order.name ?? order.id.slice(0, 8)}</div>
                            <div className="mt-1 text-xs text-black/60">{order.phone ?? order.user_id}</div>
                          </td>
                          <td className="px-4 py-4 text-black">{order.paymentStatus ?? "—"}</td>
                          <td className="px-4 py-4 text-black">{order.orderStatus ?? "—"}</td>
                          <td className="px-4 py-4 text-black">{formatCurrency(Number(order.finalAmount ?? order.totalAmount ?? 0))}</td>
                          <td className="px-4 py-4 text-black/60">{formatDateTime(order.createdAt)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel>
          {selectedOrder ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-black/60">
                    <ReceiptText className="h-3.5 w-3.5" />
                    Order detail
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{selectedOrder.name ?? selectedOrder.id}</h3>
                  <p className="mt-1 text-sm text-black/60">{selectedOrder.createdAt ? formatDateTime(selectedOrder.createdAt) : "—"}</p>
                </div>
                <div className="text-right text-sm text-black/60">
                  <div>{selectedOrder.paymentMethod ?? "Payment method"}</div>
                  <div>{selectedOrder.paymentStatus ?? "Pending"}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-black/50">Customer</div>
                  <div className="mt-2 text-sm text-black">{selectedOrder.name ?? "—"}</div>
                  <div className="mt-1 text-sm text-black/60">{selectedOrder.phone ?? "—"}</div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-black/50">Amounts</div>
                  <div className="mt-2 text-sm text-black">Total: {formatCurrency(Number(selectedOrder.totalAmount ?? 0))}</div>
                  <div className="mt-1 text-sm text-black/60">Final: {formatCurrency(Number(selectedOrder.finalAmount ?? 0))}</div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 sm:col-span-2">
                  <div className="text-xs uppercase tracking-[0.24em] text-black/50">Shipping address</div>
                  <div className="mt-2 text-sm text-black">{selectedOrder.addressLine1 ?? "—"}</div>
                  <div className="text-sm text-black/60">{selectedOrder.addressLine2 ?? ""}</div>
                  <div className="mt-1 text-sm text-black/60">
                    {[selectedOrder.city, selectedOrder.state, selectedOrder.country, selectedOrder.pincode].filter(Boolean).join(", ") || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium uppercase tracking-[0.24em] text-black/50">Items</h4>
                <div className="mt-3 space-y-3">
                  {selectedItems.length === 0 ? (
                    <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/60">No items for this order.</div>
                  ) : (
                    selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4">
                        <div>
                          <div className="font-medium text-black">{item.name}</div>
                          <div className="mt-1 text-xs text-black/60">Size: {item.size ?? "—"} | Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right text-sm text-black">
                          <div>{formatCurrency(Number(item.price))}</div>
                          <div className="mt-1 text-xs text-black/60">{item.variant_id ?? "Variant N/A"}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60">Select an order to inspect the shipping and item breakdown.</div>
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
