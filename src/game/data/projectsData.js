export const projects = [
  {
    id: "project1",
    title: "Trimble Virtual World",
    description: "Land surveying and construction simulation.",
    image: "/Trimble_Logo.webp",

    overview: `
Trimble Virtual World is an immersive training simulation for land surveyors. 
It enhances familiarity with surveying instruments and workflows in a 3D interactive environment. 
Built in Unity, it allows users to practice real-world surveying techniques with GNSS rovers, 
total stations, and scanning instruments.

Key Features:
- Real-World Equipment Simulation: Train with Trimble’s SX12, GNSS rovers, & data controllers.
- Interactive Training Quests: Step-by-step guided workflows for hands-on learning.
- Virtual Job Sites: Work in realistic environments like construction sites and cityscapes.
- Seamless Software Integration: Direct connection to Trimble Access & SiteWorks.
- Customizable Digital Twins: Import real-world 3D models for site-specific training.

Built with:
→ Engine: Unity  
→ 3D Tools: Blender, SketchUp 3D Warehouse  
→ Integration: Trimble Access, SiteWorks, GNSS & Total Station Simulations
    `,

    overview_media: "https://www.youtube.com/watch?v=DUN1N0Vg8bs",

    disclaimer: "This video was created by Guillaume Clin, a coworker at Trimble, and is used here to provide relevant context on the project. All rights to the video remain with its original creator.",

    my_contributions: {
      main_ui: {
        title: "Main User Interface (UI/UX)",
        short_description: "Designed and implemented a structured, user-friendly interface for seamless navigation.",
        content: [
          {
            type: "text",
            value: `
#### Process Overview

**Paper Prototype & Initial Testing**

Created a paper prototype to rapidly test layout concepts.
Conducted two design meetings to test usability and gather feedback.

**Figma Prototype & Refinement**

Translated the best design ideas into a high-fidelity Figma prototype.
Integrated Trimble’s branding for visual consistency across applications.

**Implementation & Development Collaboration**

Coordinated with developers to define UI logic, interactions, and navigation systems.

#### Outcome

Transformed a basic 3-button interface into a structured, scalable UI.
Ensured accessibility and usability for both new and experienced users.
Created an intuitive and visually consistent UI that integrates seamlessly with Trimble’s ecosystem.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/Main%20UI.mp4" }
        ]
      },
      run_mode_hud: {
        title: "Run Mode HUD",
        short_description: "Developed an in-game HUD for real-time user feedback.",
        content: [
          {
            type: "text",
            value: `
#### Process

**User-Centric Design & Feedback Implementation**

Designed a dynamic HUD that allows easy modification.
Incorporated customer feedback to refine UI components.

**Key Features**

Upper Ribbon: Displays key survey data in a compact layout.
Cycling Data Panels: Allows users to toggle through relevant datasets.
Compass Integration: Helps with orientation and direction tracking.
Side Panes: Enables quick access to maps, tools, and settings.

#### Outcome

Developed an efficient, customizable HUD that enhances workflow efficiency.
Implemented an interactive system that allows users to toggle key information dynamically.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/HUD.mp4" }
        ]
      },
      avatar_selection: {
        title: "Avatar Selection",
        short_description: "Implemented a system for choosing different surveyor avatars.",
        content: [
          {
            type: "text",
            value: `
#### Process

**Preset Avatar System**

Integrated character models from Synty Studios to ensure consistent visual style.
Developed preset outfit selections to align with different surveying environments.

**Card-Based UI Navigation**

Designed the avatar selection using the same card-based UI pattern as the rest of the interface.
Allows users to switch between avatars and customize clothing seamlessly.

#### Outcome

Created an intuitive and structured character selection system.
Ensured visual and functional consistency across the UI.
Developed a scalable system that allows future customization expansions.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/Avatar%20selection.mp4" }
        ]
      },
      interactive_objects: {
        title: "Interactive Objects System",
        short_description: "Built the framework for interacting with tools and objects.",
        content: [
          {
            type: "text",
            value: `
#### Process

**Interaction Logic**

Implemented controller-style button interactions (up to 4 actions per object).
Added shader-based highlights for interactable objects.

**Selection & Prioritization**

System scans and prioritizes objects based on proximity and importance.

**User Feedback & Notifications**

Integrated HUD-based real-time prompts, ensuring clarity when interacting with objects.
Provided error prevention mechanisms, reducing unnecessary user mistakes.

#### Outcome

Built an efficient and responsive interaction system.
Integrated visual feedback to enhance user experience.
Ensured logical object interaction across various scenarios.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/object%20interaction.mp4" }
        ]
      },
      character_controller: {
        title: "Character Controller & Animations",
        short_description: "Developed smooth and responsive character movement and animations.",
        content: [
          {
            type: "text",
            value: `
#### Process

**IK-Based Movement & Animation**

Used Inverse Kinematics (IK) for feet and hand positioning, ensuring realistic contact with the environment.
Implemented raycasts to detect step-up limits, making movement feel natural.

**Realism & Movement Constraints**

Defined movement constraints based on surveyors’ real-world experiences.
Ensured the system allows terrain traversal while accounting for survey tools in hand.

**Smooth Animation Transitions**

Integrated Unity’s animation system to match character movement to animations dynamically.
Ensured smooth transitions between idle, walking, terrain adjustment, and object interaction states.

#### Outcome

Developed a realistic, physics-based character movement system.
Ensured fluid animations that react dynamically to terrain.
Designed a scalable system that can be extended with future updates.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/Character%20Controller.mp4" }
        ]
      },
      machine_animations: {
        title: "Machine Animations",
        short_description: "Created animations for various surveying machines and tools.",
        content: [
          {
            type: "text",
            value: `
#### Process

**Rigging & Model Preparation**

A team member rigged the models, ensuring proper skeletal structure.
I developed programmatic animations for all machine movements.

**Realism & Movement Constraints**

Implemented arm & rotation limits to match real machines.
Integrated jiggle physics, inertia, and rotation mechanics.
Added dynamic sound effects & smoke particles.

**Collaboration on User-Controlled Animations**

Another team member built the user-controlled animation system.
My animations were fully integrated, allowing seamless triggering.

#### Outcome

Created realistic machine animations controlled dynamically by the system.
Integrated 7 fully animated construction machines, all crucial to the simulation.
Enhanced immersion with real-time feedback & environmental interactions.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/Machine%20sped%20up.mp4" }
        ]
      },
      three_wire_leveling: {
        title: "3-Wire Leveling System",
        short_description: "Designed and implemented a system to simulate 3-wire leveling measurements.",
        content: [
          {
            type: "text",
            value: `
#### Process

**Educational Purpose**

Developed in collaboration with The University of Texas to train future surveyors.
Created a real-world simulation that helps students learn leveling techniques before applying them in the field.

**Dynamic Measurement System**

Integrated a measuring ruler using the character controller’s IK system.
The ruler adjusts unit settings (feet/meters) dynamically.
Ground-following logic ensures accurate measurements.

**Surveying Process & Feedback**

Users interact with a total station for precise elevation & distance readings.
Implemented real-time HUD feedback for guidance.

#### Outcome

Created a hands-on educational tool for surveyors.
Integrated real-world measurement techniques into a digital environment.
Enhanced user experience with terrain-adaptive ruler positioning.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/threewire.mp4" }
        ]
      },
      stake_layout: {
        title: "Stake Layout System",
        short_description: "Developed an educational and simulation-based stake layout system.",
        content: [
          {
            type: "text",
            value: `
#### Process

**Simulation & Planning Mode**

Users can place stakes dynamically in city-builder-style mode.
Enables site visualization & planning for construction projects.

**Educational Stakeout Training**

Students must use a total station to locate hidden stake positions.
System provides real-time accuracy tracking for evaluation.

**HUD Integration & Real-Time Feedback**

HUD displays positioning guidance to help users place stakes precisely.

#### Outcome

Developed a dual-purpose system for simulation & education.
Provided students with real-world stakeout training in a virtual setting.
Integrated interactive feedback for accuracy tracking.
            `
          },
          { type: "video", value: "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/Videos/stakeout%20sped%20up.mp4" }
        ]
      }
    },

    media: "https://www.youtube.com/watch?v=DUN1N0Vg8bs"
  },


  {
  id: "project2",
  title: "Full Stack Projects",
  description: "Web Development Projects",
  image: "/images/project2_thumbnail.jpg",

  overview: `
This small projects are a creative blend of two web development exercises, each exploring a different nostalgic aesthetic.
The projects explore the intersection of creative design and modern development tools while paying homage to nostalgic digital aesthetics.

1. **PS1-Style Portfolio Game** — A personal portfolio built using React and Three.js, styled like a survival horror game from the PlayStation 1 era.

2. **Retro Archive Landing Page** — A fictional startup landing page designed using HTML and Bootstrap, made to feel like an old 90s internet archive.
  `,


  disclaimer: "This project is a personal creative exploration, combining retro aesthetics with web development skills using both React/Three.js and HTML/CSS.",

  my_contributions: {
    portfolio_game: {
      title: "PS1-Inspired Portfolio Game",
      short_description: "An interactive 3D portfolio built using React and Three.js.",
      content: [
        {
          type: "text",
          value: `
#### Overview

Built using React Three Fiber, Cannon.js, and Vanilla JS/CSS for UI overlays.
Inspired by PS1 survival horror games like Silent Hill, with low-poly graphics and fixed camera angles.

**Key Features:**
- Custom 3D navigation
- Stylized retro UI menus
- Physics-based character interactions

**Stack:**
- React, React Three Fiber, Drei
- HTML/CSS/JS for UI logic
- Cannon.js for physics
          `
        }
      ]
    },
    landing_page: {
      title: "90s-Inspired Landing Page",
      short_description: "A modern website designed to look like a 90s archive using HTML and Bootstrap.",
      content: [
        {
          type: "text",
          value: `
#### Overview

A small project for a fictional startup that archives retro websites.
Built using HTML and Bootstrap, with creative CSS to match the old-school vibe.

**Key Features:**
- Pixel fonts, marquee text, and low-res iconography
- Fully responsive layout
- Clean HTML-only structure
          `
        }
      ]
    }
  },

  media: "https://feangapegamedev.github.io/Startup-website/"
}
];
