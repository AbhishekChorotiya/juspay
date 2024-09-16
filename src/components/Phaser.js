import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useAtom } from "jotai";
import { currentAniamtionTypeAtom, spritesAtom } from "../utils/atoms";

const PhaserGame = ({ width = 600, height = 600 }) => {
  const gameRef = useRef(null);
  const [characters, setCharacters] = useAtom(spritesAtom);
  const [currentAniamtionType, setCurrentAnimationType] = useAtom(
    currentAniamtionTypeAtom
  );

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: "phaser-game-container",
      backgroundColor: "#ffffff",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    let sprites = [];
    let animationsComplete = {};
    let totalAnimations = {};
    let completedAnimations = {};
    let currentAnimationIndex = {};

    // Initialize Phaser game
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Preload assets
    function preload() {
      //   this.load.image(`${characters[0]?.id}`, "cat.png");
      //   this.load.image("sprite2", "ball.png");
      characters.forEach((character) => {
        this.load.image(`${character?.id}`, character?.src);
      });
    }

    // Create the scene
    function create() {
      this.physics.world.setBounds(0, 0, width, height);

      const xyz = characters.map((character) => {
        return {
          key: `${character?.id}`,
          x: character?.left || 100,
          y: character?.top || 100,
          movements: {
            when_flag_clicked: [
              { type: "move", x: 20, y: 0, duration: 1000 },
              { type: "rotate", degrees: 15, duration: 1000 },
            ],
            when_sprite_clicked: [
              { type: "rotate", degrees: 15, duration: 1000 },
              { type: "steps", steps: 100, duration: 1000 },
            ],
            other: [
              { type: "rotate", degrees: 15, duration: 1000 },
              { type: "rotate", degrees: 15, duration: 1000 },
            ],
          },
        };
      });

      console.log(xyz);
      const spriteConfigs = xyz;
      //   const spriteConfigs = [
      //     {
      //       key: "1",
      //       x: 100,
      //       y: 100,
      //       movements: [
      //         { type: "move", x: 200, y: 100, duration: 1000 },
      //         { type: "move", x: 400, y: 400, duration: 1000 },
      //         { type: "rotate", degrees: 360, duration: 1000 },
      //       ],
      //     },
      //     // {
      //     //   key: "sprite2",
      //     //   x: 400,
      //     //   y: 100,
      //     //   movements: [
      //     //     { type: "move", x: 20, y: 0, duration: 1000 },
      //     //     { type: "rotate", degrees: -125, duration: 1000 },
      //     //     { type: "move", x: 400, y: 400, duration: 1000 },
      //     //   ],
      //     // },
      //   ];

      spriteConfigs.forEach((config, index) => {
        const sprite = this.physics.add
          .sprite(config.x, config.y, config.key)
          .setCollideWorldBounds(true);
        setContainedSize(sprite, 100, 100);
        sprites.push(sprite);

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

        sprite.id = config.key;

        animationsComplete[config.key] = false;
        totalAnimations[config.key] = sprite.animations.length;
        completedAnimations[config.key] = 0;
        currentAnimationIndex[config.key] = 0;
      });

      for (let i = 0; i < sprites.length; i++) {
        for (let j = i + 1; j < sprites.length; j++) {
          this.physics.add.collider(
            sprites[i],
            sprites[j],
            () =>
              debouncedCollision.apply(this, [sprites[i], sprites[j], i, j]),
            null,
            this
          );
        }
      }

      sprites.forEach((sprite, index) => {
        console.log(sprite);
        executeAnimation(this, sprite, sprite.id);
      });
    }

    function executeAnimation(scene, sprite, spriteKey) {
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

    const debouncedCollision = debounce(handleCollision, 100, 3);

    function handleCollision(sprite1, sprite2) {
      console.log("collision");

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

    function getSpriteKey(sprite) {
      return sprite.texture.key;
    }

    function update() {}

    async function checkAnimationsComplete(scene) {
      if (
        Object.keys(completedAnimations).every(
          (key) => completedAnimations[key] === totalAnimations[key]
        )
      ) {
        console.log("All animations completed. Pausing the game.");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        pauseGame(scene);
      }
    }

    function pauseGame(scene) {
      scene.physics.world.pause();
      scene.scene.pause();
    }

    return () => {
      game.destroy(true);
    };
  }, [height, width, characters, currentAniamtionType]);

  return <div id="phaser-game-container" />;
};

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
