import { Outlet } from "react-router-dom";

export default function OnlyOrderIdRoute() {
  const orderId = sessionStorage.getItem("orderId");

  return orderId ? <Outlet /> : null;
}
