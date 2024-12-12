import { Alert, Button, Spinner, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";

export default function SearchItem() {
  const [itemID, setItemID] = useState("");
  const [pieces, setPieces] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const nav = useNavigate();

  const fetchPieces = async (id) => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      if (res.ok) {
        setPieces(data);
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

  useEffect(() => {
    setErrorMessage(null);
    setPieces([]);
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id) {
      setItemID(id);
      fetchPieces(id);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    const inputText = itemID.trim();
    setItemID(inputText);
    if (!inputText) {
      return setErrorMessage("Please enter a valid item ID");
    }
    fetchPieces(inputText);
    nav(`/search-item?id=${inputText}`);
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
          {/* Prompt to enter an item ID */}
          <form
            className="mx-auto flex justify-center items-center gap-3"
            onSubmit={handleSubmit}
          >
            <TextInput
              className="w-[20vw]"
              placeholder="Please enter an item ID"
              value={itemID}
              onChange={(e) => setItemID(e.target.value)}
              required
              color={errorMessage ? "failure" : null}
            />
            <Button size="md" color="dark" pill type="submit">
              Search
            </Button>
          </form>

          {/* locations of all pieces */}
          {pieces.length !== 0 ? (
            <div className="mx-auto mt-10 w-[80vw] overflow-x-auto">
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
