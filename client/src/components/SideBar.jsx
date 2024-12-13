import { Sidebar } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";
import { TbHeartHandshake, TbShoppingCartPlus } from "react-icons/tb";
import { useSelector } from "react-redux";

export default function SideBar({ tab }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Sidebar className="w-full h-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/dashboard?tab=SearchItem"
            icon={FaSearch}
            active={tab === "SearchItem" || !tab}
          >
            Search Item
          </Sidebar.Item>
          <Sidebar.Item
            href="/dashboard?tab=SearchOrder"
            icon={PiPackageFill}
            active={tab === "SearchOrder"}
          >
            Search Order
          </Sidebar.Item>
          {currentUser.roles.includes("staff") && (
            <>
              <Sidebar.Item
                href="/dashboard?tab=AddItem"
                icon={TbHeartHandshake}
                active={tab === "AddItem"}
              >
                Accept Donation
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard?tab=StartOrder"
                icon={TbShoppingCartPlus}
                active={tab === "StartOrder"}
              >
                Start an Order
              </Sidebar.Item>
            </>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
