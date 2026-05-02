# Bodim Places Finding Web Platform for University Students

A comprehensive full-stack web application designed to help university students easily find, review, and book affordable boarding places ("Bodims"). The platform also features an AI-powered recommendation system to help match students with the most suitable accommodations.

## 🚀 Features

- **User Authentication:** Secure registration and login for both students and landlords (JWT-based).
- **Property Listings:** Landlords can add and manage boarding place listings.
- **Smart Search & AI Recommendations:** Find the best places using OpenAI-powered search and recommendations.
- **Booking System:** Students can seamlessly book available spaces.
- **Rating & Reviews:** Integrated review system for students to rate their stay and share experiences.

## 💻 Tech Stack

### Frontend

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose)
- **AI Integration:** OpenAI API for intelligent features
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs

## 📁 Project Structure

```
├── backend/            # Express server, MongoDB models, controllers, and routes
│   ├── config/         # Database configuration (db.js)
│   ├── controllers/    # API logic (auth, listings, bookings, reviews, ai)
│   ├── middleware/     # Custom middlewares (e.g., Auth protection)
│   ├── models/         # Mongoose schemas (User, Listing, Booking, Review)
│   ├── routes/         # Express API routes
│   └── index.js        # Backend entry point
│
└── frontend/           # React frontend (Vite)
    ├── src/            # React components, styles, and assets
    ├── public/         # Static frontend assets
    └── vite.config.js  # Vite configuration
```

## 🛠️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string
- Output API Key for OpenAI features (optional, but needed for AI endpoints)

### 1. Clone the repository

```bash
git clone https://github.com/Isuru-Eranda/Bodim-Places-Finding-Web-Platform-for-University-Students.git
cd Bodim-Places-Finding-Web-Platform-for-University-Students
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and add your environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Run the backend server:

```bash
# For development
npm run dev

# For production
npm start
```

### 3. Frontend Setup

Open a new terminal session and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Run the frontend development server:

```bash
npm run dev
```

## 📜 License

This project is licensed under the ISC License.
