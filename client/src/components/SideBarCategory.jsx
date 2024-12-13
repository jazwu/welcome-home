import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { getMains, getSubs } from "../server/getCategory";

export default function CateSideBar({ category, subcategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const mains = await getMains();
      const cates = await Promise.all(
        mains.map(async (main) => {
          const subs = await getSubs({ mainCategory: main });
          return [main, subs];
        })
      );
      setCategories(cates);
    };
    fetchCategories();
  }, []);

  return (
    <Sidebar className="w-full h-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/shopping" active={!category}>
            All
          </Sidebar.Item>
          {categories.map((categories) => (
            <Sidebar.Collapse label={categories[0]} key={categories[0]}>
              {categories[1].map((sub) => (
                <Sidebar.Item
                  href={`/shopping?category=${categories[0]}&sub=${sub}`}
                  key={sub}
                  active={category === categories[0] && sub === subcategory}
                >
                  {sub}
                </Sidebar.Item>
              ))}
            </Sidebar.Collapse>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
