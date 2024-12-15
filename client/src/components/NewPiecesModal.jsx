import { Modal, Button, Label, TextInput, Select, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { getRooms, getShelves } from "../server/getLocations";

export default function NewPiecesModal({ itemId, show, onClose }) {
  const [pieceNum, setPieceNum] = useState(0);
  const [roomNum, setRoomNum] = useState("");
  const [shelfNum, setShelfNum] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [addedPieces, setAddedPieces] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [shelves, setShelves] = useState([]);

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const res = await fetch(`/api/items/${itemId}/pieces`);
        const data = await res.json();
        if (res.ok) {
          setAddedPieces(data.pieces);
          setPieceNum(data.pieces.length + 1);
          return;
        }
        console.error(data.message);
      } catch (error) {
        console.error(error);
      }
    };
    if (itemId) {
      fetchPieces();
    }
  }, [itemId]);

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await getRooms();
      setRooms(rooms);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchShelves = async () => {
      const shelves = await getShelves(roomNum);
      setShelves(shelves);
    };
    if (roomNum) {
      fetchShelves();
    }
  }, [roomNum]);

  const addPiece = async (e) => {
    e.preventDefault();
    if (!pieceNum || !roomNum || !shelfNum || !length || !width || !height)
      return;
    try {
      const res = await fetch(`/api/items/${itemId}/pieces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pieceNum,
          length,
          width,
          height,
          roomNum,
          shelfNum,
        }),
      });
      if (res.ok) {
        setAddedPieces([
          ...addedPieces,
          { pieceNum, length, width, height, roomNum, shelfNum },
        ]);
        setPieceNum(pieceNum + 1);
        setRoomNum("");
        setShelfNum("");
        setLength(0);
        setWidth(0);
        setHeight(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onClose={onClose} dismissible={onClose}>
      <Modal.Body>
        <form className="flex flex-col p-5" onSubmit={addPiece}>
          <div className="flex justify-between items-center p-3">
            <h2 className="text-2xl font-semibold my-4">
              Add Pieces for Item #{itemId}
            </h2>
            <Button size="md" type="submit">
              Add
            </Button>
          </div>
          <div className="flex gap-2 mx-auto w-full">
            <div className="w-32">
              <Label htmlFor="pieceNum" value="# Piece" />
              <TextInput id="pieceNum" value={pieceNum} disabled />
            </div>
            <div className="w-32">
              <Label htmlFor="length" value="Length" />
              <TextInput
                id="length"
                value={length}
                type="number"
                onChange={(e) => setLength(e.target.value)}
              />
            </div>
            <div className="w-32">
              <Label htmlFor="width" value="Width" />
              <TextInput
                id="width"
                value={width}
                type="number"
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="w-32">
              <Label htmlFor="height" value="Height" />
              <TextInput
                id="height"
                value={height}
                type="number"
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="w-64">
              <Label htmlFor="roomNum" value="# Room" />
              <Select
                id="roomNum"
                value={roomNum}
                required
                onChange={(e) => setRoomNum(e.target.value)}
              >
                <option value="">Not Selected</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-64">
              <Label htmlFor="shelfNum" value="# Shelf" />
              <Select
                id="selfNum"
                value={shelfNum}
                required
                onChange={(e) => setShelfNum(e.target.value)}
              >
                <option value="">Not Selected</option>
                {shelves.map((shelf) => (
                  <option key={shelf} value={shelf}>
                    {shelf}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </form>
        {addedPieces.length !== 0 && (
          <Table>
            <Table.Head>
              <Table.HeadCell># Piece</Table.HeadCell>
              <Table.HeadCell>Length</Table.HeadCell>
              <Table.HeadCell>width</Table.HeadCell>
              <Table.HeadCell>height</Table.HeadCell>
              <Table.HeadCell># Room</Table.HeadCell>
              <Table.HeadCell># Shelf</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {addedPieces
                .slice()
                .reverse()
                .map((piece) => (
                  <Table.Row key={piece.pieceNum}>
                    <Table.Cell>{piece.pieceNum}</Table.Cell>
                    <Table.Cell>{piece.length}</Table.Cell>
                    <Table.Cell>{piece.width}</Table.Cell>
                    <Table.Cell>{piece.height}</Table.Cell>
                    <Table.Cell>{piece.roomNum}</Table.Cell>
                    <Table.Cell>{piece.shelfNum}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
}
