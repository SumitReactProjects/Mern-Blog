import { Sidebar, SidebarItem } from "flowbite-react";
import { HiArrowSmRight, HiUser, HiOutlineDocument } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userslice";
import { useSelector } from "react-redux";
import { LuUsers } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegCommentAlt } from "react-icons/fa";
const Dashsidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    // console.log(tabFromURL);
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

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
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={"/dashboard?tab=dash"}>
            <SidebarItem
              active={tab === "dash"}
              icon={MdOutlineDashboard}
              className="cursor-pointer"
              labelColor="dark"
              as="div"
            >
              Dashboard
            </SidebarItem>
          </Link>
          <Link to={"/dashboard?tab=profile"}>
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              className="cursor-pointer"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"}>
              <SidebarItem
                active={tab === "posts"}
                icon={HiOutlineDocument}
                labelColor="dark"
                className="cursor-pointer"
                as="div"
              >
                Posts
              </SidebarItem>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=users"}>
              <SidebarItem
                active={tab === "users"}
                icon={LuUsers}
                labelColor="dark"
                className="cursor-pointer"
                as="div"
              >
                Users
              </SidebarItem>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=comments"}>
              <SidebarItem
                active={tab === "comments"}
                icon={FaRegCommentAlt}
                className="cursor-pointer"
                as="div"
              >
                Comments
              </SidebarItem>
            </Link>
          )}
          <SidebarItem
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Signout
          </SidebarItem>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default Dashsidebar;
