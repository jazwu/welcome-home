import { useState } from "react";
import {
  Label,
  TextInput,
  Button,
  Select,
  Alert,
  Spinner,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        setLoading(false);
        return setError(data.message);
      }
      if (response.ok) {
        setLoading(false);
        nav("/sign-in");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full mt-20 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold text-gray-700">
        Create an account
      </h1>

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
          <Label htmlFor="email" value="Email" />
          <TextInput
            type="email"
            id="email"
            name="email"
            required
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="fname" value="First name" />
          <TextInput
            type="text"
            id="fname"
            name="fname"
            required
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="lname" value="Last name" />
          <TextInput
            type="text"
            id="lname"
            name="lname"
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

        <div>
          <Label htmlFor="role" value="Select your role" />
          <Select id="role" name="role" required onChange={handleChange}>
            <option value="staff">Staff</option>
            <option value="volunteer">Volunteer</option>
            <option value="client">Client</option>
          </Select>
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
            "Sign Up"
          )}
        </Button>
      </form>
      <p className="mt-5 text-gray-700">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-purple-600">
          Sign In
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
