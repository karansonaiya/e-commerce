export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  images: string;
  price: number;
  salePrice: number | null;
  rating: number;
  reviewCount: number;
  scentNotes: string | null;
  stock: number;
  category: { name: string; slug: string };
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice: number | null;
  quantity: number;
  stock: number;
};

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Unpaid" | "Paid" | "Failed" | "Refunded";
