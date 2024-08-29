import { FeaturedProducts, Hero } from "@/components";
import { type ProductsResponse } from "@/utils";
import { useLoaderData } from "react-router-dom";

function Landing() {
  const result = useLoaderData() as ProductsResponse;
  console.log(result);

  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
}

export default Landing;
