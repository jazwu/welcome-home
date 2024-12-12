import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import FindItem from "./pages/FindItem";
import ItemsPage from "./pages/ItemsPage";
import FindOrder from "./pages/FindOrder";

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
          <Route path="/search-item" element={<FindItem />} />
          <Route path="/search-order" element={<FindOrder />} />
        </Routes>
      </SideBar>
    </BrowserRouter>
  );
}

export default App;
