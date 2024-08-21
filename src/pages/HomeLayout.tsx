import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

function HomeLayout() {
  return (
    <>
      <Header />
      <nav>navbar</nav>
      <Outlet />
    </>
  );
}
export default HomeLayout;
