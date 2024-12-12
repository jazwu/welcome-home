import { Sidebar } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";
import { TbHeartHandshake, TbShoppingCartPlus } from "react-icons/tb";

export default function SideBar({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 h-full">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/search-item" icon={FaSearch}>
              Search Item
            </Sidebar.Item>
            <Sidebar.Item href="/search-order" icon={PiPackageFill}>
              Search Order
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={TbHeartHandshake}>
              Accept Donation
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={TbShoppingCartPlus}>
              Start an Order
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
