"use client";

import { useEffect, useMemo, useState } from "react";
import { ReceiptText, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { formatCurrency, formatDateTime } from "@/utils/admin";
import { getOrderItems, getOrders } from "@/services/admin";
import { OrderItemRow, OrderRow } from "@/types";

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
      description="Inspect placed orders, shipping details, and the item rows."
      actions={
        <button
          type="button"
          onClick={() => void reload()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90 sm:w-auto sm:inline-flex"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.05fr_0.95fr]">
        
        {/* LEFT PANEL: Order List */}
        <AdminPanel>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-black">Placed orders</h3>
            </div>
            <div className="text-sm text-black/60 shrink-0">{orders.length} orders</div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-black/60">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-sm text-black/60">No orders found.</div>
          ) : (
            <>
              {/* MOBILE VIEW: Card Layout */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {orders.map((order) => {
                  const active = order.id === selectedOrder?.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                        active ? "border-black bg-black/5" : "border-black/10 bg-white shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-bold text-black">{order.name ?? order.id.slice(0, 8)}</div>
                          <div className="text-xs text-black/60 mt-0.5">{order.phone ?? order.user_id}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-black">{formatCurrency(Number(order.finalAmount ?? order.totalAmount ?? 0))}</div>
                          <div className="text-xs text-black/60 mt-0.5">{formatDateTime(order.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-black/5">
                        <div className="text-xs font-medium text-black/60">{order.paymentStatus ?? "—"}</div>
                        <span className="inline-flex items-center rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-black">
                          {order.orderStatus ?? "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP VIEW: Table Layout */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-black/10">
                <table className="w-full divide-y divide-black/10 text-left text-sm">
                  <thead className="bg-black/5 text-black">
                    <tr>
                      <th className="px-4 py-3 font-medium">Order</th>
                      <th className="px-4 py-3 font-medium">Payment</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {orders.map((order) => {
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
                          <td className="px-4 py-4 text-black">
                            <span className="inline-flex items-center rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-black">
                                {order.orderStatus ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-black text-right">{formatCurrency(Number(order.finalAmount ?? order.totalAmount ?? 0))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </AdminPanel>

        {/* RIGHT PANEL: Order Detail */}
        <AdminPanel>
          {selectedOrder ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-black/60">
                    <ReceiptText className="h-3.5 w-3.5" />
                    Detail
                  </p>
                  <h3 className="mt-3 text-xl md:text-2xl font-semibold tracking-tight text-black">{selectedOrder.name ?? selectedOrder.id.slice(0,8)}</h3>
                  <p className="mt-1 text-xs md:text-sm text-black/60">{selectedOrder.createdAt ? formatDateTime(selectedOrder.createdAt) : "—"}</p>
                </div>
                <div className="text-right text-xs md:text-sm text-black/60">
                  <div className="font-medium text-black">{formatCurrency(Number(selectedOrder.finalAmount ?? 0))}</div>
                  <div className="mt-1">{selectedOrder.paymentStatus ?? "Pending"}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-white p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-black/40">Customer</div>
                  <div className="mt-2 text-sm text-black font-medium">{selectedOrder.name ?? "—"}</div>
                  <div className="mt-1 text-sm text-black/60">{selectedOrder.phone ?? "—"}</div>
                </div>
                <div className="rounded-xl border border-black/10 bg-white p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-black/40">Shipping Address</div>
                  <div className="mt-2 text-sm text-black">{selectedOrder.addressLine1 ?? "—"}</div>
                  <div className="text-sm text-black/60">{selectedOrder.addressLine2 ?? ""}</div>
                  <div className="mt-1 text-sm text-black/60">
                    {[selectedOrder.city, selectedOrder.state, selectedOrder.pincode].filter(Boolean).join(", ") || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/40 mb-3">Items Purchased</h4>
                <div className="space-y-3">
                  {selectedItems.length === 0 ? (
                    <div className="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/60 text-center">No items for this order.</div>
                  ) : (
                    selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                        <div>
                          <div className="font-medium text-black text-sm">{item.name}</div>
                          <div className="mt-1 text-xs text-black/60">Size: {item.size ?? "—"} <span className="mx-1">•</span> Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right text-sm text-black">
                          <div className="font-semibold">{formatCurrency(Number(item.price))}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center text-sm text-black/60">Select an order to inspect the shipping and item breakdown.</div>
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}