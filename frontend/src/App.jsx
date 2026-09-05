import React, { useState } from 'react';
import { submitIntake, generateIdeas, generateMentorPlan, triggerReplan } from './api';

// Icon library with modern Lucide-style SVGs
const Icons = {
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Layers: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Clipboard: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Flame: () => (
    <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};

const POPULAR_SKILLS = [
  'React', 'Python', 'Node.js', 'FastAPI', 'TypeScript', 'SQL', 'SQLite', 
  'PostgreSQL', 'TensorFlow', 'Flask', 'Docker', 'Next.js', 'PyTorch', 'MongoDB'
];

const POPULAR_INTERESTS = [
  'Healthcare', 'Fintech', 'Education', 'Developer Tools', 'AI / ML', 'Cybersecurity', 'Climate Tech', 'E-Commerce'
];

const POPULAR_CONSTRAINTS = [
  'No Machine Learning', 'No Cloud / Local Only', 'No Hardware', 'Offline LocalStorage', 'Zero Budget', 'Serverless Only'
];

// Presets for quick 1-click test drives
const PRESETS = [
  {
    icon: '🤖',
    name: 'AI & Vision Hacker',
    skills: 'Python, FastAPI, TensorFlow, PyTorch',
    interests: 'Healthcare, AI / ML',
    team_size: 2,
    weeks_available: 6,
    constraints: 'No Hardware'
  },
  {
    icon: '🌐',
    name: 'Fullstack Web Squad',
    skills: 'React, Node.js, TypeScript, PostgreSQL',
    interests: 'Developer Tools, Fintech',
    team_size: 3,
    weeks_available: 8,
    constraints: 'No Machine Learning'
  },
  {
    icon: '⚡',
    name: 'Rapid Solo MVP',
    skills: 'React, SQLite, TypeScript',
    interests: 'Education, Developer Tools',
    team_size: 1,
    weeks_available: 3,
    constraints: 'No Cloud / Local Only'
  }
];

export default function App() {
  // Navigation & Step Management (1: Intake, 2: Ideas, 3: Mentor Plan)
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'tech' | 'scope' | 'guardrails'

  // Student Profile State
  const [profile, setProfile] = useState({
    name: '',
    skills: '',
    interests: '',
    team_size: 2,
    weeks_available: 6,
    constraints: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [constraintInput, setConstraintInput] = useState('');

  const [studentId, setStudentId] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [contractInfo, setContractInfo] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [mentorPlan, setMentorPlan] = useState(null);
  const [planId, setPlanId] = useState(null);

  // Replanning state
  const [replanOpen, setReplanOpen] = useState(false);
  const [replanConstraint, setReplanConstraint] = useState('');
  const [replanCount, setReplanCount] = useState(0);
  const [replanContract, setReplanContract] = useState(null);

  // Loading, Errors & Toast Notification
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [taskDone, setTaskDone] = useState({});

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to split comma-separated values into clean individual tokens
  const getTokens = (str) => (str || '').split(',').map(s => s.trim()).filter(Boolean);

  const addToken = (field, token) => {
    if (!token || !token.trim()) return;
    const cleanToken = token.trim();
    const tokens = getTokens(profile[field]);
    if (!tokens.some(t => t.toLowerCase() === cleanToken.toLowerCase())) {
      setProfile({ ...profile, [field]: [...tokens, cleanToken].join(', ') });
    }
  };

  const removeToken = (field, tokenToRemove) => {
    const tokens = getTokens(profile[field]);
    const updated = tokens.filter(t => t.toLowerCase() !== tokenToRemove.toLowerCase()).join(', ');
    setProfile({ ...profile, [field]: updated });
  };

  const togglePill = (field, token) => {
    const tokens = getTokens(profile[field]);
    const exists = tokens.some(t => t.toLowerCase() === token.toLowerCase());
    if (exists) {
      removeToken(field, token);
    } else {
      addToken(field, token);
    }
  };

  const applyPreset = (preset) => {
    setProfile({
      name: preset.name,
      skills: preset.skills,
      interests: preset.interests,
      team_size: preset.team_size,
      weeks_available: preset.weeks_available,
      constraints: preset.constraints
    });
    showToast(`Loaded ${preset.name} configuration!`);
  };

  // 1. Submit Intake & Generate Ideas
  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    if (!profile.skills.trim()) {
      setError('Please provide at least one technical skill or select from the quick tags.');
      return;
    }

    setLoading(true);
    setLoadingText('Analyzing candidate domain taxonomy & matching skills...');
    setError(null);
    try {
      const intakeRes = await submitIntake(profile);
      setStudentId(intakeRes.id);

      setLoadingText('Scoring taxonomy and generating 3 grounded project architectures...');
      const ideaRes = await generateIdeas(intakeRes.id);
      setIdeas(ideaRes.ideas || []);
      setContractInfo(ideaRes.contract);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Select Idea & Generate Mentor Execution Plan
  const handleSelectIdea = async (idea) => {
    setSelectedIdea(idea);
    setLoading(true);
    setLoadingText('Synthesizing MVP features, tech stack reasoning, and week-by-week sprints...');
    setError(null);
    try {
      const planRes = await generateMentorPlan(idea.id);
      setMentorPlan(planRes);
      setPlanId(planRes.id);
      setStep(3);
      setActiveTab('roadmap');
      showToast('Engineering roadmap synthesized successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Execute Mid-Project Surgical Replan
  const handleReplan = async (customConstraint = null) => {
    const textToSubmit = customConstraint || replanConstraint;
    if (!textToSubmit) return;

    setLoading(true);
    setLoadingText(`Surgically replanning around: "${textToSubmit}"...`);
    setError(null);
    try {
      const res = await triggerReplan(planId, textToSubmit);
      setMentorPlan(prev => ({
        ...prev,
        tech_stack: res.updated.tech_stack,
        roadmap: res.updated.roadmap
      }));
      setReplanContract(res.contract);
      setReplanCount(c => c + 1);
      setReplanConstraint('');
      setReplanOpen(false);
      showToast('Surgical replan applied! Scope remained immutable.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Task checkoff toggle
  const toggleTask = (weekIdx, taskIdx) => {
    const key = `${weekIdx}-${taskIdx}`;
    setTaskDone(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate task completion progress
  const totalTasks = mentorPlan?.roadmap?.reduce((acc, w) => acc + (w.tasks?.length || 0), 0) || 0;
  const completedTasks = Object.values(taskDone).filter(Boolean).length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Copy plan as Markdown to clipboard
  const copyPlanMarkdown = () => {
    if (!mentorPlan || !selectedIdea) return;
    const md = `
# Project Plan: ${selectedIdea.title}
**Difficulty:** ${selectedIdea.difficulty} | **Timeline:** ${profile.weeks_available} Weeks | **Team Size:** ${profile.team_size}

## Pitch
${selectedIdea.pitch}

## MVP Core Features
${mentorPlan.features_mvp.map(f => `- [ ] ${f}`).join('\n')}

## Stretch Goals
${mentorPlan.features_stretch.map(f => `- [ ] ${f}`).join('\n')}

## Tech Stack
${mentorPlan.tech_stack.map(t => `- **${t.name}**: ${t.reason}`).join('\n')}

## Weekly Roadmap
${mentorPlan.roadmap.map(w => `### ${w.week}: ${w.goal}\n${w.tasks.map(t => `- [ ] ${t}`).join('\n')}`).join('\n\n')}

## Pitfalls to Avoid
${mentorPlan.pitfalls.map(p => `- ${p}`).join('\n')}

## Wow Factor
${mentorPlan.wow_factor}
    `.trim();

    navigator.clipboard.writeText(md);
    showToast('Copied full engineering plan as Markdown!');
  };

  const exportPlanJson = () => {
    if (!mentorPlan) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ idea: selectedIdea, plan: mentorPlan }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `project-mentor-${selectedIdea?.taxonomy_ref || 'plan'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported project spec JSON!');
  };

  const resetAll = () => {
    setStep(1);
    setSelectedIdea(null);
    setMentorPlan(null);
    setReplanCount(0);
    setReplanContract(null);
    setTaskDone({});
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans relative overflow-hidden bg-grid-pattern">
      {/* Ambient background light orbs */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 ambient-orb-1 rounded-full pointer-events-none blur-3xl"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 ambient-orb-2 rounded-full pointer-events-none blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 ambient-orb-3 rounded-full pointer-events-none blur-3xl"></div>

      {/* Floating Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-indigo-500/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-md animate-bounce">
          <Icons.CheckCircle />
          <span className="text-xs font-medium">{toast}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0c101c]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={resetAll}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <Icons.Sparkles />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Project Mentor <span className="text-indigo-400">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {contractInfo?.mode || 'Engineering Intelligence'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Algorithmic Scoping • Architecture • Surgical Replanning</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Interactive Step Navigator */}
            <div className="hidden md:flex items-center space-x-1 text-xs font-semibold bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setStep(1)}
                className={`px-3 py-1.5 rounded-lg transition ${step === 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                1. Intake & Skills
              </button>
              <span className="text-slate-600 px-0.5">›</span>
              <button
                onClick={() => ideas.length > 0 && setStep(2)}
                disabled={ideas.length === 0}
                className={`px-3 py-1.5 rounded-lg transition ${step === 2 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400'}`}
              >
                2. Project Ideas
              </button>
              <span className="text-slate-600 px-0.5">›</span>
              <button
                onClick={() => mentorPlan && setStep(3)}
                disabled={!mentorPlan}
                className={`px-3 py-1.5 rounded-lg transition ${step === 3 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400'}`}
              >
                3. Execution Plan
              </button>
            </div>

            {step > 1 && (
              <button
                onClick={resetAll}
                className="text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition flex items-center space-x-1.5 font-medium"
              >
                <Icons.Refresh />
                <span>Start New</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative z-10">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/70 text-rose-200 flex items-start space-x-3 shadow-xl backdrop-blur-md">
            <Icons.AlertTriangle />
            <div className="flex-1">
              <p className="text-sm font-bold">Requirement check</p>
              <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200 text-xs font-bold">✕</button>
          </div>
        )}

        {/* Global Animated Loader */}
        {loading && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <div className="absolute text-indigo-400 animate-pulse">
                <Icons.Sparkles />
              </div>
            </div>
            <p className="mt-5 text-slate-200 text-sm font-semibold text-center max-w-sm tracking-wide">{loadingText}</p>
            <p className="mt-1 text-xs text-indigo-400 font-mono">Enforcing schema & taxonomy ground truth</p>
          </div>
        )}

        {/* ============================================================
            STEP 1: STUDENT INTAKE & PROFILE BUILDER
        ============================================================ */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            {/* Hero Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                <Icons.Sparkles />
                <span>Smart Project Scoping System</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
                Design Your Next <span className="gradient-accent-text">Engineering Masterpiece</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                Provide your stack, team size, and timeline. Our mentor engine maps your profile against structured engineering challenges to build a grounded, achievable roadmap.
              </p>
            </div>

            {/* Quick Presets Picker */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">⚡ 1-Click Test Drive Presets:</span>
                <span className="text-[11px] text-slate-500">Click to instantly populate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="card-glass text-left p-3.5 rounded-xl hover:border-indigo-500/50 transition duration-200 flex items-start space-x-3 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{preset.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{preset.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{preset.skills.split(',')[0]} • {preset.weeks_available}w</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Intake Form */}
            <form onSubmit={handleIntakeSubmit} className="card-glass rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Student / Team Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g., Alex Rivera, Team Apex"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Technical Skills: Interactive Chip Tags */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Technical Skills & Languages <span className="text-rose-400">*</span>
                  </label>
                  {getTokens(profile.skills).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, skills: '' })}
                      className="text-[11px] text-slate-400 hover:text-rose-400 transition"
                    >
                      Clear all ({getTokens(profile.skills).length})
                    </button>
                  )}
                </div>

                {/* Tag Input Box */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 flex flex-wrap gap-2 items-center focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition min-h-[46px]">
                  {getTokens(profile.skills).map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeToken('skills', skill)}
                        className="hover:text-white font-bold leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addToken('skills', skillInput);
                        setSkillInput('');
                      } else if (e.key === 'Backspace' && !skillInput && getTokens(profile.skills).length > 0) {
                        const tokens = getTokens(profile.skills);
                        removeToken('skills', tokens[tokens.length - 1]);
                      }
                    }}
                    placeholder={getTokens(profile.skills).length === 0 ? "Type skills (press Enter or select below)..." : "Add more..."}
                    className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500 flex-1 min-w-[140px] px-1 py-0.5"
                  />
                </div>

                {/* Popular Skills Quick Add */}
                <div className="flex flex-wrap gap-1.5 items-center mt-2.5">
                  <span className="text-[11px] text-slate-500 mr-1">Quick toggle:</span>
                  {POPULAR_SKILLS.map((skill) => {
                    const active = getTokens(profile.skills).some(t => t.toLowerCase() === skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => togglePill('skills', skill)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition duration-150 ${
                          active
                            ? 'bg-indigo-600/30 border-indigo-500/70 text-indigo-300 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {active ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Domain Interests: Interactive Chip Tags */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Domain Interests
                  </label>
                  {getTokens(profile.interests).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, interests: '' })}
                      className="text-[11px] text-slate-400 hover:text-rose-400 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 flex flex-wrap gap-2 items-center focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition min-h-[46px]">
                  {getTokens(profile.interests).map((interest, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeToken('interests', interest)}
                        className="hover:text-white font-bold leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addToken('interests', interestInput);
                        setInterestInput('');
                      } else if (e.key === 'Backspace' && !interestInput && getTokens(profile.interests).length > 0) {
                        const tokens = getTokens(profile.interests);
                        removeToken('interests', tokens[tokens.length - 1]);
                      }
                    }}
                    placeholder={getTokens(profile.interests).length === 0 ? "Type domains (e.g. Healthcare, Fintech)..." : "Add more..."}
                    className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500 flex-1 min-w-[140px] px-1 py-0.5"
                  />
                </div>

                {/* Popular Interests Quick Add */}
                <div className="flex flex-wrap gap-1.5 items-center mt-2.5">
                  <span className="text-[11px] text-slate-500 mr-1">Domains:</span>
                  {POPULAR_INTERESTS.map((interest) => {
                    const active = getTokens(profile.interests).some(t => t.toLowerCase() === interest.toLowerCase());
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => togglePill('interests', interest)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition duration-150 ${
                          active
                            ? 'bg-purple-600/30 border-purple-500/70 text-purple-300 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {active ? `✓ ${interest}` : `+ ${interest}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders: Team Size & Weeks Available */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                      <Icons.Users />
                      <span>Team Size</span>
                    </span>
                    <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-mono">
                      {profile.team_size} {profile.team_size === 1 ? 'Solo Dev' : 'Members'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={profile.team_size}
                    onChange={(e) => setProfile({ ...profile, team_size: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>1 (Solo)</span>
                    <span>3 (Squad)</span>
                    <span>6 (Full Team)</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                      <Icons.Calendar />
                      <span>Timeline Duration</span>
                    </span>
                    <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-mono">
                      {profile.weeks_available} Weeks
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={profile.weeks_available}
                    onChange={(e) => setProfile({ ...profile, weeks_available: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>1 Week</span>
                    <span>6 Weeks</span>
                    <span>12 Weeks</span>
                  </div>
                </div>
              </div>

              {/* Special Constraints */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Constraints & Guardrails (Optional)
                  </label>
                  {getTokens(profile.constraints).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, constraints: '' })}
                      className="text-[11px] text-slate-400 hover:text-rose-400 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 flex flex-wrap gap-2 items-center focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition min-h-[46px]">
                  {getTokens(profile.constraints).map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => removeToken('constraints', c)}
                        className="hover:text-white font-bold leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={constraintInput}
                    onChange={(e) => setConstraintInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addToken('constraints', constraintInput);
                        setConstraintInput('');
                      } else if (e.key === 'Backspace' && !constraintInput && getTokens(profile.constraints).length > 0) {
                        const tokens = getTokens(profile.constraints);
                        removeToken('constraints', tokens[tokens.length - 1]);
                      }
                    }}
                    placeholder={getTokens(profile.constraints).length === 0 ? "Type constraint (e.g. No cloud, zero budget)..." : "Add more..."}
                    className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500 flex-1 min-w-[140px] px-1 py-0.5"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 items-center mt-2.5">
                  <span className="text-[11px] text-slate-500 mr-1">Suggested filters:</span>
                  {POPULAR_CONSTRAINTS.map((c) => {
                    const active = getTokens(profile.constraints).some(t => t.toLowerCase() === c.toLowerCase());
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => togglePill('constraints', c)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition duration-150 ${
                          active
                            ? 'bg-amber-600/30 border-amber-500/70 text-amber-300 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {active ? `✓ ${c}` : `+ ${c}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full btn-primary py-3.5 px-6 rounded-xl font-bold text-white text-sm tracking-wide flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <Icons.Sparkles />
                <span>Score Taxonomy & Synthesize Project Options</span>
                <Icons.ArrowRight />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================
            STEP 2: PROJECT CANDIDATE CARDS (GROUNDED IN TAXONOMY)
        ============================================================ */}
        {step === 2 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                  <Icons.CheckCircle />
                  <span>3 High-Confidence Matches Found</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Curated Project Architectures</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluated against your stack ({profile.skills || 'All skills'}), {profile.weeks_available} weeks, and {profile.team_size} team member(s).
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition flex items-center space-x-1.5 w-fit"
              >
                <span>← Adjust Parameters</span>
              </button>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ideas.map((idea, index) => {
                const diffBadge =
                  idea.difficulty === 'Beginner'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : idea.difficulty === 'Advanced'
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

                return (
                  <div
                    key={idea.id || index}
                    className="card-glass rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      {/* Card Header Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-800/90 text-indigo-300 border border-indigo-500/30">
                          {idea.taxonomy_ref}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${diffBadge}`}>
                          {idea.difficulty}
                        </span>
                      </div>

                      {/* Project Title & Pitch */}
                      <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors">
                        {idea.title}
                      </h3>
                      <p className="text-slate-300 text-xs leading-relaxed mb-4">
                        {idea.pitch}
                      </p>

                      {/* Fit Explanation Box */}
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 mb-5">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center space-x-1 mb-1">
                          <Icons.Target />
                          <span>Why this fits your constraints</span>
                        </span>
                        <p className="text-xs text-slate-400 leading-normal">
                          {idea.fit_reason}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleSelectIdea(idea)}
                      className="w-full btn-primary py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-2 cursor-pointer mt-2"
                    >
                      <span>Build Full Engineering Roadmap</span>
                      <Icons.ArrowRight />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 3: MENTOR EXECUTION PLAN DASHBOARD
        ============================================================ */}
        {step === 3 && mentorPlan && selectedIdea && (
          <div className="space-y-6">
            {/* Top Project Banner */}
            <div className="card-glass-active rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      REF: {selectedIdea.taxonomy_ref}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {selectedIdea.difficulty} • {profile.weeks_available} Weeks Duration • {profile.team_size} Person Team
                    </span>
                    {replanCount > 0 && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        ⚡ Adapted {replanCount}x
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{selectedIdea.title}</h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">{selectedIdea.pitch}</p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={copyPlanMarkdown}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition flex items-center space-x-1.5 font-medium cursor-pointer"
                    title="Copy GitHub-formatted Markdown"
                  >
                    <Icons.Clipboard />
                    <span>Copy MD</span>
                  </button>

                  <button
                    onClick={exportPlanJson}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition flex items-center space-x-1.5 font-medium cursor-pointer"
                    title="Export raw plan data as JSON"
                  >
                    <Icons.Download />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => setReplanOpen(true)}
                    className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition flex items-center space-x-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <Icons.Refresh />
                    <span>Adaptive Replan</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar for Checked Off Tasks */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sprint Progress:</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    {completedTasks} / {totalTasks} Tasks Completed ({completionPercent}%)
                  </span>
                </div>
                <div className="w-full sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${completionPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex border-b border-slate-800 space-x-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'roadmap'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icons.Calendar />
                <span>Sprint Roadmap ({mentorPlan.roadmap?.length || 0} Weeks)</span>
              </button>

              <button
                onClick={() => setActiveTab('tech')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'tech'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icons.Layers />
                <span>Tech Stack & Reasoning ({mentorPlan.tech_stack?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('scope')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'scope'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icons.ShieldCheck />
                <span>Scope Boundaries (MVP vs Stretch)</span>
              </button>

              <button
                onClick={() => setActiveTab('guardrails')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'guardrails'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icons.AlertTriangle />
                <span>Pitfalls & Wow Factor</span>
              </button>
            </div>

            {/* TAB 1: SPRINT ROADMAP */}
            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Week-by-week actionable milestones. Click any task box to toggle your progress.
                  </p>
                  <span className="text-[11px] text-slate-500">Interactive sprint checklist</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(mentorPlan.roadmap || []).map((weekPlan, wIdx) => {
                    const weekTasks = weekPlan.tasks || [];
                    const weekCompleted = weekTasks.filter((_, tIdx) => taskDone[`${wIdx}-${tIdx}`]).length;
                    const weekDone = weekTasks.length > 0 && weekCompleted === weekTasks.length;

                    return (
                      <div
                        key={wIdx}
                        className={`card-glass rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 ${
                          weekDone ? 'border-emerald-500/40 bg-emerald-950/10' : ''
                        }`}
                      >
                        <div>
                          {/* Week Badge & Progress */}
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                              {weekPlan.week}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {weekCompleted}/{weekTasks.length} done
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white mb-3 leading-snug">
                            {weekPlan.goal}
                          </h4>

                          {/* Task Checkboxes */}
                          <div className="space-y-2">
                            {weekTasks.map((task, tIdx) => {
                              const isChecked = !!taskDone[`${wIdx}-${tIdx}`];
                              return (
                                <div
                                  key={tIdx}
                                  onClick={() => toggleTask(wIdx, tIdx)}
                                  className={`p-2.5 rounded-xl text-xs transition cursor-pointer flex items-start space-x-2.5 select-none ${
                                    isChecked
                                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/40 line-through'
                                      : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border border-slate-800/80'
                                  }`}
                                >
                                  <span className="mt-0.5 font-bold text-sm leading-none">
                                    {isChecked ? '✓' : '○'}
                                  </span>
                                  <span className="leading-snug">{task}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: TECH STACK */}
            {activeTab === 'tech' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(mentorPlan.tech_stack || []).map((tech, i) => (
                  <div key={i} className="card-glass rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-extrabold text-indigo-400 tracking-tight">{tech.name}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{tech.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: SCOPE BOUNDARIES (MVP VS STRETCH) */}
            {activeTab === 'scope' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core MVP */}
                <div className="card-glass rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                      <Icons.ShieldCheck />
                      <span>MVP Core Features (Must Ship)</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Immutable Scope
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {(mentorPlan.features_mvp || []).map((feat, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                        <Icons.CheckCircle />
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stretch Goals */}
                <div className="card-glass rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                      <Icons.Sparkles />
                      <span>Stretch Goals (Post-MVP)</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      Bonus Features
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {(mentorPlan.features_stretch || []).map((feat, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          +
                        </span>
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PITFALLS & WOW FACTOR */}
            {activeTab === 'guardrails' && (
              <div className="space-y-6">
                {/* Wow factor spotlight */}
                {mentorPlan.wow_factor && (
                  <div className="card-glass rounded-2xl p-6 border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-transparent">
                    <div className="flex items-center space-x-2 mb-2 text-amber-400">
                      <Icons.Flame />
                      <span className="text-xs font-extrabold uppercase tracking-wider">🌟 Demo Wow Factor</span>
                    </div>
                    <p className="text-sm text-slate-100 font-medium leading-relaxed">{mentorPlan.wow_factor}</p>
                  </div>
                )}

                {/* Pitfalls */}
                {mentorPlan.pitfalls && mentorPlan.pitfalls.length > 0 && (
                  <div className="card-glass rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-4 flex items-center space-x-2">
                      <Icons.AlertTriangle />
                      <span>Engineering Pitfalls & Risks to Avoid</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mentorPlan.pitfalls.map((pitfall, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{pitfall}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            ADAPTIVE REPLANNER MODAL DRAWER
        ============================================================ */}
        {replanOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="card-glass-active max-w-xl w-full rounded-2xl p-6 sm:p-8 border border-indigo-500/40 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Icons.Refresh />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Surgical Project Re-Planner</h3>
                    <p className="text-xs text-slate-400">Mutates tech stack & roadmap while preserving core MVP goals</p>
                  </div>
                </div>
                <button
                  onClick={() => setReplanOpen(false)}
                  className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Quick Scenario Buttons */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Simulate real-world project pivots:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleReplan("Timeline cut in half (urgent release in 2 weeks)")}
                    className="text-xs p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left transition cursor-pointer"
                  >
                    ⏱️ Cut timeline in half
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReplan("Cannot use external cloud APIs, must run 100% offline")}
                    className="text-xs p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left transition cursor-pointer"
                  >
                    🚫 100% Offline / Local Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReplan("One teammate left the team, down to solo developer")}
                    className="text-xs p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left transition cursor-pointer"
                  >
                    👤 Solo developer pivot
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReplan("Switch database from cloud to zero-config SQLite")}
                    className="text-xs p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left transition cursor-pointer"
                  >
                    💾 Switch to SQLite
                  </button>
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Or Describe Custom Constraint:
                </label>
                <textarea
                  rows={3}
                  value={replanConstraint}
                  onChange={(e) => setReplanConstraint(e.target.value)}
                  placeholder="e.g. 'Must use Python FastAPI instead of Node.js', 'Deadline moved forward by 3 weeks'..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-emerald-400 font-mono">
                    🛡️ Verified Invariant: MVP Features Preserved
                  </span>
                  <button
                    type="button"
                    onClick={() => handleReplan()}
                    disabled={!replanConstraint.trim()}
                    className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Execute Replan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-900 bg-[#080c14]/90 py-6 text-center text-xs text-slate-500 mt-12 relative z-10">
        <p>Project Mentor AI — Grounded Engineering Taxonomy & Surgical Re-planning</p>
      </footer>
    </div>
  );
}
