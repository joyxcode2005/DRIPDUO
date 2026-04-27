import { CategoryRow, OrderItemRow, OrderRow, ProductCategoryRow, ProductImageRow, ProductRow, ProductTypeRow, ProductVariantRow } from "@/types";
import { createClient } from "@/utils/supabse";




const supabase = createClient();

async function mutate<T>(promise: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await promise;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProducts() {
  return mutate(
    supabase
      .from("products")
      .select("id, name, description, product_type_id, price, discount, finalPrice, stock, isActive, createdAt, updatedAt")
      .order("createdAt", { ascending: false })
  ) as Promise<ProductRow[]>;
}

export async function getCategories() {
  return mutate(
    supabase
      .from("categories")
      .select("id, name, slug, is_active")
      .order("name", { ascending: true })
  ) as Promise<CategoryRow[]>;
}

export async function getProductTypes() {
  return mutate(
    supabase
      .from("product_type")
      .select("id, name, slug, is_active")
      .order("name", { ascending: true })
  ) as Promise<ProductTypeRow[]>;
}


// Replace your existing upsertProductType with this:
export async function upsertProductType(payload: {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
}) {
  if (payload.id) {
    await mutate(
      supabase
        .from("product_type")
        .update({ name: payload.name, slug: payload.slug, is_active: payload.isActive })
        .eq("id", payload.id)
        .select("id")
    );
    return payload.id;
  }

  // ADDED: The insert logic for creating new product types
  const created = await mutate<{ id: string }>(
    supabase
      .from("product_type")
      .insert({ name: payload.name, slug: payload.slug, is_active: payload.isActive })
      .select("id")
      .single()
  );

  return created?.id as string;
}

// ADDED: The missing delete function
export async function deleteProductType(id: string) {
  await mutate(supabase.from("product_type").delete().eq("id", id).select("id"));
}

export async function getProductImages() {
  return mutate(
    supabase
      .from("product_images")
      .select("id, product_id, url, isPrimary")
      .order("id", { ascending: true })
  ) as Promise<ProductImageRow[]>;
}

export async function getProductCategories() {
  return mutate(
    supabase
      .from("product_categories")
      .select("id, product_id, category_id")
  ) as Promise<ProductCategoryRow[]>;
}

export async function getVariants() {
  return mutate(
    supabase
      .from("product_variants")
      .select("id, product_id, size, stock, gsm")
      .order("product_id", { ascending: true })
  ) as Promise<ProductVariantRow[]>;
}

export async function getOrders() {
  return mutate(
    supabase
      .from("orders")
      .select("id, user_id, totalAmount, discount, finalAmount, address_id, paymentMethod, paymentStatus, orderStatus, name, phone, addressLine1, addressLine2, city, state, country, pincode, trackingId, courier, createdAt, updatedAt")
      .order("createdAt", { ascending: false })
  ) as Promise<OrderRow[]>;
}

export async function getOrderItems() {
  return mutate(
    supabase
      .from("order_items")
      .select("id, order_id, product_id, variant_id, name, price, quantity, size, image")
      .order("id", { ascending: true })
  ) as Promise<OrderItemRow[]>;
}

export async function upsertProduct(payload: {
  id?: string;
  name: string;
  description: string;
  product_type_id: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  isActive: boolean;
  categoryIds: string[];
  imageUrls: string[];
}) {
  const productPayload = {
    name: payload.name,
    description: payload.description || null,
    product_type_id: payload.product_type_id || null,
    price: payload.price,
    discount: payload.discount,
    finalPrice: payload.finalPrice,
    stock: payload.stock,
    isActive: payload.isActive,
    updatedAt: new Date().toISOString(),
  };

  let productId = payload.id;

  if (productId) {
    await mutate(
      supabase.from("products").update(productPayload).eq("id", productId).select("id")
    );
  } else {
    const created = await mutate<{ id: string }>(
      supabase
        .from("products")
        .insert({ ...productPayload, createdAt: new Date().toISOString() })
        .select("id")
        .single()
    );

    productId = created?.id;
  }

  if (!productId) {
    throw new Error("Product could not be saved.");
  }

  await mutate(supabase.from("product_categories").delete().eq("product_id", productId).select("id"));
  await mutate(supabase.from("product_images").delete().eq("product_id", productId).select("id"));

  if (payload.categoryIds.length > 0) {
    await mutate(
      supabase.from("product_categories").insert(
        payload.categoryIds.map((categoryId) => ({ product_id: productId, category_id: categoryId }))
      )
    );
  }

  const filteredImageUrls = payload.imageUrls.map((value) => value.trim()).filter(Boolean);

  if (filteredImageUrls.length > 0) {
    await mutate(
      supabase.from("product_images").insert(
        filteredImageUrls.map((url, index) => ({ product_id: productId, url, isPrimary: index === 0 }))
      )
    );
  }

  return productId;
}

export async function deleteProduct(id: string) {
  await mutate(supabase.from("product_categories").delete().eq("product_id", id).select("id"));
  await mutate(supabase.from("product_images").delete().eq("product_id", id).select("id"));
  await mutate(supabase.from("product_variants").delete().eq("product_id", id).select("id"));
  await mutate(supabase.from("products").delete().eq("id", id).select("id"));
}

export async function upsertCategory(payload: {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
}) {
  if (payload.id) {
    await mutate(
      supabase
        .from("categories")
        .update({ name: payload.name, slug: payload.slug, is_active: payload.isActive })
        .eq("id", payload.id)
        .select("id")
    );
    return payload.id;
  }

  const created = await mutate<{ id: string }>(
    supabase
      .from("categories")
      .insert({ name: payload.name, slug: payload.slug, is_active: payload.isActive })
      .select("id")
      .single()
  );

  return created?.id as string;
}

export async function deleteCategory(id: string) {
  await mutate(supabase.from("product_categories").delete().eq("category_id", id).select("id"));
  await mutate(supabase.from("categories").delete().eq("id", id).select("id"));
}

export async function upsertVariant(payload: {
  id?: string;
  product_id: string;
  size: string;
  stock: number;
  gsm: number;
}) {
  if (payload.id) {
    await mutate(
      supabase
        .from("product_variants")
        .update({ product_id: payload.product_id, size: payload.size, stock: payload.stock, gsm: payload.gsm })
        .eq("id", payload.id)
        .select("id")
    );
    return payload.id;
  }

  const created = await mutate<{ id: string }>(
    supabase
      .from("product_variants")
      .insert({ product_id: payload.product_id, size: payload.size, stock: payload.stock, gsm: payload.gsm })
      .select("id")
      .single()
  );

  return created?.id as string;
}

export async function deleteVariant(id: string) {
  await mutate(supabase.from("product_variants").delete().eq("id", id).select("id"));
}