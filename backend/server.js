import 'dotenv/config';
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();      
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder and subdirectories
const uploadsDir = path.join(__dirname, 'uploads');
const profileDir = path.join(uploadsDir, 'profile');
const artDir = path.join(uploadsDir, 'art');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
}
if (!fs.existsSync(artDir)) {
    fs.mkdirSync(artDir, { recursive: true });
}

// Multer configuration for profile uploads
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Multer configuration for art uploads
const artStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, artDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const uploadProfile = multer({ 
    storage: profileStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
});

const uploadArt = multer({ 
    storage: artStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});

// mongoose.connect("mongodb://localhost:27017/PortfolioDB")
mongoose.connect(process.env.MONGODB_URI || "")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err.message);
    })


// ------------------ SCHEMAS & MODELS ------------------
const introSchema = new mongoose.Schema({
    name: String,
    title: String,
    location: String,
    email: String,
    github: String,
    linkedin: String,
    profileImage: String,
    resumeUrl: String,
    bio: String   
});

const experienceSchema = new mongoose.Schema({
    yearRange: String,
    title: String,
    institution: String,
    location: String,
    description: String
});

const skillSchema = new mongoose.Schema({
    name: String,
    level: String,
    icon: String
});

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: [String],
    githubLink: String,
    vercelLink: String
});

const artSchema = new mongoose.Schema({
    title: String,
    type: String,
    image: String
});

const querySchema = new mongoose.Schema({
    name: String,
    email: String,
    query: String,
    createdAt: { type: Date, default: Date.now }
});

const IntroModel = mongoose.model("Intro", introSchema, "intro");
const ExperienceModel = mongoose.model("Experience", experienceSchema, "experience");
const SkillModel = mongoose.model("Skill", skillSchema, "skill");
const ProjectModel = mongoose.model("Project", projectSchema, "project");
const ArtModel = mongoose.model("Art", artSchema, "art");
const QueryModel = mongoose.model("Query", querySchema, "query");

// ------------------ ROUTES ------------------
app.post("/intro", async (req, res) => {
    const result = await new IntroModel({
        name: req.body.name,
        title: req.body.title,
        location: req.body.location,
        email: req.body.email,
        github: req.body.github,
        linkedin: req.body.linkedin,
        profileImage: req.body.profileImage,
        resumeUrl: req.body.resumeUrl,
        bio: req.body.bio
    });
    const rr = await result.save();
    if (rr) {
        res.send({ statuscode: 1 });
    } else {
        res.send({ statuscode: 0 });
    }
});

app.get('/intro', async (req, res) => {
  try {
    const doc = await IntroModel.findOne().sort({ _id: -1 }).lean();
    if (!doc) return res.status(404).json({ error: 'No intro found' });
    res.json(doc);
  } catch (err) {
    console.error('Error fetching intro:', err);
    res.status(500).json({ error: 'Failed to fetch intro' });
  }
});

app.post('/experience', async (req, res) => {
    try {
        const newExp = new ExperienceModel({
            yearRange: req.body.yearRange,
            title: req.body.title,
            institution: req.body.institution,
            location: req.body.location,
            description: req.body.description
        });
        const rr = await newExp.save();
        res.json({ statuscode: 1, d: rr });
    } catch (err) {
        console.error('Error saving experience:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to save experience' });
    }
});

app.get('/experience', async (req, res) => {
    try {
        const docs = await ExperienceModel.find().lean();
        // Return in user's preferred wrapper
        res.json({ statuscode: 1, d: docs });
    } catch (err) {
        console.error('Error fetching experiences:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to fetch experiences' });
    }
});

// Update an experience
app.put('/experience/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = {
            yearRange: req.body.yearRange,
            title: req.body.title,
            institution: req.body.institution,
            location: req.body.location,
            description: req.body.description
        };
        const updated = await ExperienceModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json({ statuscode: 0, error: 'Not found' });
        res.json({ statuscode: 1, d: updated });
    } catch (err) {
        console.error('Error updating experience:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to update experience' });
    }
});

// Delete an experience
app.delete('/experience/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const removed = await ExperienceModel.findByIdAndDelete(id).lean();
        if (!removed) return res.status(404).json({ statuscode: 0, error: 'Not found' });
        res.json({ statuscode: 1 });
    } catch (err) {
        console.error('Error deleting experience:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to delete experience' });
    }
});

// ==================== SKILL ROUTES ====================

// Create a skill
app.post('/skill', async (req, res) => {
    try {
        const newSkill = new SkillModel({
            name: req.body.name,
            level: req.body.level,
            icon: req.body.icon
        });
        const rr = await newSkill.save();
        res.json({ statuscode: 1, d: rr });
    } catch (err) {
        console.error('Error saving skill:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to save skill' });
    }
});

// Get all skills
app.get('/skill', async (req, res) => {
    try {
        const docs = await SkillModel.find().lean();
        res.json({ statuscode: 1, d: docs });
    } catch (err) {
        console.error('Error fetching skills:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to fetch skills' });
    }
});

