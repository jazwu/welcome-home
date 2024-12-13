import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "../components/CateSideBar";
import ItemsPage from "../components/ItemsPage";
import { Alert } from "flowbite-react";
import { useSelector } from "react-redux";

export default function Shopping() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [sub, setSub] = useState("");
  const [orderID, setOrderID] = useState(sessionStorage.getItem("orderID"));
  const [client, setClient] = useState("");
  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/orders/" + orderID);
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
  }, [orderID]);

  useEffect(() => {
    // if (!location.state || !location.state.fromSource) {
    //   navigate("/");
    // }
    const searchParams = new URLSearchParams(location.search);
    const cate = searchParams.get("category");
    const sub = searchParams.get("sub");
    if (cate) {
      setCategory(cate);
    }
    if (sub) {
      setSub(sub);
    }
  }, [location.search, navigate]);

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
          {orderDate} <span className="font-bold">order ID {orderID}</span>.
        </Alert>
        <ItemsPage category={category} subcategory={sub} />
      </main>
    </div>
  );
}
