# Bodim Places Finding Web Platform for University Students

A comprehensive full-stack web application designed to help university students easily find, review, and book affordable boarding places ("Bodims") near their universities. The platform includes an AI-powered recommendation system, a full admin dashboard, role-based access for students, property owners, and administrators, 360° virtual tours, and map-based location picking.

## 🚀 Features

- **User Authentication:** Secure registration and login with role-based access control (JWT-based).
- **User Roles:** Three roles — `student`, `owner`, and `admin` — each with distinct permissions.
- **Property Listings:** Owners can create and manage boarding place listings with images, facilities, location, and pricing.
- **Listing Verification:** Admins can verify listings before they are publicly visible. Listings with images older than 6 months are automatically unverified by a nightly cron job.
- **Smart AI Recommendations:** OpenAI GPT-3.5-powered endpoint to match students with suitable accommodations based on preferences.
- **Booking System:** Students can book available spaces; owners can accept or reject requests; admins can manage all bookings and payment statuses.
- **Ratings & Reviews:** Students can add reviews for listings; admins can moderate them.
- **Admin Dashboard:** Full analytics and management panel for users, listings, bookings, reviews, and contact messages.
- **360° Virtual Tours:** Property owners can upload equirectangular panoramic images; students can explore rooms interactively using the built-in Pannellum viewer.
- **Interactive Map Integration:** Google Maps-based location picker (`MapPicker`) for owners to pin exact property coordinates; full map view on listing detail pages.
- **Owner Dashboard:** Dedicated portal for property owners to manage their listings and handle incoming booking requests.
- **Profile Management:** Users can update personal details, change their password, upload a profile picture, and manage contact/guardian information.
- **Contact System:** Public contact form with admin-side message management (read/unread/replied status, filtering, deletion).
- **Cloud File Storage:** Listing images and 360° panoramas stored securely in Supabase Storage (separate buckets, admin-key-protected 360° uploads).

## 💻 Tech Stack

### Frontend

| Technology             | Version  | Purpose                        |
| ---------------------- | -------- | ------------------------------ |
| React                  | ^19.2.5  | UI library                     |
| React Router DOM       | ^7.14.2  | Client-side routing            |
| Vite                   | ^8.0.10  | Build tool                     |
| Tailwind CSS           | ^3.4.19  | Utility-first CSS framework    |
| Axios                  | ^1.16.0  | HTTP client                    |
| Lucide React           | ^1.14.0  | Icon library                   |
| @react-google-maps/api | ^2.20.8  | Google Maps integration        |
| Leaflet                | ^1.9.4   | Alternative map library        |
| React-Leaflet          | ^5.0.0   | React bindings for Leaflet     |
| Pannellum              | ^2.5.7   | 360° panoramic image viewer    |
| prop-types             | ^15.8.1  | Runtime prop type checking     |
| @supabase/supabase-js  | ^2.105.3 | Supabase client (file storage) |

### Backend

| Technology            | Version   | Purpose                              |
| --------------------- | --------- | ------------------------------------ |
| Node.js               | v20+      | Runtime environment                  |
| Express.js            | ^5.2.1    | Web framework                        |
| MongoDB / Mongoose    | ^9.2.1    | Database & ODM                       |
| JSON Web Tokens       | ^9.0.3    | Authentication tokens                |
| bcryptjs              | ^3.0.3    | Password hashing                     |
| OpenAI SDK            | ^6.35.0   | AI recommendations (GPT-3.5)         |
| @supabase/supabase-js | ^2.105.3  | Supabase client (file storage)       |
| @aws-sdk/client-s3    | ^3.1041.0 | AWS S3 SDK (file storage fallback)   |
| Multer                | ^2.1.1    | File upload middleware               |
| node-cron             | ^4.2.1    | Scheduled jobs (stale listing check) |
| ws                    | ^8.20.0   | WebSocket support for Supabase       |
| dotenv                | ^17.3.1   | Environment variable loading         |

