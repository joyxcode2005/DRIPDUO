export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface SupabaseProductImage {
  id: string;
  url: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  product_type_id: string;
  product_type?: { name: string };
  price: number;
  discount: number;
  final_price: number;
  stock: number;
  total_stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_categories: { categories: SupabaseCategory }[];
  product_images: SupabaseProductImage[];
}

