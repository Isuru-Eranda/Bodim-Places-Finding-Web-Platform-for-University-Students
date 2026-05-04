# PUSL3190 Computing Project — Final Report

## AI-Powered Smart Boarding Place Finder for University Students

### Sri Lanka Institute of Information Technology (SLIIT)

---

---

## Acknowledgements

I would like to express my sincere gratitude to all those who supported and guided me throughout the development of this Computing Project.

First and foremost, I extend my deepest appreciation to my project supervisor for their invaluable guidance, continuous feedback, and unwavering support throughout the entire project lifecycle. Their technical expertise and constructive criticism were instrumental in shaping both the direction and quality of this work.

I am also grateful to the academic staff of the Faculty of Computing at SLIIT for equipping me with the theoretical knowledge and practical skills necessary to undertake a project of this nature.

My heartfelt thanks go to my family and friends for their moral support and encouragement during the demanding phases of this project. Their patience and understanding made it possible for me to dedicate the time and effort required.

I also wish to acknowledge the open-source communities behind React, Node.js, MongoDB, Tailwind CSS, and OpenAI, whose tools and documentation significantly accelerated development.

Finally, I am grateful to all university students and boarding house owners who provided informal feedback and insights during the requirements-gathering phase, helping ensure the platform addresses real-world needs.

---

---

## Abstract

Finding suitable and affordable boarding accommodation is one of the most pressing challenges faced by university students in Sri Lanka. The existing methods of searching for boarding places—primarily word-of-mouth and physical notice boards—are inefficient, time-consuming, and often result in students settling for substandard housing without access to verified information.

This project presents the design and development of an **AI-Powered Smart Boarding Place Finder**, a full-stack web platform that streamlines the process of discovering, evaluating, and booking boarding houses (locally known as _"bodims"_) for university students across Sri Lanka.

The platform adopts a three-tier role-based architecture comprising **students**, **property owners**, and **administrators**. Students can search and filter verified listings, view detailed property information including geolocation on an interactive map, submit booking requests, and write reviews. Property owners are provided with a self-service dashboard to create and manage their listings. Administrators oversee the platform through a comprehensive management console supporting user control, listing verification, booking management, and review moderation.

A key innovation of the platform is its **AI-powered recommendation engine**, built on the OpenAI GPT-3.5 Turbo API, which analyses student preferences such as budget, location, and required facilities, and intelligently matches them to the most suitable available listings.

The system is built using a modern technology stack: **React 19** and **Tailwind CSS** on the frontend, **Node.js with Express.js** on the backend, **MongoDB** for persistent data storage, **Supabase Storage** for image hosting, and **JWT-based authentication** for secure access control.

This report documents the complete software development lifecycle of the platform — from background research and requirements analysis through system design, implementation, testing, and deployment — demonstrating how technology can address a tangible socioeconomic problem faced by Sri Lankan undergraduates.

**Keywords:** Boarding Place Finder, University Students, AI Recommendation, MERN Stack, Sri Lanka, Web Platform, Role-Based Access Control

---

---

## List of Figures

| Figure No.  | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| Figure 1.1  | Growth of Sri Lankan university student enrolment (2015–2024) |
| Figure 2.1  | Comparison of existing boarding place search methods          |
| Figure 3.1  | System Architecture Diagram                                   |
| Figure 3.2  | Use Case Diagram — Student                                    |
| Figure 3.3  | Use Case Diagram — Owner                                      |
| Figure 3.4  | Use Case Diagram — Admin                                      |
| Figure 3.5  | Entity-Relationship (ER) Diagram                              |
| Figure 3.6  | Database Schema — User Collection                             |
| Figure 3.7  | Database Schema — Listing Collection                          |
| Figure 3.8  | Database Schema — Booking Collection                          |
| Figure 3.9  | Database Schema — Review Collection                           |
| Figure 4.1  | Home Page — Hero Section                                      |
| Figure 4.2  | Browse Listings Page with Search and Filter                   |
| Figure 4.3  | Listing Details Page with Map and Booking                     |
| Figure 4.4  | AI Recommendation Interface                                   |
| Figure 4.5  | Owner Dashboard — Listing Management                          |
| Figure 4.6  | MapPicker Component — Leaflet Integration                     |
| Figure 4.7  | Admin Dashboard — Analytics Overview                          |
| Figure 4.8  | Admin Listings — Verification Management                      |
| Figure 4.9  | User Registration and Login Pages                             |
| Figure 4.10 | My Profile Page — Contact Details & Bookings                  |
| Figure 5.1  | API Route Structure                                           |
| Figure 5.2  | JWT Authentication Middleware Flow                            |
| Figure 5.3  | Supabase Storage Upload Flow                                  |
| Figure 5.4  | OpenAI Recommendation Prompt and Response Flow                |
| Figure 6.1  | Unit Test Results — Authentication Endpoints                  |
| Figure 6.2  | Unit Test Results — Listing CRUD Endpoints                    |
| Figure 6.3  | Integration Test — Booking Workflow                           |

