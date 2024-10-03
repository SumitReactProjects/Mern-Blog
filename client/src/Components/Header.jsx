import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userslice";
const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Navbar className="border-b-2">
      <Link
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        to={"/"}
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Sahand`s
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
        <Button
          className="w-9 h-9"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" img={currentUser.profilePhoto} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"dashboard?tab=profile"} as={"div"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Link to={"/signin"} as={"div"} onClick={handleSignout}>
              <Dropdown.Item>SignOut</Dropdown.Item>
            </Link>
          </Dropdown>
        ) : (
          <Link to={"/signin"} as={"div"}>
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign in
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/project"} as={"div"}>
          <Link to="/project">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
