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
    image: "assets/robots/titan-x7.svg",
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
    image: "assets/robots/aura-3.svg",
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
    image: "assets/robots/medix-9.svg",
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
    image: "assets/robots/companion-1.svg",
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
];

export function getRobotById(id) {
  return ROBOTS.find((r) => r.id === id);
}

export function formatPrice(n) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}
