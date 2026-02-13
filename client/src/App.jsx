import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
    Mail, Briefcase, Zap, Code, MapPin, Github, Linkedin, Download, 
    Loader2, Palette, ExternalLink, MessageSquare, Sparkles
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AdminPanel from './Admin.jsx';
import { STATIC_PORTFOLIO } from "./Data/staticPortfolio.jsx";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';



// --- 1. CORE UTILITIES, HOOKS & STYLES ---

// Custom hook for theme classes
const useThemeClasses = () => {
    return useMemo(() => {
        // Dark glassmorphism theme for professional aesthetic
        const mainText = 'text-white';
        const mainBg = 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'; 
        const tileBg = 'bg-white/10 backdrop-blur-xl';
        const tileBorder = 'border-white/20';
        const tileShadow = 'shadow-2xl';
        const tileAccent = 'bg-white/5 backdrop-blur-md';
        const tileAccentBorder = 'border-white/15';
        
        // Define button styles
        const activeClass = 'active:shadow-none active:translate-y-0.5 transition-all duration-75';
        const buttonBase = 'border-2 font-semibold ' + activeClass;
        
        // Input classes
        const inputClass = "bg-white/10 border-2 border-white/20 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400";

        return {
            mainText, mainBg, tileBg, tileBorder, tileShadow, tileAccent, tileAccentBorder,
            activeClass, buttonBase, inputClass,
            
            // Specific button color configurations with glassmorphism
            buttonPrimary: 'bg-cyan-500/60 backdrop-blur-md hover:bg-cyan-500/80 text-white shadow-lg border border-cyan-400/40',
            buttonSecondary: 'bg-slate-700/60 backdrop-blur-md hover:bg-slate-700/80 text-white shadow-lg border border-white/20',
            buttonSuccess: 'bg-emerald-500/60 backdrop-blur-md hover:bg-emerald-500/80 text-white shadow-lg border border-emerald-400/40',
            buttonWarning: 'bg-amber-500/60 backdrop-blur-md hover:bg-amber-500/80 text-white shadow-lg border border-amber-400/40',
            buttonDanger: 'bg-rose-500/60 backdrop-blur-md hover:bg-rose-500/80 text-white shadow-lg border border-rose-400/40',
        };
    }, []);
};

// Glassmorphic Container Component
function Tile({ className = "", children, style = {} }) { 
    const { tileBg, tileBorder, tileShadow } = useThemeClasses();
    
    return (
        <div
            className={`p-4 sm:p-6 ${tileBg} ${tileBorder} border-2 ${tileShadow} rounded-2xl tile-hover ${className}`}
            style={{ ...style, minHeight: '100%' }}
        >
            {children}
        </div>
    );
}

// Global Custom Styles with Glassmorphism (Light mode only)
const CustomStyles = () => {

    const scrollbarThumb = 'rgba(148, 163, 184, 0.5)'; 
    const scrollbarTrack = 'rgba(15, 23, 42, 0.5)'; 
    const scrollbarBorder = 'rgba(100, 116, 139, 0.3)'; 

    return `
        .font-sans {
            font-family: monospace; /* Blocky, digital feel */
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
            .tile-hover:hover {
                transform: none !important; /* Disable hover effects on touch devices */
            }
            body {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }
            input, textarea, button {
                -webkit-user-select: text;
                -khtml-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        }
        
        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }
        
        /* Art gallery enhancements */
        .art-item {
            transform-style: preserve-3d;
            backface-visibility: hidden;
            transition: box-shadow 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            cursor: pointer;
        }
        
        .art-item img {
            transition: transform 0.3s ease;
            will-change: transform;
        }
        
        .art-item p {
            transition: transform 0.3s ease;
            will-change: transform;
        }
        
        .art-item:hover {
            box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
        }
        
        /* Staggered animation classes for different slide directions */
        .art-item:nth-child(4n+1) { /* Left slide */ }
        .art-item:nth-child(4n+2) { /* Right slide */ }
        .art-item:nth-child(4n+3) { /* Top slide */ }
        .art-item:nth-child(4n+4) { /* Bottom slide */ }
        
        /* Enhanced blur effect for initial state */
        .art-item {
            filter: blur(0px);
        }
        
        /* Art gallery grid responsive improvements */
        @media (min-width: 1280px) {
            .art-item:nth-child(6n+1) { /* First in row */ }
            .art-item:nth-child(6n+6) { /* Last in row */ }
        }
        
        /* Parallax background effect */
        .tile-hover {
            background-attachment: fixed;
            background-size: cover;
        }
        
        /* Scroll indicator */
        .scroll-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(34, 211, 238, 0.2);
            border: 2px solid rgba(34, 211, 238, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .scroll-indicator:hover {
            background: rgba(34, 211, 238, 0.3);
            transform: scale(1.1);
        }
        
        .scroll-indicator::after {
            content: '↓';
            color: #22d3ee;
            font-size: 20px;
            font-weight: bold;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        /* Hide scroll indicator on mobile */
        @media (max-width: 768px) {
            .scroll-indicator {
                display: none;
            }
        }
        
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: ${scrollbarTrack};
            border-left: 2px solid ${scrollbarBorder};
            backdrop-filter: blur(10px);
        }
        ::-webkit-scrollbar-thumb {
            background: ${scrollbarThumb};
            border: 1px solid ${scrollbarBorder};
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
        }
        @keyframes spin-globe {
            0% { transform: rotateY(0deg) rotateX(5deg); }
            100% { transform: rotateY(360deg) rotateX(5deg); }
        }
        .animate-spin-globe {
            animation: spin-globe 12s linear infinite;
        }
        @keyframes pulse-glow {
            0%, 100% {
                opacity: 1;
                filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.5));
            }
            50% {
                opacity: 0.8;
                filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.8));
            }
        }
        .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-8px);
            }
        }
        @keyframes glow {
            0%, 100% {
                box-shadow: 0 0 5px rgba(34, 211, 238, 0.2);
            }
            50% {
                box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
            }
        }
        .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
        }
        .animate-slideInLeft {
            animation: slideInLeft 0.6s ease-out;
        }
        .animate-slideInRight {
            animation: slideInRight 0.6s ease-out;
        }
        .animate-float {
            animation: float 8s ease-in-out infinite;
        }
        .animate-glow {
            animation: glow 2s ease-in-out infinite;
        }
        * {
            border-radius: inherit;
        }
        .max-w-query {
            max-width: 400px;
        }
    `;
};

