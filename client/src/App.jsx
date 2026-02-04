import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { MessageSquare, Clock, Users, Zap } from 'lucide-react'
import PostFeed from './components/PostFeed'
import PostDetail from './components/PostDetail'
import SessionView from './components/SessionView'

function AppContent() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Anonymous auth for Firebase
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                signInAnonymously(auth).catch(console.error);
            }
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Background */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black -z-10"></div>

            {/* Header */}
            <nav className="sticky top-0 w-full p-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-40">
                <h1
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent cursor-pointer flex items-center gap-2"
                >
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    Micro-Mentor
                </h1>
                <div className="flex gap-4 items-center">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-mono font-medium text-blue-100">
                            {localStorage.getItem('userPseudo') || 'Anonyme'}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-4 pt-8">
                <Routes>
                    <Route path="/" element={<HomePage navigate={navigate} />} />
                    <Route path="/feed" element={<FeedPage navigate={navigate} />} />
                    <Route path="/post/:postId" element={<PostPage navigate={navigate} />} />
                </Routes>
            </main>
        </div>
    );
}

function HomePage({ navigate }) {
    return (
        <div className="max-w-4xl mx-auto text-center py-12">
            {/* Hero */}
            <div className="mb-12">
                <div className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-xs font-mono text-blue-400 mb-6 border border-blue-500/30">
                    FORUM D'ENTRAIDE • 3 MIN SESSIONS
                </div>

                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
                    Bloqué sur un problème ?<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                        La communauté vous aide.
                    </span>
                </h2>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                    Postez votre problème, recevez des réponses, et connectez-vous en vidéo avec un mentor.
                </p>

                <button
                    onClick={() => navigate('/feed')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all"
                >
                    <Zap className="w-5 h-5" />
                    Accéder au Forum
                </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <FeatureCard
                    icon={<MessageSquare className="w-8 h-8 text-blue-400" />}
                    title="Forum Communautaire"
                    desc="Postez vos questions, recevez des commentaires et trouvez des réponses."
                />
                <FeatureCard
                    icon={<Users className="w-8 h-8 text-blue-500" />}
                    title="Matching Intelligent"
                    desc="Les mentors proposent leurs disponibilités. Choisissez un créneau."
                />
                <FeatureCard
                    icon={<Clock className="w-8 h-8 text-blue-600" />}
                    title="Sessions 3 Minutes"
                    desc="Vidéo + chat enrichi. Échange de fichiers et partage d'écran."
                />
            </div>
        </div>
    );
}

function FeedPage({ navigate }) {
    return (
        <div className="py-4">
            <PostFeed onPostClick={(postId) => navigate(`/post/${postId}`)} />
        </div>
    );
}

function PostPage({ navigate }) {
    const { postId } = useParams();
    return (
        <div className="py-4">
            <PostDetail postId={postId} onBack={() => navigate('/feed')} />
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-colors">
            <div className="mb-4 bg-blue-500/10 w-fit p-3 rounded-lg">{icon}</div>
            <h4 className="text-lg font-bold mb-2 text-white">{title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
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
