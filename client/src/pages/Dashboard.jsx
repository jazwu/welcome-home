import { useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";

import DashAddItem from "../components/DashAddItem";
import DashSearchItem from "../components/DashSearchItem";
import DashSearchOrder from "../components/DashSearchOrder";

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
        {(tab === "SearchItem" || !tab) && <DashSearchItem />}
        {tab === "SearchOrder" && <DashSearchOrder />}
        {tab === "AddItem" && <DashAddItem />}
      </main>
    </div>
  );
}
