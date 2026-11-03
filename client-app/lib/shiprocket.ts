// client-app/lib/shiprocket.ts
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getShiprocketToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return cachedToken.token;
}

export async function createShiprocketOrder(order: any, items: any[]) {
  const token = await getShiprocketToken();

  const payload = {
    order_id: order.id,
    order_date: new Date().toISOString().slice(0, 10),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION, // set this name in Shiprocket panel
    billing_customer_name: order.name,
    billing_address: order.address_line1,
    billing_address_2: order.address_line2 || "",
    billing_city: order.city,
    billing_state: order.state,
    billing_pincode: order.pincode,
    billing_country: order.country,
    billing_phone: order.phone,
    shipping_is_billing: true,
    order_items: items.map((i) => ({
      name: i.name,
      sku: i.variant_id || i.product_id,
      units: i.quantity,
      selling_price: i.price,
    })),
    payment_method: order.payment_method === "COD" ? "COD" : "Prepaid",
    sub_total: order.final_amount,
    length: 15, breadth: 20, height: 2, weight: 0.3, // t-shirt package defaults
  };

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return res.json(); // { order_id, shipment_id, status, ... }
}