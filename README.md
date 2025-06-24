

---

# 📦 QGen – Backend API

This is the backend service for **QGen**, an AI-powered interview preparation platform. It handles user authentication, Q\&A session management, and integration with the Gemini API for generating personalized interview questions and answers.

---


## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT** for authentication
* **dotenv** for environment configuration
* **@google/genai** for AI-powered Q\&A
* **Multer** (included for file handling support)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---

## 🚀 How to Run

```bash
npm install
npm run dev
```

Server will start on `http://localhost:8000`

---

## 📁 API Overview

| Method | Route                | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/api/auth/register` | Register a new user               |
| POST   | `/api/auth/login`    | Login and receive JWT token       |
| GET    | `/api/auth/profile`  | Get user details (requires token) |
| POST   | `/api/generate`      | Generate Q\&A using Gemini API    |
| GET    | `/api/saved`         | Fetch saved sessions for user     |

---

## 📄 Folder Structure

```
server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── .env
└── server.js
```

---

## 📬 Contact

Built by **Yash Sharma**

