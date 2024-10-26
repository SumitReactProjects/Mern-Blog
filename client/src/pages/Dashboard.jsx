import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashsidebar from "../Components/Dashsidebar";
import Dashprofile from "../Components/Dashprofile";
import Dashposts from "../Components/Dashposts";
import Users from "../Components/User";
import DashComments from "../Components/DashComments";
import DashboardComp from "../Components/DashboardComp";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    // console.log(tabFromURL);
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-80 h-auto md:min-h-screen ">
        {/* sidebar */}
        <Dashsidebar />
      </div>
      <div className="w-full">
        {/* {tabs} */}
        {tab === "" && <Dashprofile />}
        {tab === "profile" && <Dashprofile />}
        {tab === "posts" && <Dashposts />}
        {tab === "users" && <Users />}
        {tab === "comments" && <DashComments />}
        {tab === "dash" && <DashboardComp />}
      </div>
    </div>
  );
}

export default Dashboard;