// Decoding Text Effect
function DecodingText({ text, speed = 80 }) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%!^&*()-+={[}]|\\:;\"'<,>.?/~`";
    const [displayedText, setDisplayedText] = useState(
        text.split('').map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
    );
    const [index, setIndex] = useState(0);

    const decodingColor = 'text-rose-400';

    useEffect(() => {
        if (index >= text.length) return;

        const timeout = setTimeout(() => {
            setDisplayedText(prev => {
                let newText = prev.split('');
                newText[index] = text[index];
                for (let i = index + 1; i < text.length; i++) {
                    newText[i] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
                return newText.join('');
            });
            setIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timeout);
    }, [text, index, speed]);

    useEffect(() => {
        setDisplayedText(
            text.split('').map(() => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
        );
        setIndex(0);
    }, [text]);

    return <span className={decodingColor}>{displayedText}</span>; 
}

// Unique ID generator (safe check for environments without `crypto`)
const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 9) + Date.now();


// Removed built-in initial data constants (skills, projects, artProjects, experiences, queries)


// =================================================================
// --- 3. PORTFOLIO VIEW COMPONENTS (The "Public" View) ---
// =================================================================

function Header() { 
    const { tileAccentBorder } = useThemeClasses();

    return (
        <header className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 ${tileAccentBorder} mb-3 pb-3 animate-fadeInUp`}>
            {/* --- Header Start --- */}
            <Link to="/adminKrish" className="hover:opacity-80 transition-opacity flex items-center gap-3">
                <Sparkles className={`w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-pulse-glow`} />
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 sm:mb-0 bg-white/80 bg-clip-text text-transparent cursor-pointer`}>
                    MY-WORLD
                </h1>
            </Link>
            {/* --- Header End --- */}
        </header>
    );
}

