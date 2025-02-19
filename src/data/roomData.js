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
    wallTexture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
    floorTexture: "/src/assets/models/Asphalt/Asphalt_Albedo.tga",
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
    wallTexture: "/src/assets/models/Cement Brick Wall/CementBrickWallAlbedo.tga",
    floorTexture: "/src/assets/models/Asphalt/Asphalt_Albedo.tga",
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
      {
        id: 1,
        type: "project",
        position: [-5, 0.5, 0], // Position the project on the left side
        label: "Project One",
        color: "blue",
      },
      {
        id: 2,
        type: "project",
        position: [5, 0.5, 0], // Position the project on the right side
        label: "Project Two",
        color: "purple",
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
    wallTexture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
    floorTexture: "/src/assets/models/Asphalt/Asphalt_Albedo.tga",
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