// Update a skill
app.put('/skill/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = {
            name: req.body.name,
            level: req.body.level,
            icon: req.body.icon
        };
        const updated = await SkillModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json({ statuscode: 0, error: 'Not found' });
        res.json({ statuscode: 1, d: updated });
    } catch (err) {
        console.error('Error updating skill:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to update skill' });
    }
});

// Delete a skill
app.delete('/skill/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const removed = await SkillModel.findByIdAndDelete(id).lean();
        if (!removed) return res.status(404).json({ statuscode: 0, error: 'Not found' });
        res.json({ statuscode: 1 });
    } catch (err) {
        console.error('Error deleting skill:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to delete skill' });
    }
});

// ==================== PROJECT ROUTES ====================

// Create a project
app.post('/project', async (req, res) => {
    try {
        const newProject = new ProjectModel({
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags || [],
            githubLink: req.body.githubLink,
            vercelLink: req.body.vercelLink
        });
        const rr = await newProject.save();
        res.json({ statuscode: 1, d: rr });
    } catch (err) {
        console.error('Error saving project:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to save project' });
    }
});

// Get all projects
app.get('/project', async (req, res) => {
    try {
        const docs = await ProjectModel.find().lean();
        res.json({ statuscode: 1, d: docs });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to fetch projects' });
    }
});

// Update a project
app.put('/project/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags || [],
            githubLink: req.body.githubLink,
            vercelLink: req.body.vercelLink
        };
        const updated = await ProjectModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json({ statuscode: 0, error: 'Not found' });
        res.json({ statuscode: 1, d: updated });
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to update project' });
    }
});

// Delete a project
app.delete('/project/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const removed = await ProjectModel.findByIdAndDelete(id).lean();
        if (!removed) return res.status(404).json({ statuscode: 0, error: 'Not found' });
        res.json({ statuscode: 1 });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ statuscode: 0, error: 'Failed to delete project' });
    }
});

// ==================== QUERY ROUTES ====================

// Create a query suggestion
app.post('/query', async (req, res) => {
    const newQuery = new QueryModel({
        name: req.body.name,
        email: req.body.email,
        query: req.body.query,
        read: false
    });
    const rr = await newQuery.save();
    res.json({ statuscode: 1, d: rr });
});

// Get all queries
app.get('/query', async (req, res) => {
    const docs = await QueryModel.find().lean();
    res.json({ statuscode: 1, d: docs });
});

// Delete a query
app.delete('/query/:id', async (req, res) => {
    const id = req.params.id;
    const removed = await QueryModel.findByIdAndDelete(id).lean();
    if (!removed) return res.status(404).json({ statuscode: 0, error: 'Not found' });
    res.json({ statuscode: 1 });
});

// ==================== ART ROUTES ====================

// Create an art item
app.post('/art', async (req, res) => {
    const newArt = new ArtModel({
        title: req.body.title,
        type: req.body.type,
        image: req.body.image
    });
    const rr = await newArt.save();
    res.json({ statuscode: 1, d: rr });
});

// Get all art items
app.get('/art', async (req, res) => {
    const docs = await ArtModel.find().lean();
    res.json({ statuscode: 1, d: docs });
});

// Update an art item
app.put('/art/:id', async (req, res) => {
    const id = req.params.id;
    const updates = {
        title: req.body.title,
        type: req.body.type,
        image: req.body.image
    };
    const updated = await ArtModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ statuscode: 0, error: 'Not found' });
    res.json({ statuscode: 1, d: updated });
});

// Delete an art item
app.delete('/art/:id', async (req, res) => {
    const id = req.params.id;
    const removed = await ArtModel.findByIdAndDelete(id).lean();
    if (!removed) return res.status(404).json({ statuscode: 0, error: 'Not found' });
    res.json({ statuscode: 1 });
});

// File upload route for profile photo
app.post('/upload/profile', uploadProfile.single('profileImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ statuscode: 0, error: 'No file uploaded' });
    }
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/profile/${req.file.filename}`;
    res.json({ statuscode: 1, d: { url: fileUrl, filename: req.file.filename } });
});

// File upload route for art photos
app.post('/upload/art', uploadArt.single('artImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ statuscode: 0, error: 'No file uploaded' });
    }
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/art/${req.file.filename}`;
    res.json({ statuscode: 1, d: { url: fileUrl, filename: req.file.filename } });
});

// ------------------- ADMIN AUTH ROUTE -------------------
// Simple password check for admin panel. Set `ADMIN_PASSWORD` in env to customize.
app.post('/auth', (req, res) => {
    const provided = req.body && req.body.password ? String(req.body.password) : '';
    const adminPass = process.env.ADMIN_PASSWORD || '';
    if (provided && provided === adminPass) {
        return res.json({ ok: true });
    }
    return res.json({ ok: false });
});

