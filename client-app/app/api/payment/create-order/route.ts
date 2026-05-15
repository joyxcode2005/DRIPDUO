// app/api/payment/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js"; // <-- CHANGE 1

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, cartItems, shippingDetails } = body;

        // --- CHANGE 2: Create an Admin Client to bypass RLS ---
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Create the Order on Razorpay's Servers
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // 2. Prepare Data for Database Insertion
        const {
            firstName = "", lastName = "", addressLine1 = "", city = "",
            postalCode = "", phone = "0000000000", state = "N/A", country = "India"
        } = shippingDetails || {};

        const fullName = `${firstName} ${lastName}`.trim() || 'Guest User';

        // 3. Insert the Parent Order using supabaseAdmin
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                total_amount: amount,
                final_amount: amount,
                payment_method: 'RAZORPAY',
                payment_status: 'PAYMENT_PENDING',
                name: fullName,
                phone: phone,
                address_line1: addressLine1,
                city: city,
                state: state,
                country: country,
                pincode: postalCode,
                razorpay_order_id: razorpayOrder.id,
                order_status: 'PAYMENT_PENDING'
            })
            .select('id')
            .single();

        if (orderError) {
            console.error("Supabase Order Insert Error:", orderError);
            throw new Error("Failed to save order to database");
        }

        const localOrderId = orderData.id;

        // 4. Insert the Cart Items using supabaseAdmin
        if (cartItems && cartItems.length > 0) {
            const itemsToInsert = cartItems.map((item: any) => ({
                order_id: localOrderId,
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                gsm: item.gsm || 'DEFAULT_GSM_VALUE',
                image: item.image
            }));

            const { error: itemsError } = await supabaseAdmin
                .from('order_items')
                .insert(itemsToInsert);

            if (itemsError) {
                console.error("Supabase Order Items Insert Error:", itemsError);
                await supabaseAdmin.from('orders').delete().eq('id', localOrderId);
                throw new Error("Failed to save order items, order rolled back.");
            }
        }

        return NextResponse.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: options.amount,
            localOrderId: localOrderId
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
    }
}