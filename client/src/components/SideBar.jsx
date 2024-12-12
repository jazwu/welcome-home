import { Sidebar } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { PiPackageFill } from "react-icons/pi";
import { TbHeartHandshake, TbShoppingCartPlus } from "react-icons/tb";

export default function SideBar({ children }) {
  return (
    <div className="flex">
      <Sidebar className="w-64">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/items" icon={FaSearch}>
              Search Item
            </Sidebar.Item>
            <Sidebar.Item href="/orders" icon={PiPackageFill}>
              Search Order
            </Sidebar.Item>
            <Sidebar.Item href="/users" icon={TbHeartHandshake}>
              Accept Donation
            </Sidebar.Item>
            <Sidebar.Item href="/users" icon={TbShoppingCartPlus}>
              Start an Order
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
