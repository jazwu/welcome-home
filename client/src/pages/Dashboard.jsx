import SearchItem from "../components/SearchItem";
import SearchOrder from "../components/SearchOrder";
import AddItem from "../components/AddItem";
import { useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    setTab(tab);
  }, [location.search]);

  return (
    <div className="min-h-screen flex">
      <div className="md:w-64">
        <SideBar tab={tab} />
      </div>

      {/* main content */}
      <main className="flex-1 p-4">
        {(tab === "SearchItem" || !tab) && <SearchItem />}
        {tab === "SearchOrder" && <SearchOrder />}
        {tab === "AddItem" && <AddItem />}
      </main>
    </div>
  );
}
