import { Drawer } from "flowbite-react";

export default function ShoppingCard({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} position="right">
      <Drawer.Header title="Shopping Cart" />
      <Drawer.Items>
      </Drawer.Items>
    </Drawer>
  );
}
