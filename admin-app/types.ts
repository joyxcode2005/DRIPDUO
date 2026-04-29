export type ProductTypeRow = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
}

export type CategoryRow = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
};

// Adding Product Row Type based on your schema
export interface ProductRow {
    discount: number;
    description: string;
    id: string;
    name: string;
    price: number;
    stock: number;
    is_active: boolean;
    product_type_id?: string;
}

export type ProductImageRow = {
    id: string;
    product_id: string;
    url: string;
    isPrimary: boolean;
};

export type ProductCategoryRow = {
    id: string;
    product_id: string;
    category_id: string;
};

export type ProductVariantRow = {
    id: string;
    product_id: string;
    size: string;
    stock: number;
    gsm: number | null;
};

export type OrderRow = {
    id: string;
    user_id: string;
    totalAmount: number | null;
    discount: number | null;
    finalAmount: number | null;
    address_id: string | null;
    paymentMethod: string | null;
    paymentStatus: string | null;
    orderStatus: string | null;
    name: string | null;
    phone: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
    trackingId: string | null;
    courier: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

export type OrderItemRow = {
    id: string;
    order_id: string;
    product_id: string;
    variant_id: string | null;
    name: string;
    price: number;
    quantity: number;
    size: string | null;
    image: string | null;
};