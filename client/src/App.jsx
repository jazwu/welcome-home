import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Header from "./components/Header";
import SideBar from "./components/SideBar";

import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import ItemsPage from "./pages/ItemsPage";
import SearchItem from "./pages/SearchItem";
import SearchOrder from "./pages/SearchOrder";
import AddItem from "./pages/AddItem";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <SideBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/search-item" element={<SearchItem />} />
          <Route path="/search-order" element={<SearchOrder />} />
          <Route element={<PrivateRoute />}>
            <Route path="/add-item" element={<AddItem />} />
          </Route>
        </Routes>
      </SideBar>
    </BrowserRouter>
  );
}

export default App;
