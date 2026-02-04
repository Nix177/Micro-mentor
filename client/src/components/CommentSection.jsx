import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Send, User, Clock, MessageSquare, Calendar, CheckCircle } from 'lucide-react';

export default function CommentSection({ postId, isDemo, demoComments }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [pseudo, setPseudo] = useState(localStorage.getItem('userPseudo') || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // If demo mode, use demo comments
        if (isDemo && demoComments) {
            setComments(demoComments);
            return;
        }

        try {
            const commentsRef = collection(db, 'posts', postId, 'comments');
            const q = query(commentsRef, orderBy('createdAt', 'asc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const commentsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toMillis() || Date.now()
                }));
                setComments(commentsData);
            }, (error) => {
                console.log('Firestore error:', error);
                if (demoComments) setComments(demoComments);
            });

            return () => unsubscribe();
        } catch (error) {
            console.log('Firebase not configured');
            if (demoComments) setComments(demoComments);
        }
    }, [postId, isDemo, demoComments]);

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

        // Save pseudo
        if (pseudo) {
            localStorage.setItem('userPseudo', pseudo);
        }

        // If demo mode, just add locally
        if (isDemo) {
            setComments(prev => [...prev, {
                id: `demo-${Date.now()}`,
                text: newComment.trim(),
                authorPseudo: pseudo || 'Anonyme',
                createdAt: Date.now()
            }]);
            setNewComment('');
            setIsSubmitting(false);
            return;
        }

        try {
            await addDoc(collection(db, 'posts', postId, 'comments'), {
                text: newComment.trim(),
                authorPseudo: pseudo || 'Anonyme',
                createdAt: serverTimestamp()
            });

            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, { commentCount: increment(1) });

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            // Add locally anyway for demo
            setComments(prev => [...prev, {
                id: `local-${Date.now()}`,
                text: newComment.trim(),
                authorPseudo: pseudo || 'Anonyme',
                createdAt: Date.now()
            }]);
            setNewComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Commentaires ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            placeholder="Votre pseudo"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white mb-2 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ajouter un commentaire... (Vous pouvez proposer une solution ou poser une question)"
                            rows={3}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Commenter
                    </button>
                </div>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-slate-500">Aucun commentaire. Soyez le premier à aider !</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${comment.isHelper
                                    ? 'bg-gradient-to-br from-green-500 to-green-700'
                                    : 'bg-slate-700'
                                }`}>
                                {comment.isHelper ? (
                                    <CheckCircle className="w-5 h-5 text-white" />
                                ) : (
                                    <User className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className={`rounded-xl p-4 ${comment.isHelper
                                        ? 'bg-green-500/10 border border-green-500/30'
                                        : 'bg-slate-800'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`font-medium ${comment.isHelper ? 'text-green-300' : 'text-white'
                                            }`}>
                                            {comment.authorPseudo || 'Anonyme'}
                                        </span>
                                        {comment.isHelper && (
                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                Propose d'aider
                                            </span>
                                        )}
                                        <span className="text-slate-500 text-xs flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed">
                                        {comment.text}
                                    </p>
                                </div>
                                {comment.isHelper && (
                                    <button className="mt-2 flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                        Voir les disponibilités
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
