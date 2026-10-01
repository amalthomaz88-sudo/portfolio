/**
 * Game Developer Portfolio - Resume & Experience Structured Data
 * Profile: Amal Thomas - Unity Game Developer
 */

const RESUME_DATA = {
  personal: {
    name: "Amal Thomas",
    title: "Unity Game Developer",
    tagline: "Building Engaging Worlds. Engineering Polished Experiences.",
    email: "amalthomaz88@gmail.com",
    phone: "+91 8848011784",
    location: "Ernakulam, Kerala, India 683574",
    website: "https://amalthomas.dev",
    github: "https://github.com/amalthomas",
    linkedin: "https://linkedin.com/in/amal-thomas",
    youtube: "https://youtube.com/@amalthomasdev",
    instagram: "https://instagram.com/amal_thomas_dev",
    summary: "Passionate Game Developer with 2+ years of experience in Unity and C#, focused on developing engaging 2D and 3D games. Skilled in gameplay programming, AI, multiplayer systems, UI development, and performance optimization. Experienced in building scalable and reusable game systems across multiple genres. Strong problem-solving abilities with a keen interest in learning new technologies and translating creative ideas into polished gameplay features."
  },
  
  stats: [
    { label: "Shipped & Prototypes", value: "10+", icon: "gamepad" },
    { label: "Years Experience", value: "2+ YRS", icon: "clock" },
    { label: "Unity & C# Mastery", value: "Expert", icon: "code" },
    { label: "Framerate Target", value: "60 FPS+", icon: "zap" }
  ],

  experience: [
    {
      company: "Slams Edu tech",
      position: "Unity Game Developer",
      duration: "May 2026 - Present",
      location: "Kochi, Kerala, India",
      type: "Full-Time",
      description: "Spearheading 2D & 3D game development, real-time multiplayer systems, and performance-optimized Unity architectures for interactive gaming experiences.",
      responsibilities: [
        "Developed and maintained high-performance 2D and 3D games using Unity and C#.",
        "Implemented robust multiplayer networking systems using Photon with real-time state synchronization.",
        "Designed server-authoritative architecture to eliminate desynchronization and prevent cheating.",
        "Significantly improved runtime performance using object pooling and optimized Update() loops and GC allocations.",
        "Leveraged ScriptableObjects for scalable, designer-friendly game data configurations.",
        "Implemented smooth, responsive UI animations and tactile feedback systems using DOTween."
      ],
      projects: ["Battleships 2D Multiplayer", "Tower Defense", "Liquid Sort", "Battleship 2D"]
    },
    {
      company: "Infocom Software Pvt. Ltd",
      position: "Associate Developer - UNITY ENGINE",
      duration: "Dec 2024 - May 2026",
      location: "Kochi, Kerala, India",
      type: "Full-Time",
      description: "Built gameplay mechanics, AI systems, physics, and user interfaces across mobile and desktop Unity titles.",
      responsibilities: [
        "Engineered gameplay loops, character controllers, and custom physics interactions in 2D and 3D.",
        "Developed Minimax and heuristic-based AI algorithms for strategic decision-making.",
        "Diagnosed and resolved complex Unity performance bottlenecks, UI canvas draw-calls, and memory leaks.",
        "Integrated REST APIs for backend player progression, remote configurations, and leaderboards.",
        "Conducted sprint planning, code reviews, and mentored junior Unity developers on architectural consistency."
      ],
      projects: ["First-Person Shooter (FPS)", "Flight Simulator", "Rocket Launcher", "Solitaire Collection"]
    }
  ],

  education: [
    {
      degree: "Diploma in Unity Game Development",
      institution: "Big Boy School of Gaming",
      year: "Kochi - 2024",
      honors: "Certified Game Developer",
      highlights: "Specialized training in Unity 2D, Unity 3D, and C# programming. Acquired hands-on expertise in gameplay physics, AI state machines, shader basics, and shipping playable interactive titles."
    }
  ],

  skillsCategorized: {
    engines: [
      { name: "Unity (2D & 3D)", level: 96, experience: "2+ Years", badge: "Expert" },
      { name: "C# Programming", level: 95, experience: "2+ Years", badge: "Master" },
      { name: "Photon / Mirror / Netcode", level: 90, experience: "Multiplayer", badge: "Advanced" },
      { name: "Unreal Engine & C++", level: 82, experience: "Systems", badge: "Proficient" }
    ],
    programming: [
      { name: "C# Game Programming", level: 96, experience: "Core", badge: "Master" },
      { name: "Data Structures & OOPs", level: 94, experience: "Architecture", badge: "Expert" },
      { name: "ScriptableObjects & Coroutines", level: 95, experience: "Design Pattern", badge: "Master" },
      { name: "REST API & Server Auth", level: 88, experience: "Networking", badge: "Advanced" },
      { name: "DOTween & UI Systems", level: 92, experience: "UI/UX", badge: "Expert" }
    ],
    gameplaySystems: [
      { name: "Gameplay Programming", level: 96, experience: "2+ Years", badge: "Expert" },
      { name: "Multiplayer Real-Time Sync", level: 90, experience: "Photon / Mirror", badge: "Advanced" },
      { name: "AI (Minimax & Heuristics)", level: 88, experience: "Decision Trees", badge: "Advanced" },
      { name: "AI & Decision-Making Systems", level: 90, experience: "FSM & Algorithms", badge: "Expert" },
      { name: "Object Pooling & Optimization", level: 95, experience: "Zero GC", badge: "Master" },
      { name: "Physics & Character Controls", level: 92, experience: "2D & 3D", badge: "Expert" },
      { name: "Procedural State Validation", level: 89, experience: "Algorithm", badge: "Advanced" },
      { name: "Memory Management & Profiling", level: 91, experience: "Optimization", badge: "Expert" }
    ],
    tools: [
      { name: "Git & GitHub", level: 94, badge: "Master" },
      { name: "Unity Profiler & Memory Profiler", level: 92, badge: "Expert" },
      { name: "Visual Studio / VS Code", level: 95, badge: "Master" },
      { name: "DOTween Pro", level: 94, badge: "Expert" },
      { name: "Agile / Scrum & Sprint Planning", level: 90, badge: "Advanced" },
      { name: "Blender & Photoshop", level: 78, badge: "Intermediate" }
    ]
  },

  certifications: [
    {
      title: "Diploma in Unity Game Development",
      issuer: "Big Boy School of Gaming - Kochi",
      year: "2024",
      credentialId: "BBSG-UNITY-2024",
      description: "Completed intensive diploma program gaining hands-on production experience in Unity 2D, Unity 3D, and C# programming with practical skills in creating immersive games."
    }
  ],

  achievements: [
    {
      title: "Mentorship & Code Quality Leadership",
      year: "2025 - 2026",
      description: "Mentored junior Unity developers, elevating code quality, Git workflows, and architectural consistency across multiple game projects."
    },
    {
      title: "Engine & Performance Bottleneck Resolution",
      year: "2025",
      description: "Diagnosed and resolved critical Unity UI optimization bottlenecks, memory spikes, and asset loading delays, sustaining steady 60 FPS on target devices."
    },
    {
      title: "Constraint-Based Procedural Generation Algorithm",
      year: "2024 - 2025",
      description: "Designed and implemented constraint-based state validation and filtering algorithms to eliminate unsolvable level configurations during procedural level generation in strategy games."
    },
    {
      title: "R&D for Scalable Architecture & REST Integration",
      year: "2024",
      description: "Conducted technical feasibility R&D for upcoming live-ops multiplayer titles, defining server-authoritative state synchronization to prevent cheating."
    }
  ],

  workflow: [
    {
      step: 1,
      title: "Idea",
      icon: "lightbulb",
      tagline: "Concept & Core Hook",
      description: "Brainstorming core gameplay loops, target audience appeal, mechanics balance, and defining the emotional hook of the game."
    },
    {
      step: 2,
      title: "Design",
      icon: "layout",
      tagline: "GDD & System Architecture",
      description: "Drafting Game Design Documents, ScriptableObject data structures, state flowcharts, and DOTween UI mockups."
    },
    {
      step: 3,
      title: "Prototype",
      icon: "code",
      tagline: "Greybox & Mechanics Feel",
      description: "Rapidly building 2D/3D physics prototypes to dial in controller responsiveness, game feel, and validate the core 'fun factor'."
    },
    {
      step: 4,
      title: "Development",
      icon: "cpu",
      tagline: "Production Architecture",
      description: "Writing clean, scalable C# systems with Object Pooling, event managers, Photon networking, and heuristic/Minimax AI."
    },
    {
      step: 5,
      title: "Testing",
      icon: "crosshair",
      tagline: "QA & Edge Cases",
      description: "Profiling collision boundaries, server-authoritative latency compensation, and validating constraint-based procedural rules."
    },
    {
      step: 6,
      title: "Optimization",
      icon: "zap",
      tagline: "60+ FPS Polish",
      description: "Eliminating GC allocations in Update cycles, optimizing UI Canvas rebuilds, configuring texture compression, and profiling draw calls."
    },
    {
      step: 7,
      title: "Release",
      icon: "rocket",
      tagline: "Deployment & Support",
      description: "Building production WebGL, Android, PC bundles, integrating REST APIs, and maintaining post-launch live-ops feature patches."
    }
  ]
};

// Export for module or global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RESUME_DATA };
}
