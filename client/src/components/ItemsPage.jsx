import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";

export default function ItemsPage() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const searchParams = new URLSearchParams(location.search);
      const mainCate = searchParams.get("category") || "All";
      const subCate = searchParams.get("sub") || "";

      if (mainCate === "All" && subCate !== "") {
        return;
      }
      setMainCategory(mainCate);
      setSubCategory(subCate);

      try {
        const res = await fetch(
          "/api/items?category=" + mainCate + "&sub=" + subCate
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setItems(data.items);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <Breadcrumb className="p-5 ml-5">
        <Breadcrumb.Item href="/items">Category</Breadcrumb.Item>
        {mainCategory && mainCategory.length > 0 && (
          <Breadcrumb.Item>
            {mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)}
          </Breadcrumb.Item>
        )}
        {subCategory && subCategory.length > 0 && (
          <Breadcrumb.Item>
            {subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-nowrap gap-6 m-20">
          {items.map((item) => (
            <ItemCard key={item.ItemID} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
