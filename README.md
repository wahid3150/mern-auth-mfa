# 🔐 Secure Authentication System (MERN)

A production-ready **authentication and authorization system** built with the **MERN stack**, focusing on modern backend security practices such as **JWT authentication, MFA, rate limiting, CSRF protection, and secure cookies**.

---

## 🚀 Features

* Secure **User Registration & Login**
* **Password Hashing** using bcrypt
* **JWT Access & Refresh Tokens**
* **Two-Factor Authentication (2FA / MFA)**
* **Role-Based Authorization** (Admin / User)
* **IP & Email Rate Limiting**
* **CSRF Protection**
* **NoSQL Injection Protection**
* **Secure Cookies** (httpOnly, secure, sameSite)
* Input validation & sanitization

---

## 🛠 Tech Stack

**Backend**

* Node.js
* Express.js
* MongoDB
* JWT
* bcrypt

**Frontend**

* React
* Axios
* React Router

---

## 📁 Project Structure

```
secure-auth-system
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── utils
│
├── frontend
│   ├── components
│   ├── pages
│   └── services
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```
git clone https://github.com/yourusername/secure-auth-system.git
cd secure-auth-system
```

### 2. Install Dependencies

Backend

```
cd backend
npm install
```

Frontend

```
cd frontend
npm install
```

### 3. Run Project

Backend

```
npm run dev
```

Frontend

```
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
```

---

## 📡 API Endpoints

```
POST /api/user/register
POST /api/user/login
POST /api/user/logout
POST /api/user/refresh
POST /api/user/verify
GET  /api/user/me
GET  /api/user/admin
```

---

## 📚 Learning Focus

This project demonstrates:

* Secure authentication architecture
* Stateless authentication with JWT
* Backend security best practices
* Role-based access control

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Wahid Ali**
MERN Stack Developer 
