export const OPPORTUNITY_LINE =
  "Looking for an R&D team where my next robot gets built, tested and deployed.";

export const CONTACT = {
  name: "Raj Mahajan",
  role: "AI & Robotics",
  email: "rajmahajan.work@gmail.com",
  phone: "+91 93223 01053",
  location: "Pune, Maharashtra, India",
  linkedin: "https://linkedin.com/in/rajmahajan2151",
  github: "https://github.com/RajMahajan-Dev",
  scholar: "https://scholar.google.com/citations?user=qhqS3HkAAAAJ",
  orcid: "https://orcid.org/0009-0008-6424-3331",
  cv: "/Raj_Mahajan_CV.pdf",
};

export type Project = {
  name: string;
  period: string;
  funded?: string;
  desc: string;
  keyImpl: string;
  skills: string[];
  github?: string;
  liveApp?: string;
  showcased?: string[];
};

export const TOP_PROJECTS: Project[] = [
  {
    name: "Autonomous Cleaning Robot",
    period: "Oct 2025 – Present",
    funded: "SVR Robotics — USD $1,200",
    desc: "Commercial AI-enabled autonomous indoor robot with real-time navigation, perception, and intelligent decision-making for real-world deployment.",
    keyImpl:
      "ROS2 + SLAM on Raspberry Pi for real-time 2D mapping and localization, combined with YOLO-based ML perception and OpenCV obstacle detection.",
    skills: ["Python", "ROS2", "SLAM", "Raspberry Pi", "OpenCV", "YOLO", "Sensor Fusion", "Pseudo-LiDAR", "CAD", "PCB Design"],
  },
  {
    name: "RehaBot — AI Rehabilitation Assistant",
    period: "Jun 2025 – Nov 2025",
    desc: "AI-based rehabilitation assistant that generates personalized exercise plans through LLM analysis of injury type, mobility level, and recovery goals.",
    keyImpl:
      "LLM-powered recommendation engine that dynamically adapts rehabilitation plans from user-specific health inputs in real time.",
    skills: ["Python", "LLM APIs", "NLP", "Agentic AI", "Flask", "Workflow Automation", "Data Processing"],
    github: "https://github.com/RajMahajan-Dev/RehaBot-AI",
  },
  {
    name: "Automated Waste Sorting System",
    period: "Jun 2025 – Nov 2025",
    desc: "Industrial-grade automated system for intelligent waste segregation using multi-sensor fusion and PLC-controlled pneumatic actuation with 92% sorting accuracy.",
    keyImpl:
      "Multi-sensor fusion (inductive, capacitive, laser + vision) classifying materials at 92% accuracy with digital-twin monitoring.",
    skills: ["PLC Programming", "Sensor Fusion", "Computer Vision", "SCADA", "Pneumatics", "Python", "Industrial Automation"],
    showcased: ["Janatics Automation Skill Challenge — Top 12 of 2,000 Teams"],
  },
  {
    name: "CoBot Palletizing System",
    period: "Feb 2025 – Apr 2025",
    desc: "Vision-assisted palletizing simulation using TM-900 CoBot with integrated visual feedback for industrial pick-and-place automation, reducing cycle time by 18%.",
    keyImpl:
      "Visual feedback integrated into RoboDK + MATLAB motion planning pipeline, cutting cycle time by 18% through vision-guided control.",
    skills: ["RoboDK", "MATLAB", "TM-900 CoBot", "Vision Systems", "Motion Planning", "Industrial Automation"],
  },
  {
    name: "Rover Ripe",
    period: "Aug 2024 – Jan 2025",
    desc: "ML-powered computer vision system for real-time fruit ripeness detection — reduced manual inspection by 85% and boosted agricultural productivity by 12%.",
    keyImpl:
      "YOLO detection model trained on Roboflow, deployed on microcontroller for real-time on-device fruit ripeness classification.",
    skills: ["Python", "YOLO", "Computer Vision", "TensorFlow", "Roboflow", "CNN", "Image Preprocessing", "ML Deployment"],
  },
  {
    name: "Bike Landing Gear Mechanism",
    period: "Dec 2025 – Feb 2026",
    desc: "End-to-end 3D prototyping of a retractable bike landing gear mechanism — from concept to physical Phase 1 prototype.",
    keyImpl:
      "Full mechanical assembly and electronic flow design for landing gear actuation; printed with Bambu Lab P1S with AMS multi-material for functional parts.",
    skills: ["Bambu Lab P1S", "AMS Multi-material", "FDM Printing", "CAD", "Mechanical Design", "Electronic Flow", "Tolerancing"],
  },
];

