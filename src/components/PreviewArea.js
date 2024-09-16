import React, { useEffect, useRef, useState } from "react";
import CatSprite from "./CatSprite";
import { useAtom } from "jotai";
import { currentSpriteAtom, spritesAtom } from "../utils/atoms";
import { Delete, Play, Trash2 } from "lucide-react";
import PhaserGame from "./Phaser";

export default function PreviewArea() {
  const [sprites, setSprites] = useAtom(spritesAtom);
  const [currentSprite, setCurrentSprite] = useAtom(currentSpriteAtom);

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
      <div className="w-full border-blue-100 border-t-4 flex items-center p-2">
        <div className="h-10 aspect-square rounded-full bg-black/80 flex items-center justify-center">
          <Play className="text-white" />
        </div>
      </div>
      <div className="w-full  h-2/5 border-t-4 p-5 overflow-y-auto gap-5 flex flex-wrap border-blue-100">
        {sprites.map((sprite, i) => (
          <SpriteCard
            key={i}
            id={sprite?.id}
            image={sprite?.src}
            remove={handleDelete}
            active={sprite?.id === currentSprite}
            setCurrentSprite={setCurrentSprite}
          />
        ))}
      </div>
    </div>
  );
}

const SpriteCard = ({
  image,
  id,
  remove,
  active = false,
  setCurrentSprite,
}) => {
  return (
    <div
      className={`w-24 h-24 flex items-center relative justify-center rounded-lg border-2  object-contain ${
        active ? " border-green-500 bg-green-200" : "border-orange-300"
      }`}
      onClick={() => setCurrentSprite(id)}
    >
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
