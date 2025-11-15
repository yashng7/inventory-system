# 🏪 Inventory & Sales Management System

Full-stack inventory and sales management application with role-based access control.

## 🎯 Features

### Customer Features
- ✅ Product browsing with search & filters
- ✅ Shopping cart management
- ✅ Order checkout
- ✅ Order history tracking
- ✅ Real-time stock updates

### Staff Features
- ✅ Sales processing
- ✅ Inventory viewing
- ✅ Sales reports
- ✅ Stock management

### Admin Features
- ✅ Complete product CRUD
- ✅ User management
- ✅ Sales analytics dashboard
- ✅ Low stock alerts
- ✅ Revenue tracking

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- Context API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/yashng7/inventory-system.git
cd inventory-system
```

### 2. Folder structure

```

inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
|   ├── .env
│   └── package.json
└── README.md

```