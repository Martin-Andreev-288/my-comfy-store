import { ProductsGrid, SectionTitle } from "@/components";

function FeaturedProducts() {
  return (
    <section className="pt-24">
      <SectionTitle text="featured products" />
      <ProductsGrid />
    </section>
  );
}
export default FeaturedProducts;
