# TalentBridge – Job Portal & Recruitment Management System

TalentBridge is a full-stack MERN application designed to connect job seekers with recruiters through a single platform. It provides job seekers with tools to explore job opportunities and manage applications, while recruiters can publish jobs and manage candidates. Administrators can monitor and manage the overall platform.

## 🚀 Features

### 👨‍💻 Job Seeker
- Register and log in securely.
- Browse and explore available job opportunities.
- Search and view job details.
- Apply for jobs with resume uploads.
- Track application status.
- Manage personal profile.
- Receive application status notifications.
- Mark notifications as read and delete them.

### 🏢 Recruiter
- Register and log in as a recruiter.
- Create and manage company profiles.
- Post new job openings.
- Edit and delete job postings.
- View applicants for posted jobs.
- Download applicant resumes.
- Update application statuses.
- Receive notifications when candidates apply.
- Track unread notifications.

### 🛡️ Admin
- Admin dashboard with platform statistics.
- Manage registered users.
- View and manage job postings.
- Manage job applications.
- Delete users, jobs and applications.
- View platform analytics and registration trends.
- Export analytics reports.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router DOM
- Recharts
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Multer

**Tools**
- Git
- GitHub
- Postman
- MongoDB Compass
- VS Code

## 📁 Project Structure

```text
TalentBridge/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aishwaryas04/talentbridge.git
```

```bash
cd talentbridge
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

The backend will run at:

```text
http://localhost:5000
```

**Note:** Keep your MongoDB connection details and JWT secret private. Never upload your `.env` file to GitHub.

## 🔐 Authentication and Security

- JWT-based authentication.
- Password hashing using bcryptjs.
- Role-based access control.
- Protected routes for Job Seekers, Recruiters and Admins.
- Authorized API requests using JWT tokens.

## 📌 Key Highlights

- Complete MERN stack application.
- Three different user roles with separate dashboards.
- Resume upload and application management.
- Recruiter and job seeker notification systems.
- Admin analytics and management features.
- Responsive user interface.
- REST API integration between frontend and backend.

## 👩‍💻 Developer

**Aishwarya S**

Bachelor of Engineering – Computer Science and Engineering  
Sri Siddhartha Institute of Technology, Tumakuru

- GitHub: [aishwaryas04](https://github.com/aishwaryas04)
- LinkedIn: [Aishwarya S](https://www.linkedin.com/in/aishwarya-s-533730316/)

---

⭐ If you find this project interesting, feel free to explore the repository!