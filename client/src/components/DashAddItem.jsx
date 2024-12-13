import {
  TextInput,
  Alert,
  Button,
  Modal,
  Label,
  Select,
  Table,
} from "flowbite-react";
import { useEffect } from "react";
import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { getMains, getSubs } from "../server/getCategory";
import NewPiecesModal from "./NewPiecesModal";

export default function DashAddItem() {
  const [donorID, setDonorID] = useState("");
  const [needRegister, setNeedRegister] = useState(false);
  const [needRole, setNeedRole] = useState(false);
  const [canAddItem, setCanAddItem] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    role: "donor",
  });
  const [addedItem, setAddedItem] = useState([]);
  const [iDescription, setIDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [mains, setMains] = useState([]);
  const [selectedMain, setSelectedMain] = useState("All");
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const fetchMains = async () => {
      const categories = await getMains();
      setMains(categories);
    };
    fetchMains();
  }, []);

  useEffect(() => {
    const fetchSubs = async () => {
      const subCategories = await getSubs({ mainCategory: selectedMain });
      setSubs(subCategories);
    };
    fetchSubs();
  }, [selectedMain]);

  const validedDonorAction = () => {
    setNeedRegister(false);
    setNeedRole(false);
    setErrorMessage(null);
    setWarningMessage(null);
    setCanAddItem(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNeedRegister(false);
    setNeedRole(false);
    setErrorMessage(null);
    setWarningMessage(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/users/${donorID}`);
      const data = await res.json();
      if (res.ok) {
        if (data.roles.includes("donor")) {
          setSuccessMessage("This user is an existing donor");
          validedDonorAction();
          return;
        }
        setWarningMessage("Please add the user as a donor first");
        setNeedRole(true);
        return;
      }
      if (data.message === "User not found") {
        setWarningMessage("Please register the donor first");
        setNeedRegister(true);
        return;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const addDonorRole = async () => {
    try {
      const res = await fetch(`/api/users/${donorID}/roles/donor`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Donor role added successfully");
        validedDonorAction();
        return;
      }
      setErrorMessage(data.message);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const handleRegister = async () => {
    const userData = { ...userFormData, username: donorID };
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        validedDonorAction();
        setSuccessMessage(data.message);
        setModalOpen(false);
        return;
      }
      setErrorMessage(data.message);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
    setNeedRegister(false);
  };

  const addNewItem = async (e) => {
    e.preventDefault();
    const donationInfo = {
      iDescription,
      mainCategory,
      subCategory,
      donor: donorID,
      donateDate: new Date().toISOString().split("T")[0],
    };
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationInfo),
      });
      const data = await res.json();
      if (res.ok) {
        setAddedItem([...addedItem, data]);
        setIDescription("");
        setMainCategory("");
        setSubCategory("");
        return;
      }
      setErrorMessage(data.message);
    } catch (error) {
      console.error(error);
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
      {warningMessage && (
        <Alert
          color="warning"
          className="font-medium my-4"
          onDismiss={() => setWarningMessage(null)}
        >
          {warningMessage}
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
      <form
        className="flex justify-center items-center gap-3"
        onSubmit={handleSubmit}
      >
        <TextInput
          className="flex-1"
          placeholder="Please enter the donor username"
          value={donorID}
          onChange={(e) => setDonorID(e.target.value)}
          color={needRegister ? "failure" : "dark"}
          disabled={canAddItem}
          required
        />
        <Button size="md" color="dark" pill type="submit">
          Search
        </Button>
        <Button
          size="md"
          gradientDuoTone="purpleToPink"
          className="w-46"
          onClick={addDonorRole}
          disabled={!needRole}
        >
          Assign Donor Role
        </Button>
        <Button
          size="md"
          gradientDuoTone="purpleToPink"
          className="w-46"
          onClick={() => setModalOpen(true)}
          disabled={!needRegister}
        >
          Register
        </Button>
      </form>
      {needRegister && (
        <Modal show={modalOpen}>
          <Modal.Header>Register as a donor</Modal.Header>
          <Modal.Body>
            <form className="flex-col gap-4">
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
                <TextInput
                  id="username"
                  placeholder="Username"
                  value={donorID}
                  onChange={(e) => {
                    setDonorID(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-2 block">
                <Label htmlFor="firstName" value="First Name" />
                <TextInput
                  id="firstName"
                  placeholder="First Name"
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      fname: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-2 block">
                <Label htmlFor="lastName" value="Last Name" />
                <TextInput
                  id="lastName"
                  placeholder="Last Name"
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      lname: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Email"
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleRegister}>Create</Button>
            <Button color="gray" onClick={() => setModalOpen(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {canAddItem && (
        <div className="border mt-10 rounded-md">
          <form className="flex flex-col p-5" onSubmit={addNewItem}>
            <div className="flex justify-between items-center p-3">
              <h2 className="text-2xl font-semibold my-4">
                Enter donation information
              </h2>
              <Button size="md" type="submit">
                Add New Item
              </Button>
            </div>
            <div className="flex gap-2 mx-auto">
              <div>
                <Label htmlFor="iDescription" value="Description" />
                <TextInput
                  id="iDescription"
                  value={iDescription}
                  onChange={(e) => setIDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mainCategory" value="Select a category" />
                <Select
                  id="mainCategory"
                  value={mainCategory}
                  required
                  onChange={(e) => {
                    setSelectedMain(e.target.value);
                    setMainCategory(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  {mains.map((main) => (
                    <option key={main} value={main}>
                      {main}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="subCategory" value="Select a subcategory" />
                <Select
                  id="subCategory"
                  value={subCategory}
                  required
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {subs.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </form>
          {addedItem.length !== 0 && (
            <Table>
              <Table.Head>
                <Table.HeadCell>Item ID</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Subcategory</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Add Pieces</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {addedItem.map((item) => (
                  <Table.Row key={item.ItemID}>
                    <Table.Cell>{item.ItemID}</Table.Cell>
                    <Table.Cell>{item.iDescription}</Table.Cell>
                    <Table.Cell>{item.mainCategory}</Table.Cell>
                    <Table.Cell>{item.subCategory}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModal(true);
                        }}
                      >
                        Add Pieces
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      )}
      {selectedItem && (
        <NewPiecesModal
          item={selectedItem}
          show={showModal}
          onClose={onClose}
        />
      )}
    </div>
  );
}
