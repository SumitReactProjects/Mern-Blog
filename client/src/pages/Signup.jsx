import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl gap-3 flex-col mx-auto md:flex-row">
        <div className="flex-1 my-auto">
          <Link className=" font-bold dark:text-white text-4xl" to={"/"}>
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Sahand`s
            </span>
            Blog
          </Link>
          <p className="text-md mt-5">
            This is Demo Project you can signin with your Email and Password or
            with Google
          </p>
        </div>
        {/* Right Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-3">
            <div>
              <Label value="Username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Email" />
              <TextInput type="email" placeholder="name@gmail.com" id="email" />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter Password"
                id="password"
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign up
            </Button>
            <div className="flex gap-2 text-sm">
              <span>Have an Account ?</span>
              <Link to={"/signin"} className="text-blue-500">
                Signin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
