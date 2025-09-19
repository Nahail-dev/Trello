import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import "./DashBoard.css";
import Tcard from "../../TrelloCards/Tcard";
import AdvSearchNav from "../../advSearchNav/AdvSearchNav";

function Dashboard() {
  const [boardData, setBoardData] = useState(null);

  useEffect(() => {
    // Load board data from localStorage
    const storedData = localStorage.getItem("boardData");
    if (storedData) {
      setBoardData(JSON.parse(storedData));
    }

    // Clear data when the user closes the browser or leaves the site
    // const handleUnload = () => {
    //   localStorage.removeItem("boardData");
    // };

    // window.addEventListener("beforeunload", handleUnload);
    // return () => {
    //   window.removeEventListener("beforeunload", handleUnload);
    // };
  }, []);

  // If there's no data yet
  if (!boardData) {
    return (
      <div className="dashboard">
        <AdvSearchNav />
        <Navbar />
        <Tcard />
      </div>
    );
  }

  // Determine background value (gradient or image)
  const backgroundValue =
    boardData.background_type === "image"
      ? `url(${boardData.background_details})`
      : boardData.background_details;

  return (
    <div
      className="dashboard"
      style={{
        background: backgroundValue,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AdvSearchNav />
      <Navbar />
      <Tcard />
    </div>
  );
}

export default Dashboard;
