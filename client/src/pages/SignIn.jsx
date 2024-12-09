import { useState } from "react";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logInStart,
  logInSuccess,
  logInFailture,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(logInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(logInFailture(data.message));
      }
      if (response.ok) {
        dispatch(logInSuccess(data.user));
        nav("/");
      }
    } catch (error) {
      dispatch(logInFailture(error.message));
    }
  };

  return (
    <div className="h-full w-full mt-20 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold text-gray-700">Log In</h1>

      <form className="flex flex-col w-full max-w-md" onSubmit={handleSubmit}>
        <div className="mb-2 block">
          <Label htmlFor="username" value="Username" />
          <TextInput
            type="text"
            id="username"
            name="username"
            required
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="password" value="Password" />
          <TextInput
            type="password"
            id="password"
            name="password"
            required
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className="mt-5"
          gradientDuoTone="purpleToPink"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading</span>
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      <p className="mt-5 text-gray-700">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-purple-600">
          Create an Account
        </Link>
      </p>

      {error && (
        <Alert className="mt-5" color="failure">
          {error}
        </Alert>
      )}
    </div>
  );
}
