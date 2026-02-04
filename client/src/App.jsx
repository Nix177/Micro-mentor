import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { MessageSquare, Clock, Users, Zap, TrendingUp, Shield, Video, Star, ChevronRight, Sparkles } from 'lucide-react'
import PostFeed from './components/PostFeed'
import PostDetail from './components/PostDetail'
import MentorDashboard from './components/MentorDashboard'
import { platformStats } from './data/demoData'

function AppContent() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('user'); // 'user' or 'mentor'

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                signInAnonymously(auth).catch((error) => {
                    console.log('Auth error, continuing without auth:', error);
                    setLoading(false);
                });
            }
        });

        // Fallback timeout
        setTimeout(() => setLoading(false), 2000);

        return () => unsubscribe();
    }, []);

    const handleSwitchMode = () => {
        if (viewMode === 'user') {
            setViewMode('mentor');
            navigate('/mentor');
        } else {
            setViewMode('user');
            navigate('/feed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Chargement de Micro-Mentor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-black"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <nav className="sticky top-0 w-full px-6 py-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 z-40">
                <div
                    onClick={() => {
                        setViewMode('user');
                        navigate('/');
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Micro-Mentor</h1>
                        <p className="text-xs text-slate-400">L'expertise en 3 minutes</p>
                    </div>
                </div>

                <div className="flex gap-3 items-center">
                    {/* Live Stats */}
                    <div className="hidden md:flex items-center gap-6 mr-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-slate-400"><span className="text-white font-bold">{platformStats.activeNow}</span> mentors en ligne</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSwitchMode}
                        className={`px-4 py-2 rounded-lg font-bold transition-all border shadow-lg ${viewMode === 'user'
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                            : 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'
                            }`}
                    >
                        {viewMode === 'user' ? 'Vue Mentor 👨‍🏫' : 'Vue Utilisateur 👤'}
                    </button>

                    {viewMode === 'user' && (
                        <button
                            onClick={() => navigate('/feed')}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700 hidden sm:block"
                        >
                            Explorer
                        </button>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Routes>
                    <Route path="/" element={<HomePage navigate={navigate} />} />
                    <Route path="/feed" element={<FeedPage navigate={navigate} />} />
                    <Route path="/post/:postId" element={<PostPage navigate={navigate} />} />
                    <Route path="/mentor" element={<MentorPage />} />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 mt-20 py-12 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-white">Micro-Mentor</span>
                        </div>
                        <p className="text-sm text-slate-400">L'expertise technique en 3 minutes. Résolvez vos problèmes bloquants instantanément.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Produit</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="hover:text-white cursor-pointer transition-colors">Comment ça marche</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Tarification</li>
                            <li className="hover:text-white cursor-pointer transition-colors">API</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Communauté</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="hover:text-white cursor-pointer transition-colors">Devenir Mentor</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Top Experts</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Légal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="hover:text-white cursor-pointer transition-colors">Conditions d'utilisation</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Confidentialité</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    © 2024 Micro-Mentor. Tous droits réservés.
                </div>
            </footer>
        </div>
    );
}

function HomePage({ navigate }) {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 mb-8">
                    <Sparkles className="w-4 h-4" />
                    <span>Nouvelle plateforme • Accès anticipé</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white mb-6">
                    Bloqué sur un
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500">
                        problème technique ?
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                    Connectez-vous avec un expert en <span className="text-white font-semibold">moins de 60 secondes</span>.
                    <br className="hidden md:block" />
                    Sessions vidéo de 3 minutes. Résolvez, apprenez, avancez.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <button
                        onClick={() => navigate('/feed')}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Poser une question
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>

                    <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-105">
                        <span className="flex items-center gap-2">
                            <Video className="w-5 h-5" />
                            Voir une démo
                        </span>
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>98% satisfaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>1,200+ mentors vérifiés</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-800/30 border-y border-slate-800 py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                        <StatCard value={platformStats.totalMentors.toLocaleString()} label="Mentors" />
                        <StatCard value={platformStats.activeNow} label="En ligne maintenant" highlight />
                        <StatCard value={platformStats.avgResponseTime} label="Temps de réponse moyen" />
                        <StatCard value={platformStats.totalSessions.toLocaleString()} label="Sessions complétées" />
                        <StatCard value={`${platformStats.satisfactionRate}%`} label="Satisfaction" />
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Comment ça marche ?
                    </h2>
                    <p className="text-slate-400 text-lg">3 étapes simples pour résoudre votre problème</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard
                        number="1"
                        icon={<MessageSquare className="w-8 h-8" />}
                        title="Décrivez votre problème"
                        description="Postez votre question avec du contexte, du code, des captures d'écran. La communauté répond en quelques minutes."
                    />
                    <StepCard
                        number="2"
                        icon={<Users className="w-8 h-8" />}
                        title="Un expert propose son aide"
                        description="Les mentors qualifiés consultent votre question et proposent leurs disponibilités pour une session."
                    />
                    <StepCard
                        number="3"
                        icon={<Video className="w-8 h-8" />}
                        title="Session vidéo en 3 min"
                        description="Connectez-vous en vidéo, partagez votre écran, résolvez ensemble. Simple, rapide, efficace."
                    />
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Clock className="w-7 h-7 text-blue-400" />}
                        title="Sessions de 3 minutes"
                        description="Format court qui force la concision. Pas de bavardage, que des solutions."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-7 h-7 text-green-400" />}
                        title="Time Banking"
                        description="Aidez 10 min, recevez 10 min. Un système d'échange équitable."
                    />
                    <FeatureCard
                        icon={<Shield className="w-7 h-7 text-purple-400" />}
                        title="Mentors vérifiés"
                        description="Chaque expert est validé. Notes, avis, historique visible."
                    />
                    <FeatureCard
                        icon={<Zap className="w-7 h-7 text-yellow-400" />}
                        title="Matching intelligent"
                        description="Notre algo trouve l'expert parfait pour votre problème spécifique."
                    />
                    <FeatureCard
                        icon={<MessageSquare className="w-7 h-7 text-pink-400" />}
                        title="Chat enrichi"
                        description="Partagez du code, des fichiers, des liens pendant la session."
                    />
                    <FeatureCard
                        icon={<Star className="w-7 h-7 text-orange-400" />}
                        title="Satisfaction garantie"
                        description="Pas satisfait ? Session remboursée. Sans condition."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-6 py-20 text-center">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Prêt à débloquer votre situation ?
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">
                        Rejoignez des milliers de développeurs qui avancent plus vite.
                    </p>
                    <button
                        onClick={() => navigate('/feed')}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105"
                    >
                        Commencer maintenant — C'est gratuit
                    </button>
                </div>
            </section>
        </div>
    );
}

function StatCard({ value, label, highlight }) {
    return (
        <div className="text-center">
            <p className={`text-3xl md:text-4xl font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>
                {value}
            </p>
            <p className="text-sm text-slate-400 mt-1">{label}</p>
        </div>
    );
}

function StepCard({ number, icon, title, description }) {
    return (
        <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all group">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                {number}
            </div>
            <div className="mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 hover:border-slate-600 transition-all group">
            <div className="mb-4 p-3 bg-slate-800 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    );
}

function FeedPage({ navigate }) {
    return (
        <div className="py-8 px-6">
            <PostFeed onPostClick={(postId) => navigate(`/post/${postId}`)} />
        </div>
    );
}

function PostPage({ navigate }) {
    const { postId } = useParams();
    return (
        <div className="py-8 px-6">
            <PostDetail postId={postId} onBack={() => navigate('/feed')} />
        </div>
    );
}

function MentorPage() {
    return (
        <div className="py-8 px-6">
            <MentorDashboard />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter basename="/Micro-mentor">
            <AppContent />
        </BrowserRouter>
    );
}

export default App
