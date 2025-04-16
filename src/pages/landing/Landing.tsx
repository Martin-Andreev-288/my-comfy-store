import { FeaturedProducts, Hero } from "@/components";
import { customFetch, type ProductsResponse } from "@/utils";
import { useLoaderData, type LoaderFunction } from "react-router";

const url = "/products?featured=true";

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async (): Promise<ProductsResponse> => {
  const response = await customFetch<ProductsResponse>(url);
  return { ...response.data };
};

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
