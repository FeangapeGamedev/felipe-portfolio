export const projects = [
  {
    id: "project1",
    title: "Trimble Virtual World",
    description: "Land surveying and construction simulation.",
    image: "/images/project1.jpg",
    overview: `
      Trimble Virtual World is a training simulation for land surveyors, 
      designed to enhance familiarity with surveying instruments and workflows. 
      Built in Unity, it integrates real-world surveying processes with an 
      interactive environment.
    `,
    overview_media: "/videos/tvw_overview.mp4",
    my_contributions: {
      ui_design: {
        title: "UI Design",
        short_description: "Designed an intuitive UI.",
        content: [
          { type: "text", value: "The goal was to create a UI that allows users to easily navigate." },
          { type: "image", value: "/images/ui_wireframe.jpg" },
          { type: "text", value: "Once the layout was set, I implemented it using Unity's UI system." },
          { type: "video", value: "/videos/ui_final.mp4" }
        ]
      }
    },
    media: "/images/project1_gallery.jpg"
  }
];
