export const projects = [
  {
    id: "project1",
    title: "Trimble Virtual World",
    description: "Land surveying and construction simulation.",
    image: "public/Trimble_Logo.png",

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
        title: "Main User Interface",
        short_description: "Designed and implemented the main UI for seamless navigation.",
        content: [
          { type: "text", value: "The UI was built to provide a clear and intuitive layout for surveyors." },
          { type: "image", value: "/images/ui_wireframe.jpg" },
          { type: "text", value: "Using Unity's UI system, I implemented a scalable and responsive design." },
          { type: "video", value: "/videos/ui_final.mp4" }
        ]
      },
      run_mode_hud: {
        title: "Run Mode HUD",
        short_description: "Developed an in-game HUD for real-time user feedback.",
        content: [
          { type: "text", value: "The HUD displays key information such as task progress and equipment status." },
          { type: "image", value: "/images/hud_design.jpg" },
          { type: "text", value: "It was designed to be non-intrusive and easy to read during simulations." }
        ]
      },
      avatar_selection: {
        title: "Avatar Selection",
        short_description: "Implemented a system for choosing different surveyor avatars.",
        content: [
          { type: "text", value: "Players can select between different avatars to personalize their experience." },
          { type: "image", value: "/images/avatar_selection.jpg" }
        ]
      },
      interactive_objects: {
        title: "Interactive Objects System",
        short_description: "Built the framework for interacting with tools and objects.",
        content: [
          { type: "text", value: "Objects can be picked up, manipulated, and used within the environment." },
          { type: "video", value: "/videos/object_interactions.mp4" }
        ]
      },
      character_controller: {
        title: "Character Controller & Animations",
        short_description: "Developed smooth and responsive character movement and animations.",
        content: [
          { type: "text", value: "The character movement system allows realistic navigation." },
          { type: "image", value: "/images/character_animation.jpg" }
        ]
      },
      machine_animations: {
        title: "Machine Animations",
        short_description: "Created animations for various surveying machines and tools.",
        content: [
          { type: "text", value: "Machines such as total stations and GNSS rovers have realistic animations." },
          { type: "video", value: "/videos/machine_animations.mp4" }
        ]
      },
      three_wire_leveling: {
        title: "3-Wire Leveling System",
        short_description: "Designed and implemented a system to simulate 3-wire leveling measurements.",
        content: [
          { type: "text", value: "This system allows users to perform realistic 3-wire leveling in the virtual world." },
          { type: "image", value: "/images/three_wire_leveling.jpg" }
        ]
      },
      stake_layout: {
        title: "Stake Layout System",
        short_description: "Developing a system for setting out stake layouts.",
        content: [
          { type: "text", value: "The stake layout system allows precise positioning for construction and survey sites." },
          { type: "video", value: "/videos/stake_layout.mp4" }
        ]
      }
    },

    media: "/images/project1_gallery.jpg"
  }
];
