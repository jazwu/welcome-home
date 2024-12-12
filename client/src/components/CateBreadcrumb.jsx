import { Breadcrumb } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CateBreadcrumb() {
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const hierarchy = location.pathname
      .split("/")
      .filter((path) => path !== "");
    hierarchy.shift();
    setCategories(hierarchy);
  }, [location]);

  return (
    <Breadcrumb className="m-10">
      <Breadcrumb.Item href="/items">Category</Breadcrumb.Item>
      {categories.map((category, index) => (
        <Breadcrumb.Item
          key={index}
          href={categories.slice(0, index + 1).join("/")}
          active={index === categories.length - 1}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
