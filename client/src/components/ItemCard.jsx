import { Button, Badge } from "flowbite-react";
import { useEffect, useMemo } from "react";

export default function ItemCard({ item }) {
  const imgURL = useMemo(() => {
    if (item.photo?.data) {
      const blob = new Blob([new Uint8Array(item.photo.data)], {
        type: "image/png",
      });
      return URL.createObjectURL(blob);
    }
    return null;
  }, [item.photo]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imgURL);
    };
  }, [imgURL]);

  return (
    <div className="relative group min-w-32 flex flex-col border shadow-lg rounded-md overflow-hidden">
      <img
        src={imgURL}
        alt="image"
        className="w-full h-80 group-hover:h-72 transition-all duration-300 z-20"
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
          className="absolute bottom-[-200px] group-hover:bottom-0 left-1 right-1 z-10 transition-all duration-300"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
