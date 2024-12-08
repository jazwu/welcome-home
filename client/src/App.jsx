import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import FindItem from "./pages/FindItem";
import FindOrder from "./pages/FindOrder";
import DisplayItems from "./pages/DisplayItems";
import AcceptDonation from "./pages/AcceptDonation";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/find-item" element={<FindItem />} />
        <Route path="/find-order" element={<FindOrder />} />
        <Route path="/display-items" element={<DisplayItems />} />
        <Route path="/accept-donation" element={<AcceptDonation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
