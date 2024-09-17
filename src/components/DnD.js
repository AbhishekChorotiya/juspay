import {
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { BlocklyWorkspace } from "react-blockly";
import * as Blockly from "blockly";
import { controlBlocks, eventBlocks, motionBlocks } from "../utils/constants";
import { GlobalContext } from "../App";
import Dropdown from "./Dropdown";
import { useAtom } from "jotai";
import {
  currentSpriteAtom,
  lastSpriteAtom,
  MovementBlocksAtom,
  spritesAtom,
} from "../utils/atoms";
import { convertBlocksToMovements } from "../utils/helpers";

Blockly.defineBlocksWithJsonArray([
  ...eventBlocks,
  ...motionBlocks,
  ...controlBlocks,
]);

const useToolboxConfig = () =>
  useMemo(
    () => ({
      kind: "flyoutToolbox",
      contents: [
        { kind: "label", text: "Event", "web-class": "event-label" },
        ...eventBlocks.map((block) => ({ kind: "block", type: block.type })),
        { kind: "label", text: "Motion", "web-class": "motion-label" },
        ...motionBlocks.map((block) => ({ kind: "block", type: block.type })),
        { kind: "label", text: "Control", "web-class": "control-label" },
        ...controlBlocks.map((block) => ({ kind: "block", type: block.type })),
      ],
    }),
    []
  );

const useWorkspaceConfig = () =>
  useMemo(
    () => ({
      grid: {
        spacing: 20,
        length: 3,
        colour: "#fff",
        snap: true,
      },
    }),
    []
  );

function DnD() {
  const { setData } = useContext(GlobalContext);
  const toolboxConfig = useToolboxConfig();
  const workspaceConfig = useWorkspaceConfig();
  const savedWorkspace = useRef({ 1: null });
  const [selectedSprite, setSelectedSprite] = useState("Cat");
  const index = useRef(1);
  const [sprites, setSprites] = useAtom(spritesAtom);
  const [currentSprite, setCurrentSprite] = useAtom(currentSpriteAtom);
  const [lastSprite, setlastSprite] = useAtom(lastSpriteAtom);
  const [movementBlock, setMovementBlock] = useAtom(MovementBlocksAtom);

  const options = [
    { name: "Cat", src: "/cat.png" },
    { name: "Ball", src: "/ball.png" },
    { name: "Banana", src: "/banana.png" },
  ];

  const handleJsonChange = useCallback(
    (e) => {
      console.log(e?.blocks?.blocks);
      if (e?.blocks?.blocks) {
        setMovementBlock((prev) => ({
          ...prev,
          [currentSprite]: convertBlocksToMovements(e?.blocks?.blocks),
        }));
      }
      setData(e?.blocks?.blocks);
    },
    [setData, currentSprite]
  );

  useEffect(() => {
    console.log(movementBlock);
  }, [movementBlock]);

  function handleSave(id) {
    const currentWorkspace = Blockly.getMainWorkspace();
    savedWorkspace.current[id] =
      Blockly.serialization.workspaces.save(currentWorkspace);
    currentWorkspace.clear();
  }
  function handleOpen(id) {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      workspace.clear(); // Clear workspace before loading new state
      Blockly.serialization.workspaces.load(
        savedWorkspace.current[id],
        workspace
      );
    }
  }

  const handleSelectedSprite = (option) => {
    setSelectedSprite(option?.name);
    const sprite = {
      id: ++index.current,
      name: option?.name,
      src: option?.src,
      top: Math.random() * 350 + 70,
      left: Math.random() * 350 + 70,
    };
    setSprites([...sprites, sprite]);
  };

  useEffect(() => {
    if (currentSprite) {
      handleSave(lastSprite);
      if (savedWorkspace?.current?.[currentSprite]) handleOpen(currentSprite);
      setlastSprite(currentSprite);
      console.log(lastSprite, currentSprite, sprites);
    }
  }, [currentSprite]);

  return (
    <div className="flex relative flex-col min-w-full h-full">
      <BlocklyWorkspace
        onJsonChange={handleJsonChange}
        className="w-full h-full"
        toolboxConfiguration={toolboxConfig}
        workspaceConfiguration={workspaceConfig}
      />
      <div className="absolute z-[10000] flex items-center gap-2 top-0 bg-yellow-300/40 right-0 rounded-bl-xl  px-4 py-2 text-black">
        <span>Add : </span>
        <Dropdown
          selected={selectedSprite}
          setSelected={handleSelectedSprite}
          options={options}
        />
      </div>
    </div>
  );
}

export default DnD;
