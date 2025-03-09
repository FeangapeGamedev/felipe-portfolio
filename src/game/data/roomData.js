export const roomData = [
  {
    id: 1,
    name: "Introduction Room",
    position: [0, 0, 0],
    spawnPositionForward: [0, 0, 6],
    spawnPositionBackward: [-4, 0, -6],
    width: 15,
    depth: 15,
    height: 5,
    floorTexture: "src/assets/textures/dark-rock-wall-seamless-texture-free.jpg",
    walls: {
      back: { visible: true, texture: "src/assets/textures/spray-paint-wall-graffiti-texture-free.jpg" },
      left: { visible: false, texture: "src/assets/textures/graffiti-wall-texture-free.jpg" },
      right: { visible: false, texture: "src/assets/textures/graffiti-wall-texture-free.jpg" },
      front: { visible: false, texture: "src/assets/textures/graffiti-wall-texture-free.jpg" },
    },
    items: [
      {
        id: "door1",
        type: "door",
        position: [-4, 1.3, -7.1],
        rotation: [0, -55, 0],
        targetRoomId: 2,
        label: "Go to Project Room",
        model: "/src/assets/3dModels/door/scene.gltf",
        scale: [0.14, 0.11, 0.12],
        userData: { raycastable: true, isInteractive: true },
      },
    ],
    props: [
      {
        id: "car",
        type: "prop",
        position: [-4, 1, 5],
        rotation: [0, 6, 0],
        scale: [3, 3, 3],
        model: "src/assets/3dModels/1987_Mercedes_Benz_b_0304010346_texture.glb",
      },
      {
        id: "suv",
        type: "prop",
        position: [5.5, 1.4, 5],
        rotation: [0, 6, 0],
        scale: [3, 3, 3],
        model: "src/assets/3dModels/suv_truck.glb",
      },
      {
        id: "wallLights",
        type: "prop",
        position: [-4, 4, -7],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        model: "src/assets/3dModels/3_modern_street_wall__0305114438_texture.glb",
      },
      {
        id: "streetLights",
        type: "prop",
        position: [1.5, 0, 7],
        rotation: [0, 3, 0],
        scale: [25, 25, 25],
        model: "src/assets/3dModels/lamp.glb",
      },
    ],
    lights: [
      {
        position: [-5, 4, -7],       // Elevated, like a ceiling/streetlight
        targetPosition: [-5, 1, -7], // Aiming downwards towards the floor
        intensity: 10,             // Bright but not overpowering
        color: 0xffcc88,            // Warm yellow light
        angle: Math.PI / 4,         // Narrower beam for a focused effect
        penumbra: 0.4,              // Soft edges
        decay: 5,                   // Light fades naturally
        distance: 20,               // Reasonable range for room lighting
      },
      {
        position: [-4, 4, -7],       // Elevated, like a ceiling/streetlight
        targetPosition: [-4.5, 1, -7], // Aiming downwards towards the floor
        intensity: 10,             // Bright but not overpowering
        color: 0xffcc88,            // Warm yellow light
        angle: Math.PI / 4,         // Narrower beam for a focused effect
        penumbra: 0.4,              // Soft edges
        decay: 5,                   // Light fades naturally
        distance: 20,               // Reasonable range for room lighting
      },
      {
        position: [-3, 4, -7],       // Elevated, like a ceiling/streetlight
        targetPosition: [-3.5, 1, -7], // Aiming downwards towards the floor
        intensity: 10,             // Bright but not overpowering
        color: 0xffcc88,            // Warm yellow light
        angle: Math.PI / 4,         // Narrower beam for a focused effect
        penumbra: 0.4,              // Soft edges
        decay: 5,                   // Light fades naturally
        distance: 20,               // Reasonable range for room lighting
      },
      {
        position: [1.5, 3.7, 7],       // Elevated, like a ceiling/streetlight
        targetPosition: [1.5, 0, 7], // Aiming downwards towards the floor
        intensity: 10,             // Bright but not overpowering
        color: 0xffcc88,            // Warm yellow light
        angle: Math.PI / 4,         // Narrower beam for a focused effect
        penumbra: 0.4,              // Soft edges
        decay: 5,                   // Light fades naturally
        distance: 20,               // Reasonable range for room lighting
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
    floorTexture: "src/assets/textures/FloorTile2.jpg",
    walls: {
      back: { visible: true, texture: "src/assets/textures/grunge-wall-texture.jpg" },
      left: { visible: true, texture: "src/assets/textures/grunge-wall-texture.jpg" },
      right: { visible: false, texture: "src/assets/textures/grunge-wall-texture.jpg" },
      front: { visible: false, texture: "src/assets/textures/grunge-wall-texture.jpg" },
    },
    items: [
      {
        id: "door2",
        type: "door",
        position: [4, 0, -7.3],
        rotation: [0, Math.PI, 0],
        targetRoomId: 3,
        label: "Go to Game Room",
        model: "src/assets/3dModels/SciFiDoor.glb",
        scale: [0.9, 0.9, 0.9],
        userData: { raycastable: true, isInteractive: true },
      },
      {
        id: "door3",
        type: "door",
        position: [-4, 1.3, 7],
        rotation: [0, -55, 0],
        targetRoomId: 1,
        label: "Go to Introduction Room",
        model: "/src/assets/3dModels/door/scene.gltf",
        scale: [0.14, 0.11, 0.12],
        transparency: 0.2,
        userData: { raycastable: true, isInteractive: true },
      },
      {
        id: "project1",
        type: "project",
        position: [-5, 0.5, -5],
        rotation: [0, 55, 0],
        label: "Project One",
        model: "/src/assets/3dModels/Construction.glb",
        scale: [0.52, 0.52, 0.52],
        userData: { raycastable: true, isInteractive: true },
      },
    ],
    props: [
      {
        id: "stand_1",
        type: "prop",
        position: [-5.2, 0.2, -5.2],
        rotation: [0, 0, 0],
        scale: [1.5, 0.2, 1.5],
        model: "src/assets/3dModels/display_stand.glb",
      },
      {
        id: "ceilingLight",
        type: "prop",
        position: [-5, 5, -5],
        rotation: [3.15, 0, 0],
        scale: [2, 2, 2],
        model: "src/assets/3dModels/Octagonal concrete lamp.glb",
      },
      {
        id: "plant_1",
        type: "prop",
        position: [0, 1, -6.5],
        rotation: [0, 0, 0],
        scale: [1 ,1 ,1],
        model: "src/assets/3dModels/Indoor_Plant_one.glb",
      },
      {
        id: "plant_2",
        type: "prop",
        position: [0, 1, 6.5],
        rotation: [0, 0, 0],
        scale: [1 ,1 ,1],
        model: "src/assets/3dModels/Indoor_Plant_one.glb",
      },
      {
        id: "plant_3",
        type: "prop",
        position: [-6.5, 1, 0],
        rotation: [0, 0, 0],
        scale: [1 ,1 ,1],
        model: "src/assets/3dModels/Indoor_Plant_two.glb",
      },
      {
        id: "plant_4",
        type: "prop",
        position: [6.5, 1, 0],
        rotation: [0, 0, 0],
        scale: [1 ,1 ,1],
        model: "src/assets/3dModels/Indoor_Plant_two.glb",
      }
    ], 
    lights: [
      {
        position: [-5, 4.5, -5],       // Elevated, like a ceiling/streetlight
        targetPosition: [-5, 0, -5], // Aiming downwards towards the floor
        intensity: 20,             // Bright but not overpowering
        color: 0xffcc88,            // Warm yellow light
        angle: Math.PI / 2,         // Narrower beam for a focused effect
        penumbra: 0.4,              // Soft edges
        decay: 5,                   // Light fades naturally
        distance: 40,               // Reasonable range for room lighting
      },
    ],
  },
  {
    id: 3,
    name: "Danger Room",
    position: [0, 0, 0],
    spawnPositionForward: [5, 0, 6 ],
    spawnPositionBackward: [0, 0, -4],
    width: 15,
    depth: 15,
    height: 5,
    floorTexture: "src/assets/textures/FloorTile2.jpg",
    walls: {
      back: { visible: true, texture: "src/assets/textures/FloorTile2.jpg" },
      left: { visible: true, texture: "src/assets/textures/FloorTile2.jpg" },
      right: { visible: false, texture: "src/assets/textures/FloorTile2.jpg" },
      front: { visible: false, texture: "src/assets/textures/FloorTile2.jpg" },
    },
    items: [
      {
        id: "door4",
        type: "door",
        position: [5, 0, 7.7],
        rotation: [0, 0, 0],
        targetRoomId: 2,
        label: "Go to Project Room",
        model: "src/assets/3dModels/SciFiDoor.glb",
        scale: [0.9, 0.9, 0.9],
        transparency: 0.2,
        userData: { raycastable: true, isInteractive: true, id: "door4", },
      },
    ],
    props: [], // Ensure props is an array
    lights: [],
  },
];
