export const roomData = [
  {
    id: 1,
    name: "Introduction Room",
    position: [0, 0, 0],
    spawnPositionForward: [0, 0, 4],
    spawnPositionBackward: [0, 0, -4],
    width: 15,
    depth: 15,
    height: 5,
    color: "lightblue",
    items: [
      {
        id: "door1",
        type: "door",
        position: [0, 0.5, -7], // Position the door at the back wall
        direction: "forward",
        label: "Go to Project Room",
      },
    ],
  },
  {
    id: 2,
    name: "Project Room",
    position: [0, 0, 0],
    spawnPositionForward: [0, 0, 4],
    spawnPositionBackward: [0, 0, -4],
    width: 15,
    depth: 15,
    height: 5,
    color: "lightgreen",
    items: [
      {
        id: "door2",
        type: "door",
        position: [0, 0.5, -7], // Position the door at the back wall
        direction: "forward",
        label: "Go to Game Room",
      },
      {
        id: "door3",
        type: "door",
        position: [0, 0.5, 7], // Position the door at the front wall
        direction: "backward",
        label: "Go to Introduction Room",
      },
    ],
  },
  {
    id: 3,
    name: "Game Room",
    position: [0, 0, 0],
    spawnPositionForward: [0, 0, 4],
    spawnPositionBackward: [0, 0, -4],
    width: 15,
    depth: 15,
    height: 5,
    color: "lightcoral",
    items: [
      {
        id: "door4",
        type: "door",
        position: [0, 0.5, 7], // Position the door at the front wall
        direction: "backward",
        label: "Go to Project Room",
      },
    ],
  },
];