import { useState } from 'react'
import { Rocket, Clock, MessageSquare, Zap, Info, X } from 'lucide-react'
import SessionView from './components/SessionView'

function App() {
    const [mode, setMode] = useState('landing'); // landing, requesting, session
    const [currentSession, setCurrentSession] = useState(null);
    const [isFinding, setIsFinding] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const handleRequestHelp = () => {
        setMode('requesting');
    }

    const findMentor = async () => {
        setIsFinding(true);

        // DEMO MODE: Force success after 2s without backend
        setTimeout(() => {
            setIsFinding(false);
            const mockSession = {
                id: 123,
                mentor: {
                    name: "Sarah Chen",
                    expertise: ["React", "State Management"],
                    rating: 4.9
                }
            };
            setCurrentSession(mockSession);
            setMode('session');
        }, 2000);
    };

    const endSession = () => {
        setMode('landing');
        setCurrentSession(null);
    };

    if (mode === 'session' && currentSession) {
        return <SessionView session={currentSession} onEndSession={endSession} />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-slate-900 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>

            {/* Header */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center glass z-10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent cursor-pointer" onClick={() => setMode('landing')}>
                    Flash Mentor
                </h1>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors animate-pulse border border-blue-400"
                    >
                        <Info className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Guide Déploiement</span>
                    </button>

                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-mono font-bold text-yellow-100">10 min</span>
                    </div>
                </div>
            </nav>

            {/* Guide Modal */}
            {showGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-lg w-full relative shadow-2xl">
                        <button onClick={() => setShowGuide(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            🚀 Prochaines Étapes
                        </h3>
                        <div className="space-y-4 text-sm text-slate-300">
                            <p className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                                <strong>1. Installer gh-pages :</strong><br />
                                <code className="text-blue-300">npm install gh-pages --save-dev</code>
                            </p>
                            <p className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30">
                                <strong>2. Déployer :</strong><br />
                                <code className="text-purple-300">npm run deploy</code>
                            </p>
                            <p className="bg-green-900/30 p-3 rounded-lg border border-green-500/30">
                                <strong>3. Activer sur GitHub :</strong><br />
                                Allez dans <em>Settings {'>'} Pages</em> et vérifiez que la source est sur la branche <code>gh-pages</code>.
                            </p>
                            <div className="pt-4 border-t border-slate-700 text-xs text-slate-500">
                                Note : J'ai déjà configuré le fichier <code>package.json</code> et <code>vite.config.js</code> pour vous. Lancez juste les commandes !
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-4xl w-full text-center mt-16">

                {mode === 'landing' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-yellow-400 mb-4 border-yellow-500/30">
                            SOS EXPERTISE • 3 MIN CHRONO
                        </div>

                        <h2 className="text-6xl font-extrabold tracking-tight leading-tight text-white">
                            Bloqué sur un problème ?<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">L'Uber du savoir-faire.</span>
                        </h2>

                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Connectez-vous instantanément avec un expert pour une session vidéo de 3 minutes.
                            <br />"Donnez 10 min, recevez 10 min".
                        </p>

                        <div className="flex justify-center gap-6 mt-12">
                            <button
                                onClick={handleRequestHelp}
                                className="group relative px-8 py-4 bg-amber-500 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all text-black overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                <span className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 fill-current" />
                                    SOS Expertise
                                </span>
                                <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-amber-300 transition-all" />
                            </button>

                            <button className="px-8 py-4 glass rounded-xl font-bold text-lg hover:bg-white/5 transition-colors text-slate-200">
                                Devenir Mentor
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
                            <FeatureCard
                                icon={<Clock className="w-8 h-8 text-yellow-400" />}
                                title="3 Minutes Max"
                                desc="Limite stricte. Force la concision. Respecte votre temps."
                            />
                            <FeatureCard
                                icon={<Rocket className="w-8 h-8 text-amber-500" />}
                                title="Time Banking"
                                desc="Gagnez du temps en aidant les autres. Système équitable."
                            />
                            <FeatureCard
                                icon={<MessageSquare className="w-8 h-8 text-orange-400" />}
                                title="Contexte Immédiat"
                                desc="L'IA résume votre problème avant l'appel."
                            />
                        </div>
                    </div>
                )}

                {mode === 'requesting' && (
                    <div className="glass p-8 rounded-2xl max-w-xl mx-auto text-left animate-slide-up border border-white/10 shadow-2xl">
                        {isFinding ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 border-4 border-slate-700/50 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                                    <Zap className="absolute inset-0 m-auto w-8 h-8 text-brand-500 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Finding an Expert...</h3>
                                <p className="text-slate-400 text-sm">Matching your problem with our top mentors.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold mb-6 text-white">Describe your blocker</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Topic</label>
                                        <input type="text" placeholder="e.g. React useEffect loop" className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-colors" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Context (or record audio)</label>
                                        <textarea rows="4" placeholder="I'm trying to update state but..." className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 transition-colors"></textarea>
                                    </div>

                                    <button onClick={findMentor} className="w-full py-4 bg-brand-600 rounded-lg font-bold shadow-lg mt-4 hover:brightness-110 transition text-white">
                                        Find Mentor
                                    </button>

                                    <button onClick={() => setMode('landing')} className="w-full text-sm text-slate-500 mt-2 hover:text-white transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </main>
        </div>
    )
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="glass p-6 rounded-xl hover:bg-white/5 transition-colors border-white/5">
            <div className="mb-4 bg-white/5 w-fit p-3 rounded-lg">{icon}</div>
            <h4 className="text-lg font-bold mb-2 text-white">{title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    )
}

export default App
