import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';
import PostCard from './PostCard';
import NewPostModal from './NewPostModal';
import { demoPosts } from '../data/demoData';
import { Plus, Flame, Clock, TrendingUp, Search, Filter, Zap } from 'lucide-react';

export default function PostFeed({ onPostClick }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewPost, setShowNewPost] = useState(false);
    const [sortBy, setSortBy] = useState('new');
    const [searchQuery, setSearchQuery] = useState('');
    const [useDemo, setUseDemo] = useState(false);

    useEffect(() => {
        try {
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const postsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toMillis() || Date.now()
                }));

                // If no real posts, use demo data
                if (postsData.length === 0) {
                    setPosts(demoPosts);
                    setUseDemo(true);
                } else {
                    setPosts(postsData);
                    setUseDemo(false);
                }
                setLoading(false);
            }, (error) => {
                console.log('Firestore error, using demo data:', error);
                setPosts(demoPosts);
                setUseDemo(true);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.log('Firebase not configured, using demo data');
            setPosts(demoPosts);
            setUseDemo(true);
            setLoading(false);
        }
    }, [sortBy]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === 'new') return b.createdAt - a.createdAt;
        if (sortBy === 'hot') return (b.commentCount || 0) - (a.commentCount || 0);
        if (sortBy === 'top') return (b.upvotes || 0) - (a.upvotes || 0);
        return 0;
    });

    const SortButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setSortBy(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Forum d'entraide</h1>
                        <p className="text-slate-400">Posez vos questions, trouvez des réponses</p>
                    </div>
                    <button
                        onClick={() => setShowNewPost(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau Post
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un problème..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Sort buttons */}
                <div className="flex gap-2">
                    <SortButton id="new" icon={Clock} label="Récent" />
                    <SortButton id="hot" icon={Flame} label="Populaire" />
                    <SortButton id="top" icon={TrendingUp} label="Top" />
                </div>
            </div>

            {/* Demo Mode Banner */}
            {useDemo && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-blue-300 font-medium">Mode démo</p>
                        <p className="text-sm text-blue-400/70">Ces posts sont des exemples. Créez le premier vrai post !</p>
                    </div>
                </div>
            )}

            {/* Posts List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400">Chargement des posts...</p>
                </div>
            ) : sortedPosts.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/30 border border-slate-700 rounded-2xl">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Aucun résultat</h3>
                    <p className="text-slate-400 mb-6">Essayez une autre recherche ou créez un nouveau post</p>
                    <button
                        onClick={() => setShowNewPost(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                    >
                        Créer un post
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onClick={() => onPostClick(post.id)}
                        />
                    ))}
                </div>
            )}

            {/* New Post Modal */}
            {showNewPost && (
                <NewPostModal onClose={() => setShowNewPost(false)} />
            )}
        </div>
    );
}
