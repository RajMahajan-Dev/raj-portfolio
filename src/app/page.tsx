import Image from "next/image";
import AgentSwarm from "@/components/AgentSwarm";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";
import ProjectsSection from "@/components/ProjectsSection";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { CONTACT, GALLERY, OPPORTUNITY_LINE, PUBLICATIONS, SKILL_GROUPS } from "@/data/portfolio";
import certs from "@/data/certs.json";

const NAV = [
  ["About", "#about"],
  ["Education", "#education"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Research", "#publications"],
  ["Certifications", "#certifications"],
  ["Contact", "#contact"],
] as const;

const STATS = [
  { value: "9.51", label: "B.Tech CGPA / 10" },
  { value: "3rd", label: "Department rank" },
  { value: "11", label: "Projects built" },
  { value: "2", label: "Publications" },
];

const EXPERIENCE = [
  {
    role: "Machine Learning Research Intern",
    org: "IIT Roorkee",
    period: "Apr 2026 – Jul 2026",
    points: [
      "Built an edge AI device for real-time monitoring of driver distraction and stress in transportation systems.",
      "Designed CNN + LSTM models for behavioural analysis using sensor and vision-based data to improve road safety.",
      "Deployed deep learning inference on NVIDIA Jetson Orin and Raspberry Pi 5, documenting quantisation workflows under compute constraints.",
    ],
    highlight: "Edge AI for driver safety and stress detection",
  },
  {
    role: "Computer Vision Intern",
    org: "KeepActive Pro AI Solutions",
    period: "Jan 2026 – Apr 2026",
    points: [
      "Worked on a solar cleaning robot, focusing on hardware design and autonomous operation.",
      "Trained and evaluated a YOLOv8 detection model, achieving 92% detection accuracy.",
      "Implemented MQTT for reliable communication and system monitoring; did CAD design for the robot structure.",
    ],
    highlight: "YOLOv8 + MQTT on a solar cleaning robot",
  },
  {
    role: "Research Intern",
    org: "NIT Karnataka",
    period: "Jun 2025 – Jul 2025",
    points: [
      "Worked on gecko-inspired climbing robots, applying AI-based analysis to study adhesion across varied surface conditions.",
      "Analysed experimental data from 10+ robot prototypes using Python; tested on 100 surfaces.",
      "Improved adhesion prediction and cut the prototype failure rate by 22%.",
    ],
    highlight: "22% reduction in prototype failure rate",
  },
];

const LEADERSHIP = [
  { role: "President", org: "Janatics Automation and Robotics Club (JARC), JSPM RSCOE", period: "Nov 2024 – 2026" },
  { role: "R&D Team Member", org: "Ramanujan Society of Research, IIT Madras", period: "Sep 2024 – Present" },
  { role: "Social Media Leader", org: "IEEE RAS Student Chapter, JSPM RSCOE", period: "Nov 2023 – Mar 2025" },
];

const ACHIEVEMENTS = [
  { title: "Selected for Erasmus Mundus IFROS Scholarship, Cohort 6", detail: "1 of 7 globally, sole selectee from India" },
  { title: "Selected for Columbia University Summer Visiting Undergraduate Fellow 2026", detail: "1 of 10 from India" },
  { title: "Winner — ProQuest Professional Challenge, Innovision 2K25", detail: "Idea pitching competition · Feb 2025" },
  { title: "Finalist — Mumbai Hacks AI Hackathon (Fintech Track)", detail: "Nov 2025" },
  { title: "Finalist — Top 12 out of 2,000 teams, Janatics Automation Skill Challenge", detail: "Nov 2025" },
  { title: "Merit Holder — 3rd Rank, Automation & Robotics Dept., JSPM RSCOE", detail: "Jul 2025" },
  { title: "Selected — McKinsey Forward Program", detail: "Leadership and skill development" },
  { title: "Summer@EPFL 2027 — Application submitted", detail: "Nov 2026" },
  { title: "RIGI, MPI for Intelligent Systems — Application submitted", detail: "Nov 2026" },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      <SmoothScroll />
      <AgentSwarm />

      <header data-swarm-layer className="sticky top-0 z-40 -mx-5 border-b border-border bg-background/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <a href="#top" className="font-display text-lg font-extrabold tracking-tight text-accent">
            Raj<span className="text-text">.</span>
          </a>
          <nav className="hidden items-center gap-4 font-mono text-[11px] text-muted lg:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="transition hover:text-accent">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={CONTACT.cv}
              download
              className="rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-accent2"
            >
              Download CV
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="top" className="scroll-mt-24 py-14 sm:py-20">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_300px]">
            <div>
              <p data-swarm-layer className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Open to research and R&amp;D opportunities
              </p>
              <h1 data-swarm-layer className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                Raj Mahajan
                <span className="mt-2 block text-3xl text-accent sm:text-4xl">AI &amp; Robotics</span>
              </h1>
              <p data-swarm-layer className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                I build intelligent systems where machine learning meets real-world robotics: edge AI,
                computer vision, and robots that work outside the lab.
              </p>
              <p data-swarm-layer className="mt-5 max-w-xl border-l-2 border-accent pl-4 text-base font-medium leading-relaxed">
                {OPPORTUNITY_LINE}
              </p>
              <div data-swarm-layer className="mt-7 flex flex-wrap gap-3">
                <a
                  href={CONTACT.cv}
                  download
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-accent2"
                >
                  Download CV
                </a>
                <a
                  href="#contact"
                  className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent"
                >
                  Get in touch
                </a>
              </div>
              <div data-swarm-layer className="mt-8 flex flex-wrap gap-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-bold text-accent">{s.value}</p>
                    <p className="font-mono text-[11px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div data-swarm-layer className="mx-auto w-full max-w-[300px]">
              <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
                <Image
                  src="/headshot.jpg"
                  alt="Raj Mahajan"
                  width={888}
                  height={1000}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center font-mono text-[11px] text-dim">
                {CONTACT.location} · English, Hindi, Marathi
              </p>
            </div>
          </div>
        </section>

        <section id="about" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="About" title="Researcher who ships robots" />
          <Reveal>
            <p className="mt-6 max-w-3xl leading-relaxed text-muted">
              I am a robotics and AI researcher from Pune. My B.Tech in Automation and Robotics is
              complete, and I am finishing a BSc in Data Science at IIT Madras alongside it. My work
              so far spans edge AI on Jetson and Raspberry Pi, YOLO-based computer vision on real
              robots, and ROS2 navigation with SLAM. I care about low-cost robots for dangerous
              work, and I want my next project to be built, tested, and deployed, not just written
              up.
            </p>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              Kaggle work: surface anomaly segmentation. Pretrained model out-of-fold 0.7516,
              leaderboard 0.69. The same failure-mode thinking applies to safety evaluation: finding
              where a model misses defects.
            </p>
          </Reveal>
        </section>

        <section id="education" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Education" title="Academic foundation" />
          <div className="mt-8 space-y-5">
            <Reveal>
              <article className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold">B.Tech — Automation &amp; Robotics</h3>
                  <span className="font-mono text-[11px] text-dim">2022 – 2026 · Completed Jul 2026</span>
                </div>
                <p className="mt-1 text-sm text-muted">JSPM Rajarshi Shahu College of Engineering, Pune (SPPU)</p>
                <p className="mt-2 text-sm">CGPA 9.51 / 10 · Department Rank 3 · Merit Student</p>
              </article>
            </Reveal>
            <Reveal>
              <article className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold">BSc — Data Science &amp; Applications</h3>
                  <span className="font-mono text-[11px] text-dim">2023 – 2027</span>
                </div>
                <p className="mt-1 text-sm text-muted">Indian Institute of Technology Madras (hybrid)</p>
                <p className="mt-2 text-sm">Diploma level · Focus on machine learning, statistics, and programming</p>
              </article>
            </Reveal>
            <Reveal>
              <article className="rounded-2xl border border-accent/50 bg-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold">MSc — Robotics &amp; Artificial Intelligence</h3>
                  <span className="font-mono text-[11px] text-dim">Starts Sep 2027</span>
                </div>
                <p className="mt-1 text-sm text-muted">University of Glasgow</p>
                <p className="mt-2 text-sm">Conditional offer accepted · 12 months, full-time</p>
              </article>
            </Reveal>
          </div>
        </section>

        <section id="experience" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Experience" title="Research internships" />
          <div className="mt-8 space-y-5">
            {EXPERIENCE.map((e, i) => (
              <Reveal key={e.role} delay={i * 0.06}>
                <article className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-bold">{e.role}</h3>
                    <span className="font-mono text-[11px] text-dim">{e.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-accent">{e.org}</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <p className="mt-3 border-l-2 border-accent pl-3 text-sm font-medium">{e.highlight}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="projects" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Projects" title="Things I have built" />
          <ProjectsSection />
        </section>

        <section id="skills" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Skills" title="What I know" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {SKILL_GROUPS.map((g, i) => (
              <Reveal key={g.name} delay={(i % 2) * 0.06}>
                <article className="h-full rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-bold">{g.name}</h3>
                  <p className="mt-1 font-mono text-[11px] text-dim">{g.subtitle}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {g.tags.map((t) => (
                      <span key={t} className="rounded-full border border-border bg-card2 px-2.5 py-0.5 font-mono text-[11px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="publications" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Publications" title="Research &amp; patents" />
          <div className="mt-8 space-y-4">
            {PUBLICATIONS.map((p) => (
              <Reveal key={p.title}>
                <article className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{p.kind}</p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.detail}</p>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                      {p.linkLabel} →
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="certifications" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Certifications" title="Continuous learning" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((c) => (
              <Reveal key={c.name}>
                <article className="h-full overflow-hidden rounded-2xl border border-border bg-card">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt={c.name} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-card2 px-4 text-center font-display text-lg font-bold text-accent">
                      {c.name}
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold leading-snug">{c.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {c.issuer} · {c.date}
                    </p>
                    {c.verify && (
                      <a href={c.verify} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                        Verify →
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="leadership" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Leadership" title="Leadership &amp; community" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {LEADERSHIP.map((l) => (
              <Reveal key={l.role}>
                <article className="h-full rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-bold">{l.role}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{l.org}</p>
                  <p className="mt-3 font-mono text-[11px] text-dim">{l.period}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="achievements" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Achievements" title="Recognition &amp; awards" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {ACHIEVEMENTS.map((a) => (
              <Reveal key={a.title}>
                <article className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-display text-base font-bold leading-snug">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted">{a.detail}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="gallery" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Gallery" title="Moments &amp; memories" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {GALLERY.map((g) => (
              <Reveal key={g.title}>
                <figure className="overflow-hidden rounded-2xl border border-border bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="p-4 text-sm font-medium">{g.title}</figcaption>
                </figure>
              </Reveal>
            ))}
            <Reveal>
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:aspect-auto sm:min-h-[240px]">
                <p className="font-display text-lg font-bold">More photos coming</p>
                <p className="mt-2 text-sm text-muted">
                  One gallery photo is still being re-uploaded and will appear here once it is added.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" data-swarm-layer className="scroll-mt-24 border-t border-border py-14">
          <SectionHeading kicker="Contact" title="Let's build something" />
          <Reveal>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted">{OPPORTUNITY_LINE}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`mailto:${CONTACT.email}`} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-accent2">
                Email me
              </a>
              <a
                href={CONTACT.cv}
                download
                className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                Download CV
              </a>
            </div>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-dim">Email</dt>
                <dd className="mt-1 text-sm font-medium">
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-accent hover:underline">{CONTACT.email}</a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-dim">Phone</dt>
                <dd className="mt-1 text-sm font-medium">
                  <a href="tel:+919322301053" className="hover:text-accent hover:underline">{CONTACT.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-dim">LinkedIn</dt>
                <dd className="mt-1 text-sm font-medium">
                  <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">linkedin.com/in/rajmahajan2151</a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-dim">GitHub</dt>
                <dd className="mt-1 text-sm font-medium">
                  <a href={CONTACT.github} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">github.com/RajMahajan-Dev</a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-dim">Google Scholar</dt>
                <dd className="mt-1 text-sm font-medium">
                  <a href={CONTACT.scholar} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">Google Scholar profile</a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-dim">ORCID</dt>
                <dd className="mt-1 text-sm font-medium">
                  <a href={CONTACT.orcid} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">orcid.org/0009-0008-6424-3331</a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center font-mono text-[11px] text-dim">
        © 2026 Raj Mahajan · {CONTACT.email} · {CONTACT.phone} · Crafted from {CONTACT.location}
      </footer>
    </div>
  );
}
