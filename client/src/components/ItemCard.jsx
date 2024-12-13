import { Button, Badge } from "flowbite-react";

export default function ItemCard({ item }) {
  const orderID = sessionStorage.getItem("orderID");

  const addToOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ItemID: item.ItemID }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      alert(`Item ${item.ItemID} added to order ${orderID}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col border shadow-lg rounded-md overflow-hidden min-w-72">
      <img
        src="/public/item-placeholder.png"
        alt="image"
        className="w-full h-60 object-cover"
      />
      <div className="m-3 flex flex-col gap-1">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900">
          {item.iDescription}
        </h5>
        <div className="flex justify-between text-sm">
          <div className="flex gap-1 text-gray-500 italic">
            <span>{item.color}</span>
            <span>{item.material}</span>
          </div>
          {item.isNew === 1 ? <Badge>Brand New</Badge> : null}
        </div>
        <Button
          gradientDuoTone="purpleToPink"
          outline
          size="sm"
          className="mt-2"
          onClick={addToOrder}
        >
          Add to Order
        </Button>
      </div>
    </div>
  );
}
