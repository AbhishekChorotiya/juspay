import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
const Dropdown = ({
  options = [],
  placeholder = "Blue",
  selected = "",
  setSelected = () => {},
}) => {
  const [open, setOpen] = useState(false);

  const divRef = useRef(null);
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setOpen(false);
      return;
    }
    if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
      setOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="border w-28 bg-white cursor-pointer border-black px-3 py-1 rounded-[4px] relative">
      <div
        className="flex items-center gap-2 z-0 justify-between"
        ref={dropdownRef}
      >
        <span
          className={`${selected ? "text-black" : "text-green-500"} text-xs`}
        >
          {selected
            ? `${selected.charAt(0).toUpperCase()}${selected.slice(1)}`
            : placeholder}
        </span>
        <ChevronDown className="w-5 text-black" />
      </div>
      {open && (
        <div
          ref={divRef}
          className="w-full bg-yellow-300/40 left-0 z-[1000] overflow-hidden rounded-[10px] border border-black/60 absolute top-[calc(100%+5px)] flex flex-col"
        >
          {options?.map((option, i) => (
            <div
              key={i}
              className="flex items-center text-primary hover:bg-white hover:text-black px-4 py-2 justify-between"
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
            >
              <span className="text-sm">{option?.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
