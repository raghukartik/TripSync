# 🌍 WanderLog

**WanderLog** is a full-stack travel logging application that lets users document their travel experiences, upload photos, and share memories. Built with a modern tech stack and designed to be responsive and user-friendly.

---

## 🔧 Tech Stack

### 🖥️ Frontend
- React.js (with Vite)
- Tailwind CSS
- React Router
- Axios

### 🛠️ Backend
- Node.js
- Express.js
- MongoDB
- Multer (for file uploads)
- dotenv (for environment management)

---

## 📁 Project Structure

```
wanderLog/
├── backend/        # Node.js + Express backend
│   ├── models/
│   ├── uploads/
│   ├── assets/
│   ├── .env
│   └── index.js, etc.
│
├── frontend/
|   ├──wanderLog/
│   |   ├── public/
│   |   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   |   └── vite.config.js, etc.
│   └──
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 🛠️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```
ACCESS_TOKEN_SECRET=your_jwt_secret
```
Create a `config.json` file inside `/backend`:
```
{
    connectionString: your_mongodb_cluster_url
}
```

Then run the backend server:

```bash
npm start
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend dev server:

```bash
npm run dev
```

---

## 📦 API Endpoints 

- `GET /get-user` - Get user
- `POST /image-upload` – Upload images
- `POST /create-account` – Create account
- `POST /login` – Login account
- `POST /add-travel-story` – Add travel story
- `PUT /edit-story/:id` – Edit travel story
- `DELETE /delete-story:id` – delete travel story
- `DELETE /delete-image` – delete image
- `GET /get-all-stories` – Get all travel stories
- `GET /search` – Search stories
- `GET /travel-stories/filter` – Get stories in date range


---

## 📸 Screenshots

> ![alt text](image.png)
> ![alt text](image-1.png)

---

## 📤 Deployment

To be added (e.g. Vercel for frontend, Render for backend).

---

## 🧑‍💻 Author

- [Kartik Raghuwanshi](https://github.com/raghukartik)


