# Raj Mahajan — Portfolio

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4. Dark/light mode, Agent Cursor
Swarm (6 labelled cursors), Lenis smooth scroll, Framer Motion reveals.

## Preview locally

```bash
cd ~/workspace/portfolio/raj-portfolio
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Deploy

Not deployed. Raj reassigns qzz.io to the new Vercel project himself.
Import this folder as a new Vercel project (Framework: Next.js), then set the
qzz.io domain on that project in Vercel.

## Content

- `src/data/portfolio.ts` — projects, skills, publications, gallery, contact.
- `src/data/certs.json` — certifications. To add one, append an object with
  `name`, `issuer`, `date`, `image` (jsDelivr URL from the Image repo, or null)
  and `verify` (URL or null).
- `public/headshot.jpg` — hero photo, served locally via next/image.
- `public/Raj_Mahajan_CV.pdf` — fresh general AI/ML CV. Source:
  `cv-source.html`, rendered with `node render-cv.js` (Puppeteer + Chromium).
  Re-render after editing the source, and check it stays exactly 1 page.
- `src/components/AgentSwarm.tsx` — the 6-cursor swarm (Perception,
  Navigation, Vision, Control, Learning, Safety). Desktop fine-pointer only,
  respects prefers-reduced-motion, replay button bottom-right.

## Gallery — still needed from Raj

Five gallery photos are expired LinkedIn links and were omitted. Re-uploads
needed: President JARC, Department Merit Award, IEEE Leadership Summit,
AI Unplugged Workshop, Automated Waste Sorting Project. Add them to
`src/data/portfolio.ts` GALLERY (jsDelivr URLs from RajMahajan-Dev/Image)
and remove the "More photos coming" placeholder card in `src/app/page.tsx`.

## Never include

No IIT Madras GPA, no AI-Driven DCA / Business Data Management project
(never completed), no Singapore collaboration item, no invented numbers.
