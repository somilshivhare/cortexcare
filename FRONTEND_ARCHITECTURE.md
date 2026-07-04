# CortexCare Frontend Architecture Document

This document outlines the architecture, layout system, component structure, and integration guidelines for the CortexCare frontend. It serves as a blueprint for developers to build a premium, SaaS-like React single-page application.

---

## 1. Tech Stack Overview

*   **Core Framework**: React 19 & Vite (for fast hot-module reloading and optimized builds).
*   **Routing**: React Router (v6/v7) supporting nested route layouts and programmatic route guards.
*   **Styling**: Tailwind CSS with custom HSL variables supporting sleek light/dark SaaS theme overrides.
*   **UI Foundation**: shadcn/ui (built on Radix UI primitives) for accessible, custom-styled premium components.
*   **Animations**: Framer Motion for premium micro-animations (page transitions, dialog pops, button squishes).
*   **Data Fetching**: TanStack Query (React Query v5) for query/mutation state synchronization and automatic caching.
*   **API Client**: Axios (configured with authorization headers and token expiry interceptors).
*   **Forms**: React Hook Form integrated with Zod validation schemas.
*   **Voice Integration**: LiveKit Client SDK (handling WebRTC microphone tracks and voice streaming).

---

## 2. Folder Structure

The frontend is structured as a Feature-Based Architecture (matching React best practices), separating global configurations, shared utilities, and global services from specific self-contained features:

```text
client/
├── public/                 # Static assets (favicons, logos)
├── src/
│   ├── app/                # React App entry routing and setup
│   ├── assets/             # Images, fonts
│   ├── animations/         # Reusable Framer Motion variants
│   ├── components/         # Shared UI components
│   │   └── ui/             # shadcn reusable elements
│   ├── config/             # Config variables (Axios, TanStack Query clients)
│   ├── contexts/           # Global Context Providers (Auth, Theme)
│   ├── features/           # Self-contained feature slices
│   ├── hooks/              # Global custom React hooks
│   ├── layouts/            # Shared Layout wrappers (AuthLayout, DashboardLayout)
│   ├── lib/                # Library wrappers (shadcn utils, Tailwind merge)
│   ├── routes/             # Router definition, route guards (Protected, Guest)
│   ├── services/           # Shared API backend communication services
│   ├── styles/             # Global Tailwind and HSL stylesheets
│   ├── utils/              # Reusable helper functions
│   ├── app.jsx             # React Application entry wrapper
│   └── main.jsx            # DOM Mount entry point
├── tailwind.config.js      # Custom theme mappings & animations
├── vite.config.js          # Vite config (proxy setups, path aliases)
├── package.json            # Frontend packages & scripts
└── FRONTEND_ARCHITECTURE.md# This document
```

---

## 3. Feature Structure (Vertical Slices)

Self-contained features reside inside `src/features/`. Each feature owns only what it needs, keeping components modular and easy to study:

### Feature List
1.  `landing/`: Marketing SaaS index page.
2.  `auth/`: Registration, logins, and validations.
3.  `patient/`: Patient dashboard listings.
4.  `voice/`: Dedicated WebRTC session, microphone tracking, waveform visualization, and audio controllers.
5.  `consultation/`: Interactive transcript feeds and intakes (consumes the `voice` feature).
6.  `doctor/`: Clinician dashboard tables and claims.
7.  `clinic/`: Enrolling and clinic stats forms.
8.  `timeline/`: Historical consultation charts and logs.
9.  `profile/`: User settings.

### Feature Subfolder Example
```text
src/features/auth/
├── components/             # Components local to this feature
├── hooks/                  # TanStack Query custom hooks
├── pages/                  # Route entry screens
├── services/               # Feature-specific API adapters
├── schemas/                # Local Zod schema forms validation
└── types/                  # Optional type files
```

---

## 4. Routing Structure

React Router manages URLs statelessly. We enforce structural route layout nesting and guard permissions:

```text
/ (Landing Page - Public)
├── /auth (Guest only - AuthLayout)
│   ├── /login
│   └── /register
├── /patient (Protected: Role == PATIENT - PatientLayout)
│   ├── /dashboard
│   ├── /consultation (Consumes voice feature)
│   ├── /timeline/:id
│   └── /profile
└── /doctor (Protected: Role == DOCTOR - DoctorLayout)
    ├── /dashboard
    ├── /consultation/:id
    ├── /clinic
    └── /profile
```