## 📁 Project Structure

```
├── package.json            # Root scripts to run both servers together using concurrently
│
├── backend/
│   ├── index.js            # Express server entry point
│   ├── seed.js             # Database seeding script
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── supabase.js     # Supabase client (default + admin)
│   ├── controllers/        # Route handler logic
│   │   ├── adminController.js
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   ├── listingController.js
│   │   ├── ownerController.js
│   │   └── reviewController.js
│   ├── jobs/
│   │   └── unverifyStaleListings.js  # Nightly cron: unverify 6-month-old listings
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect & role authorize
│   │   └── upload.js           # Multer config (images & 360°)
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Contact.js
│   │   ├── Listing.js
│   │   ├── Review.js
│   │   └── User.js
│   └── routes/
│       ├── admin.js
│       ├── ai.js
│       ├── auth.js
│       ├── bookings.js
│       ├── contact.js
│       ├── listings.js
│       ├── owner.js
│       ├── reviews.js
│       └── upload.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/         # Reusable UI components
        │   ├── FeatureBar.jsx
        │   ├── Footer.jsx
        │   ├── Hero.jsx
        │   ├── ListingCard.jsx
        │   ├── ListingsSection.jsx
        │   ├── MapPicker.jsx
        │   ├── Navbar.jsx
        │   ├── SearchBox.jsx
        │   ├── StatsSection.jsx
        │   ├── Testimonials.jsx
        │   └── Viewer360.jsx
        ├── config/
        │   └── supabase.js     # Supabase frontend client
        ├── context/
        │   └── AuthContext.jsx # Global auth state
        ├── pages/
        │   ├── About.jsx
        │   ├── Browse.jsx
        │   ├── Contact.jsx
        │   ├── ForOwners.jsx
        │   ├── Home.jsx
        │   ├── ListingDetails.jsx
        │   ├── Login.jsx
        │   ├── MyProfile.jsx
        │   ├── Register.jsx
        │   └── admin/
        │       ├── AdminBookings.jsx
        │       ├── AdminDashboard.jsx
        │       ├── AdminLayout.jsx
        │       ├── AdminListings.jsx
        │       ├── AdminMessages.jsx
        │       ├── AdminReviews.jsx
        │       └── AdminUsers.jsx
        └── services/
            └── api.js          # Axios API service layer
```

## 🔑 User Roles

| Role      | Permissions                                                                               |
| --------- | ----------------------------------------------------------------------------------------- |
| `student` | Browse listings, make bookings, add reviews, manage own profile                           |
| `owner`   | Create and manage their own listings, upload images & 360° tours, handle booking requests |
| `admin`   | Full access: manage users, listings, bookings, reviews, contact messages, and analytics   |

## 🌐 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint           | Access    | Description                        |
| ------ | ------------------ | --------- | ---------------------------------- |
| POST   | `/register`        | Public    | Register a new user                |
| POST   | `/login`           | Public    | Login and receive JWT              |
| GET    | `/me`              | Protected | Get current user profile           |
| PUT    | `/profile`         | Protected | Update name / email                |
| PUT    | `/change-password` | Protected | Change password                    |
| PUT    | `/contact-details` | Protected | Update phone / WhatsApp / guardian |
| POST   | `/profile-picture` | Protected | Upload avatar image                |

### Listings — `/api/listings`

| Method | Endpoint | Access       | Description                            |
| ------ | -------- | ------------ | -------------------------------------- |
| GET    | `/`      | Public       | Get all listings (filters, pagination) |
| GET    | `/:id`   | Public       | Get single listing with owner details  |
| POST   | `/`      | Owner, Admin | Create listing                         |
| PUT    | `/:id`   | Owner, Admin | Update listing                         |
| DELETE | `/:id`   | Owner, Admin | Delete listing                         |

### Owner — `/api/owner`

