import { useLoaderData } from "react-router-dom";
import {
  OrdersList,
  ComplexPaginationContainer,
  SectionTitle,
} from "@/components";
import { type OrdersResponse } from "@/utils";

function Orders() {
  const { meta } = useLoaderData() as OrdersResponse;
  if (meta.pagination.total < 1) {
    return <SectionTitle text="Please make an order" />;
  }

  return (
    <>
      <SectionTitle text="Your Orders" />
      <OrdersList />
      <ComplexPaginationContainer />
    </>
  );
}
export default Orders;
