import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, orderBy, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import CommentSection from './CommentSection';
import { ArrowLeft, ChevronUp, MessageSquare, Clock, User, Calendar, Image as ImageIcon } from 'lucide-react';

export default function PostDetail({ postId, onBack }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            const docRef = doc(db, 'posts', postId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPost({
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toMillis() || Date.now()
                });
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
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            upvotes: increment(1)
        });
        setPost(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-12 text-slate-400">
                Post non trouvé
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Retour au feed
            </button>

            {/* Post Content */}
            <article className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-white">{post.authorPseudo || 'Anonyme'}</p>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(post.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-4">
                    {post.title}
                </h1>

                {/* Content */}
                <div className="prose prose-invert max-w-none mb-4">
                    <p className="text-slate-300 whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Media */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {post.mediaUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Media ${index + 1}`}
                                className="rounded-lg w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(url, '_blank')}
                            />
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                    <button
                        onClick={handleUpvote}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors"
                    >
                        <ChevronUp className="w-4 h-4" />
                        <span>{post.upvotes || 0}</span>
                    </button>

                    <div className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentCount || 0} commentaires</span>
                    </div>

                    <button
                        onClick={() => setShowScheduleModal(true)}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium transition-all hover:scale-105"
                    >
                        <Calendar className="w-4 h-4" />
                        Je peux aider
                    </button>
                </div>
            </article>

            {/* Comments Section */}
            <div className="mt-6">
                <CommentSection postId={postId} />
            </div>

            {/* Schedule Modal (placeholder) */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-4">Proposer des disponibilités</h3>
                        <p className="text-slate-400 mb-4">
                            Cette fonctionnalité sera disponible dans la Phase 2.
                        </p>
                        <button
                            onClick={() => setShowScheduleModal(false)}
                            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
