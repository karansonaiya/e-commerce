import { HeroCarousel } from "@/components/store/hero-carousel";
import { CollectionsGrid } from "@/components/store/collections-grid";
import { ProductTabs } from "@/components/store/product-tabs";
import { WhyUs } from "@/components/store/why-us";
import { CtaBanner } from "@/components/store/cta-banner";
import { ProductSpotlight } from "@/components/store/product-spotlight";
import { ReviewsSection } from "@/components/store/reviews-section";
import { Newsletter } from "@/components/store/newsletter";
import { getBestsellers, getNewArrivals } from "@/lib/data/products";

export default async function HomePage() {
  const [bestsellers, newArrivals] = await Promise.all([
    getBestsellers(),
    getNewArrivals(),
  ]);

  return (
    <>
      <HeroCarousel />
      <CollectionsGrid />
      <ProductTabs bestsellers={bestsellers} newArrivals={newArrivals} />
      <WhyUs />
      <CtaBanner />
      <ProductSpotlight />
      <ReviewsSection />
      <Newsletter />
    </>
  );
}
