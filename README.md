<div align="center">

# Orbit

### A clearer view of recurring revenue.

An approachable SaaS analytics workspace for subscription health, customer growth, and the numbers behind a growing product.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_Orbit-557B3D?style=for-the-badge&logo=vercel&logoColor=white)](https://2-my-portfolio-website.vercel.app)

![React](https://img.shields.io/badge/React-19-20261E?style=flat-square&logo=react&logoColor=B7E56B)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-20261E?style=flat-square&logo=typescript&logoColor=79B9B1)
![Vite](https://img.shields.io/badge/Vite-6-20261E?style=flat-square&logo=vite&logoColor=F2A78D)
![Responsive](https://img.shields.io/badge/Layout-Responsive-20261E?style=flat-square&logo=css3&logoColor=B7E56B)

</div>

---

## The Overview

Orbit puts the SaaS metrics a team checks every day in one calm, scannable workspace. The interface is designed to feel useful at a glance, while keeping customer-level actions close at hand.

| Revenue | Customers | Operations |
| --- | --- | --- |
| MRR, retention, and churn summaries | Plan mix and subscriber growth | Search, filter, sort, and paginate customer records |
| 7-, 30-, and 90-day revenue trends | Customer detail profiles | Add customers and export filtered records to CSV |

## Built For Real Workflows

- **Find the signal:** compare recurring revenue periods and scan subscription health.
- **Move from trend to person:** open a customer profile directly from the directory.
- **Keep control of the data:** filter by status, sort columns, and export the current results.
- **Work on any screen:** responsive navigation, compact metric panels, and an internally scrollable data table.
- **Use it with a keyboard:** semantic landmarks, labeled controls, visible focus states, and reduced-motion support.

## Technology

React 19 · TypeScript · Vite · Recharts · Lucide · CSS

## Run It Locally

Requires Node.js 18 or newer.

```bash
git clone https://github.com/j06352811-cell/2.MY-PORTFOLIO-WEBSITE-.git
cd 2.MY-PORTFOLIO-WEBSITE-
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Project Map

```text
src/
  App.tsx       Dashboard layout, data, and interactions
  main.tsx      React entry point
  styles.css    Responsive visual system
.github/
  agents/       Portfolio-focused VS Code custom agent
```

## What This Project Practices

- Breaking a data-dense interface into clear, reusable React components
- Keeping sorting, filtering, pagination, and export behavior understandable
- Pairing chart context with concise business metrics
- Designing responsive navigation and accessible interaction states
- Making implementation choices that can be explained in a code review or interview

## Data & Demo

**Live demo:** [2-my-portfolio-website.vercel.app](https://2-my-portfolio-website.vercel.app)

This is a frontend portfolio project using illustrative local data. It is not connected to a billing provider, production database, or live customer records.