### Route Guards
*   **`GuestGuard`**: If a JWT token exists in `localStorage`, redirects the user to their respective dashboard (prevents accessing login routes while active).
*   **`AuthGuard`**: Redirects unauthorized visitors to `/auth/login`.
*   **`RoleGuard`**: Validates JWT `role` attributes, redirecting unauthorized role requests to `/403`.

---

## 5. Voice Feature Slicing (`features/voice`)

The WebRTC audio processing is decoupled from consultation state tracking. The dedicated `features/voice/` feature owns:
*   **LiveKit Connections**: WebRTC room attachments, microsecond transcript feeds, and microphone toggling.
*   **Visualizations**: Canvas audio analyser mapping microphone frequencies into a responsive visualizer.
*   **UI States**: Glowing indicator animations showing states: `Connecting`, `Listening`, `AI Speaking`, `Muted`.

Consultation intake pages import and consume the `voice` feature, passing down consultation metadata.

---

## 6. Shared API Services (`src/services/`)

To avoid scattered Axios calls, all network communications reside in `src/services/` and map to backend REST endpoints:
*   `api.js`: Centered Axios instance configuration containing auth interceptors.
*   `auth.service.js`: Calls to `/api/auth/register` and `/api/auth/login`.
*   `patient.service.js`: Calls to `/api/patient/profile`.
*   `consultation.service.js`: Calls to `/api/consultation`.
*   `doctor.service.js`: Calls to `/api/doctor`.
*   `clinic.service.js`: Calls to `/api/clinic`.
*   `timeline.service.js`: Calls to `/api/timeline`.
*   `voice.service.js`: Calls to `/api/livekit` to request WebRTC tokens.

---

## 7. Shared Animations (`src/animations/`)

To keep motion declarations DRY, Framer Motion variant mappings reside inside `src/animations/`:
*   `fade.js`: Opacity changes for simple fades.
*   `slide.js`: Left/Right/Up slide entrances.
*   `scale.js`: Scale-up button tap and dialog pop effects.
*   `pageTransition.js`: Routing change slide-and-fade layouts.

---

## 8. Shared UI Primitives (`src/components/ui/`)

All custom elements are built on top of shadcn/ui standards:
*   `Button`: Premium action button (tap-scaling, spinner loader support).
*   `Card`: Glassmorphic, bordered containers.
*   `Input` & `Dialog` & `Sheet` & `Popover` & `Badge` & `Avatar` & `Table` & `Tabs` & `Skeleton` & `Toast`.
*   `EmptyState`: A premium illustration-free placeholder for empty dashboard tables.
*   `Loader`: Pulsing logo spinner during slow loading phases.

---

## 9. Design Aesthetics

*   **Light SaaS Theme**: Pure white backdrops, soft neutral gray borders, high-contrast text, and generous spacing.
*   **Inspirations**: Apple, Stripe, Linear, OpenAI, Vercel, Antigravity.
*   **Anti-Patterns**: Avoid generic hospital blue templates, stock medical icons, or overcrowded dashboard grids.

---

## 10. Frontend Development Order

Development is frozen in this exact sequential order:
1.  **Frontend Foundation** (Config setups, packages, Tailwind, shadcn configuration, routing skeleton, layouts, Context providers - *no feature pages*).
2.  **Landing** (SaaS landing marketing index).
3.  **Authentication** (Register/Login).
4.  **Patient** (Dashboard listings).
5.  **Voice** (LiveKit hook, visualizer, audio controllers).
6.  **Consultation** (Interactive audio session intake, transcript scrolling).
7.  **Doctor** (Dashboard counts, claim list, detailed notes review).
8.  **Clinic** (Create clinic codes, invite lists).
9.  **Timeline** (Unified chronological consultation timeline logs).
10. **Profile** (Edit profile details).
11. **Final Polish** (Animation tuning, loading and error boundary checks).
12. **Deployment** (Vite builds, asset bundling, Nginx static host maps).
