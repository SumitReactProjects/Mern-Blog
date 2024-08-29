import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
const Header = () => {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        to={"/"}
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Schand's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={IoIosSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-9 h-9 lg:hidden" color="gray" pill>
        <IoIosSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-9 h-9" color="gray" pill>
          <FaMoon />
        </Button>
        <Button gradientDuoTone="purpleToBlue">Sign IN</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/project"}>
          <Link to="/project">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
