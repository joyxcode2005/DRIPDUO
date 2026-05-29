import { Product } from "@/types";


export const getProductsByCateogry = (products: Product[], category: string) => {
    if (category === "All") return products;
    return products.filter(p => p.product_categories.some(c => c.categories.name === category));
}