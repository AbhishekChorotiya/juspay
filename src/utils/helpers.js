export function convertBlocksToMovements(blocks) {
  const movements = {
    when_flag_clicked: [],
    when_sprite_clicked: [],
    other: [],
  };

  const processedKeys = new Set();

  function processBlock(block) {
    const { type, fields, next, inputs } = block;
    let movement = null;

    if (type === "move") {
      movement = {
        type: "steps",
        steps: fields?.x_position || 0,
        x: fields?.x_position || 0,
        y: fields?.y_position || 0,
        duration: 500,
      };
    } else if (type === "clockwise") {
      movement = {
        type: "rotate",
        degrees: fields?.angle || 0,
        duration: 500,
      };
    } else if (type === "anticlockwise") {
      movement = {
        type: "rotate",
        degrees: -1 * (fields?.angle || 0),
        duration: 500,
      };
    } else if (type === "go_to") {
      movement = {
        type: "move",
        x: fields?.x_position || 0,
        y: fields?.y_position || 0,
        duration: 500,
      };
    } else if (type === "repeat") {
      const repeatCount = fields?.times || 0;
      const repeatMovements = [];

      if (inputs?.DO?.block) {
        let currentBlock = inputs.DO.block;
        while (currentBlock) {
          const { movement: nestedMovement, next: nestedNext } =
            processBlock(currentBlock);
          if (nestedMovement) {
            repeatMovements.push(nestedMovement);
          }
          currentBlock = nestedNext?.block;
        }
      }

      // Duplicate the repeat movements `repeatCount` times
      const duplicatedMovements = Array(repeatCount)
        .fill(repeatMovements)
        .flat();

      return { movement: duplicatedMovements, next };
    }

    return { movement, next };
  }

  function addToMovements(block, key) {
    if (processedKeys.has(key)) return; // Ignore if the key is already processed

    let currentBlock = block;
    while (currentBlock) {
      const { movement, next } = processBlock(currentBlock);
      if (movement) {
        if (Array.isArray(movement)) {
          movements[key].push(...movement); // Spread movements if it's an array (from repeat block)
        } else {
          movements[key].push(movement); // Single movement
        }
      }
      currentBlock = next?.block;
    }

    processedKeys.add(key); // Mark the key as processed
  }

  blocks.forEach((block) => {
    const { type, next } = block;

    // Determine which category the block belongs to
    if (type === "when_flag_clicked") {
      if (block?.next?.block)
        addToMovements(block.next.block, "when_flag_clicked");
    } else if (type === "when_sprite_clicked") {
      if (block?.next?.block)
        addToMovements(block.next.block, "when_sprite_clicked");
    } else {
      if (block) addToMovements(block, "other");
    }
  });

  return movements;
}
