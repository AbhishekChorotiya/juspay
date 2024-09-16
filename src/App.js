import React, { createContext, useState } from "react";
import PreviewArea from "./components/PreviewArea";
import DnD from "./components/DnD";
import "./index.css";

export const GlobalContext = createContext();

export default function App() {
  const [data, setData] = useState({});
  return (
    <GlobalContext.Provider value={{ data, setData }}>
      <div className="bg-blue-100 flex h-dvh flex-col w-screen p-2 font-sans">
        {/* <div className="mb-2">{"Scratch starter project"}</div> */}
        <div className="w-full h-full flex">
          <div className="flex-1 h-full overflow-hidden  flex flex-row bg-white border-t border-r border-gray-200 rounded-xl mr-2">
            <DnD />
          </div>
          <div className="w-2/5 h-full  flex flex-row bg-white border-t border-l border-gray-200 rounded-xl overflow-hidden">
            <PreviewArea />
          </div>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}
