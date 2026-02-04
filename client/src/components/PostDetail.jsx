import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import CommentSection from './CommentSection';
import { demoPosts, demoComments } from '../data/demoData';
import { ArrowLeft, ChevronUp, MessageSquare, Clock, User, Calendar, Share2, Bookmark, Flag, AlertCircle, Video, CheckCircle } from 'lucide-react';

export default function PostDetail({ postId, onBack }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            // Check if it's a demo post
            const demoPost = demoPosts.find(p => p.id === postId);
            if (demoPost) {
                setPost(demoPost);
                setIsDemo(true);
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'posts', postId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPost({
                        id: docSnap.id,
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt?.toMillis() || Date.now()
                    });
                }
            } catch (error) {
                console.log('Error fetching post:', error);
            }
            setLoading(false);
        };

        fetchPost();
    }, [postId]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleUpvote = async () => {
        if (isDemo) {
            setPost(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
            return;
        }
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, { upvotes: increment(1) });
            setPost(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
        } catch (error) {
            console.log('Error upvoting:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-bold text-white mb-2">Post non trouvé</h3>
                <button onClick={onBack} className="text-blue-400 hover:text-blue-300">
                    Retour au feed
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Retour au feed
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Post Content */}
                    <article className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                        {/* Urgent Badge */}
                        {post.urgent && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-red-300 font-medium">Question urgente</span>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-white text-lg">{post.authorPseudo || 'Anonyme'}</p>
                                <p className="text-sm text-slate-400 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(post.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                            {post.title}
                        </h1>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-invert max-w-none mb-6">
                            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {post.content.split('```').map((part, index) => {
                                    if (index % 2 === 1) {
                                        // Code block
                                        const lines = part.split('\n');
                                        const language = lines[0];
                                        const code = lines.slice(1).join('\n');
                                        return (
                                            <pre key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto my-4">
                                                <code className="text-sm text-green-400 font-mono">{code}</code>
                                            </pre>
                                        );
                                    }
                                    return <span key={index}>{part}</span>;
                                })}
                            </div>
                        </div>

                        {/* Media */}
                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {post.mediaUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Media ${index + 1}`}
                                        className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity border border-slate-700"
                                        onClick={() => window.open(url, '_blank')}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-6 border-t border-slate-700">
                            <button
                                onClick={handleUpvote}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-blue-600 rounded-lg text-slate-300 hover:text-white transition-all"
                            >
                                <ChevronUp className="w-5 h-5" />
                                <span className="font-bold">{post.upvotes || 0}</span>
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
                                <Share2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Partager</span>
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
                                <Bookmark className="w-4 h-4" />
                                <span className="hidden sm:inline">Sauvegarder</span>
                            </button>

                            <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
                                <Flag className="w-4 h-4" />
                            </button>
                        </div>
                    </article>

                    {/* Comments Section */}
                    <CommentSection postId={postId} isDemo={isDemo} demoComments={demoComments[postId]} />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Help CTA */}
                    <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <Video className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Vous pouvez aider ?</h3>
                                <p className="text-sm text-green-300/70">Gagnez des crédits</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-4">
                            Proposez vos disponibilités pour une session de 3 minutes avec l'auteur.
                        </p>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" />
                            Je peux aider
                        </button>
                    </div>

                    {/* Author Info */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4">À propos de l'auteur</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-white">{post.authorPseudo}</p>
                                <p className="text-sm text-slate-400">Membre depuis 2024</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xl font-bold text-white">12</p>
                                <p className="text-xs text-slate-400">Questions</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg p-3">
                                <p className="text-xl font-bold text-white">89%</p>
                                <p className="text-xs text-slate-400">Résolues</p>
                            </div>
                        </div>
                    </div>

                    {/* Similar Questions */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4">Questions similaires</h3>
                        <div className="space-y-3">
                            {demoPosts.slice(0, 3).filter(p => p.id !== postId).map(p => (
                                <div key={p.id} className="text-sm text-slate-400 hover:text-white cursor-pointer transition-colors line-clamp-2">
                                    {p.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Proposer votre aide</h3>
                                <p className="text-sm text-slate-400">Sélectionnez vos disponibilités</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {['Maintenant', 'Dans 30 min', 'Dans 1 heure', 'Demain matin'].map((time, i) => (
                                <button
                                    key={i}
                                    className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-xl text-left text-white transition-all"
                                >
                                    {time}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    alert('Demande envoyée ! (Demo)');
                                    setShowScheduleModal(false);
                                }}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
                            >
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
