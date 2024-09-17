import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const Dashprofile = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <div className="mx-auto max-w-lg w-full p-3">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-6">
        <div className="w-32 h-32 self-center mx-auto cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePhoto}
            alt="User"
            className="w-full h-full rounded-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser.username}
        />
        <TextInput type="text" id="email" defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="********" />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update Profile
        </Button>
      </form>
      <div className="flex items-center justify-between text-red-500 my-4">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">SignOut</span>
      </div>
    </div>
  );
};

export default Dashprofile;
