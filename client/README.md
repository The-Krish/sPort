# PORTFOLIO

A full-stack portfolio website with React frontend (Vite) and Express backend (Node.js + MongoDB).

## Features

- ✨ Portfolio showcase with projects, skills, experience, and art gallery
- 📸 Image upload for profile and art photos (Multer)
- 💾 MongoDB database for persistent data
- 🎨 Retro boxy design with Tailwind CSS
- 🔧 Admin panel for managing portfolio content
- 📧 Contact form with queries saved to database

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Mongoose (MongoDB)
- **File Uploads**: Multer
- **UI**: Lucide React icons

## Local Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (free cluster)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/The-Krish/MY-PROJECTS.git
cd porto
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and other settings:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portoDB
PORT=8000
NODE_ENV=development
VITE_API_URL=http://localhost:8000
```

### Run Locally

**Terminal 1 - Backend (Express):**
```bash
node server.js
```
Backend runs on `http://localhost:8000`

**Terminal 2 - Frontend (Vite dev server):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

Admin panel: `http://localhost:5173/admin`

## Deployment

### Deploy Frontend (Vercel)

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo (`MY-PROJECTS`)
   - Vercel auto-detects Vite settings
   - Click "Deploy"

3. **Set environment variables on Vercel**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com` (Render/Railway URL from step 4)
   - Redeploy

### Deploy Backend (Render)

1. **Push latest code to GitHub** (ensure `Procfile` and `.env.example` are committed)

2. **Create Render account** and connect GitHub:
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Select your GitHub repo
   - Choose branch: `main`

3. **Configure**:
   - **Name**: `portfolio-backend` (or your choice)
   - **Runtime**: `Node`
   - **Build command**: `npm install`
   - **Start command**: `node server.js`
   - **Plan**: Free (will auto-shutdown after 15 min inactivity; upgrade for production)

4. **Set Environment Variables**:
   - In Render dashboard, go to Environment
   - Add the following:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `API_BASE_URL`: `https://portfolio-backend-xxxxx.onrender.com` (your Render URL)
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render's default; leave blank to use 8000)

5. **Deploy**:
   - Click "Create Web Service"
   - Render builds and deploys automatically
   - Copy your backend URL (e.g., `https://portfolio-backend-xxxxx.onrender.com`)

6. **Update Vercel frontend**:
   - Go back to Vercel project settings
   - Update `VITE_API_URL` environment variable to your Render backend URL
   - Redeploy the frontend

### Alternative: Deploy Backend to Railway

1. **Connect Railway to GitHub**:
   - Go to https://railway.app
   - Click "Create New Project" → "Deploy from GitHub repo"
   - Select your repo

2. **Set Variables**:
   - Go to Variables tab
   - Add `MONGODB_URI`, `API_BASE_URL`, `NODE_ENV`

3. **Add `start` script** (ensure `package.json` has it):
```json
"start": "node server.js"
```

4. **Deploy** and copy the public URL to your Vercel frontend `VITE_API_URL`

## Environment Variables

### `.env` (Local Development)
```
MONGODB_URI=mongodb+srv://krishhgo23_db_user:OiU0WVrt8B1BQkVB@cluster0.vtetwto.mongodb.net/portoDB
PORT=8000
NODE_ENV=development
VITE_API_URL=http://localhost:8000
```

### Vercel (Frontend)
- `VITE_API_URL`: `https://your-backend-url.com` (Render/Railway backend)

### Render/Railway (Backend)
- `MONGODB_URI`: Your MongoDB connection string
- `API_BASE_URL`: Your deployed backend URL (for file upload responses)
- `NODE_ENV`: `production`

## File Upload Paths

- **Profile photos**: `/uploads/profile/`
- **Art photos**: `/uploads/art/`

On local: Stored on disk in `./uploads/`  
On production: Stored on Render/Railway ephemeral filesystem (will be deleted on redeploy)

**For persistent file storage in production, consider migrating to S3/Cloudinary (see `server.js` for Multer setup).**

## API Endpoints

### Profile
- `GET /intro` - Fetch profile data
- `POST /intro` - Save profile data

### Experience
- `GET /experience` - Get all experiences
- `POST /experience` - Create
- `PUT /experience/:id` - Update
- `DELETE /experience/:id` - Delete

### Skills
- `GET /skill` - Get all skills
- `POST /skill` - Create
- `PUT /skill/:id` - Update
- `DELETE /skill/:id` - Delete

### Projects
- `GET /project` - Get all projects
- `POST /project` - Create
- `PUT /project/:id` - Update
- `DELETE /project/:id` - Delete

### Art
- `GET /art` - Get all art items
- `POST /art` - Create
- `PUT /art/:id` - Update
- `DELETE /art/:id` - Delete

### Queries
- `GET /query` - Get all queries
- `POST /query` - Submit new query
- `DELETE /query/:id` - Delete

### File Uploads
- `POST /upload/profile` - Upload profile photo
- `POST /upload/art` - Upload art photo

## Troubleshooting

### Backend not connecting on Vercel
- Vercel frontend is static; backend must be deployed separately (Render/Railway/Fly)
- Ensure `VITE_API_URL` env var on Vercel points to your backend's public URL
- Check CORS is enabled in `server.js`: `app.use(cors())`

### Uploads not persisting after Render redeploy
- Render uses ephemeral storage; files are deleted on redeploy
- **Solution**: Migrate uploads to AWS S3 or Cloudinary (requires code changes)

### MongoDB connection fails
- Verify connection string in `.env`
- Check MongoDB Atlas network whitelist includes `0.0.0.0/0` (allow all IPs)
- Ensure IP address of Render/Railway is whitelisted

## License

MIT

---

**Made with ❤️ by The-Krish**
