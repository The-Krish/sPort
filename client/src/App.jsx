import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
    Mail, Briefcase, Zap, Code, MapPin, Github, Linkedin, Download, 
    Loader2, Palette, ExternalLink, MessageSquare
} from 'lucide-react';
import AdminPanel from './Admin.jsx';

// API Base URL - prefer Vite env var `VITE_API_URL`, fallback to same-host:8000 or localhost
const API_URL = import.meta.env.VITE_API_URL || (
  (typeof window !== 'undefined' && window.location && window.location.hostname)
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://localhost:8000'
);



// --- 1. CORE UTILITIES, HOOKS & STYLES ---

// Custom hook for theme classes
const useThemeClasses = () => {
    return useMemo(() => {
        // Light mode only - dark mode removed
        const mainText = 'text-black';
        const mainBg = 'bg-gray-100'; 
        const tileBg = 'bg-white';
        const tileBorder = 'border-black';
        const tileShadow = 'shadow-[8px_8px_0px_#000000]';
        const tileAccent = 'bg-gray-100';
        const tileAccentBorder = 'border-black';
        
        // Define button styles
        const activeClass = 'active:shadow-none active:translate-y-0.5 transition-all duration-75';
        const buttonBase = 'border-2 font-semibold ' + activeClass;
        
        // Input classes
        const inputClass = "bg-white border-2 border-black p-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black";

        return {
            mainText, mainBg, tileBg, tileBorder, tileShadow, tileAccent, tileAccentBorder,
            activeClass, buttonBase, inputClass,
            
            // Specific button color configurations
            buttonPrimary: 'bg-cyan-300 hover:bg-cyan-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonSecondary: 'bg-gray-300 hover:bg-gray-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonSuccess: 'bg-lime-300 hover:bg-lime-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonWarning: 'bg-yellow-300 hover:bg-yellow-400 text-black shadow-[4px_4px_0px_#000000]',
            buttonDanger: 'bg-red-400 hover:bg-red-500 text-black shadow-[4px_4px_0px_#000000]',
        };
    }, []);
};

// Boxy Container Component
function Tile({ className = "", children, style = {} }) { 
    const { tileBg, tileBorder, tileShadow } = useThemeClasses();
    
    return (
        <div
            className={`p-6 ${tileBg} ${tileBorder} border-4 ${tileShadow} ${className}`}
            style={{ ...style, minHeight: '100%' }}
        >
            {children}
        </div>
    );
}

// Global Custom Styles (Light mode only)
const CustomStyles = () => {

    const scrollbarThumb = '#000000'; 
    const scrollbarTrack = '#ffffff'; 
    const scrollbarBorder = '#000000'; 

    return `
        .font-sans {
            font-family: monospace; /* Blocky, digital feel */
        }
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-track {
            background: ${scrollbarTrack};
            border-left: 4px solid ${scrollbarBorder};
        }
        ::-webkit-scrollbar-thumb {
            background: ${scrollbarThumb};
            border: 1px solid ${scrollbarTrack};
        }
        @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
        }
        * {
            border-radius: 0 !important;
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

    const decodingColor = 'text-red-600';

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
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b-4 ${tileAccentBorder} mb-6`}>
            {/* --- Header Start --- */}
            <h1 className={`text-3xl items-center justify-center  font-extrabold  mb-4 md:mb-0`}>
                MY-WORLD
            </h1>
            {/* --- Header End --- */}
        </header>
    );
}

