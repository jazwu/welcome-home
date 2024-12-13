import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { Breadcrumb, Spinner } from "flowbite-react";

export default function ItemsPage({ category, subcategory }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      try {
        const res = await fetch(
          "/api/items?category=" + category + "&sub=" + subcategory
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        if (isMounted) {
          setItems(data.items);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [category, subcategory]);

  return (
    <div className="w-full flex flex-col">
      {category && subcategory ? (
        <Breadcrumb className="p-5 ml-5">
          <Breadcrumb.Item>{category}</Breadcrumb.Item>
          <Breadcrumb.Item>{subcategory}</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        <Breadcrumb className="p-5 ml-5">
          <Breadcrumb.Item>All Items</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <div className="max-w-full mx-auto">
        <div className="flex flex-wrap gap-5 m-10">
          {items.length === 0 ? (
            <p>No items found</p>
          ) : (
            items.map((item) => <ItemCard key={item.ItemID} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}
