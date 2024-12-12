import { Navbar, Button, Avatar, Dropdown, Popover } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

const SubCategory = ({ mainCategory }) => {
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const getSubCategories = async () => {
      try {
        const response = await fetch(`/api/categories/${mainCategory}`);
        if (response.ok) {
          const subCategories = await response.json();
          setSubCategories(subCategories);
        } else {
          throw new Error("Failed to fetch sub categories");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getSubCategories();
  }, [mainCategory]);

  return (
    <>
      {subCategories.map((subCategory, index) => (
        <Dropdown.Item
          key={index}
          href={`/items?category=${mainCategory}&sub=${subCategory}`}
        >
          {subCategory}
        </Dropdown.Item>
      ))}
    </>
  );
};

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  const [categories, setCategories] = useState([]);

  const path = useLocation().pathname;
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const categories = await response.json();
          setCategories(categories);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser?.role === "client") {
      getAllCategories();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
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
        {currentUser?.role === "client" && (
          <Dropdown
            label=""
            inline
            trigger="hover"
            renderTrigger={() => (
              <span style={{ cursor: "pointer" }}>All Categories</span>
            )}
          >
            <Dropdown.Item href="/items?category=All">All</Dropdown.Item>
            {categories.map((category, index) => (
              <Dropdown.Item key={index} href={`/items?category=${category}`}>
                <Dropdown
                  label=""
                  trigger="hover"
                  placement="right"
                  renderTrigger={() => (
                    <span style={{ cursor: "pointer" }}>{category}</span>
                  )}
                >
                  <SubCategory mainCategory={category} />
                </Dropdown>
              </Dropdown.Item>
            ))}
          </Dropdown>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
