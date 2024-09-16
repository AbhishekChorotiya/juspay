import { atom } from "jotai";
import CatSprite from "../components/CatSprite";

export const spritesAtom = atom([{ id: 1, name: "Cat", src: <CatSprite /> }]);
