import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";

export default function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items");
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
    <div className="w-full">
      <div className="flex flex-nowrap gap-6 m-20">
        {items.map((item) => (
          <ItemCard key={item.ItemID} item={item} />
        ))}
      </div>
    </div>
  );
}
