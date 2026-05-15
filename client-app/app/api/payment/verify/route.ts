// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js"; 

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !localOrderId) {
            return NextResponse.json({ success: false, message: "Missing params" }, { status: 400 });
        }

        // --- CHANGE 2: Create an Admin Client to bypass RLS ---
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Generate the expected signature
        const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(signatureBody.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // 3. Payment verified! Update Supabase database using supabaseAdmin
            const { error: updateError } = await supabaseAdmin
                .from('orders')
                .update({
                    payment_status: 'SUCCESS',
                    order_status: 'PROCESSING',
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                    updated_at: new Date().toISOString()
                })
                .eq('id', localOrderId);

            if (updateError) {
                console.error("Supabase Update Error:", updateError);
                return NextResponse.json({ success: false, message: "DB update failed" }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: "Payment verified successfully" });

        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}