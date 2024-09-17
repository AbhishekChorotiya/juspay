import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Phaser from "phaser";
import { useAtom } from "jotai";
import {
  currentAniamtionTypeAtom,
  MovementBlocksAtom,
  spritesAtom,
} from "../utils/atoms";

const PhaserGame = forwardRef(
  ({ width = 600, height = 600, allowCollide }, ref) => {
    const gameRef = useRef(null);
    const [characters, setCharacters] = useAtom(spritesAtom);
    const [currentAniamtionType, setCurrentAnimationType] = useAtom(
      currentAniamtionTypeAtom
    );
    const [movementBlock, setMovementBlock] = useAtom(MovementBlocksAtom);

    let spritesRef = useRef([]);
    let animationsComplete = {};
    let totalAnimations = {};
    let completedAnimations = {};
    let currentAnimationIndex = {};
    const collideRef = useRef(allowCollide);

    let movementBlockRef = useRef({});

    function pauseGame(scene) {
      scene.physics.world.pause();
      scene.scene.pause();
    }

    async function checkAnimationsComplete(scene) {
      if (
        Object.keys(completedAnimations).every(
          (key) => completedAnimations[key] === totalAnimations[key]
        )
      ) {
        console.log("All animations completed.");
      }
    }

    function executeAnimation(scene, sprite, spriteKey) {
      console.log(scene, sprite, spriteKey);
      if (currentAnimationIndex[spriteKey] >= sprite.animations.length) {
        animationsComplete[spriteKey] = true;
        completedAnimations[spriteKey] = totalAnimations[spriteKey];
        checkAnimationsComplete(scene);
        return;
      }

      const animation = sprite.animations[currentAnimationIndex[spriteKey]];

      if (!animation) {
        animationsComplete[spriteKey] = true;
        completedAnimations[spriteKey] = totalAnimations[spriteKey];
        checkAnimationsComplete(scene);
        return;
      }

      if (animation.type === "move") {
        scene.tweens.add({
          targets: sprite,
          x: animation.x,
          y: animation.y,
          duration: animation.duration,
          onComplete: () => {
            currentAnimationIndex[spriteKey]++;
            executeAnimation(scene, sprite, spriteKey);
          },
        });
      } else if (animation.type === "rotate") {
        scene.tweens.add({
          targets: sprite,
          angle: sprite.angle + animation.degrees,
          duration: animation.duration,
          onComplete: () => {
            currentAnimationIndex[spriteKey]++;
            executeAnimation(scene, sprite, spriteKey);
          },
        });
      } else if (animation.type === "steps") {
        scene.tweens.add({
          targets: sprite,
          x:
            sprite.x +
            Math.cos(Phaser.Math.DegToRad(sprite.angle)) * animation.steps,
          y:
            sprite.y +
            Math.sin(Phaser.Math.DegToRad(sprite.angle)) * animation.steps,
          duration: animation.duration,
          onComplete: () => {
            currentAnimationIndex[spriteKey]++;
            executeAnimation(scene, sprite, spriteKey);
          },
        });
      }
    }

    function handleCollision(sprite1, sprite2) {
      if (!collideRef.current) return;
      const sprite1Key = getSpriteKey(sprite1);
      const sprite2Key = getSpriteKey(sprite2);

      const tempAnimations = sprite1.animations.slice(
        currentAnimationIndex[sprite1Key] + 1
      );
      sprite1.animations = sprite2.animations.slice(
        currentAnimationIndex[sprite2Key] + 1
      );
      sprite2.animations = tempAnimations;

      currentAnimationIndex[sprite1Key] = 0;
      currentAnimationIndex[sprite2Key] = 0;
      animationsComplete[sprite1Key] = false;
      animationsComplete[sprite2Key] = false;
      completedAnimations[sprite1Key] = 0;
      completedAnimations[sprite2Key] = 0;

      executeAnimation(this, sprite1, sprite1Key);
      executeAnimation(this, sprite2, sprite2Key);
    }

    function handlePlay() {
      console.log("play");
      spritesRef.current.forEach((sprite, index) => {
        console.log(sprite);
        executeAnimation(this, sprite, sprite.id);
      });
    }

    useImperativeHandle(ref, () => ({
      playAll: () => {
        if (gameRef.current && gameRef.current.scene) {
          const scene = gameRef.current.scene.scenes[0];
          spritesRef.current.forEach((sprite, index) => {
            const tempAnimations = [];
            for (let val in movementBlockRef.current?.[sprite.id]) {
              tempAnimations.push(
                ...movementBlockRef.current?.[sprite.id]?.[val]
              );
            }
            sprite.animations = tempAnimations;
            currentAnimationIndex[sprite.id] = 0;
            executeAnimation(scene, sprite, sprite.id);
          });
        }
      },
      flagClick: () => {
        if (gameRef.current && gameRef.current.scene) {
          const scene = gameRef.current.scene.scenes[0];
          spritesRef.current.forEach((sprite, index) => {
            sprite.animations =
              movementBlockRef.current?.[sprite.id]?.["when_flag_clicked"] ||
              [];

            currentAnimationIndex[sprite.id] = 0;
            executeAnimation(scene, sprite, sprite.id);
          });
        }
      },
      pause: () => {
        if (gameRef.current && gameRef.current.scene) {
          const scene = gameRef.current.scene.scenes[0];
          pauseGame(scene);
        }
      },
    }));

    function addAnimations(sprite, config) {
      if (currentAniamtionType === "when_flag_clicked") {
        sprite.animations = config.movements.when_flag_clicked;
      } else if (currentAniamtionType === "when_sprite_clicked") {
        sprite.animations = config.movements.when_sprite_clicked;
      } else {
        const tempAnimations = [];
        for (let val in config.movements) {
          tempAnimations.push(...config.movements[val]);
        }
        sprite.animations = tempAnimations;
      }
    }

    function preload() {
      characters.forEach((character) => {
        this.load.image(`${character?.id}`, character?.src);
      });
    }

    useEffect(() => {
      collideRef.current = allowCollide;
    }, [allowCollide]);

    function create(playType) {
      this.physics.world.setBounds(0, 0, width, height);

      const xyz = characters.map((character) => {
        return {
          key: `${character?.id}`,
          x: character?.left || 100,
          y: character?.top || 100,
          movements: {
            when_flag_clicked: [
              { type: "move", x: 20, y: 0, duration: 500 },
              { type: "rotate", degrees: 15, duration: 500 },
            ],
            when_sprite_clicked: [
              { type: "rotate", degrees: 15, duration: 500 },
              { type: "steps", steps: 100, duration: 500 },
            ],
            other: [
              { type: "rotate", degrees: 15, duration: 500 },
              { type: "rotate", degrees: 15, duration: 500 },
            ],
          },
        };
      });

      const spriteConfigs = xyz;

      spriteConfigs.forEach((config, index) => {
        const sprite = this.physics.add
          .sprite(config.x, config.y, config.key)
          .setCollideWorldBounds(true)
          .setInteractive({ draggable: true }); // Enable dragging

        setContainedSize(sprite, 100, 100);
        spritesRef.current.push(sprite);

        // Add click listener to the sprite
        sprite.on("pointerdown", () => {
          console.log("da", movementBlockRef.current);
          console.log(`Sprite ${sprite.id} clicked!`);
          // Handle the sprite click (e.g., trigger when_sprite_clicked animations)
          currentAnimationIndex[sprite.id] = 0;
          sprite.animations =
            movementBlockRef.current?.[sprite.id]?.when_sprite_clicked || [];
          executeAnimation(this, sprite, sprite.id); // Start animation
        });

        // Enable dragging of sprite
        this.input.setDraggable(sprite);

        sprite.on("drag", (pointer, dragX, dragY) => {
          // While dragging, update sprite position
          sprite.x = dragX;
          sprite.y = dragY;
        });

        sprite.on("dragstart", (pointer) => {
          console.log(`Sprite ${sprite.id} drag started`);
        });

        sprite.on("dragend", (pointer) => {
          console.log(`Sprite ${sprite.id} drag ended`);
        });

        addAnimations(sprite, config);

        sprite.id = config.key;

        animationsComplete[config.key] = false;
        totalAnimations[config.key] = sprite.animations.length;
        completedAnimations[config.key] = 0;
        currentAnimationIndex[config.key] = 0;
      });

      const debouncedCollision = debounce(
        handleCollision,
        100,
        spritesRef.current.length
      );

      for (let i = 0; i < spritesRef.current.length; i++) {
        for (let j = i + 1; j < spritesRef.current.length; j++) {
          this.physics.add.collider(
            spritesRef.current[i],
            spritesRef.current[j],
            () =>
              debouncedCollision.apply(this, [
                spritesRef.current[i],
                spritesRef.current[j],
                i,
                j,
              ]),
            null,
            this
          );
        }
      }

      if (playType === "playAll") handlePlay.call(this);
    }

    function update() {}

    function initGame() {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      const config = {
        type: Phaser.AUTO,
        parent: "phaser-game-container",
        backgroundColor: "#ffffff",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            // debug: true,
          },
        },
        scene: {
          preload,
          create,
          update,
        },
      };

      // Initialize Phaser game
      const game = new Phaser.Game(config);
      gameRef.current = game;
    }

    useEffect(() => {
      if (movementBlock) {
        movementBlockRef.current = movementBlock;
      }
    }, [movementBlock]);

    useEffect(() => {
      initGame();

      return () => {
        gameRef.current.destroy(true);
      };
    }, [height, width, characters, currentAniamtionType]);

    return <div id="phaser-game-container" />;
  }
);

export default PhaserGame;

function setContainedSize(sprite, maxWidth, maxHeight) {
  const originalWidth = sprite.width;
  const originalHeight = sprite.height;

  const aspectRatio = originalWidth / originalHeight;

  if (originalWidth > maxWidth) {
    sprite.displayWidth = maxWidth;
    sprite.displayHeight = maxWidth / aspectRatio;
  }

  if (sprite.displayHeight > maxHeight) {
    sprite.displayHeight = maxHeight;
    sprite.displayWidth = maxHeight * aspectRatio;
  }
}

function debounce(func, wait, size) {
  let timeoutMatrix = Array(size)
    .fill(0)
    .map(() => Array(size).fill(null));
  return function (...args) {
    clearTimeout(timeoutMatrix[args[2]][args[3]]);
    timeoutMatrix[args[2]][args[3]] = setTimeout(
      () => func.apply(this, args),
      wait
    );
  };
}
function getSpriteKey(sprite) {
  return sprite.texture.key;
}
