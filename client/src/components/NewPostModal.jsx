import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { X, Image, Video, Send, Loader2, AlertCircle } from 'lucide-react';

export default function NewPostModal({ onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pseudo, setPseudo] = useState(localStorage.getItem('userPseudo') || '');
    const [tags, setTags] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + mediaFiles.length > 4) {
            alert('Maximum 4 fichiers');
            return;
        }

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video') ? 'video' : 'image'
        }));

        setMediaFiles([...mediaFiles, ...files]);
        setMediaPreviews([...mediaPreviews, ...newPreviews]);
    };

    const removeMedia = (index) => {
        setMediaFiles(mediaFiles.filter((_, i) => i !== index));
        setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));
    };

    const uploadMedia = async (file) => {
        try {
            const fileName = `posts/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        try {
            // Save pseudo
            if (pseudo) {
                localStorage.setItem('userPseudo', pseudo);
            }

            // Upload media files
            const mediaUrls = (await Promise.all(mediaFiles.map(uploadMedia))).filter(url => url !== null);

            // Parse tags
            const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            // Create post
            await addDoc(collection(db, 'posts'), {
                title: title.trim(),
                content: content.trim(),
                mediaUrls,
                tags: tagsList,
                urgent: isUrgent,
                authorPseudo: pseudo || 'Anonyme',
                authorId: auth.currentUser?.uid || 'anonymous',
                createdAt: serverTimestamp(),
                commentCount: 0,
                upvotes: 0
            });

            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            // Fallback for demo if Firebase fails
            alert('Note: Le post sera visible localement (Mode Démo)');
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Nouveau Problème</h2>
                        <p className="text-sm text-slate-400">Décrivez votre besoin pour obtenir de l'aide</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pseudo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">
                                Votre pseudo
                            </label>
                            <input
                                type="text"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                                placeholder="Anonyme"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">
                                Tags (séparés par des virgules)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="React, Node, CSS..."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">
                            Titre du problème *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Mon application crash au déploiement"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:font-normal"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">
                            Description détaillée *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Expliquez ce que vous essayez de faire et l'erreur que vous rencontrez. Vous pouvez utiliser du code..."
                            required
                            rows={6}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed font-mono text-sm"
                        />
                    </div>

                    {/* Urgent Toggle */}
                    <div
                        className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all"
                        onClick={() => setIsUrgent(!isUrgent)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${isUrgent ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Marquer comme urgent</p>
                                <p className="text-xs text-slate-400">Pour les problèmes bloquants nécessitant une réponse immédiate</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${isUrgent ? 'bg-red-600' : 'bg-slate-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isUrgent ? 'translate-x-6' : 'translate-x-0'} left-1`} />
                        </div>
                    </div>

                    {/* Media Previews */}
                    {mediaPreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {mediaPreviews.map((media, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group">
                                    {media.type === 'video' ? (
                                        <video src={media.url} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={media.url} alt="" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeMedia(index)}
                                        className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg p-1 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700"
                            >
                                <Image className="w-4 h-4" />
                                <span className="text-sm font-medium">Médias</span>
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !title.trim() || !content.trim()}
                                className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                Publier mon problème
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
