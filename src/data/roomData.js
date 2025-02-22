export const roomData = [
  {
    id: 1,
    name: "Introduction Room",
    position: [0, 0, 0],
    spawnPositionForward: [0, 0, 4],
    spawnPositionBackward: [-4, 0, -6],
    width: 15,
    depth: 15,
    height: 5,
    color: "lightblue",
    floorTexture: "/src/assets/models/Asphalt/Asphalt_Albedo.tga",
    walls: {
      back: {
        visible: true,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
      left: {
        visible: false,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
      right: {
        visible: false,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
      front: {
        visible: false,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
    },
    items: [
      {
        id: "door1",
        type: "door",
        position: [-4, 1.5, -7.2], // Position the door at the back wall
        rotation: [0, -55, 0], // Rotate the door to face the room
        direction: "forward",
        label: "Go to Project Room",
        model: "/src/assets/3dModels/door/scene.gltf", // New model path for the door in the first room
        scale: [0.14, 0.12, 0.14], // Scale down the model
      },
    ],
  },
  {
    id: 2,
    name: "Project Room",
    position: [0, 0, 0],
    spawnPositionForward: [-4, 0, 6],
    spawnPositionBackward: [4.5, 0, -5.5],
    width: 15,
    depth: 15,
    height: 5,
    color: "lightgreen",
    floorTexture: "/src/assets/models/Asphalt/Asphalt_Albedo.tga",
    walls: {
      back: {
        visible: true,
        texture: "/src/assets/models/Cement Brick Wall/CementBrickWallAlbedo.tga",
      },
      left: {
        visible: true,
        texture: "/src/assets/models/Cement Brick Wall/CementBrickWallAlbedo.tga",
      },
      right: {
        visible: false,
        texture: "/src/assets/models/Cement Brick Wall/CementBrickWallAlbedo.tga",
      },
      front: {
        visible: false,
        texture: "/src/assets/models/Cement Brick Wall/CementBrickWallAlbedo.tga",
      },
    },
    items: [
      {
        id: "door2",
        type: "door",
        position: [4, 0, -7.3], // Position the door at the back wall
        rotation: [0, Math.PI, 0], // Rotate the door to face the room
        direction: "forward",
        label: "Go to Game Room",
        model: "src/assets/3dModels/SciFiDoor.glb", // No model path, will use fallback
        scale: [0.9, 0.9, 0.9], // Default scale
      },
      {
        id: "door3",
        type: "door",
        position: [-4, 1.5, 7.2], // Position the door at the front wall
        rotation: [0, -55, 0], // Rotate the door to face the room
        direction: "backward",
        label: "Go to Introduction Room",
        model: "/src/assets/3dModels/door/scene.gltf",
        scale: [0.14, 0.12, 0.14], // Default scale
        transparency: 0.2, // Add transparency option
      },
      {
        id: 1,
        type: "project",
        position: [-5, 0, -3], // Position the project on the left side
        rotation: [0, 0, 0], // Rotate the project to face the room
        label: "Project One",
        color: "blue",
        model: "/src/assets/3dModels/Construction.glb", // No model path, will use fallback
        scale: [0.65, 0.65, 0.65], // Default scale
      },
    ],
  },
  {
    id: 3,
    name: "Game Room",
    position: [0, 0, 0],
    spawnPositionForward: [5.5, 0, 6],
    spawnPositionBackward: [0, 0, -4],
    width: 15,
    depth: 15,
    height: 5,
    color: "lightcoral",
    floorTexture: "/src/assets/models/Asphalt/Asphalt_Albedo.tga",
    walls: {
      back: {
        visible: true,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
      left: {
        visible: true,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
      right: {
        visible: false,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
      front: {
        visible: false,
        texture: "/src/assets/models/Brick Wall/BrickWall_Albedo.tga",
      },
    },
    items: [
      {
        id: "door4",
        type: "door",
        position: [5, 0, 7.7], // Position the door at the front wall
        rotation: [0, 0, 0], // Rotate the door to face the room
        direction: "backward",
        label: "Go to Project Room",
        model: "src/assets/3dModels/SciFiDoor.glb", // No model path, will use fallback
        scale: [0.9, 0.9, 0.9], // Default scale
        transparency: 0.2, // Add transparency option
      },
    ],
  },
];