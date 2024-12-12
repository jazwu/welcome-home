import {
  Alert,
  Button,
  Spinner,
  Table,
  TextInput,
  Modal,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";

export default function SearchOrder() {
  const [orderID, setOrderID] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [supervisorID, setSupervisorID] = useState("");
  const [clientID, setClientID] = useState("");
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (selectedItem) {
      setShowModal(true);
    }
  }, [selectedItem]);

  const fetchItems = async (id) => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items);
        setOrderDate(data.orderDate);
        setSupervisorID(data.supervisor);
        setClientID(data.client);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setErrorMessage(null);
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id) {
      setOrderID(id);
      fetchItems(id);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    const inputText = orderID.trim();
    setOrderID(inputText);
    if (!inputText) {
      return setErrorMessage("Please enter a valid order ID");
    }
    fetchItems(inputText);
    nav(`/search-order?id=${inputText}`);
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
          <h1 className="text-3xl my-10 mx-auto font-semibold">
            Find an Order
          </h1>
          {/* Prompt to enter an order ID */}
          <form
            className="mx-auto flex justify-center items-center gap-3"
            onSubmit={handleSubmit}
          >
            <TextInput
              className="w-[20vw]"
              placeholder="Please enter an order ID"
              value={orderID}
              onChange={(e) => setOrderID(e.target.value)}
              required
              color={errorMessage ? "failure" : null}
            />
            <Button size="md" color="dark" pill type="submit">
              Search
            </Button>
          </form>

          {/* locations of all items */}
          <div className="mx-auto mt-10 w-[80vw] overflow-x-auto">
            {items.length !== 0 && (
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Item ID</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">View</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {items.map((item) => (
                    <Table.Row key={item.ItemID}>
                      <Table.Cell>{item.ItemID}</Table.Cell>
                      <Table.Cell>{item.iDescription}</Table.Cell>
                      <Table.Cell>
                        {item.mainCategory} - {item.subCategory}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="sm"
                          color="light"
                          pill
                          onClick={() => setSelectedItem(item)}
                        >
                          View
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>
        </div>
      )}
      {selectedItem && (
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          dismissible
        >
          <Modal.Header>Item #{selectedItem.ItemID} includes</Modal.Header>
          <Modal.Body>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell># Piece</Table.HeadCell>
                <Table.HeadCell># room</Table.HeadCell>
                <Table.HeadCell># shelf</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {selectedItem.pieces.map((piece) => (
                  <Table.Row key={piece.pieceNum}>
                    <Table.Cell>{piece.pieceNum}</Table.Cell>
                    <Table.Cell>{piece.roomNum}</Table.Cell>
                    <Table.Cell>{piece.shelfNum}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
