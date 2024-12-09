import { Label, TextInput, Button, Select } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-full w-full mt-20 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold text-gray-700">
        Create an account
      </h1>

      <form className="flex flex-col w-full max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="username" value="Username" />
          <TextInput type="text" id="username" name="username" required />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="email" value="Email" />
          <TextInput type="email" id="email" name="email" required />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="fname" value="First name" />
          <TextInput type="text" id="fname" name="fname" required />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="lname" value="Last name" />
          <TextInput type="text" id="lname" name="lname" required />
        </div>

        <div className="mb-2 block">
          <Label htmlFor="password" value="Password" />
          <TextInput type="password" id="password" name="password" required />
        </div>

        <div>
          <Label htmlFor="role" value="Select your role" />
          <Select id="role" required>
            <option value="staff">Staff</option>
            <option value="volunteer">Volunteer</option>
            <option value="client">Client</option>
          </Select>
        </div>

        <Button
          type="submit"
          className="mt-5"
          gradientDuoTone="purpleToPink"
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </form>
      <p className="mt-5 text-gray-700">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-purple-600">
          Sign In
        </Link>
      </p>
    </div>
  );
}