export const MORE_PROJECTS: Project[] = [
  {
    name: "PayMitra Finance",
    period: "Nov 2025 – Dec 2025",
    desc: "A personal finance app that uses AI to analyze loan strategies, compare financial options, and intelligently track expenses for smarter money decisions.",
    keyImpl:
      "AI-based financial strategy pipeline using Python + LLM APIs for autonomous loan comparison and decision support, backed by Flask + MongoDB + JWT.",
    skills: ["Python", "Flask", "MongoDB", "JWT Auth", "LLM APIs", "NLP", "REST APIs"],
    github: "https://github.com/RajMahajan-Dev/PayMitra-Finance-Advisor",
    showcased: ["Mumbai Hacks AI Hackathon — Fintech Track Finalist"],
  },
  {
    name: "HomeZen — Household Services Platform",
    period: "Sep 2024 – Oct 2024",
    desc: "Full-stack household services platform enabling users to discover, book, and manage services like cleaning, tutoring, and childcare.",
    keyImpl:
      "Scalable Flask-based backend with REST APIs, role-based authentication, and SQLAlchemy ORM, combined with a responsive Bootstrap UI.",
    skills: ["Flask", "SQLAlchemy", "SQLite", "HTML5", "Bootstrap 5", "REST APIs", "Authentication"],
  },
  {
    name: "Ganpati Store",
    period: "2025",
    desc: "E-commerce web application for religious and spiritual products, designed with a clean and intuitive shopping experience.",
    keyImpl: "Full-stack web app with product catalog, cart management, and smooth UX deployed on Lovable.",
    skills: ["React", "JavaScript", "UI/UX", "E-Commerce", "Web Development"],
    liveApp: "https://ganpati-grove.lovable.app/",
  },
  {
    name: "Sponsor-Influencer Platform",
    period: "2025",
    desc: "AI-driven platform connecting sponsors with influencers — streamlines discovery, matching, and campaign management.",
    keyImpl:
      "AI-powered matching engine pairing sponsors and influencers based on niche, audience, and campaign goals using data-driven scoring.",
    skills: ["Python", "Flask", "AI/ML", "Data Processing", "REST APIs", "MongoDB"],
    github: "https://github.com/RajMahajan-Dev/Sponsor-Influencer-Project",
  },
  {
    name: "JARC Club Website",
    period: "2025",
    desc: "Official website for the Janatics Automation and Robotics Club — showcasing events, members, projects, and club activities.",
    keyImpl: "Responsive club website with modern web stack deployed on Vercel with dynamic content sections.",
    skills: ["React", "JavaScript", "Web Development", "UI/UX", "Vercel"],
    liveApp: "https://jarc.vercel.app/",
  },
];

export const SKILL_GROUPS = [
  {
    name: "Machine Learning & AI",
    subtitle: "Custom models, LLMs, Computer Vision, Agentic AI",
    tags: ["Scikit-Learn", "TensorFlow", "PyTorch", "YOLO", "LLM APIs", "Hugging Face", "Roboflow", "OpenCV", "Pandas", "NumPy"],
  },
  {
    name: "Python",
    subtitle: "Backend, DSA, APIs, Database integration",
    tags: ["Flask", "FastAPI", "MongoDB", "SQLite", "JWT", "DSA", "REST APIs", "OOP"],
  },
  {
    name: "Robotics & Embedded Systems",
    subtitle: "ROS2, SLAM, PLC, Microcontrollers",
    tags: ["ROS2", "SLAM", "PLC", "ESP32", "MATLAB", "RoboDK", "Raspberry Pi", "Embedded C", "CAD"],
  },
  {
    name: "Computer Vision",
    subtitle: "OpenCV, YOLO, Image Processing Pipelines",
    tags: ["OpenCV", "YOLO", "Roboflow", "TensorFlow", "Edge Deployment", "Depth Estimation"],
  },
  {
    name: "Industrial Automation & Control",
    subtitle: "SCADA, Pneumatics, CoBot, Motion Planning",
    tags: ["SCADA", "PLC", "Pneumatics", "TM-900", "RoboDK", "MATLAB", "Industrial IoT", "HMI"],
  },
  {
    name: "3D Printing & Prototyping",
    subtitle: "Bambu Lab P1S, FDM, CAD-to-Print Workflow",
    tags: ["Bambu Lab P1S", "AMS Multi-material", "FDM", "Fusion 360", "CAD", "Tolerancing"],
  },
  {
    name: "Web & Full-Stack Development",
    subtitle: "React, Flask, MongoDB, REST APIs",
    tags: ["React", "Flask", "MongoDB", "PostgreSQL", "REST APIs", "Vercel", "JWT", "Tailwind"],
  },
];

