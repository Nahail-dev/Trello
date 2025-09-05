import React, { useState } from "react";
import "./home.css";
import {
  Clock,
  EarthLock,
  LayoutPanelLeft,
  Settings,
  User,
} from "lucide-react";
import Cards from "@/components/Cards/Cards";
import BoardPopup from "@/components/Custom/BoardPopup";

const Home = () => {
  const [cards, setCards] = useState([]);
  const [setSelectedBg] = useState(null);
  return (
    <main className="main-section">
      <div className="flex gap-2">
        <Clock size={20} className="mt-1" />
        <h2 className="text-[#b6c2cf] text-xl font-semibold">
          Recently viewed
        </h2>
      </div>

      <div className="flex gap-5">
        <Cards cards={cards} />
      </div>

      <div className="mt-14">
        <h2 className="text-[#b6c2cf] text-xl font-bold">YOUR WORKSPACES</h2>
        <div className="flex lg:flex-row flex-col justify-between gap-4 mt-5 cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="bg-pink-400 rounded-lg w-12 h-12 flex items-center justify-center text-xl text-black font-bold">
              L
            </span>
            <h3 className="text-xl font-semibold">Laiba</h3>
          </div>

          <div className="flex lg:flex-row flex-col gap-4">
            <div className="flex gap-4 flex-row">
              <div className="flex gap-2 bg-[#333c43] rounded-md items-center p-3 w-40 lg:w-full">
                <LayoutPanelLeft size={18} />
                <span className="text-lg">Boards</span>
              </div>

              <div className="flex gap-2 bg-[#333c43] rounded-md items-center p-3 w-40 lg:w-full">
                <User size={18} />
                <span className="text-lg">Members</span>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex gap-2 bg-[#333c43] rounded-md items-center p-3 w-40 lg:w-full">
                <Settings size={18} />
                <span className="text-lg">Settings</span>
              </div>

              <div className="flex gap-2 bg-[#333c43] rounded-md items-center p-3 w-40 lg:w-full">
                <EarthLock size={18} />
                <span className="text-lg">Upgrade</span>
              </div>
            </div>

          </div>
        </div>

        <div className="flex gap-2 sm:gap-5">
          <Cards cards={cards} />
          <div className="flex rounded-2xl shadow-md shadow-black/30 bg-[#2a3238] items-center justify-center p-5 w-48 sm:w-72 mt-5 hover:bg-[#333c43] cursor-pointer">
            <BoardPopup
              onCreate={(card) => setCards((prev) => [...prev, card])}
              onBackgroundSelect={setSelectedBg}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
