export const DASHBOARD_NAV = [
	{ href: "/dashboard", label: "Overview" },
	{ href: "/dashboard/products", label: "Products" },
	{ href: "/dashboard/inventory", label: "Inventory" },
	{ href: "/dashboard/categories", label: "Categories" },
	{ href: "/dashboard/orders", label: "Orders" },
];

export const PRODUCT_TYPE_LABELS = [
	{ value: "", label: "Choose a product type" },
	{ value: "1", label: "T-Shirt" },
	{ value: "2", label: "Hoodie" },
	{ value: "3", label: "Cap" },
	{ value: "4", label: "Other" },
];

export const ORDER_STATUS_OPTIONS = [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
];

export const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"];
