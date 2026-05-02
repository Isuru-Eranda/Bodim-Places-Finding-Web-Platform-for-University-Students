# Bodim Places Finding Web Platform for University Students

A comprehensive full-stack web application designed to help university students easily find, review, and book affordable boarding places ("Bodims") near their universities. The platform includes an AI-powered recommendation system, a full admin dashboard, and role-based access for students, property owners, and administrators.

## 🚀 Features

- **User Authentication:** Secure registration and login with role-based access control (JWT-based).
- **User Roles:** Three roles — `student`, `owner`, and `admin` — each with distinct permissions.
- **Property Listings:** Owners can create and manage boarding place listings with images, facilities, location, and pricing.
- **Listing Verification:** Admins can verify listings before they are publicly visible.
- **Smart AI Recommendations:** OpenAI-powered endpoint to match students with suitable accommodations.
- **Booking System:** Students can book available spaces; admins can manage all bookings.
- **Ratings & Reviews:** Students can add reviews for listings; admins can moderate them.
- **Admin Dashboard:** Full analytics and management panel for users, listings, bookings, and reviews.

## 💻 Tech Stack

### Frontend

| Technology       | Version |
| ---------------- | ------- |
| React            | ^19.2.5 |
| React Router DOM | ^7.14.2 |
| Vite             | ^8.0.10 |
| Tailwind CSS     | ^3.4.19 |
| Axios            | ^1.16.0 |
| Lucide React     | ^1.14.0 |

### Backend

| Technology         | Version |
| ------------------ | ------- |
| Node.js            | v16+    |
| Express.js         | ^5.2.1  |
| MongoDB / Mongoose | ^9.2.1  |
| JSON Web Tokens    | ^9.0.3  |
| bcryptjs           | ^3.0.3  |
| OpenAI SDK         | ^6.35.0 |
| dotenv             | ^17.3.1 |

## 📁 Project Structure

```
├── package.json            # Root scripts to run both servers concurrently
│
├── backend/
│   ├── index.js            # Express server entry point
│   ├── seed.js             # Database seeding script
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/        # Route handler logic
│   │   ├── adminController.js
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── listingController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect & role authorize
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Listing.js
│   │   ├── Review.js
│   │   └── User.js
│   └── routes/
│       ├── admin.js
│       ├── ai.js
│       ├── auth.js
│       ├── bookings.js
│       ├── listings.js
│       └── reviews.js
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
        │   ├── Navbar.jsx
        │   ├── SearchBox.jsx
        │   ├── StatsSection.jsx
        │   └── Testimonials.jsx
        ├── context/
        │   └── AuthContext.jsx # Global auth state
        ├── pages/
        │   ├── Home.jsx
        │   ├── Browse.jsx
        │   ├── ListingDetails.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminLayout.jsx
        │       ├── AdminListings.jsx
        │       ├── AdminBookings.jsx
        │       ├── AdminReviews.jsx
        │       └── AdminUsers.jsx
        └── services/
            └── api.js          # Axios API service layer
```

## 🔑 User Roles

| Role      | Permissions                                                           |
| --------- | --------------------------------------------------------------------- |
| `student` | Browse listings, make bookings, add reviews                           |
| `owner`   | Create and manage their own listings                                  |
| `admin`   | Full access: manage users, listings, bookings, reviews, and analytics |

## 🌐 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint    | Access    |
| ------ | ----------- | --------- |
| POST   | `/register` | Public    |
| POST   | `/login`    | Public    |
| GET    | `/me`       | Protected |

### Listings — `/api/listings`

| Method | Endpoint | Access       |
| ------ | -------- | ------------ |
| GET    | `/`      | Public       |
| GET    | `/:id`   | Public       |
| POST   | `/`      | Owner, Admin |
| PUT    | `/:id`   | Owner, Admin |
| DELETE | `/:id`   | Owner, Admin |

### Bookings — `/api/bookings`

| Method | Endpoint | Access         |
| ------ | -------- | -------------- |
| POST   | `/`      | Student, Admin |
| GET    | `/my`    | Protected      |

### Reviews — `/api/reviews`

| Method | Endpoint      | Access    |
| ------ | ------------- | --------- |
| POST   | `/`           | Protected |
| GET    | `/:listingId` | Public    |

### AI — `/api/ai`

| Method | Endpoint     | Access    |
| ------ | ------------ | --------- |
| POST   | `/recommend` | Protected |

### Admin — `/api/admin`

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | `/analytics`           | Platform stats        |
| GET    | `/users`               | List all users        |
| PUT    | `/users/:id/role`      | Update user role      |
| DELETE | `/users/:id`           | Delete user           |
| GET    | `/listings`            | List all listings     |
| PUT    | `/listings/:id/verify` | Verify a listing      |
| DELETE | `/listings/:id`        | Delete listing        |
| GET    | `/bookings`            | List all bookings     |
| PUT    | `/bookings/:id`        | Update booking status |
| DELETE | `/bookings/:id`        | Delete booking        |
| GET    | `/reviews`             | List all reviews      |
| DELETE | `/reviews/:id`         | Delete review         |

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas connection string
- OpenAI API Key (required for AI recommendation features)

### 1. Clone the repository

```bash
git clone https://github.com/Isuru-Eranda/Bodim-Places-Finding-Web-Platform-for-University-Students.git
cd Bodim-Places-Finding-Web-Platform-for-University-Students
```

### 2. Install all dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the application

**Run both frontend and backend together (recommended):**

```bash
# From the project root
npm run dev
```

**Or run them separately:**

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
