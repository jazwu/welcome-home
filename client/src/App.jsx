import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import FindItem from "./pages/FindItem";
import ItemsPage from "./pages/ItemsPage";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/find-item" element={<FindItem />} />
        <Route path="/items" element={<ItemsPage />} />
        {/* <Route path="/items" element={<Navigate to="/items/all" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