| Method | Endpoint        | Access | Description                               |
| ------ | --------------- | ------ | ----------------------------------------- |
| GET    | `/listings`     | Owner  | Get owner's own listings                  |
| POST   | `/listings`     | Owner  | Create a new listing                      |
| PUT    | `/listings/:id` | Owner  | Update own listing                        |
| DELETE | `/listings/:id` | Owner  | Delete own listing                        |
| GET    | `/bookings`     | Owner  | Get all booking requests for own listings |
| PUT    | `/bookings/:id` | Owner  | Accept or reject a booking request        |

### Bookings — `/api/bookings`

| Method | Endpoint | Access         | Description                 |
| ------ | -------- | -------------- | --------------------------- |
| POST   | `/`      | Student, Admin | Create a booking request    |
| GET    | `/my`    | Protected      | Get current user's bookings |

### Reviews — `/api/reviews`

| Method | Endpoint      | Access    | Description                    |
| ------ | ------------- | --------- | ------------------------------ |
| POST   | `/`           | Protected | Add a review (one per listing) |
| GET    | `/:listingId` | Public    | Get all reviews for a listing  |

### Contact — `/api/contact`

| Method | Endpoint      | Access | Description                   |
| ------ | ------------- | ------ | ----------------------------- |
| POST   | `/`           | Public | Submit a contact message      |
| GET    | `/`           | Admin  | Get all contact messages      |
| PUT    | `/:id/status` | Admin  | Mark message as read / unread |
| DELETE | `/:id`        | Admin  | Delete contact message        |

### Upload — `/api/upload`

| Method | Endpoint | Access       | Description                               |
| ------ | -------- | ------------ | ----------------------------------------- |
| POST   | `/`      | Owner, Admin | Upload up to 10 listing images (Supabase) |
| POST   | `/360`   | Owner, Admin | Upload a 360° panoramic image (Supabase)  |

### AI — `/api/ai`

| Method | Endpoint     | Access    | Description                           |
| ------ | ------------ | --------- | ------------------------------------- |
| POST   | `/recommend` | Protected | Get AI-ranked listing recommendations |

### Admin — `/api/admin`

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| GET    | `/analytics`           | Platform stats & charts data    |
| GET    | `/users`               | List all users (search, filter) |
| PUT    | `/users/:id/role`      | Update user role                |
| DELETE | `/users/:id`           | Delete user                     |
| GET    | `/listings`            | List all listings               |
| PUT    | `/listings/:id/verify` | Verify / unverify a listing     |
| DELETE | `/listings/:id`        | Delete listing                  |
| GET    | `/bookings`            | List all bookings               |
| PUT    | `/bookings/:id`        | Update booking status / payment |
| DELETE | `/bookings/:id`        | Delete booking                  |
| GET    | `/reviews`             | List all reviews                |
| DELETE | `/reviews/:id`         | Delete review                   |

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20+)
- MongoDB running locally or a MongoDB Atlas connection string
- OpenAI API Key (required for AI recommendation features)
- Supabase project with two storage buckets: `listing-images` and `listing-360`
- Google Maps API Key (required for map-based location picking)

### 1. Clone the repository

```bash
git clone https://github.com/Isuru-Eranda/Bodim-Places-Finding-Web-Platform-for-University-Students.git
cd Bodim-Places-Finding-Web-Platform-for-University-Students
```

### 2. Install dependencies

```bash
# Install root dependencies (concurrently manager)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

> Note: The root `package.json` contains the `dev` and `start` scripts that launch both backend and frontend together using `concurrently`.

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Run the application

**Run both frontend and backend together (recommended):**

```bash
# From the project root
npm run dev
```

**Alternative startup command:**

```bash
# From the project root
npm run start
```

**Or run services individually:**

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

### 5. (Optional) Seed the database

```bash
cd backend
node seed.js
```

## 📜 License

This project is licensed under the ISC License.
