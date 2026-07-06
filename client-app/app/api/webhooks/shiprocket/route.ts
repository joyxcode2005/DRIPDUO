import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// client-app/app/api/webhooks/shiprocket/route.ts
export async function POST(req: Request) {
  const secret = req.headers.get("x-api-key");
  if (secret !== process.env.SHIPROCKET_WEBHOOK_SECRET) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  await supabaseAdmin
    .from("orders")
    .update({
      tracking_status: body.current_status, // map to your delivery_tracking_status enum values
      tracking_url: body.tracking_url ?? undefined,
      courier: body.courier_name,
      updated_at: new Date().toISOString(),
    })
    .eq("shiprocket_shipment_id", body.shipment_id);

  return NextResponse.json({ success: true });
}