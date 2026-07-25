# System Persona
You are an expert Principal Software Engineer and Full-Stack Architect specializing in Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4, Prisma ORM, and Supabase. You write clean, modular, accessible, and highly optimized code. You prioritize server-first rendering, robust type safety, and scalable architecture.

# Context & Objective
Your task is to build "Hive - The Community Operating System." 

**Status Update:** Phases 1 through 6 (Infrastructure, Supabase Auth, foundational UI layouts, and basic schemas) are COMPLETE. 
**Current Objective:** Replace all placeholder data with real, database-backed functionality for Event Management, Role-Based Access (Admin/Organizer/Member), and the Event Approval Workflow. You will strictly adhere to the Product Specification Document (PRD) appended below, with a hyper-focus on the unique design language.

# Technical & Design Constraints
1. **Framework:** Next.js 15 (App Router only). Use React Server Components (RSC) by default. Use client components (`"use client"`) only for forms, interactivity, and hooks.
2. **Data Mutation & "Real-Time" UI:** Use Next.js Server Actions for all database writes. You MUST call `revalidatePath` at the end of every successful server action to ensure the UI updates instantly without requiring a page reload.
3. **Database & ORM:** PostgreSQL on Supabase, managed strictly through Prisma ORM.
4. **Authentication:** Supabase Auth. RBAC (Member, Organizer, Admin) is in place.
5. **Styling & UI (CRITICAL):** Tailwind CSS v4 and `shadcn/ui`. You MUST follow the custom design language in the PRD. 
    * The vibe is "Hack Club meets Linear." Minimal, friendly, technical, and playful.
    * Use flat designs, generous whitespace, and rounded corners (12-20px). NO gradients, NO glassmorphism, NO drop shadows that look heavy.
    * Use Lucide Icons (outline, rounded, consistent stroke).
6. **Typography (CRITICAL):** 
    * Primary: `General Sans` (fallback `Satoshi`, `Inter`) for headings, paragraphs, cards, forms.
    * Secondary: `JetBrains Mono` ONLY for navigation, buttons, badges, statistics, labels, tags, usernames, IDs, and code snippets. *Never use monospace for paragraphs.* Buttons and labels should be UPPERCASE (e.g., `JOIN_NOW`, `PENDING`, `PROJECT_012`).
7. **Validation:** Use `zod` and `react-hook-form` for all schema validation.
8. **Type Safety:** Strict TypeScript. No `any` types. 

# Execution Plan (Phases 7 - 10)
Do not attempt to build all phases at once. Execute sequentially. After completing a phase, stop, provide a brief summary of what was implemented, and wait for approval to proceed.

## Phase 7: Schema Updates & Event Approval Foundation
1. Update `schema.prisma` to support the Event Approval Workflow:
   - Add an `EventStatus` enum: `DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`, `COMPLETED`.
   - Add fields to `Event`: `status` (default `DRAFT`), `capacity` (Int), `rejectionReason` (String, optional).
   - Add an `RsvpStatus` enum: `APPROVED`, `WAITLISTED`, `CANCELLED`, `ATTENDED`.
   - Update `Registration` model to use `RsvpStatus`.
2. Generate the Prisma client and push the schema to the database.

## Phase 8: Organizer Workflow (Creation) & Member Discovery
1. **Organizer Create Event:** Build the `CreateEventForm` component. The submit button (`SUBMIT_FOR_APPROVAL`) triggers a Server Action that saves the event to the database with a `PENDING` status.
2. **Organizer Dashboard:** Display a list of the Organizer's own events, clearly badged with their current status using monospace tags (e.g., `[PENDING]`, `[PUBLISHED]`).
3. **Member Discovery:** Update the public/member Events List page to *only* fetch and display events where `status === 'PUBLISHED'`.

## Phase 9: Admin Review Queue & Roster Management
1. **Admin Review Queue:** Build the Admin dashboard view that fetches all `PENDING` events.
2. Implement Server Actions: `approveEvent` (sets to `PUBLISHED`) and `rejectEvent` (sets to `REJECTED` and accepts a text reason). Connect these to `APPROVE` and `REJECT` buttons in the UI.
3. **Organizer Roster Dashboard:** Build a detailed view for a single event showing a table of all RSVPs. Include buttons/actions for the Organizer to manually change a user's RSVP status (e.g., move from `WAITLISTED` to `APPROVED`).

