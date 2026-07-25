# Hive - The Community Operating System

[![Live Deployment](https://img.shields.io/badge/Live-Deployment-0DB4C9?style=for-the-badge)](https://hive-rosy.vercel.app/)

Hive is a unified, scalable web application designed to transition student developer communities from fragmented logistics to automated, high-impact operations. By centralizing event management, member discovery, and community engagement, Hive acts as a complete operating system for modern developer chapters.

**Live Demo:** [https://hive-rosy.vercel.app/](https://hive-rosy.vercel.app/)

---

## Overview

As communities scale, managing operations via disconnected spreadsheets, calendar links, and chat platforms becomes unsustainable. Hive solves this by providing a centralized platform driven by a strict **Role-Based Access Control (RBAC)** architecture. 

The system securely isolates functionalities across three distinct user roles—Members, Organizers, and Admins—ensuring that users only see the tools and data relevant to their responsibilities.

---

## Tech Stack

Hive is engineered for real-time performance, secure data mutations, and scalable server-side rendering.

*   **Framework:** Next.js 15 (App Router, React Server Components, Server Actions)
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Authentication & Infrastructure:** Supabase
*   **Styling:** Tailwind CSS v4 + shadcn/ui

---

## Role-Based Access Control (RBAC) & Features

Hive is an open platform where anyone can create an account. Upon secure authentication via Supabase, new users are assigned the default **Member** role. Elevated permissions (Organizer, Admin) are strictly granted by existing Administrators.

### 1. Members (Default Role)
The Member portal provides a frictionless, distraction-free environment for users to engage with the community, discover events, and track their growth.

*   **Event Discovery & RSVP:** Browse the global calendar for upcoming hackathons, workshops, and tech talks. Members can register with a single click.
*   **Dynamic Waitlists:** If an event reaches maximum capacity, members are automatically routed to a waitlist and seamlessly bumped up if a spot opens.
*   **Explore Sub-Communities:** Discover and join specialized, niche groups within the larger chapter (e.g., Web Development, Artificial Intelligence, Cloud Computing).
*   **Opportunities Board:** View and apply for community-sourced open roles, internships, and open-source contribution requests.
*   **Developer Profile:** Build and maintain a personalized profile highlighting skills, projects, and event attendance history.
*   **Gamified Leaderboard:** Track community engagement through a point-based system. Members earn points for attending events, hosting sessions, and volunteering, allowing them to track their ranking on the global leaderboard.

### 2. Organizers
Organizers are granted a dedicated workspace focused heavily on event logistics, sub-community management, and attendee tracking.

*   **Event Drafting:** Create new events, set exact attendee capacities, upload promotional banners, and establish registration windows.
*   **Smart Event Routing:** Publish flagship events **Globally** to the entire platform, or route niche workshops **Locally** to a specific sub-community to reduce platform noise.
*   **Roster Management:** Access real-time attendee tables to view approved members and waitlisted users. Organizers can manually adjust RSVP statuses when necessary.
*   **Day-of Operations:** Access a mobile-optimized scanning interface to scan member QR codes for instantaneous, verified event check-ins.

### 3. Administrators
Admins possess eagle-eye control over the entire platform. They oversee security, manage global permissions, and maintain the quality standards of the community ecosystem.

*   **Ecosystem Orchestration:** Dynamically create new sub-communities as the chapter scales and assign specific Organizers to lead them.
*   **Event Review Queue:** Maintain strict quality control. When an Organizer drafts an event, it enters a `PENDING` queue. Admins review the draft and can either **Approve** it to the public feed or **Reject** it with attached feedback for the Organizer.
*   **Role Management:** Access the global user database to upgrade standard Members to Organizers or grant Admin privileges. Database updates immediately alter the user's dashboard access upon their next navigation.

---

## Getting Started (Local Development)

If you want to contribute or run Hive locally, follow these steps.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or pnpm
*   A Supabase project (for Authentication and PostgreSQL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/CoDx-ZeesH/Hive.git](https://github.com/CoDx-ZeesH/Hive.git)
   cd hive