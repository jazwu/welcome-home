import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBarCategory";
import ItemsPage from "../components/ItemsPage";
import { Alert } from "flowbite-react";
import { useSelector } from "react-redux";

export default function Shopping() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [category, setCategory] = useState("");
  const [sub, setSub] = useState("");
  const [orderId, setorderId] = useState(sessionStorage.getItem("orderId"));
  const [client, setClient] = useState("");
  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/items`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setClient(data.client);
        setOrderDate(new Date(data.orderDate).toISOString().split("T")[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cate = searchParams.get("category");
    const sub = searchParams.get("sub");
    if (cate) {
      setCategory(cate);
    }
    if (sub) {
      setSub(sub);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex">
      <div className="md:w-64">
        <SideBar category={category} subcategory={sub} />
      </div>

      {/* main content */}
      <main className="flex-1 p-4">
        <Alert className="font-medium">
          Hi <span className="font-bold">{currentUser.username}</span>! You are
          shopping for <span className="font-bold">{client}</span> on{" "}
          {orderDate} with <span className="font-bold">order ID {orderId}</span>
          .
        </Alert>
        <ItemsPage category={category} subcategory={sub} />
      </main>
    </div>
  );
}