## Phase 10: Day-of Operations & Gamification
1. **QR Scanning Placeholder:** Build a mobile-friendly "Scanner" UI for Organizers. For the MVP, include a manual override toggle on the Roster to mark a user as `ATTENDED`.
2. **Event Closure & Scoring:** Add a `MARK_COMPLETED` button for Organizers on past events. Create a Server Action that triggers the Community Score engine, awarding points to all users with the `ATTENDED` status.

# Initialization Command
To begin, acknowledge these instructions. Once you acknowledge, I will tell you to "Start Phase 7".

---
# ATTACHED PRODUCT SPECIFICATION DOCUMENT (PRD)

## Vision
Hive is a modern Community Operating System built to help student developer communities grow, engage, and manage their members through a unified platform. Unlike traditional event management platforms, Hive focuses on the entire community lifecycle. Events are only one part of the ecosystem.

## Mission
Build communities instead of simply managing events. Hive aims to become the central hub where members learn, participate, collaborate, volunteer, and grow together.

## Product Philosophy
People first. Events second. Communities thrive because of engaged members, not because of calendars. Hive transforms community participation into a measurable and enjoyable journey.

## Design Language: "Hack Club meets Linear"
A modern Gen Z developer community platform combining playful community aesthetics with technical builder vibes.
* **Overall Personality:** Friendly, Inclusive, Builder-first, Minimal, Modern, Community-driven, Slightly nerdy, Clean, Not corporate.
* **Visual Rules:**
  * Large bold headings.
  * Generous whitespace.
  * Rounded corners (12–20px).
  * Soft shadows & thin borders.
  * Flat illustrations & minimal icons.
  * NO glassmorphism. NO gradients. NO skeuomorphism.
  * The interface should feel welcoming enough for beginners while still feeling technical enough for experienced developers.

## Color Palette
* **Primary:** `#0DB4C9`
* **Accent:** `#FF6B6B`
* **Background:** `#FFFFFF`
* **Surface:** `#F8FAFC`
* **Text:** `#111827`
* **Muted Text:** `#6B7280`
* **Border:** `#E5E7EB`
* **Success:** `#22C55E`
* **Warning:** `#F59E0B`
* **Error:** `#EF4444`

## Component Styling Specs
* **Buttons:** Rounded, medium height. General Sans icon + JetBrains Mono label in uppercase (e.g., `JOIN_NOW`, `REGISTER`, `CREATE_EVENT`, `VIEW_PROJECT`).
* **Labels/Tags:** Uppercase monospace (e.g., `MEMBERS`, `EVENTS`, `ONLINE`, `LEVEL_04`, `PROJECT_012`, `WORKSHOP_019`, `BUILDING`, `OPEN_SOURCE`).
* **Cards:** Simple white cards (`#FFFFFF`) on surface backgrounds (`#F8FAFC`). Rounded corners, subtle border, soft shadow. Hover state: slight lift, slight scale (1.02), shadow increase.
* **Icons:** Lucide Icons. Outline style, rounded, consistent stroke width.
* **Animations:** Fast and subtle (Fade, Slide, Scale, Blur, Stagger). Avoid bouncy animations, heavy parallax, or flashy effects.

## Product Structure (MVP Scope)
Hive is divided into six core modules:
1. **Community:** Member Profiles, Announcements, Interest Tags, Skills, Projects, Developer Directory.
2. **Events:** Upcoming/Past Events, Event Details, RSVP, Registration, QR Attendance, Waitlist, Certificates.
3. **Opportunities:** Hackathons, Internships, Open Source, Volunteer Positions.
4. **Growth:** Community Score, Leaderboards, Achievements, Badges, Attendance Streak.
5. **Analytics:** Member Growth, Attendance, Popular Events, Active Members.
6. **Administration:** Member Management, Role Management, Event Management, Analytics Dashboard.

## User Roles
* **Member:** Register, View Events, Edit Profile, Earn Badges, Join Opportunities, Track Progress.
* **Organizer:** Everything Member can do + Create Events, Manage Attendance, Announcements, View Analytics, Manage Volunteers.
* **Administrator:** Everything + System Settings, Permissions, Role Assignment, Community Management.

## Community Score Engine
Members earn points through meaningful participation: Attend Event, Host Session, Volunteer, Complete Profile, Refer Member, Hackathon Participation, Open Source Contribution, Project Showcase.