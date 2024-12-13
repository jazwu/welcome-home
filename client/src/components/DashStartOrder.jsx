import { TextInput, Button, Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function DashStartOrder() {
  const { currentUser } = useSelector((state) => state.user);
  const [clientID, setClientID] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [canStartOrder, setCanStartOrder] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setCanStartOrder(false);

    if (!clientID.trim()) {
      setErrorMessage("Please enter a valid client username");
      return;
    }

    try {
      const res = await fetch(`/api/users/${clientID}`);
      const data = await res.json();
      if (res.ok) {
        if (clientID === currentUser.username) {
          setErrorMessage("You cannot start an order for yourself");
          return;
        }
        if (data.roles.includes("client")) {
          setSuccessMessage("This user is an existing client");
          setCanStartOrder(true);
          return;
        }
      }
      setErrorMessage("Client not found");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const assignOrderID = async () => {
    try {
      const res = await fetch("/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supervisor: currentUser.username,
          client: clientID,
          orderDate: new Date().toISOString().split("T")[0],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(
          `Order ID ${data.orderID} has been assigned to ${clientID}. You can now add items to the order.`
        );
        sessionStorage.setItem("orderID", data.orderID);
        setClientID("");
        setSuccessMessage(null);
        setCanStartOrder(false);
        return;
      }
      setErrorMessage(data.message);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {errorMessage && (
        <Alert
          color="failure"
          className="font-medium my-4"
          icon={HiInformationCircle}
          onDismiss={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert
          color="success"
          className="font-medium my-4"
          onDismiss={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <TextInput
          className="flex-1"
          placeholder="Please enter the client username"
          value={clientID}
          onChange={(e) => setClientID(e.target.value)}
          color={errorMessage ? "failure" : "dark"}
          required
        />
        <Button size="md" color="dark" pill type="submit">
          Search
        </Button>
        <Button
          size="md"
          gradientDuoTone="purpleToPink"
          type="submit"
          className="w-46"
          disabled={!canStartOrder}
          onClick={assignOrderID}
        >
          Assign an Order ID
        </Button>
      </form>
    </div>
  );
}
