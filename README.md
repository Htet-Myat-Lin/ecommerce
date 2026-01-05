# E-commerce Platform

A full-stack e-commerce application built with modern web technologies.

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Order management
- Admin dashboard
- Notification
- Product Review
- Responsive design

## Tech Stack

### Frontend
- React.js (v19)
- TypeScript
- Vite (build tool)
- Zustand (state management)
- TanStack Query (React Query) for data fetching
- React Router DOM
- React Hook Form with Zod validation
- Axios for API calls
- Tailwind CSS for styling
- Flowbite React (UI components)

### Backend
- Node.js
- TypeScript
- Express.js (v5)
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for email services

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. Install dependencies for both frontend and backend
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add your environment variables (see Environment Variables section below)

4. Start the development servers
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend development server (from frontend directory)
   npm run dev
   ```

## Project Structure

```
ecommerce/
├── backend/           # Backend server code (TypeScript)
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic services
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration files
│   │   ├── utils/         # Utility functions
│   │   └── uploads/       # Uploaded files
│   └── tsconfig.json
│
└── frontend/          # Frontend React application (TypeScript + Vite)
    ├── public/        # Static files
    └── src/           # React source code
        ├── api/       # API client functions
        ├── components/ # Reusable components
        ├── pages/     # Page components
        ├── store/     # Zustand stores
        ├── hooks/     # Custom React hooks
        ├── routes/    # Route configuration
        └── utils/     # Utility functions
```

## Available Scripts

### Backend
- `npm start` - Start the production server (runs compiled JavaScript)
- `npm run dev` - Start the development server with tsx watch (TypeScript)
- `npm run build` - Compile TypeScript to JavaScript

### Frontend
- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
EMAIL_USER = 
EMAIL_PASS = 
EMAIL_HOST = 
EMAIL_PORT = 
REFRESH_TOKEN_SECRET = 
REFRESH_TOKEN_EXPIRES_IN = 7d
ACCESS_TOKEN_SECRET = 
ACCESS_TOKEN_EXPIRES_IN = 10m
ADMIN_USER_ID = 
```

