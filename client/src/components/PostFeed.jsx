import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';
import PostCard from './PostCard';
import NewPostModal from './NewPostModal';
import { Plus, Flame, Clock, TrendingUp } from 'lucide-react';

export default function PostFeed({ onPostClick }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewPost, setShowNewPost] = useState(false);
    const [sortBy, setSortBy] = useState('new'); // 'new', 'hot', 'top'

    useEffect(() => {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toMillis() || Date.now()
            }));
            setPosts(postsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [sortBy]);

    const SortButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setSortBy(id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <SortButton id="new" icon={Clock} label="Récent" />
                    <SortButton id="hot" icon={Flame} label="Populaire" />
                    <SortButton id="top" icon={TrendingUp} label="Top" />
                </div>
                <button
                    onClick={() => setShowNewPost(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Nouveau Post
                </button>
            </div>

            {/* Posts List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <p className="text-lg mb-2">Aucun post pour le moment</p>
                    <p className="text-sm">Soyez le premier à poser une question !</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
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
