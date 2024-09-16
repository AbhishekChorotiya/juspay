import { atom } from "jotai";
import CatSprite from "../components/CatSprite";

export const spritesAtom = atom([
  { id: 1, name: "Cat", src: "/cat.png", top: 70, left: 70 },
]);

export const currentSpriteAtom = atom(1);
export const lastSpriteAtom = atom(1);
