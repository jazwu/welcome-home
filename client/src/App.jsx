import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import OnlyOrderIdRoute from "./components/OnlyOrderIdRoute";

import Header from "./components/Header";

import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Shopping from "./pages/Shopping";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<OnlyOrderIdRoute />}>
            <Route path="/shopping" element={<Shopping />} />
          </Route>
        </Route>
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<SignIn />} />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
