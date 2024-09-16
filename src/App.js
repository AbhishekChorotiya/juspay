import React, { createContext, useState } from "react";
import PreviewArea from "./components/PreviewArea";
import DnD from "./components/DnD";
import "./index.css";

export const GlobalContext = createContext();

export default function App() {
  const [data, setData] = useState({});
  return (
    <GlobalContext.Provider value={{ data, setData }}>
      <div className="bg-blue-100 flex h-screen flex-col w-screen p-2 font-sans">
        <div className="mb-2">{"Scratch starter project"}</div>
        <div className="w-full h-full overflow-hidden flex">
          <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
            {/* <Sidebar /> <MidArea /> */}
            <DnD />
          </div>
          <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
            <PreviewArea />
          </div>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}