export const PUBLICATIONS = [
  {
    kind: "Journal Paper · IEEE",
    title: "Zero Trust Security: A Novel Cybersecurity Paradigm for Enterprises and Manufacturing",
    detail: "IEEE Xplore, 2026 · Best Paper Award, ICMES-2025",
    link: "https://doi.org/10.1109/ICSFT67370.2026.11566635",
    linkLabel: "DOI 10.1109/ICSFT67370.2026.11566635",
  },
  {
    kind: "Book Chapter · Springer",
    title: "Advancement of High Entropy Alloys from Few Decades",
    detail: "Springer Nature Singapore · Advanced Structured Materials, 2026",
    link: "https://doi.org/10.1007/978-981-92-0252-2_2",
    linkLabel: "DOI 10.1007/978-981-92-0252-2_2",
  },
  {
    kind: "Paper · Accepted",
    title: "A Review of Autonomous Home Cleaning Robots",
    detail: "MDPI Proceedings · Accepted Nov 2026 · No DOI yet",
    link: null,
    linkLabel: null,
  },
  {
    kind: "Design Patent",
    title: "Sensor-Integrated Well Cap for Real-time Monitoring in Autoflow Wells",
    detail: "Indian Patent Office · Application No. 444306-001 · Apr 2025",
    link: "https://search.ipindia.gov.in/DesignQRStatus/PDF_Viewer.aspx?AppNo=NDQ0MzA2LTAwMQ==&CNo=MTk2MjEz",
    linkLabel: "View patent",
  },
  {
    kind: "Patent · Filed",
    title: "Driver Stress Detection Model and Hardware",
    detail: "Filed with IIT Roorkee · Edge AI system for driver safety",
    link: null,
    linkLabel: null,
  },
];

export const GALLERY = [
  {
    title: "ProQuest Winner — Innovision 2K25",
    src: "https://cdn.jsdelivr.net/gh/RajMahajan-Dev/Image@main/20250212_181904251%20(1).jpg",
  },
  {
    title: "Bike Landing Gear Prototype",
    src: "https://cdn.jsdelivr.net/gh/RajMahajan-Dev/Image@main/image.jpg",
  },
  {
    title: "President, Janatics Automation and Robotics Club",
    src: "/gallery/president-jarc.jpg",
  },
  {
    title: "Best Paper Award — ICMES-2025, Aditya University",
    src: "/gallery/best-paper-award-icmes2025.jpg",
  },
  {
    title: "Paper Presentation — ICSFT 2026, MMCOE Pune",
    src: "/gallery/icsft2026-paper-presentation.jpg",
  },
  {
    title: "STM32 with Embedded C Workshop — RSCOE",
    src: "/gallery/stm32-workshop.jpg",
  },
  {
    title: "Agentic Systems using LLMs — IIT Madras, Paradox'25",
    src: "/gallery/agentic-systems-workshop.jpg",
  },
  {
    title: "Dashboard Design Workshop — IIT Madras, Paradox'25",
    src: "/gallery/dashboard-design-workshop.jpg",
  },
  {
    title: "JARC President — Felicitation Ceremony",
    src: "/gallery/jarc-president-felicitation.jpg",
  },
  {
    title: "Merit Student Felicitation — JSPM RSCOE",
    src: "/gallery/merit-student-felicitation.jpg",
  },
  {
    title: "IEEE Social Media Lead — IEEE RAS SBC RSCOE Inauguration",
    src: "/gallery/ieee-social-media-lead.jpg",
  },
  {
    title: "IEEE Education Leadership Summit 2024 — Hyderabad",
    src: "/gallery/ieee-leadership-summit-2024.jpg",
  },
  {
    title: "Certificate of Participation — IEEE Education Leadership Summit 2024",
    src: "/gallery/ieee-leadership-summit-certificate.jpg",
  },
  {
    title: "Automated Waste Sorting Project",
    src: "/gallery/automated-waste-sorting-project.jpg",
  },
  {
    title: "Fundamentals of Agents — Hugging Face Agents Course",
    src: "/gallery/hugging-face-agents.jpg",
  },
];
