import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Send, User, Clock, MessageSquare } from 'lucide-react';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [pseudo, setPseudo] = useState(localStorage.getItem('userPseudo') || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const commentsRef = collection(db, 'posts', postId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toMillis() || Date.now()
            }));
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [postId]);

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'maintenant';
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        return `${Math.floor(seconds / 86400)}j`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            // Save pseudo
            if (pseudo) {
                localStorage.setItem('userPseudo', pseudo);
            }

            // Add comment
            await addDoc(collection(db, 'posts', postId, 'comments'), {
                text: newComment.trim(),
                authorPseudo: pseudo || 'Anonyme',
                createdAt: serverTimestamp()
            });

            // Increment comment count on post
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                commentCount: increment(1)
            });

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Commentaires ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        placeholder="Pseudo"
                        className="w-32 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                    Aucun commentaire. Soyez le premier !
                </p>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1 bg-slate-800 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-300 text-sm">
                                        {comment.authorPseudo || 'Anonyme'}
                                    </span>
                                    <span className="text-slate-500 text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatTimeAgo(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
