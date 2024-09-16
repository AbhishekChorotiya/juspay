export function convertBlocksToMovements(blocks) {
  const movements = {
    when_flag_clicked: [],
    when_sprite_clicked: [],
    other: [],
  };

  const processedKeys = new Set(); // To keep track of keys that have been processed

  function processBlock(block) {
    const { type, fields, next } = block;

    // Map the Blockly block types to the movement types
    let movement = null;
    if (type === "move") {
      movement = {
        type: "steps",
        steps: fields?.x_position || 0,
        x: fields?.x_position || 0,
        y: fields?.y_position || 0,
        duration: 1000, // Assuming a default duration
      };
    } else if (type === "clockwise") {
      movement = {
        type: "rotate",
        degrees: fields?.angle || 0,
        duration: 1000,
      };
    } else if (type === "go_to") {
      movement = {
        type: "move",
        x: fields?.x_position || 0,
        y: fields?.y_position || 0,
        duration: 1000,
      };
    }

    return { movement, next };
  }

  function addToMovements(block, key) {
    if (processedKeys.has(key)) return; // Ignore if the key is already processed

    let currentBlock = block;
    while (currentBlock) {
      const { movement, next } = processBlock(currentBlock);
      if (movement) {
        movements[key].push(movement);
      }
      currentBlock = next?.block;
    }

    processedKeys.add(key); // Mark the key as processed
  }

  blocks.forEach((block) => {
    const { type, next } = block;

    // Determine which category the block belongs to
    if (type === "when_flag_clicked") {
      addToMovements(block.next.block, "when_flag_clicked");
    } else if (type === "when_sprite_clicked") {
      addToMovements(block.next.block, "when_sprite_clicked");
    } else {
      addToMovements(block, "other");
    }
  });

  return movements;
}
