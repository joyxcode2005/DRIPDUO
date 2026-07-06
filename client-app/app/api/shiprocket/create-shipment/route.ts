// client-app/app/api/shiprocket/create-shipment/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createShiprocketOrder } from "@/lib/shiprocket";

export async function POST(req: Request) {
    const { orderId } = await req.json();
    if (!orderId) {
        return NextResponse.json({ success: false, message: "orderId required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: orderRow } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).single();
    const { data: items } = await supabaseAdmin.from("order_items").select("*").eq("order_id", orderId);

    if (!orderRow) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    try {
        const shiprocketRes = await createShiprocketOrder(orderRow, items || []);

        await supabaseAdmin
            .from("orders")
            .update({
                shiprocket_order_id: shiprocketRes.order_id,
                shiprocket_shipment_id: shiprocketRes.shipment_id,
            })
            .eq("id", orderId);

        return NextResponse.json({ success: true, data: shiprocketRes });
    } catch (err: any) {
        console.error("Shiprocket shipment creation failed:", err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}