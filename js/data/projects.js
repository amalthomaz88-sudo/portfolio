/**
 * Game Developer Portfolio - Projects Structured Data
 * Featured projects developed by Amal Thomas (Unity Game Developer)
 * Exact portfolio list:
 * 1. Cars of Voice
 * 2. Solitaire Collection
 * 3. Fruits 3D
 * 4. Battleship 2D
 * 5. Tower Defense
 * 6. Liquid Sort
 * 7. First-Person Shooter(FPS)
 * 8. Flight Simulator
 * 9. Rocket Launcher
 */

const PROJECTS_DATA = [
  {
    id: "cars-of-voice",
    title: "Cars of Voice",
    subtitle: "Voice-Controlled Arcade Racing Challenge • Microphone-Driven Physics",
    genre: "Arcade Racing / Voice-Controlled Physics",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "Racing", "C#", "Audio", "Mobile"],
    role: "Audio Systems & Vehicle Physics Developer",
    timeline: "Production Title (v2.6 on Google Play)",
    teamSize: "Core Development",
    shortDescription: "The ultimate voice-controlled arcade racing challenge where your voice is your accelerator and silence is your brake! Features real-time vocal soundwave visualizers, ramp jumps, gap hopping, and custom vehicle physics on Google Play.",
    stats: {
      voiceControl: "Mic Decibel & Soundwave Analyzer",
      gameplay: "Voice Throttle / Silence Brake",
      version: "Version 2.6 on Google Play",
      platforms: "Android (Google Play) / Mobile",
      fps: "60 FPS Locked"
    },
    overview: "Published on Google Play (v2.6), Cars of Voice is an innovative arcade racing game where players put down the steering wheel and drive using only their voice! The louder players speak or shout, the faster their vehicle accelerates—powering over ramps and leaping across wide gaps. Remaining completely silent triggers instant braking and drifting around tight hairpin turns and obstacle courses.",
    features: [
      "Unique Voice-Control Engine: Zero touch driving—continuous microphone decibel analysis maps vocal energy directly to engine acceleration",
      "Dynamic Voice Boost Mechanics: Shouting triggers maximum velocity boosts to launch over ramps and clear perilous gaps",
      "Silence Brake & Drift System: Immediate vehicle deceleration and drift cornering triggered by vocal silence",
      "Real-Time Reactive Soundwave UI: Animated vocal waveform visualizer rendering live microphone input levels",
      "Garage & Vehicle Customization: Collectible in-game coins unlock a fleet of specialized cars with distinct speeds, weights, and suspension physics",
      "Customizable Sci-Fi HUD Themes: Visual HUD presets including Cyber Neon, Retro Arcade, Minimal Modern, and SciFi HUD",
      "Acrobatic Track Level Design: Challenging obstacle courses packed with loop-the-loops, jump ramps, speed boost pads, and hazard traps",
      "Celebratory 3-Star Victory Screens: Dynamic level-end scoring with celebratory confetti particle bursts and offline play support"
    ],
    challenges: [
      {
        problem: "Background environmental noise and microphone sensitivity variance across diverse Android devices caused accidental throttle triggers.",
        solution: "Engineered dynamic noise floor calibration with adaptive threshold filtering and microphone gain normalizers, ensuring clean voice-to-throttle responsiveness across all mobile hardware."
      },
      {
        problem: "Smoothly translating volatile microphone decibel spikes into natural, responsive car acceleration without jarring physics jerky jumps.",
        solution: "Implemented an exponential moving average (EMA) dampener and smooth interpolation curve on vocal input vectors, yielding fluid engine torque curves and satisfying weight transfer."
      }
    ],
    technicalImplementation: "Developed in Unity and C#. Microphone audio streams are captured via Unity's Microphone API into cyclic audio buffers. Decibel and amplitude values are processed in real time and smoothed before driving custom 2D/3D vehicle physics. Custom shaders power the reactive soundwave HUD, and ScriptableObjects manage the multi-car garage attributes and level progression.",
    contributions: [
      "Architected the core microphone audio analyzer and decibel-to-throttle input mapping system",
      "Engineered the vehicle physics controller with dynamic voice acceleration and silence-activated braking",
      "Designed the reactive soundwave UI visualizer and customizable Sci-Fi HUD themes",
      "Optimized performance for solid 60 FPS gameplay and seamless offline play across Android devices"
    ],
    technologies: ["Unity", "C#", "Microphone API", "Audio DSP", "Vehicle Physics", "Particle Systems", "DOTween", "Android SDK"],
    githubUrl: "https://github.com/amalthomaz88-sudo/cars-of-voice-unity",
    demoUrl: "#"
  },
  {
    id: "solitaire-collection",
    title: "Solitaire Collection",
    subtitle: "Comprehensive Classic Card Game Suite with Command Pattern Undo",
    genre: "2D Card & Board / Casual",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "2D", "Puzzle", "C#", "Architecture"],
    role: "Lead Gameplay Programmer & Systems Architect",
    timeline: "Production Title",
    teamSize: "Core Development",
    shortDescription: "A polished Solitaire card collection featuring Klondike, Spider, and FreeCell with drag-and-drop physics, auto-complete solvers, infinite undo/redo, and festive win particle cascades.",
    stats: {
      architecture: "Command Pattern (Infinite Undo)",
      deckEngine: "Fisher-Yates Shuffle",
      fps: "120 FPS Mobile",
      platforms: "Android / iOS / PC"
    },
    overview: "Built to provide a smooth, responsive, and visually rewarding card gameplay experience. Features clean separation between card deck state representations, drag-and-drop collision sorting, foundation rule evaluators, and particle cascades.",
    features: [
      "Multiple Solitaire modes including Klondike (Draw 1 / Draw 3), Spider, and FreeCell",
      "Fisher-Yates cryptographically-fair deck shuffling with solvable deal validation",
      "Full Command Pattern architecture supporting limitless step-by-step undo and redo operations",
      "Smart auto-complete solver detecting when remaining cards can be seamlessly transferred to foundation piles",
      "Tactile card drag-and-drop physics with dynamic depth sorting and snap-to-column animations via DOTween",
      "Vibrant celebratory victory particle fireworks and card bouncing cascades"
    ],
    challenges: [
      {
        problem: "Rapid consecutive card taps during animations caused desynchronized tableau states.",
        solution: "Implemented an input locking state machine that queues user tap commands until ongoing DOTween card translation tweens complete cleanly."
      }
    ],
    technicalImplementation: "Developed in Unity with modular C# interfaces (ICardRule, IDeckShuffler, ICommand). High-performance UI canvas batching prevents overdraw spikes on low-end mobile devices.",
    contributions: [
      "Architected the card game rule evaluation engine and foundation state validation",
      "Engineered the Command Pattern undo/redo manager with zero heap allocation",
      "Implemented smooth card drag-drop mechanics and win cascade physics"
    ],
    technologies: ["Unity", "C#", "Command Pattern", "DOTween", "Canvas Optimization", "OOP Architecture"],
    githubUrl: "https://github.com/amalthomaz88-sudo/solitaire-collection-unity",
    demoUrl: "#"
  },
  {
    id: "fruit-game",
    title: "Fruits 3D",
    subtitle: "3D Physics Fruit Drop & Watermelon Merge Evolution Puzzle",
    genre: "3D Casual Physics & Merge Puzzle",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "Physics", "Casual", "C#", "DOTween"],
    role: "Lead Gameplay & Physics Developer",
    timeline: "Production Project",
    teamSize: "Core Development",
    shortDescription: "A vibrant 3D physics-driven watermelon merge puzzle game where players drop expressive fruits into a container chute. Features real-time Rigidbody physics, dynamic collision merging, multi-tier evolution hierarchy, and combo score multipliers.",
    stats: {
      mergeEngine: "Tiered Evolution FSM",
      physics: "3D Rigidbodies & Colliders",
      fps: "60 FPS on Mobile",
      platforms: "Android / iOS / WebGL"
    },
    overview: "Built with Unity and C#, Fruits 3D is a physics-driven merge puzzle inspired by Suika-style mechanics. Players aim and drop 3D fruit spheres with expressive facial animations into a containment chute. When two identical fruits collide, they merge into the next tier of the evolution cycle (from tiny Cherries up to massive Watermelons and Golden Chests) accompanied by satisfying physics pop impulses and juicy DOTween particle celebrations.",
    features: [
      "Interactive top fruit dropper with precision aim guide and dotted trajectory line",
      "3D Rigidbody physics with custom PhysicMaterial friction and restitution for organic rolling & stacking",
      "Tiered evolution cycle state machine advancing matching fruits from Cherries to Watermelons and Golden Chests",
      "Circular HUD evolution wheel displaying the active merge hierarchy and next-fruit preview",
      "Dynamic merge collision detection spawning upgraded fruit at exact impact midpoints with DOTween punch scale",
      "Container ceiling boundary sensor triggering danger alerts and game over fail-state on overflow"
    ],
    challenges: [
      {
        problem: "Rapid multi-fruit collisions could cause duplicate merge triggers and race conditions in physics ticks.",
        solution: "Implemented an atomic merge lock with state validation on collision contact, ensuring only one promotion event fires per pair and pooling instantiations without GC spikes."
      },
      {
        problem: "Fruits clipping through walls during high-velocity dropping.",
        solution: "Switched container and fruit colliders to Continuous Speculative collision detection with tuned solver iterations for rock-solid stability."
      }
    ],
    technicalImplementation: "Engineered in Unity using C# and 3D Rigidbody physics. Collision events trigger an atomic evolution controller that calculates the centroid of both colliding spheres, recycles them via an Object Pooler, and instantiates the upgraded fruit with an upward velocity burst and DOTween pop. A circular UI shader and ScriptableObject hierarchy define the fruit progression tree.",
    contributions: [
      "Architected the 3D physics dropper mechanics, aim trajectory guideline, and container collision physics",
      "Built the tiered merge evolution state machine and circular HUD cycle indicator",
      "Engineered atomic collision validation preventing race conditions during chain merges",
      "Implemented juicy DOTween juice bursts, pop animations, and sound effects"
    ],
    technologies: ["Unity", "C#", "3D Physics", "Rigidbodies", "PhysicMaterial", "DOTween", "ScriptableObjects", "Object Pooling"],
    githubUrl: "https://github.com/amalthomaz88-sudo/fruits-3d-unity",
    demoUrl: "#"
  },
  {
    id: "battleship-2d",
    title: "Battleship 2D",
    subtitle: "Classic Single-Player Naval Grid Tactics with Heuristic Hunt-and-Target AI",
    genre: "2D Strategy & Board Game",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "2D", "Strategy", "C#", "AI"],
    role: "Gameplay & AI Developer",
    timeline: "Production Project",
    teamSize: "Core Development",
    shortDescription: "A classic 10x10 2D naval warfare tactical game featuring strategic fleet placement, fog-of-war reveal mechanics, and an intelligent Hunt-and-Target heuristic opponent AI that calculates probability densities.",
    stats: {
      aiEngine: "Hunt & Target Probability Map",
      gridLogic: "10x10 Matrix State Machine",
      fps: "60 FPS",
      platforms: "PC / Mobile / WebGL"
    },
    overview: "A refined single-player adaptation of classic grid naval warfare. Players deploy their fleet on a 10x10 coordinate matrix and take turns firing coordinate artillery strikes against an intelligent AI that uses mathematical probability density maps to track and sink ships.",
    features: [
      "10x10 coordinate grid matrix with ship overlap validation and boundary constraint checks",
      "Intelligent Hunt-and-Target heuristic AI: switches between parity hunting and directional target tracking upon scoring a hit",
      "Dynamic fog-of-war tiles with tactile hit (explosive fire) and miss (water splash) animations via DOTween",
      "Fleet placement phase supporting manual drag-rotate positioning and instant randomized auto-layout",
      "Detailed combat statistics: accuracy percentage, turns to victory, and streak records",
      "Responsive 2D layout scaling smoothly across mobile portrait and desktop screens"
    ],
    challenges: [
      {
        problem: "Pure random AI shooting was trivial to beat and lacked challenge.",
        solution: "Implemented a checkerboard parity search pattern combined with a probability density matrix that calculates remaining ship dimensions to choose the mathematically optimal next strike."
      }
    ],
    technicalImplementation: "Programmed in Unity using C# 2D grid arrays. State machine cleanly orchestrates Placement Phase, Player Turn, AI Computation, and End Match. DOTween drives all grid tile flips and shake animations.",
    contributions: [
      "Programmed the Hunt-and-Target probability density AI algorithms",
      "Engineered the 2D grid matrix state machine and coordinate validation logic",
      "Designed the responsive UI, placement drag-rotation, and hit-effect animations"
    ],
    technologies: ["Unity", "C#", "AI Algorithms", "Probability Mapping", "DOTween", "2D Grid Arrays"],
    githubUrl: "https://github.com/amalthomaz88-sudo/battleship-2d-unity",
    demoUrl: "#"
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
    githubUrl: "https://github.com/amalthomaz88-sudo/tower-defense-unity",
    demoUrl: "#"
  },
  {
    id: "liquid-sort",
    title: "Liquid Sort",
    subtitle: "Constraint-Based State Validation & Fluid Pouring Logic",
    genre: "2D Casual Puzzle",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "2D", "Puzzle", "C#", "Algorithm"],
    role: "Lead Gameplay & Algorithm Programmer",
    timeline: "Production Title",
    teamSize: "Core Development",
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
    githubUrl: "https://github.com/amalthomaz88-sudo/liquid-sort-puzzle-unity",
    demoUrl: "#"
  },
  {
    id: "first-person-shooter",
    title: "First-Person Shooter(FPS)",
    subtitle: "High-Octane 3D Tactical Combat Mechanics",
    genre: "3D Action / FPS",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "FPS", "C#", "AI", "Physics"],
    role: "Combat & Gameplay Systems Programmer",
    timeline: "Production Project",
    teamSize: "Core Development",
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
    githubUrl: "https://github.com/amalthomaz88-sudo/fps-tactical-unity",
    demoUrl: "#"
  },
  {
    id: "flight-simulator",
    title: "Flight Simulator",
    subtitle: "Realistic 3D Aerodynamic Flight Physics & Avionics",
    genre: "3D Flight Simulation",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "Simulation", "C#", "Physics"],
    role: "Aerodynamics & Flight Systems Programmer",
    timeline: "Production Project",
    teamSize: "Core Development",
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
    githubUrl: "https://github.com/amalthomaz88-sudo/flight-simulator-unity",
    demoUrl: "#"
  },
  {
    id: "rocket-launcher",
    title: "Rocket Launcher",
    subtitle: "Explosive Projectile Physics & Blast Radius Systems",
    genre: "3D Action Combat",
    engine: "Unity",
    engineType: "unity",
    tags: ["Unity", "3D", "FPS", "C#", "Physics"],
    role: "Combat & Physics Programmer",
    timeline: "Production Prototype",
    teamSize: "Core Development",
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
    githubUrl: "https://github.com/amalthomaz88-sudo/rocket-launcher-combat-unity",
    demoUrl: "#"
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