function Hero({ profile }) {
    const { mainText, tileAccentBorder, activeClass } = useThemeClasses();
    
    


    return (


        <Tile className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* --- Hero Start --- */}
            {/* --- Profile Image, Decoding Name, Title (ProfileBlock) Start --- */}
            <div className="md:col-span-1 flex flex-col items-center justify-center">
                <img 
                    src={profile.profileImage}
                    alt={profile.name} 
                    className={`w-24 h-24 sm:w-32 sm:h-32 border-2 object-cover bg-black rounded-xl backdrop-blur-sm ring-4 shadow-xl animate-float transition-all duration-300 hover:shadow-cyan-400/20 profile-image`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = "./public/krishhh.jpg"; }}
                />
                <h2 className={`text-lg sm:text-xl font-bold mt-4 ${mainText}`}>
                    <DecodingText text={profile.name} speed={100} />
                </h2>
                <p className={`text-sm text-slate-400 italic text-center`}>{profile.title}</p>
                
                <a 
                    href={profile.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`mt-3 p-2 text-xs bg-emerald-600  text-white shadow-lg ${activeClass} rounded-lg border border-emerald-400/40 backdrop-blur-sm flex items-center justify-center gap-1 font-semibold`} 
                    title="Download Resume/CV"
                >
                    <Download className="w-4 h-4" />Resume </a>
            </div>
            {/* --- ProfileBlock End --- */}

            {/* --- Biography, Contact, and Social Links --- */}
            <div className="md:col-span-2">
                <h3 className={`text-xl sm:text-2xl font-extrabold border-b-2 ${tileAccentBorder} pb-2 mb-3 ${mainText} bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>BIOGRAPHY BLOCK</h3>
                <p className={`whitespace-pre-wrap ${mainText} mb-4 text-sm sm:text-base`}>{profile.bio}</p>
                
                {/* Contact and Location */}
                <div className={`flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm font-semibold mb-4 ${mainText}`}>
                    <span className={`flex items-center gap-1 text-rose-400`}><MapPin className="w-4 h-4"/> {profile.location}</span>
                    <a href={`mailto:${profile.email}`} className={`flex items-center gap-1 text-cyan-300 hover:text-cyan-200`}>
                        <Mail className="w-4 h-4"/> {profile.email}
                    </a>
                </div>
                
                <h4 className={`text-base sm:text-lg font-bold border-b-2 ${tileAccentBorder} pb-1 mb-2 ${mainText} bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent`}>CRITICAL LINKS:</h4>
                <div className="flex flex-wrap gap-3">
                    <a 
                        href={profile.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-700/60 backdrop-blur-md hover:bg-slate-700/80 text-white border border-white/20 rounded-lg shadow-lg ${activeClass}`}
                    >
                        <Github className="w-4 h-4"/> GITHUB CODE MINE
                    </a>
                    <a 
                        href={profile.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-blue-700/60 backdrop-blur-md hover:bg-blue-700/80 text-white border border-blue-400/30 rounded-lg shadow-lg ${activeClass}`}
                    >
                        <Linkedin className="w-4 h-4"/> LINKEDIN PROFESSION BLOCK
                    </a>
                </div>
            {/* --- Biography/Links Block End --- */}
            {/* --- Hero End --- */}
            </div>
            {/* --- WorkQueryBlock End --- */}
        </Tile>
    );
}

function Skills({ skills }) {
    const { mainText, tileAccentBorder, tileAccent } = useThemeClasses();

    return (
        <Tile className="h-fit">
            {/* --- Skills Start --- */}
            <h3 className={`text-lg sm:text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-2 mb-4 flex items-center gap-2 ${mainText} bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent`}><Zap className="w-4 h-4 sm:w-5 sm:h-5"/> SKILL BLOCKS</h3>
            <ul className="space-y-2">
                {skills.map(skill => (
                    <li key={skill.id} className={`p-3 ${tileAccent} border ${tileAccentBorder} rounded-lg shadow-md flex justify-between items-center hover:bg-white/15 transition-all duration-200 skill-item`}>
                        <span className={`font-semibold ${mainText}`}>{skill.icon} {skill.name}</span>
                        <span className={`text-xs px-2 py-1 border border-emerald-400/40 text-white bg-emerald-500/20 backdrop-blur-sm rounded-md font-semibold skill-level`}>
                            {skill.level}
                        </span>
                    </li>
                ))}
            </ul>
            {/* --- Skills End --- */}
        </Tile>
    );
}

function ExperienceTimeline({ experiences }) {
    const { mainText, tileAccentBorder, tileAccent } = useThemeClasses();
    
    const sortedExperiences = useMemo(() => {
        return [...experiences].sort((a, b) => b.yearRange.localeCompare(a.yearRange));
    }, [experiences]);

    return (
        <Tile className="h-fit">
            {/* --- ExperienceTimeline Start --- */}
            <h3 className={`text-lg sm:text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-2 mb-4 flex items-center gap-2 ${mainText} bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent`}>
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5"/> EXPERIENCE & EDUCATION LOGS
            </h3>
            <div className="space-y-6">
                {sortedExperiences.map((item) => (
                    <div key={item.id} className={`relative p-4 border-l-2 ${tileAccentBorder} timeline-item`}>
                        {/* Timeline Pin (Block) */}
                        <div className={`absolute -left-3 top-0 w-6 h-6 border-2 border-white bg-green-500/80 backdrop-blur-sm rounded-full flex items-center justify-center`}>
                            <span className={`w-2 h-2 bg-white block rounded-full`}></span>
                        </div>
                        
                        <div className={`p-4 ${tileAccent} border ${tileAccentBorder} rounded-xl shadow-md hover:bg-white/15 transition-all duration-200`}>
                            <p className={`text-sm font-mono font-semibold mb-1 text-rose-400`}>
                                {item.yearRange}
                            </p>
                            <h4 className={`text-lg font-bold ${mainText}`}>{item.title}</h4>
                            <p className={`text-base italic text-slate-300 mb-2`}>{item.institution} ({item.location})</p>
                            <p className={`text-sm text-slate-400`}>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* --- ExperienceTimeline End --- */}
        </Tile>
    );
}

function Projects({ projects, title, icon, className = "" }) {
    const { mainText, tileAccentBorder, tileAccent, activeClass } = useThemeClasses();

    return (
        <Tile className={`h-fit`}>
            {/* --- Projects Start --- */}
            <h3 className={`text-lg sm:text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-2 mb-4 flex items-center gap-2 ${mainText} bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent`}>{icon} {title.toUpperCase()} PROJECTS </h3>
            <div className="space-y-4">
                {projects.map(project => (
                    <div key={project.id} className={`p-4 ${tileAccent} border ${tileAccentBorder} rounded-xl shadow-md hover:bg-white/15 transition-all duration-200 project-card`}>
                        <h4 className={`text-lg font-bold ${mainText}`}>{project.title}</h4>
                        <p className={`text-sm text-slate-300 my-2`}>{project.description}</p>
                        
                        <div className="flex justify-between items-end mt-3">
                            {/* Project Tags */}
                            {project.tags && Array.isArray(project.tags) && (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className={`text-xs font-mono px-2 py-1 border border-cyan-400/40 rounded-md bg-cyan-500/20 backdrop-blur-sm text-cyan-300 font-semibold`}>{tag}</span>
                                    ))}
                                </div>
                            )}

                            {/* Links/Apps */}
                            <div className="flex gap-2">
                                {project.githubLink && (
                                    <a 
                                        href={project.githubLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={`flex items-center justify-center h-8 w-8 text-sm font-semibold border ${tileAccentBorder} ${activeClass} bg-gray-700/60 backdrop-blur-md hover:bg-gray-700/80 text-white rounded-lg shadow-md`}
                                        title="View Source Code (GitHub)"
                                    >
                                        <Github className="w-4 h-4"/>
                                    </a>
                                )}
                                {project.vercelLink && (
                                    <a 
                                        href={project.vercelLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={`flex items-center justify-center h-8 w-8 text-sm font-semibold border ${tileAccentBorder} ${activeClass} bg-lime-500/60 backdrop-blur-md hover:bg-lime-500/80 text-white rounded-lg shadow-md`}
                                        title="View Live App (Vercel/Demo)"
                                    >
                                        <ExternalLink className="w-4 h-4"/>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* --- Projects End --- */}
        </Tile>
    );
}

function ArtGallery({ artProjects }) {
    const { mainText, tileAccentBorder, tileAccent } = useThemeClasses();

    return (
        <Tile className="h-fit">
            {/* --- ArtGallery Start --- */}
            <h3 className={`text-lg sm:text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-2 mb-4 flex items-center gap-2 ${mainText} bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent`}><Palette className="w-4 h-4 sm:w-5 sm:h-5"/> MY SKETCHES GALLERY</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {artProjects.map(art => (
                    <div key={art.id} className={`p-3 ${tileAccent} border ${tileAccentBorder} rounded-xl shadow-md hover:bg-white/15 transition-all duration-200 art-item`}>
                        <img 
                            src={art.image} 
                            alt={art.title} 
                            className={`w-full h-auto border ${tileAccentBorder} object-cover mb-2 bg-slate-700/40 rounded-lg`}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/000000/FFFFFF?text=K"; }}
                        />
                        <p className={`text-sm font-semibold leading-tight ${mainText}`}>{art.title}</p>
                        <p className={`text-xs text-slate-400 italic`}>{art.type}</p>
                    </div>
                ))}
            </div>
            {/* --- ArtGallery End --- */}
        </Tile>
    );
}

function WorkQueryBlock({ setQueries }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); 
    const [statusMessage, setStatusMessage] = useState('');
    
    const { mainText, tileAccentBorder, buttonPrimary, buttonDanger, activeClass } = useThemeClasses();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('error');
            setStatusMessage('Error: All required fields must be filled!');
            setTimeout(() => { setStatus(null); setStatusMessage(''); }, 3000);
            return;
        }

        setStatus('pending');
        setStatusMessage('Sending chunk request...');

        const sendQuery = async () => {
            const res = await fetch(`${API_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    query: formData.message
                })
            });
            if (res.ok) {
                const body = await res.json();
                const newQuery = body.d;
                setQueries(prev => [{ 
                    id: newQuery._id || generateId(), 
                    name: newQuery.name, 
                    email: newQuery.email, 
                    query: newQuery.query
                }, ...prev]);
                
                setStatus('success');
                setStatusMessage('SUCCESS! Your work query has been logged in my queue.');
                setFormData({ name: '', email: '', message: '' }); 
                setTimeout(() => { setStatus(null); setStatusMessage(''); }, 4000);
            } else {
                setStatus('error');
                setStatusMessage('Failed to send query. Please try again.');
                setTimeout(() => { setStatus(null); setStatusMessage(''); }, 3000);
            }
        };

        sendQuery();
    };

    const isPending = status === 'pending';
    const isSuccess = status === 'success';
    const _buttonClasses = isSuccess 
        ? buttonDanger 
        : buttonPrimary;
    const buttonText = isPending ? 'TRANSMITTING...' : (isSuccess ? 'SENT!' : 'SEND QUERY');
    
    let statusClasses = '';
    if (status === 'success') {
        statusClasses = 'text-emerald-300 border-emerald-400/40 bg-emerald-500/20';
    } else if (status === 'error') {
        statusClasses = 'text-rose-300 border-rose-400/40 bg-rose-500/20';
    }

    return (
        <Tile className="h-fit">
            <h3 className={`text-lg sm:text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-2 mb-4 flex items-center gap-2 ${mainText} bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent`}>
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5"/> WORK QUERY / SUGGETIONS
            </h3>
            
            <p className={`text-sm text-slate-400 mb-4`}>
                Need a specific feature, component, or full stack app chunk coded? Send a detailed request here.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className={`text-sm font-semibold ${mainText} mb-1`} htmlFor="query-name">Your Name</label>
                        <input
                            id="query-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-white/10 backdrop-blur-md border border-white/20 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-slate-400"
                            placeholder="Name Here"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className={`text-sm font-semibold ${mainText} mb-1`} htmlFor="query-email">Your Email</label>
                        <input
                            id="query-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-white/10 backdrop-blur-md border border-white/20 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-slate-400"
                            placeholder="gmail here"
                        />
                    </div>
                </div>
                
                <div className="flex flex-col">
                    <label className={`text-sm font-semibold ${mainText} mb-1`} htmlFor="query-message">Work Query Details</label>
                    <textarea
                        id="query-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-slate-400 resize-none"
                        placeholder="yoou query here..."
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 gap-3">
                    {statusMessage && (
                        <p className={`text-sm font-medium border-2 p-3 rounded-lg ${statusClasses} backdrop-blur-sm`}>
                            {statusMessage}
                        </p>
                    )}
                    <button 
                        type="submit"
                        disabled={isPending}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 text-base rounded-lg font-semibold border border-white/60 ${activeClass} ${buttonPrimary} w-full sm:w-auto sm:ml-auto`}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mail className="w-5 h-5"/>} {buttonText}
                    </button>
                </div>
            </form>
        </Tile>
    );
}

// FOOTER COMPONENT
function Footer({ email }) {
    return (
        <footer className={`mt-8 pt-4 border-t-2 border-white/20 text-center`}>
            <p className={`text-sm font-semibold p-4 border-2 border-white/20 rounded-xl shadow-lg inline-block bg-white/10 backdrop-blur-md text-white`}>
                KRISH•2025: <a href={`mailto:${email}`} className={`text-cyan-400 hover:text-cyan-300 underline font-bold`}>{email}</a>
            </p>
        </footer>
    );
}


function PortfolioView({ data, setQueries }) {
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const heroRef = useRef(null);
    const skillsRef = useRef(null);
    const projectsRef = useRef(null);
    const experienceRef = useRef(null);
    const artRef = useRef(null);
    const queryRef = useRef(null);
    const footerRef = useRef(null);

    useEffect(() => {
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        const isMobile = window.innerWidth < 768;
        
        const tl = gsap.timeline();
        
        // Initial setup - hide elements
        gsap.set([headerRef.current, heroRef.current, skillsRef.current, projectsRef.current, experienceRef.current, artRef.current, queryRef.current, footerRef.current], {
            opacity: 0,
            y: isMobile ? 20 : 50
        });

        // Adjust animation settings for mobile
        const duration = isMobile ? 0.5 : 0.8;
        const staggerDelay = isMobile ? 0.1 : 0.2;

        // Animate header first
        tl.to(headerRef.current, {
            opacity: 1,
            y: 0,
            duration: duration,
            ease: "power2.out"
        })
        // Animate hero section
        .to(heroRef.current, {
            opacity: 1,
            y: 0,
            duration: duration,
            ease: "power2.out"
        }, isMobile ? "-=0.3" : "-=0.4")
        // Stagger animate the grid items
        .to([skillsRef.current, projectsRef.current, experienceRef.current], {
            opacity: 1,
            y: 0,
            duration: duration * 0.8,
            stagger: staggerDelay,
            ease: "power2.out"
        }, isMobile ? "-=0.3" : "-=0.4")
        // Animate art gallery
        .to(artRef.current, {
            opacity: 1,
            y: 0,
            duration: duration,
            ease: "power2.out"
        }, isMobile ? "-=0.1" : "-=0.2")
        // Add a subtle loading pulse to art items initially
        .to('.art-item', {
            scale: 1.02,
            duration: 0.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1
        }, "-=0.5")
        // Animate query block
        .to(queryRef.current, {
            opacity: 1,
            y: 0,
            duration: duration * 0.8,
            ease: "power2.out"
        }, isMobile ? "-=0.3" : "-=0.4")
        // Animate footer
        .to(footerRef.current, {
            opacity: 1,
            y: 0,
            duration: duration * 0.8,
            ease: "power2.out"
        }, isMobile ? "-=0.1" : "-=0.2");

        // Add scroll-triggered animations for page opening effect
        if (!isMobile) {
            // Animate skill items as they come into view
            gsap.utils.toArray('.skill-item').forEach((item, index) => {
                gsap.fromTo(item, 
                    { 
                        opacity: 0, 
                        x: index % 2 === 0 ? -50 : 50,
                        scale: 0.8 
                    },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Animate project cards with stagger
            gsap.utils.toArray('.project-card').forEach((card, index) => {
                gsap.fromTo(card,
                    { 
                        opacity: 0, 
                        y: 60,
                        rotateY: -15
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotateY: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "bottom 15%",
                            toggleActions: "play none none reverse"
                        },
                        delay: index * 0.1
                    }
                );
            });

            // Animate experience timeline items
            gsap.utils.toArray('.timeline-item').forEach((item, index) => {
                gsap.fromTo(item,
                    { 
                        opacity: 0, 
                        x: -100,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 75%",
                            end: "bottom 25%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Animate art gallery items with sophisticated slide effects
            gsap.utils.toArray('.art-item').forEach((item, index) => {
                const row = Math.floor(index / 6); // Assuming 6 items per row on xl screens
                const col = index % 6;
                
                // Create different slide directions based on position
                let slideDirection = { x: 0, y: 0 };
                let rotation = 0;
                
                if (row % 2 === 0) {
                    // Even rows: slide from left, right, top, bottom alternately
                    if (col % 4 === 0) slideDirection = { x: -100, y: 0 }; // Left
                    else if (col % 4 === 1) slideDirection = { x: 100, y: 0 }; // Right  
                    else if (col % 4 === 2) slideDirection = { x: 0, y: -100 }; // Top
                    else slideDirection = { x: 0, y: 100 }; // Bottom
                } else {
                    // Odd rows: diagonal slides with rotation
                    if (col % 3 === 0) {
                        slideDirection = { x: -80, y: -80 };
                        rotation = -15;
                    } else if (col % 3 === 1) {
                        slideDirection = { x: 80, y: -80 };
                        rotation = 15;
                    } else {
                        slideDirection = { x: 0, y: 80 };
                        rotation = 5;
                    }
                }
                
                gsap.fromTo(item,
                    { 
                        opacity: 0, 
                        x: slideDirection.x,
                        y: slideDirection.y,
                        rotation: rotation,
                        scale: 0.7,
                        filter: 'blur(10px)'
                    },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotation: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 1.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 95%",
                            end: "bottom 5%",
                            toggleActions: "play none none reverse"
                        },
                        delay: (row * 0.1) + (col * 0.05) // Staggered delay based on position
                    }
                );
            });

            // Add hover effects for art gallery items
            gsap.utils.toArray('.art-item').forEach((item) => {
                const image = item.querySelector('img');
                const title = item.querySelector('p:first-of-type');
                const type = item.querySelector('p:last-of-type');
                
                item.addEventListener('mouseenter', () => {
                    gsap.to(item, {
                        scale: 1.05,
                        y: -10,
                        duration: 0.3,
                        ease: "power2.out",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    });
                    gsap.to(image, {
                        scale: 1.1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    gsap.to([title, type], {
                        y: -2,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                    });
                    gsap.to(image, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    gsap.to([title, type], {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                item.addEventListener('click', () => {
                    gsap.to(item, {
                        scale: 0.95,
                        duration: 0.1,
                        ease: "power2.out",
                        yoyo: true,
                        repeat: 1
                    });
                });
            });
        }

        // Add hover animations only on desktop
        if (!isMobile) {
            const tiles = gsap.utils.toArray('.tile-hover');
            tiles.forEach(tile => {
                tile.addEventListener('mouseenter', () => {
                    gsap.to(tile, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                tile.addEventListener('mouseleave', () => {
                    gsap.to(tile, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });

            // Floating animation for profile image
            const profileImg = document.querySelector('.profile-image');
            if (profileImg) {
                gsap.to(profileImg, {
                    y: -10,
                    duration: 2,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }

            // Pulse animation for skill levels
            const skillLevels = gsap.utils.toArray('.skill-level');
            skillLevels.forEach(level => {
                gsap.to(level, {
                    scale: 1.05,
                    duration: 1.5,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: Math.random() * 2
                });
            });
        }

        // Hide scroll indicator on scroll
        const handleScroll = () => {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                if (window.scrollY > 100) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* --- PortfolioView Start --- */}
            <div ref={headerRef}>
                <Header profile={data.portfolioData} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-min">
                <div ref={heroRef} className="lg:col-span-8">
                    <Hero profile={data.portfolioData} />
                </div>
                <div ref={skillsRef} className="lg:col-span-4">
                    <Skills skills={data.skills} />
                </div>
                <div ref={projectsRef} className="lg:col-span-6">
                    <Projects 
                        projects={data.projects} 
                        title="Code" 
                        icon={<Code className="w-5 h-5"/>} 
                    />
                </div>
                
                <div ref={experienceRef} className="lg:col-span-6">
                    <ExperienceTimeline experiences={data.experiences} />
                </div>
                
                <div ref={artRef} className="lg:col-span-12">
                    <ArtGallery artProjects={data.artProjects} />
                </div>

                <div ref={queryRef} className="lg:col-span-12">
                    <WorkQueryBlock setQueries={setQueries} />
                </div>
            </div>

            <div ref={footerRef}>
                <Footer email={data.portfolioData.email} />
            </div>
            
            {/* Scroll Indicator */}
            <div 
                className="scroll-indicator"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                title="Scroll to explore"
            ></div>
            
            {/* --- PortfolioView End --- */}
        </div>
    );
}


// --- 5. ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught an error in component:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`p-8 md:p-10 border-2 border-rose-500/40 bg-rose-500/20 backdrop-blur-xl text-white rounded-2xl shadow-lg max-w-xl mx-auto mt-20`}>
          <h1 className="text-3xl font-bold border-b-2 border-rose-500/40 pb-3 mb-2">🚨 WORLD ERROR: CHUNK FAILED TO LOAD!</h1>
          <p className="mt-4 text-slate-200">
            A critical error occurred while rendering the interface. The world has temporarily paused.
          </p>
          <details className="mt-4 bg-white/5 backdrop-blur-md p-3 border border-white/20 rounded-lg text-sm">
             <summary className="font-semibold cursor-pointer hover:opacity-80 transition-opacity text-slate-100">Click to inspect broken item (Debugging)</summary>
             <pre className="mt-3 text-xs whitespace-pre-wrap overflow-auto bg-slate-900/50 p-2 rounded border border-white/20 text-slate-300">
                 {this.state.error && this.state.error.toString()}
             </pre>
             {this.state.errorInfo?.componentStack && (
                <pre className="mt-3 text-xs whitespace-pre-wrap overflow-auto border-t border-white/20 pt-2 bg-slate-900/50 p-2 rounded text-slate-300">
                    {this.state.errorInfo.componentStack}
                </pre>
             )}
          </details>
          <button 
              className="mt-4 px-4 py-2 bg-amber-500/60 backdrop-blur-md text-white border border-amber-400/40 rounded-lg font-bold shadow-lg hover:bg-amber-500/70 transition-all" 
              onClick={() => window.location.reload()}
          >
              RELOAD WORLD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}



// --- 6. MAIN APPLICATION COMPONENT ---

// Removed initialPortfolioData; portfolio initializes from backend or empty defaults

export default function App() {
    const [portfolioData, setPortfolioData] = useState( STATIC_PORTFOLIO.portfolioData);
    const [skills, setSkills] = useState( STATIC_PORTFOLIO.skills);
    const [projects, setProjects] = useState(STATIC_PORTFOLIO.projects);
    const [artProjects, setArtProjects] = useState(STATIC_PORTFOLIO.artProjects);
    const [experiences, setExperiences] = useState(STATIC_PORTFOLIO.experiences);
    const [queries, setQueries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // theme toggling removed - fixed light theme
    
    const data = { portfolioData, skills, projects, artProjects, experiences, queries };
    const { mainBg, mainText } = useThemeClasses();
    const [isAdminAuth, setIsAdminAuth] = useState(() => !!(typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('adminAuth')));

    function AdminAuth({ onSuccess }) {
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [pending, setPending] = useState(false);

        const submit = async (e) => {
            e && e.preventDefault();
            setPending(true); setError('');
            try {
                const res = await fetch(`${API_URL}/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });
                const body = await res.json().catch(() => null);
                if (body && body.ok) {
                    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem('adminAuth', '1');
                    setIsAdminAuth(true);
                    onSuccess && onSuccess();
                } else {
                    setError('Invalid password');
                }
            } catch (error) {
                console.error(error);
                setError('Network error');
            } finally { setPending(false); }
        };

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Admin Login</h2>
                    <form onSubmit={submit} className="space-y-3">
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full p-2 border border-white/20 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-slate-400" />
                        {error && <div className="text-sm text-rose-400 font-semibold">{error}</div>}
                        <div className="flex justify-end">
                            <button type="submit" disabled={pending} className="px-4 py-2 bg-gradient-to-r from-cyan-500/60 to-blue-500/60 hover:from-cyan-600/60 hover:to-blue-600/60 border border-cyan-400/40 rounded-lg font-semibold text-white shadow-md">{pending ? 'Checking...' : 'Enter'}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Helper to fetch and normalize server responses.
    // Server sometimes returns { statuscode: 1, d: ... } or raw documents; normalize to the inner data.
    const fetchJson = async (endpoint, options) => {
        try {
            const res = await fetch(`${API_URL}${endpoint}`, options);
            if (!res.ok) {
                console.error(`API request failed: ${endpoint} -> ${res.status}`);
                return null;
            }
            const body = await res.json().catch(() => null);
            console.log('fetchJson', endpoint, body);
            if (!body) return null;
            // If wrapped response with .d, return that, otherwise return body directly
            return body.d !== undefined ? body.d : body;
        } catch (_err) {
            console.error(`Fetch error for ${endpoint}:`, _err);
            return null;
        }
    };

    // Normalize image URL stored in DB: if it's a filename, prefix with API_URL and proper uploads path.
    const normalizeImage = (img, kind = 'art') => {
        if (!img) return '';
        if (typeof img !== 'string') return '';
        const trimmed = img.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('http') || trimmed.startsWith('//')) return trimmed;
        if (trimmed.startsWith('/')) return `${API_URL}${trimmed}`;
        if (trimmed.includes('/uploads/')) return `${API_URL}/${trimmed.replace(/^\/*/, '')}`;
        // Assume it's a filename
        if (kind === 'profile') return `${API_URL}/uploads/profile/${trimmed}`;
        return `${API_URL}/uploads/art/${trimmed}`;
    };

    // Mock Loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800); 
        return () => clearTimeout(timer);
    }, []);

    // Fetch profile data (bio) from backend on mount and update portfolioData
    useEffect(() => {
        let mounted = true;
        const loadProfile = async () => {
            const serverData = await fetchJson('/intro');
            if (!mounted || !serverData) return;
            const mapped = {
                name: serverData.name || '',
                title: serverData.title || '',
                location: serverData.location || '',
                bio: serverData.bio || '',
                email: serverData.email || '',
                github: serverData.github || '',
                linkedin: serverData.linkedin || '',
                profileImage: normalizeImage(serverData.profileImage, 'profile') || '',
                resumeUrl: serverData.resumeUrl || '',
            };
            setPortfolioData(mapped);
        };

        loadProfile();
        return () => { mounted = false; };
    }, []);

    // Fetch experiences from backend on mount and populate experiences state
    useEffect(() => {
        const loadExperiences = async () => {
            const experiencesList = await fetchJson('/experience');
            if (!experiencesList) return;
            const mapped = experiencesList.map(exp => ({ 
                id: exp._id || exp.id || generateId(), 
                yearRange: exp.yearRange,
                title: exp.title,
                institution: exp.institution,
                location: exp.location,
                description: exp.description
            }));
            setExperiences(mapped);
        };

        loadExperiences();
    }, [setExperiences]);

    // Fetch skills from backend on mount and populate skills state
    useEffect(() => {
        const loadSkills = async () => {
            const skillsList = await fetchJson('/skill');
            if (!skillsList) return;
            const mapped = skillsList.map(skill => ({ 
                id: skill._id || skill.id || generateId(), 
                name: skill.name,
                level: skill.level,
                icon: skill.icon
            }));
            setSkills(mapped);
        };

        loadSkills();
    }, [setSkills]);

    // Fetch projects from backend on mount and populate projects state
    useEffect(() => {
        const loadProjects = async () => {
            const projectsList = await fetchJson('/project');
            if (!projectsList) return;
            const mapped = projectsList.map(project => ({ 
                id: project._id || project.id || generateId(), 
                title: project.title,
                description: project.description,
                tags: project.tags || [],
                githubLink: project.githubLink,
                vercelLink: project.vercelLink
            }));
            setProjects(mapped);
        };

        loadProjects();
    }, [setProjects]);

    // Fetch queries from backend on mount and populate queries state
    useEffect(() => {
        const loadQueries = async () => {
            const queriesList = await fetchJson('/query');
            if (!queriesList) return;
            const mapped = queriesList.map(q => ({ 
                id: q._id || q.id || generateId(), 
                name: q.name,
                email: q.email,
                query: q.query
            }));
            setQueries(mapped);
        };

        loadQueries();
    }, [setQueries]);

    // Fetch art from backend on mount and populate artProjects state
    useEffect(() => {
        const loadArt = async () => {
            const artList = await fetchJson('/art');
            if (!artList) return;
            const mapped = artList.map(art => ({ 
                id: art._id || art.id || generateId(), 
                title: art.title,
                type: art.type,
                image: normalizeImage(art.image, 'art')
            }));
            setArtProjects(mapped);
        };

        loadArt();
    }, [setArtProjects]);

    // Render Logic: Always render Portfolio View
    let content;
    if (isLoading) {
        content = (
            <div className={`min-screen flex items-center justify-center font-sans`}>
                <div className={`p-5 mt-[250px] w-[180px] bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl shadow-lg`}>
                    <Loader2 className={`w-12 h-12 animate-spin text-cyan-400 mx-auto`} />
                    <p className="mt-4 text-center text-lg text-white font-semibold">KRISHH...</p>
                </div>
            </div>
        );
    } else {
        content = (
            <PortfolioView 
                data={data} 
                setQueries={setQueries} 
            />
        );
    }


    return (
        <Routes>
            <Route path="/" element={
                <div className={`min-h-screen ${mainBg} ${mainText} p-4 md:p-8 font-sans relative`}>
                    <style>{CustomStyles()}</style>
                    
                    <ErrorBoundary>
                        {content}
                    </ErrorBoundary>
                </div>
            } />
            <Route path="/adminKrish" element={
                <div className={`min-h-screen ${mainBg} ${mainText} p-4 md:p-8 font-sans relative`}>
                    <style>{CustomStyles()}</style>
                    
                    <ErrorBoundary>
                        {isAdminAuth ? (
                            <AdminPanel 
                                data={data} 
                                setPortfolioData={setPortfolioData} 
                                setSkills={setSkills} 
                                setProjects={setProjects} 
                                setArtProjects={setArtProjects}
                                setExperiences={setExperiences} 
                                setQueries={setQueries}
                                onLogout={() => {
                                    try { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem('adminAuth'); } catch (e) { void(e); }
                                    setIsAdminAuth(false);
                                }}
                            />
                        ) : (
                            <AdminAuth onSuccess={() => {}} />
                        )}
                    </ErrorBoundary>
                </div>
            } />
        </Routes>
    );
}