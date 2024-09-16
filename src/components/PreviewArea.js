import React, { useEffect, useRef, useState } from "react";
import CatSprite from "./CatSprite";
import { useAtom } from "jotai";
import { spritesAtom } from "../utils/atoms";
import { Delete, Trash2 } from "lucide-react";
import PhaserGame from "./Phaser";

export default function PreviewArea() {
  const [sprites, setSprites] = useAtom(spritesAtom);
  const divRef = useRef(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);
  const handleDelete = (id) => {
    const newSprites = sprites.filter((sprite) => sprite?.id !== id);
    setSprites(newSprites);
  };

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
      setHeight(divRef.current.offsetHeight);
    }
  }, [divRef.current]);

  return (
    <div className="flex-col w-full h-full">
      <div ref={divRef} className="w-full relative h-3/5 overflow-hidden flex">
        <PhaserGame width={width} height={height} />
      </div>
      <div className="w-full h-32 bg-red-300"></div>
      <div className="w-full  h-2/5 border-t-4 p-5 overflow-y-auto gap-5 flex flex-wrap border-blue-100">
        {sprites.map((sprite, i) => (
          <SpriteCard
            key={i}
            id={sprite?.id}
            image={sprite?.src}
            remove={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

const SpriteCard = ({ image, id, remove }) => {
  return (
    <div className="w-24 h-24 flex items-center relative justify-center rounded-lg border-2 border-orange-300 object-contain">
      <img src={image} className="w-full h-full object-contain" />
      {id != 1 && (
        <button
          onClick={() => remove(id)}
          className="absolute w-8 h-8 flex items-center justify-center bg-white border border-red-400 rounded-full -top-3 -right-3"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      )}
    </div>
  );
};