function Hero({ profile }) {
    const { mainText, tileAccentBorder, activeClass, buttonBase } = useThemeClasses();
    
    const socialButtonClass = (bgColor, shadowColor, textColor) => 
        `flex items-center gap-2 px-3 py-1.5 text-sm ${buttonBase} ${bgColor} ${textColor} ${shadowColor}`;
        
    const miniButtonClass = `mt-3 p-1.5 text-xs bg-lime-300 hover:bg-lime-400 text-black shadow-[4px_4px_0px_#000000] ${activeClass}`;
    const linkColor = 'text-cyan-600 hover:text-cyan-800';


    return (


        <Tile className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-6">
            {/* --- Hero Start --- */}
            {/* --- Profile Image, Decoding Name, Title (ProfileBlock) Start --- */}
            <div className="sm:col-span-1 flex flex-col items-center justify-center">
                <img 
                    src={profile.profileImage} 
                    alt={profile.name} 
                    className={`w-32 h-32 border-4 ${tileAccentBorder} object-cover bg-gray-200`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/000000/FFFFFF?text=FAIL"; }}
                />
                <h2 className={`text-xl font-bold mt-4 ${mainText}`}>
                    <DecodingText text={profile.name} speed={100} />
                </h2>
                <p className={`text-sm text-gray-700 italic text-center`}>{profile.title}</p>
                
                <a 
                    href={profile.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${miniButtonClass} flex items-center justify-center`} 
                    title="Download Resume/CV"
                >Resume
                    <Download className="w-4 h-4" /> 
                </a>
            </div>
            {/* --- ProfileBlock End --- */}

            {/* --- Biography, Contact, and Social Links --- */}
            <div className="sm:col-span-3">
                <h3 className={`text-2xl font-extrabold border-b-2 ${tileAccentBorder} pb-1 mb-3 ${mainText}`}>BIOGRAPHY BLOCK</h3>
                <p className={`whitespace-pre-wrap ${mainText} mb-4`}>{profile.bio}</p>
                
                {/* Contact and Location */}
                <div className={`flex flex-wrap items-center gap-4 text-sm font-semibold mb-4 ${mainText}`}>
                    <span className={`flex items-center gap-1 text-red-600`}><MapPin className="w-4 h-4"/> {profile.location}</span>
                    <a href={`mailto:${profile.email}`} className={`flex items-center gap-1 ${mainText} hover:${linkColor}`}>
                        <Mail className="w-4 h-4"/> {profile.email}
                    </a>
                </div>
                
                <h4 className={`text-lg font-bold border-b-2 ${tileAccentBorder} pb-1 mb-2 ${mainText}`}>CRITICAL LINKS:</h4>
                <div className="flex flex-wrap gap-3">
                    <a 
                        href={profile.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={socialButtonClass('bg-gray-400', 'shadow-[4px_4px_0px_#000000]', 'text-black')}
                    >
                        <Github className="w-4 h-4"/> GITHUB CODE MINE
                    </a>
                    <a 
                        href={profile.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={socialButtonClass('bg-blue-300', 'shadow-[4px_4px_0px_#000000]', 'text-black')}
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
        <Tile className="col-span-1 md:col-span-1">
            {/* --- Skills Start --- */}
            <h3 className={`text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-1 mb-4 flex items-center gap-2 ${mainText}`}><Zap className="w-5 h-5"/> SKILL BLOCKS</h3>
            <ul className="space-y-2">
                {skills.map(skill => (
                    <li key={skill.id} className={`p-2 ${tileAccent} border-2 ${tileAccentBorder} shadow-[2px_2px_0px_#000000] flex justify-between items-center`}>
                        <span className={`font-semibold ${mainText}`}>{skill.icon} {skill.name}</span>
                        <span className={`text-xs px-1 py-0.5 border ${tileAccentBorder} text-gray-700 bg-white`}>
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
        <Tile className="md:col-span-2">
            {/* --- ExperienceTimeline Start --- */}
            <h3 className={`text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-1 mb-4 flex items-center gap-2 ${mainText}`}>
                <Briefcase className="w-5 h-5"/> EXPERIENCE & EDUCATION LOGS
            </h3>
            <div className="space-y-6">
                {sortedExperiences.map((item) => (
                    <div key={item.id} className={`relative p-4 border-l-4 ${tileAccentBorder}`}>
                        {/* Timeline Pin (Block) */}
                        <div className={`absolute -left-3 top-0 w-6 h-6 border-4 ${tileAccentBorder} bg-gray-100 flex items-center justify-center`}>
                            <span className={`w-2 h-2 bg-black block`}></span>
                        </div>
                        
                        <div className={`p-3 ${tileAccent} border-2 ${tileAccentBorder} shadow-[4px_4px_0px_#000000]`}>
                            <p className={`text-sm font-mono font-semibold mb-1 text-red-600`}>
                                {item.yearRange}
                            </p>
                            <h4 className={`text-lg font-bold ${mainText}`}>{item.title}</h4>
                            <p className={`text-base italic text-gray-700 mb-2`}>{item.institution} ({item.location})</p>
                            <p className={`text-sm text-gray-600`}>{item.description}</p>
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

    const linkButtonClass = (bgColor, textColor, shadowColor) => 
        `flex items-center justify-center h-8 w-8 text-sm font-semibold border-2 ${tileAccentBorder} ${activeClass} ${bgColor} ${textColor} ${shadowColor}`;

    return (
        <Tile className={`col-span-1 ${className}`}>
            {/* --- Projects Start --- */}
            <h3 className={`text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-1 mb-4 flex items-center gap-2 ${mainText}`}>{icon} {title.toUpperCase()} ROJECTS </h3>
            <div className="space-y-4">
                {projects.map(project => (
                    <div key={project.id} className={`p-4 ${tileAccent} border-2 ${tileAccentBorder} shadow-[4px_4px_0px_#000000]`}>
                        <h4 className={`text-lg font-bold ${mainText}`}>{project.title}</h4>
                        <p className={`text-sm text-gray-700 my-2`}>{project.description}</p>
                        
                        <div className="flex justify-between items-end mt-3">
                            {/* Project Tags */}
                            {project.tags && Array.isArray(project.tags) && (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className={`text-xs font-mono px-2 py-0.5 border ${tileAccentBorder} shadow-[1px_1px_0px_#000000] bg-cyan-300 text-black`}>{tag}</span>
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
                                        className={linkButtonClass('bg-gray-400', 'text-black', 'shadow-[4px_4px_0px_#000000]')}
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
                                        className={linkButtonClass('bg-lime-300', 'text-black', 'shadow-[4px_4px_0px_#000000]')}
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
        <Tile className="col-span-1 md:col-span-4">
            {/* --- ArtGallery Start --- */}
            <h3 className={`text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-1 mb-4 flex items-center gap-2 ${mainText}`}><Palette className="w-5 h-5"/> MY SKETCHES GALLERY</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {artProjects.map(art => (
                    <div key={art.id} className={`p-2 ${tileAccent} border-2 ${tileAccentBorder} shadow-[2px_2px_0px_#000000]`}>
                        <img 
                            src={art.image} 
                            alt={art.title} 
                            className={`w-full h-auto border-2 ${tileAccentBorder} object-cover mb-2 bg-gray-200`}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/000000/FFFFFF?text=K"; }}
                        />
                        <p className={`text-sm font-semibold leading-tight ${mainText}`}>{art.title}</p>
                        <p className={`text-xs text-gray-600 italic`}>{art.type}</p>
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
    
    const { mainText, tileAccentBorder, inputClass, buttonPrimary, buttonDanger, activeClass } = useThemeClasses();
    
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
        statusClasses = 'text-green-800 border-lime-400 bg-lime-200';
    } else if (status === 'error') {
        statusClasses = 'text-red-800 border-red-400 bg-red-200';
    }

    return (
        <Tile className="col-span-1 md:col-span-4 mt-6">
            <h3 className={`text-xl font-extrabold border-b-2 ${tileAccentBorder} pb-1 mb-4 flex items-center gap-2 ${mainText}`}>
                <MessageSquare className="w-5 h-5"/> WORK QUERY / SUGGETIONS
            </h3>
            
            <p className={`text-sm text-gray-700 mb-4`}>
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
                            className={inputClass}
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
                            className={inputClass}
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
                        className={inputClass}
                        placeholder="yoou query here..."
                    />
                </div>

                <div className="flex justify-between items-center pt-2">
                    {statusMessage && (
                        <p className={`text-sm font-medium border-4 p-2 shadow-[4px_4px_0px_#000000] ${statusClasses}`}>
                            {statusMessage}
                        </p>
                    )}
                    <button 
                        type="submit"
                        disabled={isPending}
                        className={`flex items-center gap-2 px-4 py-2 text-base ml-auto ${activeClass} ${buttonPrimary}`}
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
    const { tileAccentBorder } = useThemeClasses();

    return (
        <footer className={`mt-8 pt-4 border-t-4 ${tileAccentBorder} text-center`}>
            <p className={`text-sm font-semibold p-4 border-2 ${tileAccentBorder} shadow-[4px_4px_0px_#000000] inline-block bg-white text-black`}>
                KRISH•2025: <a href={`mailto:${email}`} className={`text-cyan-600 hover:text-cyan-800 underline`}>{email}</a>
            </p>
        </footer>
    );
}


function PortfolioView({ data, setQueries }) {
    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* --- PortfolioView Start --- */}
            <Header profile={data.portfolioData} />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
                <Hero profile={data.portfolioData} />
                <Skills skills={data.skills} />
                <Projects 
                    projects={data.projects} 
                    title="Code" 
                    icon={<Code className="w-5 h-5"/>} 
                    className="md:col-span-2"
                />
                
                <ExperienceTimeline experiences={data.experiences} />
                
                <ArtGallery artProjects={data.artProjects} />

                <WorkQueryBlock setQueries={setQueries} />
            </div>

            <Footer email={data.portfolioData.email} />
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
        <div className="p-8 md:p-10 border-4 border-black bg-red-400 text-black shadow-[10px_10px_0px_#000000] max-w-xl mx-auto mt-20">
          <h1 className="text-3xl font-bold border-b-4 border-black pb-2">🚨 WORLD ERROR: CHUNK FAILED TO LOAD!</h1>
          <p className="mt-4">
            A critical error occurred while rendering the interface. The world has temporarily paused.
          </p>
          <details className="mt-4 bg-red-300 p-3 border-2 border-black text-sm">
             <summary className="font-semibold cursor-pointer">Click to inspect broken item (Debugging)</summary>
             <pre className="mt-2 text-xs whitespace-pre-wrap overflow-auto">
                 {this.state.error && this.state.error.toString()}
             </pre>
             {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 text-xs whitespace-pre-wrap overflow-auto border-t border-black pt-2">
                    {this.state.errorInfo.componentStack}
                </pre>
             )}
          </details>
          <button 
              className="mt-4 px-4 py-2 bg-yellow-300 text-black border-2 border-black font-bold shadow-[4px_4px_0px_#000000] active:shadow-none active:translate-y-0.5" 
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
    const [portfolioData, setPortfolioData] = useState({
        name: '', title: '', location: '', bio: '', email: '', github: '', linkedin: '', profileImage: '', resumeUrl: ''
    });
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [artProjects, setArtProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
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
            } catch (err) {
                setError('Network error');
            } finally { setPending(false); }
        };

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-6 bg-white border-4 border-black shadow-[8px_8px_0px_#000000] w-full max-w-md">
                    <h2 className="text-xl font-bold mb-3">Admin Login</h2>
                    <form onSubmit={submit} className="space-y-3">
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full p-2 border-2 border-black" />
                        {error && <div className="text-sm text-red-600">{error}</div>}
                        <div className="flex justify-end">
                            <button type="submit" disabled={pending} className="px-4 py-2 bg-cyan-300 border-2 border-black">{pending ? 'Checking...' : 'Enter'}</button>
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
        } catch (err) {
            console.error(`Fetch error for ${endpoint}:`, err);
            return null;
        }
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
                profileImage: serverData.profileImage || '',
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
                image: art.image
            }));
            setArtProjects(mapped);
        };

        loadArt();
    }, [setArtProjects]);

    // Render Logic: Always render Portfolio View
    let content;
    if (isLoading) {
        content = (
            <div className={`min-h-screen ${mainBg} ${mainText} flex items-center justify-center font-sans`}>
                <div className={`p-6 bg-white border-4 border-black shadow-[8px_8px_0px_#000000]`}>
                    <p className={`text-2xl font-bold ${mainText}`}>KRISHH...</p>
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
                                    try { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem('adminAuth'); } catch (e) {}
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