---

## List of Tables

| Table No. | Description                               |
| --------- | ----------------------------------------- |
| Table 1.1 | Project Objectives mapped to Deliverables |
| Table 2.1 | Comparison of Related Systems             |
| Table 3.1 | Functional Requirements                   |
| Table 3.2 | Non-Functional Requirements               |
| Table 3.3 | User Roles and Permissions Matrix         |
| Table 4.1 | Frontend Technology Stack                 |
| Table 4.2 | Backend Technology Stack                  |
| Table 5.1 | REST API Endpoints — Authentication       |
| Table 5.2 | REST API Endpoints — Listings             |
| Table 5.3 | REST API Endpoints — Bookings             |
| Table 5.4 | REST API Endpoints — Reviews              |
| Table 5.5 | REST API Endpoints — Admin                |
| Table 5.6 | REST API Endpoints — Upload               |
| Table 6.1 | Test Cases — Functional Testing           |
| Table 6.2 | Test Cases — Security Testing             |
| Table 6.3 | Performance Testing Results               |

---

---

# Chapter 1: Introduction

## 1.1 Project Background

Sri Lanka's university education sector has experienced significant growth over the past decade. With increasing undergraduate enrolments across both state universities and degree-awarding institutions — including the Sri Lanka Institute of Information Technology (SLIIT), University of Moratuwa, University of Colombo, and others — tens of thousands of students relocate annually from their home towns to live near their respective campuses. For the majority of these students, university-managed hostels are either unavailable or insufficient in capacity, leaving them with no alternative but to seek private boarding accommodation, colloquially known as _"bodims"_ in Sri Lankan culture.

A _bodim_ is a furnished or unfurnished room or apartment rented out to students, typically located within commuting distance of a university. These range from single-room arrangements in family homes to purpose-built student boarding houses accommodating dozens of residents. The price, quality, safety standards, and available facilities vary enormously across listings.

Despite the scale and importance of this housing market, the process by which students find bodims remains largely informal and archaic. Students predominantly rely on:

- **Word-of-mouth referrals** from seniors or friends already enrolled at the institution.
- **Physical notice boards** on campus or in nearby tea shops and convenience stores.
- **Facebook groups** and WhatsApp communities, which are unstructured and unverified.
- **Direct exploration** — physically walking through surrounding neighbourhoods looking for "Room for Rent" signs.

This informal ecosystem creates several serious problems. Students often arrive at a new city with little information and limited time, forcing rushed and uninformed decisions. Listings are rarely verified, leaving students vulnerable to misleading descriptions, substandard conditions, or even fraudulent postings. There is no reliable mechanism for previous tenants to share experiences or rate properties. Price comparisons across options are difficult, and students from disadvantaged backgrounds may overpay due to lack of market visibility.

From the property owner's perspective, there is equally no reliable digital channel to reach prospective student tenants. Owners typically rely on the same informal networks, limiting their reach and the occupancy rate of their properties.

The absence of a structured, technology-driven platform to connect students with verified boarding places represents a clear gap that this project aims to address.

---

## 1.2 Problem Statement

University students in Sri Lanka face significant difficulties in finding suitable boarding accommodation due to the lack of a centralised, trustworthy, and efficient digital platform. The current landscape of informal, unverified, and fragmented search methods leads to the following core problems:

1. **Information Asymmetry:** Students lack access to accurate, up-to-date, and verified information about available boarding places, including pricing, location, facilities, and real tenant reviews.

2. **Inefficiency of Search:** The absence of a searchable, filterable listing database means students spend excessive time and effort on manual searches, often after arriving in an unfamiliar city.

3. **Absence of Trust Mechanisms:** There is no established platform for students to review properties they have stayed in, making it impossible for new students to benefit from the experiences of prior tenants.

4. **No AI-Driven Personalisation:** Generic listing platforms (where they exist) do not offer intelligent matching between student preferences and available listings.

