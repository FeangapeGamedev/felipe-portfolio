import React, { useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Intro_room } from "./Intro_room";
import { Project_room } from "./Project_room";
import { Game_room } from "./Game_room";
import { CharacterController } from "./CharacterController";
import { Character } from "./Character";
import InteractiveObject from "./InteractiveObject"; // ✅ Correct import

export const Scene = ({ isPaused, onProjectSelect, onDoorOpen }) => {
  const [targetPosition, setTargetPosition] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("Introduction_room");

  const handleDoorOpen = (direction) => {
    if (currentRoom === "Introduction_room" && direction === "forward") {
      setCurrentRoom("Project_room");
      setTargetPosition([0, 0, 6]); // Set initial position in Project_room
    } else if (currentRoom === "Project_room" && direction === "forward") {
      setCurrentRoom("Game_room");
      setTargetPosition([0, 0, 6]); // Set initial position in Game_room
    } else if (currentRoom === "Project_room" && direction === "backward") {
      setCurrentRoom("Introduction_room");
      setTargetPosition([0, 0, -6]); // Set initial position in Introduction_room
    } else if (currentRoom === "Game_room" && direction === "backward") {
      setCurrentRoom("Project_room");
      setTargetPosition([0, 0, -6]); // Set initial position in Project_room
    }
  };

  return (
    <group>
      <OrthographicCamera
        makeDefault
        position={[7.55, 5, 10]}
        rotation={[-Math.PI / 10, Math.PI / 5, 0.2]}
        zoom={90}
      />

      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />

      <Physics debug>
        {currentRoom === "Introduction_room" && <Intro_room width={15} depth={15} height={5} />}
        {currentRoom === "Project_room" && <Project_room width={15} depth={15} height={5} />}
        {currentRoom === "Game_room" && <Game_room width={15} depth={15} height={5} />}

        {/* Character */}
        <Character targetPosition={targetPosition} isPaused={isPaused} />
        <CharacterController
          isPaused={isPaused}
          setTargetPosition={setTargetPosition}
          onInteract={(object) => {
            if (object.name === "project") {
              onProjectSelect(object.userData.projectId);
            } else if (object.name === "door") {
              handleDoorOpen(object.userData.direction);
            }
          }}
        />

        {currentRoom === "Introduction_room" && (
          <>
            {/* ✅ Door with Collider */}
            <InteractiveObject
              id={3} // Pass the door ID
              position={[0, 1, -7]} // Position near the back wall
              onClick={() => console.log("Door clicked!")}
              onProjectClick={() => handleDoorOpen("forward")} // Pass the handleDoorOpen function with direction
              isPaused={isPaused} // Pass the isPaused prop
              color="red" // Color for the door
              shape="sphere" // Shape for the door
              label="Press Space to move to next area" // Custom label for the door
              setTargetPosition={setTargetPosition} // Pass the setTargetPosition function
            />
          </>
        )}

        {currentRoom === "Project_room" && (
          <>
            {/* ✅ First Capsule with Collider */}
            <InteractiveObject
              id={1} // Pass the project ID
              position={[2, 1, 0]}
              onClick={() => console.log("Capsule 1 clicked!")}
              onProjectClick={onProjectSelect} // Pass the onProjectSelect function
              isPaused={isPaused} // Pass the isPaused prop
              color="blue" // Color for the first capsule
              label="Press Space to view Project One" // Custom label for the first capsule
              setTargetPosition={setTargetPosition} // Pass the setTargetPosition function
            />

            {/* ✅ Second Capsule with Collider */}
            <InteractiveObject
              id={2} // Pass the project ID for the second project
              position={[6, 1, 0]} // Different position for the second capsule
              onClick={() => console.log("Capsule 2 clicked!")}
              onProjectClick={onProjectSelect} // Pass the onProjectSelect function
              isPaused={isPaused} // Pass the isPaused prop
              color="purple" // Color for the second capsule
              label="Press Space to view Project Two" // Custom label for the second capsule
              setTargetPosition={setTargetPosition} // Pass the setTargetPosition function
            />

            {/* ✅ Door with Collider to go back */}
            <InteractiveObject
              id={5} // Pass the door ID
              position={[0, 1, 7]} // Position near the front wall
              onClick={() => console.log("Door clicked!")}
              onProjectClick={() => handleDoorOpen("backward")} // Pass the handleDoorOpen function with direction
              isPaused={isPaused} // Pass the isPaused prop
              color="red" // Color for the door
              shape="sphere" // Shape for the door
              label="Press Space to go back" // Custom label for the door
              setTargetPosition={setTargetPosition} // Pass the setTargetPosition function
            />

            {/* ✅ Door with Collider to go forward */}
            <InteractiveObject
              id={6} // Pass the door ID
              position={[0, 1, -7]} // Position near the back wall
              onClick={() => console.log("Door clicked!")}
              onProjectClick={() => handleDoorOpen("forward")} // Pass the handleDoorOpen function with direction
              isPaused={isPaused} // Pass the isPaused prop
              color="red" // Color for the door
              shape="sphere" // Shape for the door
              label="Press Space to move to next area" // Custom label for the door
              setTargetPosition={setTargetPosition} // Pass the setTargetPosition function
            />
          </>
        )}

        {currentRoom === "Game_room" && (
          <>
            {/* ✅ Door with Collider to go back */}
            <InteractiveObject
              id={8} // Pass the door ID
              position={[0, 1, 7]} // Position near the front wall
              onClick={() => console.log("Door clicked!")}
              onProjectClick={() => handleDoorOpen("backward")} // Pass the handleDoorOpen function with direction
              isPaused={isPaused} // Pass the isPaused prop
              color="red" // Color for the door
              shape="sphere" // Shape for the door
              label="Press Space to go back" // Custom label for the door
              setTargetPosition={setTargetPosition} // Pass the setTargetPosition function
            />
          </>
        )}
      </Physics>
    </group>
  );
};
