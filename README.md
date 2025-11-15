# 🏪 Full-Stack Inventory & Sales Management System

A complete, full-stack inventory and sales management application built with the MERN stack (MongoDB, Express, React, Node.js) and deployed using modern cloud services. This system provides a feature-rich e-commerce experience for customers and powerful management tools for staff and administrators.

 <!-- Replace with your screenshot URL -->
 ![homepage](https://github.com/your-username/inventory-system/assets/thumbnail.png)

### 🚀 Live Demo

-   **Live Frontend:** [https://inventory-system-rust-seven.vercel.app/](https://inventory-system-rust-seven.vercel.app/) <!-- Replace with your Vercel URL -->
-   **Live Backend API:** [https://inventory-system-production-1561.up.railway.app/](https://inventory-system-production-1561.up.railway.app/) <!-- Replace with your Railway URL -->

---

## 🎯 Core Features

### 🛒 Customer Features
-   **Modern E-commerce Homepage**: Engaging and responsive landing page.
-   **Product Catalog**: Browse all products with search and category filtering.
-   **Guest & User Shopping Cart**: Add items to a persistent cart, even without an account.
-   **Seamless Checkout**: Smooth and secure order placement process.
-   **Order History**: Customers can view their past orders and details.
-   **Real-time Stock Updates**: Inventory is automatically updated after every sale.

### 🧑‍💼 Staff Features
-   **Staff Dashboard**: A quick overview of recent sales and inventory status.
-   **Manual Sales Entry**: Staff can process in-person or phone orders.
-   **Sales History**: View and download sales records for reporting.

### 👑 Admin Features
-   **Comprehensive Admin Dashboard**: At-a-glance view of key metrics (revenue, sales counts, low stock items).
-   **Product Management (CRUD)**: Add, view, edit, and delete products.
-   **User Management (CRUD)**: Create, edit, activate/deactivate, and delete staff and customer accounts.
-   **Sales Analytics**: Filter sales by date range and view detailed reports.
-   **Role-Based Access Control**: Secure endpoints and UI components based on user roles (Admin, Staff, Customer).

---

## 🛠️ Tech Stack

### Backend
-   **Node.js & Express.js**: For building the robust REST API.
-   **MongoDB**: NoSQL database for storing all application data.
-   **Mongoose**: Object Data Modeling (ODM) for MongoDB.
-   **JSON Web Tokens (JWT)**: For secure, stateless authentication.
-   **bcryptjs**: For hashing user passwords.
-   **CORS**: To handle cross-origin requests between frontend and backend.

### Frontend
-   **React 18**: For building the user interface.
-   **Vite**: Next-generation frontend tooling for a fast development experience.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **React Router v6**: For client-side routing and navigation.
-
-   **Axios**: For making HTTP requests to the backend API.
-   **React Context API**: For global state management (authentication, cart).

### Testing
-   **Jest & Supertest**: For backend unit and integration testing.
-   **mongodb-memory-server**: For creating an isolated in-memory database for tests.

---

## 📁 Project Structure

```
inventory-sales-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, JWT
│   │   ├── controllers/    # API logic
│   │   ├── middleware/     # Auth, roles, errors
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── tests/          # Jest/Supertest tests
│   │   └── server.js       # Express server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (Auth, Cart)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Top-level page components
│   │   ├── services/       # API call functions
│   │   └── App.jsx         # Main component with routing
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
-   Node.js (v18.x or later)
-   npm or yarn
-   MongoDB Atlas account (or a local MongoDB instance)

### 1. Clone the Repository
```bash
git clone https://github.com/yashng7/inventory-system.git
cd inventory-system
```

### 2. Backend Setup
```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create environment file from the example
cp .env.example .env

# Open .env and add your MongoDB Atlas URI and a JWT_SECRET
nano .env

# Seed the database with initial data (admin, staff, products)
npm run seed:admin
npm run seed:staff
npm run seed:products

# Start the backend server (runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file (not strictly necessary for local dev if backend is on port 5000)
cp .env.example .env

# Start the frontend server (runs on http://localhost:5173)
npm run dev
```
Your application is now running locally!

### 🔐 Default Login Credentials
-   **Admin**: `admin@inventory.com` / `admin123`
-   **Staff**: `staff@inventory.com` / `staff123`

---

## 🧪 Running Tests

To run the backend tests, navigate to the `backend` directory and run:
```bash
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request.