5. **No Owner Self-Service:** Property owners have no dedicated digital tool to list, manage, and update their properties or respond to booking requests.

6. **Lack of Administrative Oversight:** Without a central platform, there is no way to verify listing authenticity, moderate reviews, or ensure minimum standards are met.

This project directly addresses these problems by developing a full-stack, role-aware web platform with integrated AI recommendation capabilities.

---

## 1.3 Project Objectives

The primary objective of this project is to design and develop a fully functional, AI-enhanced web platform that facilitates the discovery, evaluation, and booking of boarding places for university students in Sri Lanka.

The specific objectives are:

**O1 — Develop a secure, role-based user authentication system**
Implement JWT-based registration and login with three distinct roles: Student, Owner, and Admin, each with role-appropriate access and permissions.

**O2 — Build a searchable and filterable listing module**
Enable property owners to create detailed listings with images, location, price, room availability, and facilities. Enable students to search and filter listings by location, price range, and facilities.

**O3 — Integrate interactive geolocation mapping**
Embed an interactive map (using Leaflet and OpenStreetMap) in the listing creation form and listing detail pages, allowing owners to pin exact property locations and students to view properties geographically.

**O4 — Implement an AI-powered recommendation engine**
Use the OpenAI GPT-3.5 Turbo API to analyse student-submitted preferences and return a ranked, reasoned shortlist of suitable listings from the available pool.

**O5 — Develop a booking and review workflow**
Allow students to submit booking requests against verified listings, allow owners to confirm or reject requests, and allow students to submit ratings and written reviews post-stay.

**O6 — Build a comprehensive admin management console**
Provide an administrator with tools to verify listings, manage user accounts, oversee all bookings, moderate reviews, and view platform-wide analytics.

**O7 — Implement cloud-based image storage**
Integrate Supabase Storage for persistent, publicly accessible hosting of listing images and user profile pictures.

**O8 — Deliver a responsive, accessible user interface**
Design a mobile-responsive frontend using React and Tailwind CSS that provides a consistent experience across desktop and mobile devices.

---

## 1.4 Project Deliverables

The following deliverables have been produced as part of this project:

### Deliverable 1 — Fully Functional Web Application

A deployed full-stack web platform comprising:

| Component        | Technology                   | Description                                                |
| ---------------- | ---------------------------- | ---------------------------------------------------------- |
| Frontend SPA     | React 19, Tailwind CSS, Vite | Responsive single-page application with role-based routing |
| Backend REST API | Node.js, Express.js 5        | RESTful API server with JWT-secured endpoints              |
| Database         | MongoDB, Mongoose            | Document-oriented persistent data store                    |
| Image Storage    | Supabase Storage             | Cloud bucket for listing images and profile pictures       |
| AI Endpoint      | OpenAI GPT-3.5 Turbo         | Intelligent listing recommendation engine                  |
| Map Integration  | Leaflet, OpenStreetMap       | Free, API-key-free interactive maps                        |

### Deliverable 2 — Role-Based User System

Three fully operational user roles:

- **Student:** Register, browse and search listings, submit booking requests, write reviews, receive AI recommendations, and manage their profile.
- **Owner:** Register as an owner, create and manage property listings (including image uploads and map pin), view and respond to incoming booking requests.
- **Admin:** Access a dedicated admin dashboard with analytics, manage all users (including role changes), verify/reject listings, manage bookings, and moderate reviews.

### Deliverable 3 — AI Recommendation Module

An OpenAI-powered endpoint (`POST /api/ai/recommend`) that:

- Accepts a student's structured preferences (budget, location preference, required facilities).
- Sends a formatted prompt with all active verified listings to GPT-3.5 Turbo.
- Returns a ranked, reason-annotated list of the most suitable boarding places.

### Deliverable 4 — RESTful API with 30+ Endpoints

A documented REST API covering authentication, listings, bookings, reviews, AI, admin operations, file upload, and owner-specific management routes.

### Deliverable 5 — Admin Analytics Dashboard

A real-time analytics panel displaying:

- Total users, listings, bookings, and reviews.
- Breakdown of listings by verification status.
- Breakdown of bookings by status (pending / confirmed / cancelled).

### Deliverable 6 — Project Documentation

Comprehensive academic documentation including this report, covering requirements analysis, system design (architecture, ER diagrams, use case diagrams), implementation details, testing strategy and results, and project evaluation.

---

_End of Chapter 1_

---
