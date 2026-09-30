import { WishlistView } from "@/components/store/wishlist-view";

export const metadata = { title: "Your Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container-x py-12">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Your Wishlist</h1>
      <WishlistView />
    </div>
  );
}
