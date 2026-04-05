/** NEXUS robot catalog — shared across showcase, detail, shop, builder */
export const ROBOTS = [
  {
    id: "titan-x7",
    name: "TITAN-X7",
    category: "Industrial",
    badgeClass: "badge--industrial",
    tagline: "Heavy-duty autonomy for high-throughput production lines.",
    description:
      "TITAN-X7 delivers industrial-grade strength with adaptive AI that reconfigures workflows in real time. Built for factories that cannot afford downtime.",
    shortBlurb: "Heavy payload automation for factories",
    features: ["6-Axis Arms", "500kg Payload", "Real-time Vision"],
    image: "assets/robots/titan-x7.png",
    price: 124900,
    specs: {
      aiLevel: "NEXUS-7 Reasoning",
      sensors: "LiDAR + 12MP stereo",
      speed: "2.8 m/s max traverse",
      weight: "1,240 kg",
      battery: "Hot-swap modular",
      connectivity: "5G + Private LTE",
    },
    howItWorks: [
      { title: "Sense", text: "Fused perception maps the cell and tracks payloads with sub-centimeter stability." },
      { title: "Plan", text: "Edge AI selects collision-free motions and optimizes cycle time continuously." },
      { title: "Execute", text: "Closed-loop control holds force limits while coordinating dual-arm tasks." },
    ],
    useCases: [
      { icon: "⚙", title: "Automotive welding", text: "Synchronized lines with vision-verified seam quality." },
      { icon: "📦", title: "Palletizing", text: "Mixed-SKU stacking with weight-aware grasp planning." },
      { icon: "🏭", title: "Heavy assembly", text: "500 kg payloads with human-aware safety zones." },
    ],
    shopQuick: ["500 kg class V", "12-camera perception", "OPC-UA ready"],
  },
  {
    id: "aura-3",
    name: "AURA-3",
    category: "Service",
    badgeClass: "badge--service",
    tagline: "Hospitality-grade presence with whisper-quiet navigation.",
    description:
      "AURA-3 glides through busy spaces, understands intent, and coordinates with building systems. Ideal for hotels, campuses, and premium retail.",
    shortBlurb: "Intelligent hospitality and delivery robot",
    features: ["NLP Voice", "Autonomous Nav", "12hr Battery"],
    image: "assets/robots/aura-3.png",
    price: 48900,
    specs: {
      aiLevel: "NEXUS-5 Dialog",
      sensors: "360° depth + mic array",
      speed: "1.6 m/s cruise",
      weight: "86 kg",
      battery: "12 hr mixed-use",
      connectivity: "Wi‑Fi 6E + BLE",
    },
    howItWorks: [
      { title: "Listen", text: "Far-field voice locks onto the speaker and filters background chatter." },
      { title: "Navigate", text: "Socially aware pathing yields in crowds and respects lane etiquette." },
      { title: "Deliver", text: "Secure compartment releases only to the verified recipient." },
    ],
    useCases: [
      { icon: "🏨", title: "Concierge", text: "Answers FAQs, guides guests, and escalates to staff when needed." },
      { icon: "☕", title: "In-room delivery", text: "Quiet night runs with elevator integration." },
      { icon: "🛒", title: "Retail assist", text: "Product lookup and cart handoff at the lane." },
    ],
    shopQuick: ["Social navigation", "Dual-band comms", "Tamper-evident bay"],
  },
  {
    id: "medix-9",
    name: "MEDIX-9",
    category: "Medical",
    badgeClass: "badge--medical",
    tagline: "Sub-millimeter assistance inside sterile workflows.",
    description:
      "MEDIX-9 pairs surgeon intent with instrument stability. Sterile envelopes, audit trails, and diagnostic overlays keep teams aligned.",
    shortBlurb: "Precision surgical assistance robot",
    features: ["0.01mm Precision", "Sterile Mode", "AI Diagnostics"],
    image: "assets/robots/medix-9.png",
    price: 198500,
    specs: {
      aiLevel: "NEXUS-8 Clinical",
      sensors: "4K stereo + EM tracking",
      speed: "0.4 m/s instrument tip",
      weight: "420 kg base",
      battery: "UPS + 6 hr ops",
      connectivity: "Hospital VLAN + HL7",
    },
    howItWorks: [
      { title: "Calibrate", text: "Optical and EM fusion registers tools to the patient frame in seconds." },
      { title: "Assist", text: "Hands-on scaling filters tremor while preserving surgeon authority." },
      { title: "Record", text: "Immutable logs support outcomes research and compliance review." },
    ],
    useCases: [
      { icon: "🧠", title: "Neuro navigation", text: "Trajectory plans with real-time overlay alignment." },
      { icon: "🦴", title: "Orthopedic cuts", text: "Guarded milling within pre-approved envelopes." },
      { icon: "🔬", title: "Training labs", text: "Replayable sessions for resident skill development." },
    ],
    shopQuick: ["IEC 60601 aligned", "HEPA-ready shroud", "Audit-grade logging"],
  },
  {
    id: "companion-1",
    name: "COMPANION-1",
    category: "Personal",
    badgeClass: "badge--personal",
    tagline: "A home robot that learns your rhythms, not your passwords.",
    description:
      "COMPANION-1 blends emotion-aware dialogue with safe mobility at home. Privacy-first processing keeps recognition on-device when you choose.",
    shortBlurb: "Your adaptive personal AI robot",
    features: ["Emotion AI", "Face Recognize", "Daily Learning"],
    image: "assets/robots/companion-1.png",
    price: 12900,
    specs: {
      aiLevel: "NEXUS-4 Home",
      sensors: "RGB-D + thermal (opt-in)",
      speed: "1.1 m/s indoor",
      weight: "22 kg",
      battery: "8 hr active",
      connectivity: "Thread + Matter",
    },
    howItWorks: [
      { title: "Recognize", text: "On-device embeddings identify household members you approve." },
      { title: "Adapt", text: "Routines improve from gentle feedback—no raw audio leaves your home." },
      { title: "Support", text: "Proactive reminders and gentle coaching stay context-aware." },
    ],
    useCases: [
      { icon: "🏠", title: "Daily routines", text: "Lights, climate, and schedules coordinated with mood cues." },
      { icon: "👴", title: "Wellness check-ins", text: "Discreet prompts for medication and mobility." },
      { icon: "🎓", title: "Learning partner", text: "Kids get Socratic hints instead of flat answers." },
    ],
    shopQuick: ["On-device privacy tier", "Lift-safe 22 kg", "Whole-home mapping"],
  },
  {
    id: "sentinel-x5",
    name: "SENTINEL-X5",
    category: "Security",
    badgeClass: "badge--industrial",
    tagline: "Uncompromising perimeter defense and autonomous risk mitigation.",
    description: "SENTINEL-X5 patrols heavy industrial sites, detects anomalies instantly using dual-spectrum tracking, and initiates lockdown protocols without human intervention.",
    shortBlurb: "Heavy-duty autonomous perimeter security robot",
    features: ["Thermal Tracking", "All-Terrain", "Instant Lockdown"],
    image: "assets/robots/sentinel-x5.png",
    price: 85200,
    specs: {
      aiLevel: "NEXUS-8 ThreatID",
      sensors: "Thermal + RGB + Ultrasonic",
      speed: "3.5 m/s off-road",
      weight: "680 kg",
      battery: "16 hr patrol",
      connectivity: "Encrypted 5G"
    },
    howItWorks: [
      { title: "Patrol", text: "Maps the sector continuously adjusting for obstacles." },
      { title: "Identify", text: "Thermal algorithms instantly classify moving signatures." },
      { title: "Respond", text: "Emits warnings and locks down gates automatically." }
    ],
    useCases: [
      { icon: "🛡️", title: "Site Security", text: "Night-time factory and lot surveillance." },
      { icon: "🚧", title: "Hazard Zoning", text: "Detects structural faults and human trespassing." },
      { icon: "🚨", title: "First Response", text: "Triggers silent alarms direct to headquarters." }
    ],
    shopQuick: ["Dual-spectrum vision", "Military-grade chassis", "Long-range comms"]
  },
  {
    id: "terra-9",
    name: "TERRA-9",
    category: "Agricultural",
    badgeClass: "badge--medical",
    tagline: "Precision farming and eco-monitoring at an unprecedented scale.",
    description: "TERRA-9 is designed for modern smart farms, capable of monitoring soil moisture, identifying failing crops, and precisely harvesting delicate yields autonomously.",
    shortBlurb: "Sustainable robotic agriculture assistant",
    features: ["Soil Scanners", "Gentle Harvest", "Solar Assisted"],
    image: "assets/robots/terra-9.png",
    price: 52400,
    specs: {
      aiLevel: "NEXUS-6 AgriLogic",
      sensors: "Spectral camera + Humistor",
      speed: "1.2 m/s field speed",
      weight: "185 kg",
      battery: "Solar + 10 hr swap",
      connectivity: "LoRaWAN + Wi-Fi"
    },
    howItWorks: [
      { title: "Scan", text: "Spectral imaging detects crop disease before it's visible." },
      { title: "Nurture", text: "Targeted micro-doses of water and nutrients." },
      { title: "Harvest", text: "Soft silicone grips pick fragile fruits without bruising." }
    ],
    useCases: [
      { icon: "🌱", title: "Crop Maint.", text: "Autonomously weeds and aerates soil." },
      { icon: "💧", title: "Irrigation", text: "Monitors and balances field hydration levels." },
      { icon: "🍎", title: "Harvesting", text: "24/7 continuous low-impact picking." }
    ],
    shopQuick: ["Solar trickling", "Soft-grip manipulators", "Weatherproof"]
  },
  {
    id: "astro-v",
    name: "ASTRO-V",
    category: "Exploration",
    badgeClass: "badge--service",
    tagline: "Pushing the boundaries of subterranean and orbital frontiers.",
    description: "Built for environments humans cannot survive. ASTRO-V maps cave systems, survives extreme temperatures, and deploys cosmic sensors with zero gravity algorithms.",
    shortBlurb: "Extreme-environment exploration robotics",
    features: ["Cosmic Sensors", "Temp Resistant", "LIDAR Mapping"],
    image: "assets/robots/astro-v.png",
    price: 340000,
    specs: {
      aiLevel: "NEXUS-9 Navigational",
      sensors: "High-res LIDAR + Rad detect",
      speed: "0.8 m/s rough surface",
      weight: "240 kg",
      battery: "Atomic decay thermal generator",
      connectivity: "Satellite uplink"
    },
    howItWorks: [
      { title: "Deploy", text: "Air-dropped or land-rover launched into hostile zones." },
      { title: "Map", text: "Generates point-cloud models of completely dark areas." },
      { title: "Report", text: "Pings low-bandwidth telemetry back via satellite." }
    ],
    useCases: [
      { icon: "🌋", title: "Cave Mapping", text: "Deep subterranean structural scanning." },
      { icon: "🛰️", title: "Space Deploy", text: "Microgravity manipulation on orbital platforms." },
      { icon: "🌡️", title: "Hazmat Recon", text: "Operates in nuclear or extreme heat disaster zones." }
    ],
    shopQuick: ["Radiation shielded", "Satellite uplink", "Zero-G mode"]
  },
  {
    id: "mentor-ai",
    name: "MENTOR-AI",
    category: "Education",
    badgeClass: "badge--personal",
    tagline: "Inspiring the next generation with interactive, empathic learning.",
    description: "A softly designed humanoid tutor that reads classroom engagement, adapts lesson pacing, and provides safe, judgment-free 1-on-1 coaching for students.",
    shortBlurb: "Emotionally intelligent interactive classroom tutor",
    features: ["Face Tracking", "Adaptive Pacing", "Safe Touch"],
    image: "assets/robots/mentor-ai.png",
    price: 18500,
    specs: {
      aiLevel: "NEXUS-5 Pedagogy",
      sensors: "Stereo camera + emotion AI",
      speed: "0.5 m/s",
      weight: "45 kg",
      battery: "14 hr school day",
      connectivity: "Wi-Fi 6"
    },
    howItWorks: [
      { title: "Observe", text: "Detects signs of confusion or boredom in students." },
      { title: "Adapt", text: "Switches explanations or suggests interactive games." },
      { title: "Engage", text: "Uses expressive face display to build emotional rapport." }
    ],
    useCases: [
      { icon: "🏫", title: "Classrooms", text: "Acts as a teacher's assistant for group activities." },
      { icon: "📖", title: "Special Ed", text: "Patient, repetitive learning for neurodivergent kids." },
      { icon: "🗣️", title: "Language", text: "Immersive 1-on-1 conversational practice." }
    ],
    shopQuick: ["Soft-touch plastics", "Curriculum synced", "Child-safe"]
  }
];

export function getRobotById(id) {
  return ROBOTS.find((r) => r.id === id);
}

export function formatPrice(n) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}
