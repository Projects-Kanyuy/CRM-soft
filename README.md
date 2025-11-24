
# 📌 CRM-soft

A modular **Customer Relationship Management (CRM)** system built with a **JavaScript frontend and backend**, designed to help businesses manage clients, contacts, sales information, and internal operations more efficiently.

---

## 📁 Project Structure

```
CRM-soft/
├── backend/        # Node.js / Express API
├── frontend/       # Frontend application (React or JS framework)
├── contacts.csv    # (Sample / test data for contacts)
├── package.json    # Root package file (if monorepo-style)
├── package-lock.json
└── .gitignore
```

Both the **frontend** and **backend** operate independently and can be started separately.
You can run them using their individual instructions below.

---

# 🚀 Features

### ✅ Core CRM Features

* Manage customers and contacts
* Import and export contact data (CSV supported)
* Track interactions and customer information
* Role-based and secure access (depending on backend implementation)

### 🎨 Frontend

* Modern JavaScript UI
* Component-based architecture
* Responsive layout
* Reusable and maintainable design

### ⚙️ Backend

* RESTful API using Node.js
* Modular routing and controllers
* Environment-based configuration
* Supports future integrations (authentication, databases, analytics)

---

# 🛠️ Tech Stack

### Frontend

* **JavaScript (ES6+)**
* CSS / Tailwind / or your chosen styling library
* Build tools depending on setup (Webpack/Vite/CRA)

### Backend

* **Node.js**
* **Express** (or similar framework)
* Middleware for routing, validation, parsing, etc.

### Additional Tools

* CSV handling for contact imports
* Git for version control
* npm for dependency management

---

# 📦 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Projects-Kanyuy/CRM-soft.git
cd CRM-soft
```

---

# ⚙️ Backend Setup

### Step 1 — Navigate Into Backend Folder

```bash
cd backend
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Create an Environment File

Create a file named `.env` in `/backend`:

```
PORT=5000
DATABASE_URL=your_database_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=5001
MONGO_URI= DATABASE_URL
EMAIL_USER_NAME="StellarCRM" 
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=xxxxxxxxxx
EMAIL_PASS="xxxxx
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY= xxxxx
CLOUDINARY_API_SECRET= xxxxx
(If your backend does not use DB/auth yet, keep only `PORT`.)

### Step 4 — Start the Backend

```bash
npm start
```

or for development:

```bash
npm run dev
```

Backend will typically run on:

```
http://localhost:5000
```

---

# 🎨 Frontend Setup

## Step 1 — Navigate to the Frontend Directory

```bash
cd ../frontend
```

## Step 2 — Install Dependencies

```bash
npm install
```

## Step 3 — Run the Frontend

```bash
npm start
```

Frontend will typically run on:

```
http://localhost:3000
```

---

# 🔗 Connecting Frontend with Backend

If the frontend needs API access, create a `.env` inside `frontend/`:

```
REACT_APP_API_URL=http://localhost:5000
```

(Or adjust based on your framework.)

---

# 📂 Data Handling

### contacts.csv

The file inside the project root contains sample contact data.
**Warning:**
If this file includes real customer information, do NOT commit it publicly.
You may want to move it to:

```
/backend/data/contacts-sample.csv
```

And add the real one to `.gitignore`.

---

# 🧪 Testing (optional if implemented)

If tests exist in your backend or frontend:

### Backend tests

```bash
npm test
```

### Frontend tests

```bash
npm run test
```

---

# 🔒 Security Recommendations

* Never commit `.env` files
* Rotate secrets regularly
* Validate CSV uploads to prevent malicious injection
* Enable CORS restrictions
* Add authentication + authorization middleware

If you want, I can add a **Security.md** file.

---

# 🛠️ Development Scripts Summary

### Backend

| Script        | Description                              |
| ------------- | ---------------------------------------- |
| `npm start`   | Start production server                  |
| `npm run dev` | Start development server with hot reload |
| `npm test`    | Run backend tests                        |

### Frontend

| Script          | Description               |
| --------------- | ------------------------- |
| `npm start`     | Start development UI      |
| `npm run build` | Build production frontend |
| `npm test`      | Run frontend tests        |

---

# 🚀 Deployment

### Backend

Deploy to:

* Render
* Railway
* AWS EC2
* Heroku
  (Backend is Node.js → very deployable)

### Frontend

Deploy to:

* Vercel
* Netlify
* GitHub Pages
* Cloudflare Pages

Add environment variables in deployment dashboards.

---

# 📌 Roadmap (Suggested Improvements)

### 🔜 Short-Term

* Add authentication system
* Add database integration (MongoDB, PostgreSQL, MySQL)
* Improve CSV import validation

### 🔜 Medium-Term

* Implement user roles & permissions
* Add activity logs
* Add email/SMS integration

### 🔜 Long-Term

* Full analytics dashboard
* Cloud deployment with CI/CD
* Multi-tenant CRM setup

I can help you plan these next steps if needed.

---

# 🤝 Contribution Guide

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature-xyz
   ```
3. Commit changes:

   ```bash
   git commit -m "Added new feature"
   ```
4. Push the branch:

   ```bash
   git push origin feature-xyz
   ```
5. Open a Pull Request

---


