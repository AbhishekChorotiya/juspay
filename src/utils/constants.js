export const motionBlocks = [
  {
    type: "move",
    message0: "move %1 steps",
    category: "motion",
    args0: [
      {
        type: "field_number",
        name: "x_position",
        value: 100,
      },
    ],
    previousStatement: true,
    nextStatement: true,
    colour: "#4d97fe",
  },
  {
    type: "clockwise",
    message0: "turn %1 %2 degrees",
    category: "motion",
    args0: [
      {
        type: "field_image",
        src: "/rotate-right.svg",
        width: 16,
        height: 16,
      },
      {
        type: "field_number",
        name: "angle",
        value: 45,
        min: 0,
        max: 360,
      },
    ],
    previousStatement: true,
    nextStatement: true,
    colour: "#4d97fe",
  },
  {
    type: "anticlockwise",
    message0: "turn %1 %2 degrees",
    category: "motion",
    args0: [
      {
        type: "field_image",
        src: "/rotate-left.svg",
        width: 16,
        height: 16,
      },
      {
        type: "field_number",
        name: "angle",
        value: 45,
        min: 0,
        max: 360,
      },
    ],
    previousStatement: true,
    nextStatement: true,
    colour: "#4d97fe",
  },
  {
    type: "go_to",
    message0: "go to x: %1 y: %2",
    category: "motion",
    args0: [
      {
        type: "field_number",
        name: "x_position",
        value: 0,
        min: -Infinity,
        max: Infinity,
      },
      {
        type: "field_number",
        name: "y_position",
        value: 0,
        min: -Infinity,
        max: Infinity,
      },
    ],
    previousStatement: true,
    nextStatement: true,
    colour: "#4d97fe",
  },
];

export const eventBlocks = [
  {
    type: "when_flag_clicked",
    message0: "when %1 clicked",
    category: "event",
    args0: [
      {
        type: "field_image",
        src: "/green-flag.svg",
        width: 24,
        height: 24,
      },
    ],
    nextStatement: true,
    colour: "#ffbf00",
  },
  {
    type: "when_sprite_clicked",
    message0: "when sprite is clicked",
    category: "event",
    nextStatement: true,
    colour: "#ffbf00",
  },
];

export const controlBlocks = [
  {
    type: "repeat",
    message0: "repeat %1 times",
    category: "control",
    args0: [
      {
        type: "field_number",
        name: "times",
        value: 2,
        min: 1,
      },
    ],
    message1: "%1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: true,
    nextStatement: true,
    colour: "#ffab19",
    tooltip: "Repeats the enclosed blocks a specific number of times.",
    helpUrl: "",
  },
];
