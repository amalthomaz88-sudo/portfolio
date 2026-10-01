/**
 * Game Developer Portfolio - Projects Structured Data
 * Featured projects developed by Amal Thomas (Unity Game Developer)
 */

const PROJECTS_DATA = [
  {
    id: "battleships-multiplayer",
    title: "Battleships (2D & 3D Multiplayer)",
    subtitle: "Real-Time Synchronized Naval Combat with Photon",
    genre: "Multiplayer Strategy / Naval Action",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "Multiplayer", "2D", "3D", "Photon", "C#"],
    role: "Lead Multiplayer & Systems Developer",
    timeline: "Production Project",
    teamSize: "Core Development",
    heroImage: "assets/images/battleship.jpg",
    shortDescription: "A real-time multiplayer naval combat game featuring synchronized player lobbies, server-authoritative state synchronization to prevent cheating, radar targeting, and explosive ballistic warfare.",
    stats: {
      networking: "Photon Real-Time Sync",
      architecture: "Server-Authoritative",
      fps: "60 FPS Locked",
      platforms: "PC / Mobile / WebGL"
    },
    overview: "Engineered as an engaging multiplayer naval combat game, this title allows players to deploy fleets and engage in intense real-time tactical battles. Built with a rock-solid server-authoritative networking model that completely eliminates desyncs and ensures competitive integrity.",
    features: [
      "Real-time 2-player and multi-player fleet synchronization over Photon Network",
      "Server-authoritative state validation preventing illegitimate shots, fleet position spoofing, and desynchronization",
      "Dynamic radar minimap with IFF grid targeting, missile launch sequencing, and artillery ballistics",
      "Animated UI transitions, victory celebrations, and damage numbers powered by DOTween",
      "Object pooling architecture for cannon shells, explosion debris, and missile trails eliminating GC frame drops",
      "Cross-platform matchmaker with private room codes and automated reconnect handling"
    ],
    challenges: [
      {
        problem: "Simultaneous shot inputs over mobile networks caused race conditions and client-side discrepancy.",
        solution: "Implemented an authoritative command-queue system with timestamp validation on the host client, validating firing permits before triggering visual impact effects."
      },
      {
        problem: "Spawning dozens of projectile and explosion particle prefabs caused noticeable garbage collection hitching.",
        solution: "Built a centralized generic Object Pool manager that pre-instantiates combat entities on match load, achieving 0KB per-frame memory allocation."
      }
    ],
    technicalImplementation: "Developed in Unity using C# and Photon PUN2 / Photon Realtime. Utilizes ScriptableObjects for ship stats, weapon damage profiles, and armor values. UI animations and tactile feedback are driven by DOTween Pro.",
    contributions: [
      "Architected the Photon multiplayer networking loop and synchronized turns",
      "Engineered the server-authoritative shot verification protocol",
      "Built the object-pooled particle and sound management system",
      "Designed responsive HUD and turn-timer indicators with DOTween"
    ],
    technologies: ["Unity", "C#", "Photon Networking", "ScriptableObjects", "DOTween", "Object Pooling", "Git"],
    githubUrl: "https://github.com/amalthomas/battleship-multiplayer-unity",
    demoUrl: "#",
    videoPreview: "assets/images/battleship.jpg"
  },
  {
    id: "tower-defense",
    title: "Tower Defense",
    subtitle: "Strategic Defense with ScriptableObject Architecture & Object Pooling",
    genre: "3D / 2.5D Strategy & Tower Defense",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "Strategy", "C#", "AI", "Simulation"],
    role: "Gameplay & AI Systems Programmer",
    timeline: "Production Project",
    teamSize: "Core Development",
    heroImage: "assets/images/tower-defense.jpg",
    shortDescription: "A strategic tower defense game featuring modular upgrade trees, wave management via ScriptableObjects, high-volume creep object pooling, and intelligent heuristic target acquisition.",
    stats: {
      waveEngine: "ScriptableObject Configs",
      optimization: "Object Pooling (0 GC)",
      fps: "60 FPS on Mobile",
      platforms: "PC / Android / WebGL"
    },
    overview: "Built to demonstrate scalable gameplay architecture and performance optimization, players strategically place elemental and mechanical defense towers along branching enemy corridors to defend against scaling waves of hostile creeps.",
    features: [
      "Modular tower hierarchy (Tesla Coil, Ballista, Plasma Cannon) with branchable upgrade pathways",
      "Data-driven wave spawning architecture using Unity ScriptableObjects for rapid balance tuning",
      "High-performance enemy wave management supporting 100+ active creeps simultaneously without framerate drops",
      "Heuristic targeting AI allowing players to prioritize First, Closest, Strongest, or Weakest enemies",
      "Smooth radial upgrade menus and punchy damage feedback animations implemented via DOTween",
      "Automated NavMesh / waypoint navigation with dynamic obstacle re-routing"
    ],
    challenges: [
      {
        problem: "Instantiating and destroying hundreds of creeps and homing missiles per wave triggered frequent Garbage Collection spikes.",
        solution: "Engineered a high-capacity multi-type Object Pooling system that recycles enemies, projectiles, and particle bursts seamlessly."
      },
      {
        problem: "Balancing 25+ waves required constant code recompiles.",
        solution: "Abstracted all creep stats, spawn timings, and reward tables into custom ScriptableObject assets, enabling instant designer tweaks without recompilation."
      }
    ],
    technicalImplementation: "Programmed in C# using clean SOLID design principles. Event-driven architecture decouples tower attacks, creep health changes, and UI HUD updates. DOTween powers all upgrade radial menus and camera shakes.",
    contributions: [
      "Designed the complete ScriptableObject wave and tower data architecture",
      "Implemented creep pathfinding and heuristic target evaluation logic",
      "Engineered the generic object pooler for zero-allocation projectile physics",
      "Built polished UI shop and animated victory/defeat modals with DOTween"
    ],
    technologies: ["Unity", "C#", "ScriptableObjects", "DOTween", "Object Pooling", "NavMesh", "Event System"],
    githubUrl: "https://github.com/amalthomas/tower-defense-unity",
    demoUrl: "#",
    videoPreview: "assets/images/tower-defense.jpg"
  },
  {
    id: "first-person-shooter",
    title: "First-Person Shooter (FPS)",
    subtitle: "High-Octane 3D Tactical Combat Mechanics",
    genre: "3D Action / FPS",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "FPS", "C#", "AI", "Physics"],
    role: "Combat & Gameplay Systems Programmer",
    timeline: "Production Project",
    teamSize: "Core Development",
    heroImage: "assets/images/fps.jpg",
    shortDescription: "A 3D first-person shooter featuring visceral weapon handling, procedural weapon sway, recoil impulse physics, enemy combat AI, and locational damage systems.",
    stats: {
      fps: "60+ FPS",
      weapons: "Modular Weapon Framework",
      ai: "Finite State Machine AI",
      platforms: "PC / Steam"
    },
    overview: "Focused on AAA-level weapon responsiveness and immersive player feedback. Players engage hostile combat AI through dynamic urban environments utilizing precision aiming, recoil compensation, and tactical cover.",
    features: [
      "Modular weapon controller supporting assault rifles, shotguns, and precision sidearms",
      "Procedural spring-based weapon kickback recoil, camera shake, and ADS (Aim-Down-Sights) smoothing",
      "Enemy combat AI utilizing Finite State Machines (FSM) for patrol, alert, cover-seeking, and engage behaviors",
      "Raycast shooting mechanics with locational damage modifiers (headshots, torso, limb multipliers)",
      "Dynamic ammunition, reloading, and health pickup systems with custom spatial audio triggers",
      "Sleek holographic combat HUD displaying ammo count, health vitals, and hit markers"
    ],
    challenges: [
      {
        problem: "Weapon recoil felt stiff and unnatural when animated through standard keyframe clips.",
        solution: "Coded a procedural math spring damper in C# that computes physical kickback and rotational recovery dynamically relative to fire rate."
      },
      {
        problem: "Enemy AI bots would shoot through walls when losing line of sight.",
        solution: "Implemented raycast line-of-sight checks combined with alert decay timers so AI enemies remember last-seen player positions before investigating."
      }
    ],
    technicalImplementation: "Built in Unity with C#. Utilizes custom character controllers with smooth slope stepping, rigid body impact physics, and DOTween-driven UI reticles.",
    contributions: [
      "Authored the procedural recoil and weapon handling controllers",
      "Programmed the enemy AI state machines and sensory detection logic",
      "Implemented hit-scan ballistic calculations and damage event broadcasting",
      "Optimized lighting and draw-calls to guarantee buttery 60 FPS"
    ],
    technologies: ["Unity", "C#", "FSM Combat AI", "Raycasting", "DOTween", "Audio Spatializer"],
    githubUrl: "https://github.com/amalthomas/fps-tactical-unity",
    demoUrl: "#",
    videoPreview: "assets/images/fps.jpg"
  },
  {
    id: "flight-simulator",
    title: "Flight Simulator",
    subtitle: "Realistic 3D Aerodynamic Flight Physics",
    genre: "3D Flight Simulation",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "Simulation", "C#", "Physics"],
    role: "Aerodynamics & Flight Systems Programmer",
    timeline: "Production Project",
    teamSize: "Core Development",
    heroImage: "assets/images/flight-sim.jpg",
    shortDescription: "A 3D flight simulation featuring realistic aerodynamic physics (lift, drag, thrust, pitch, roll, yaw), dynamic cockpit flight telemetry, takeoff, and landing mechanics.",
    stats: {
      physics: "Component-Based Aerodynamics",
      telemetry: "Interactive Cockpit HUD",
      fps: "60 FPS Target",
      platforms: "PC / Gamepad / Flight Stick"
    },
    overview: "Engineered to capture authentic aviation physics, this simulator calculates real-time forces acting on aircraft surfaces based on airspeed, angle of attack, and atmospheric conditions.",
    features: [
      "Rigid body aerodynamic model calculating lift, induced drag, and banking moments",
      "Realistic throttle response curves, stall warnings, and Mach velocity scaling",
      "Functional heads-up display (HUD) with artificial horizon, airspeed ladder, altitude, and heading compass",
      "Support for keyboard, mouse flight, and dual-analog gamepad controllers with customizable deadzones",
      "Landing gear suspension physics with ground friction and wheel braking simulation",
      "Dynamic camera systems including third-person chase cam and immersive cockpit view"
    ],
    challenges: [
      {
        problem: "Standard physics timesteps caused rotational jitter during high-speed vertical climbs.",
        solution: "Decoupled aerodynamic torque computations into FixedUpdate sub-steps with smoothed rotational dampening."
      }
    ],
    technicalImplementation: "Authored in Unity using C# vector mathematics. Custom shaders render HUD flight director indicators, and physics are driven through standard Unity RigidBody forces.",
    contributions: [
      "Developed the aerodynamic force calculations and aircraft flight controller",
      "Engineered the artificial horizon and telemetry HUD using Unity UI",
      "Tuned landing gear suspension springs for smooth runway touchdowns"
    ],
    technologies: ["Unity", "C#", "RigidBody Physics", "Flight Telemetry", "Unity UI", "Mathf Aerodynamics"],
    githubUrl: "https://github.com/amalthomas/flight-simulator-unity",
    demoUrl: "#",
    videoPreview: "assets/images/flight-sim.jpg"
  },
  {
    id: "liquid-sort",
    title: "Liquid Sort Puzzle",
    subtitle: "Constraint-Based State Validation & Fluid Pouring Logic",
    genre: "2D/3D Casual Puzzle",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "2D", "Puzzle", "C#", "Algorithm"],
    role: "Lead Gameplay & Algorithm Programmer",
    timeline: "Production Title",
    teamSize: "Core Development",
    heroImage: "assets/images/liquid-sort.jpg",
    shortDescription: "A vibrant color-sorting puzzle game featuring constraint-based state validation algorithms, fluid pouring animations via DOTween, undo stack state management, and 100+ solvable levels.",
    stats: {
      algorithm: "Constraint State Validation",
      stateManagement: "Command Pattern (Undo/Redo)",
      fps: "120 FPS Target",
      platforms: "Mobile (Android/iOS) / WebGL"
    },
    overview: "Demonstrating mastery of algorithms and clean game state architecture, Liquid Sort challenges players to organize mixed colored liquids into uniform test tubes. Features an intelligent procedural level generator that guarantees every generated puzzle has a valid solution.",
    features: [
      "Constraint-based state validation and filtering algorithms eliminating unsolvable puzzle configurations",
      "Command Pattern implementation supporting infinite Undo and Redo states without memory leaks",
      "Smooth fluid pouring mechanics with dynamic tilt angles and surface ripple animations powered by DOTween",
      "Procedural puzzle generation system scaling difficulty through color varieties and tube counts",
      "Celebratory particle effects, haptic vibration triggers, and responsive sound feedback",
      "Mobile-optimized touch interactions with swipe selection and tube highlighting"
    ],
    challenges: [
      {
        problem: "Random procedural generation occasionally created unsolvable dead-end tube configurations.",
        solution: "Designed and implemented constraint-based reverse-simulation algorithms that generate levels by starting from the solved state and applying legal reverse-pour operations."
      }
    ],
    technicalImplementation: "Crafted in Unity with C#. Utilizes custom shaders for fluid fill height and surface angles. DOTween governs all tube tilting, lifting, and fluid stream animations.",
    contributions: [
      "Designed and coded the constraint-based procedural level generation algorithm",
      "Architected the Command Pattern undo/redo state management system",
      "Implemented the fluid shader and DOTween pouring motion sequencing",
      "Optimized mobile render batches for ultra-low battery consumption"
    ],
    technologies: ["Unity", "C#", "Algorithms", "Command Pattern", "DOTween", "Mobile Optimization", "Shaders"],
    githubUrl: "https://github.com/amalthomas/liquid-sort-puzzle-unity",
    demoUrl: "#",
    videoPreview: "assets/images/liquid-sort.jpg"
  },
  {
    id: "rocket-launcher-combat",
    title: "Rocket Launcher Combat",
    subtitle: "Explosive Projectile Physics & Damage Radius Systems",
    genre: "3D Action Prototype",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "FPS", "C#", "Physics"],
    role: "Combat & Physics Programmer",
    timeline: "Production Prototype",
    teamSize: "Core Development",
    heroImage: "assets/images/rocket-combat.jpg",
    shortDescription: "A high-impact combat prototype featuring propelled rocket projectile physics, target acquisition, explosive blast radius falloff, and destructive particle shockwaves.",
    stats: {
      physics: "Ballistic Projectiles",
      damageModel: "Radial Blast Falloff",
      fps: "60 FPS Locked",
      platforms: "PC / Steam"
    },
    overview: "Built to demonstrate satisfying explosive combat feel, this game features missile flight dynamics, smoke particle ribbons, radial impulse knockback, and impact damage falloff.",
    features: [
      "Accelerating rocket booster physics with smoke exhaust particle ribbons",
      "Radial splash damage calculations with raycasted obstruction checks",
      "Target lock-on reticle with distance tracking and audio missile beeps",
      "Physics knockback impulses tossing enemy rigidbodies and environmental props",
      "Screen shake camera impulse and dynamic audio low-pass filtering on detonation"
    ],
    challenges: [
      {
        problem: "Explosion splash damage was penetrating solid barriers unfairly.",
        solution: "Engineered multi-raycast occlusion checks from detonation epicenter to all actors in blast radius."
      }
    ],
    technicalImplementation: "Developed in Unity with C#, leveraging custom physics colliders and particle systems. Object pooling ensures steady framerates during continuous rapid rocket fire.",
    contributions: [
      "Programmed missile trajectory and booster acceleration mechanics",
      "Coded radial blast damage falloff and physical impulse propagation",
      "Created target locking reticle HUD and audio feedback triggers"
    ],
    technologies: ["Unity", "C#", "Physics Simulation", "Particle Systems", "Object Pooling", "DOTween"],
    githubUrl: "https://github.com/amalthomas/rocket-launcher-combat-unity",
    demoUrl: "#",
    videoPreview: "assets/images/rocket-combat.jpg"
  }
];

// Helper to get project by ID
function getProjectById(id) {
  return PROJECTS_DATA.find(p => p.id === id);
}

// Export for module or global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROJECTS_DATA, getProjectById };
}
