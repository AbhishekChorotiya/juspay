import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { currentSpriteAtom, spritesAtom } from "../utils/atoms";
import { Flag, Play, RotateCcw, Trash2, X } from "lucide-react";
import PhaserGame from "./Phaser";

export default function PreviewArea() {
  const [sprites, setSprites] = useAtom(spritesAtom);
  const [currentSprite, setCurrentSprite] = useAtom(currentSpriteAtom);

  const divRef = useRef(null);
  const phaserRef = useRef(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);
  const handleDelete = (id) => {
    const newSprites = sprites.filter((sprite) => sprite?.id !== id);
    setSprites(newSprites);
  };

  const handlePlay = () => {
    if (phaserRef.current) {
      phaserRef.current.playAll();
    }
  };

  const handleFlagClick = () => {
    if (phaserRef.current) {
      phaserRef.current.flagClick();
    }
  };

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
      setHeight(divRef.current.offsetHeight);
    }
  }, [divRef.current]);

  return (
    <div className="flex-col w-full h-full relative">
      <div ref={divRef} className="w-full relative h-3/5 overflow-hidden flex">
        <PhaserGame ref={phaserRef} width={width} height={height} />
      </div>
      <div className="w-full border-blue-100 border-t-4 flex gap-5 items-center p-2">
        <button
          onClick={handlePlay}
          className="h-10 aspect-square rounded-full bg-black/80 flex items-center justify-center"
        >
          <Play className="text-white" />
        </button>
        <button
          onClick={handleFlagClick}
          className="h-10 aspect-square rounded-full border-2 border-green-500 flex items-center justify-center"
        >
          <Flag className="text-green-500" />
        </button>
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
      <button
        onClick={() => window.location.reload()}
        className="absolute top-0 flex items-center justify-center rounded-bl-xl right-0 w-10 h-10 bg-yellow-400"
      >
        <RotateCcw className="text-black" />
      </button>
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
