import {
  Alert,
  Button,
  Spinner,
  Table,
  Checkbox,
  Label,
  Select,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

export default function DashSearchItem() {
  const [pieces, setPieces] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [onePiece, setOnePiece] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    const fetchItem = async (id) => {
      try {
        const res = await fetch(`/api/items`);
        const data = await res.json();
        if (res.ok) {
          setAllItems(data);
          setItems(data);
        } else {
          setErrorMessage(data.message);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchItem();
  }, []);

  useEffect(() => {
    if (onePiece) {
      setItems(allItems.filter((item) => item.pieceCount === 1));
    } else {
      setItems(allItems);
    }
  }, [onePiece]);

  const fetchPieces = async (id) => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const res = await fetch(`/api/items/${id}/pieces`);
      const data = await res.json();
      if (res.ok) {
        setPieces(data.pieces);
        if (data.pieces.length === 0) {
          setErrorMessage("No such item");
        }
      } else {
        setPieces([]);
        setErrorMessage(data.message);
      }
    } catch (error) {
      setPieces([]);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemId = e.target.itemId.value;
    setSelectedItem(itemId);
    fetchPieces(itemId);
  };

  return (
    <div className="w-full min-h-screen">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col">
          {errorMessage && (
            <Alert
              color="failure"
              className="font-medium"
              icon={HiInformationCircle}
            >
              {errorMessage}
            </Alert>
          )}
          <h1 className="text-3xl my-10 mx-auto font-semibold">Find an Item</h1>
          {/* Prompt to select an item ID */}
          <form className="mx-auto flex" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex justify-center items-center gap-3">
                <Select id="itemId" className="w-[20vw]" required>
                  <option value="">All</option>
                  {items.map((item) => (
                    <option key={item.ItemID} value={item.ItemID}>
                      {item.ItemID} - {item.iDescription}
                    </option>
                  ))}
                </Select>
                <Button size="md" color="dark" pill type="submit">
                  Search
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="onePiece"
                  checked={onePiece}
                  onChange={(e) => {
                    setOnePiece(e.target.checked);
                  }}
                />
                <Label>Only show item with one piece?</Label>
              </div>
            </div>
          </form>

          {/* locations of all pieces */}
          {pieces.length !== 0 ? (
            <div className="mx-auto mt-10 w-[80vw] overflow-x-auto flex flex-col gap-3">
              <h4 className="font-medium">Pieces for Item #{selectedItem}</h4>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell># Piece</Table.HeadCell>
                  <Table.HeadCell># room</Table.HeadCell>
                  <Table.HeadCell># shelf</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {pieces?.map((piece) => (
                    <Table.Row key={piece.pieceNum}>
                      <Table.Cell>{piece.pieceNum}</Table.Cell>
                      <Table.Cell>{piece.roomNum}</Table.Cell>
                      <Table.Cell>{piece.shelfNum}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
