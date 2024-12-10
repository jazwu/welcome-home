import { Navbar, Button, Avatar, Dropdown } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
      });
      if (response.ok) {
        dispatch(logOutSuccess());
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded text-white">
          Welcome
        </span>
        Home
      </Link>
      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar rounded />}>
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active={path === "/"}>
          Home
        </Navbar.Link>
        <Navbar.Link href="/find-item" active={path === "find-item"}>
          Find an Item
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
