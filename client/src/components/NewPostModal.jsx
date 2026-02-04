import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { X, Image, Video, Send, Loader2 } from 'lucide-react';

export default function NewPostModal({ onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pseudo, setPseudo] = useState(localStorage.getItem('userPseudo') || '');
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
        const fileName = `posts/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
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
            const mediaUrls = await Promise.all(mediaFiles.map(uploadMedia));

            // Create post
            await addDoc(collection(db, 'posts'), {
                title: title.trim(),
                content: content.trim(),
                mediaUrls,
                authorPseudo: pseudo || 'Anonyme',
                authorId: auth.currentUser?.uid || 'anonymous',
                createdAt: serverTimestamp(),
                commentCount: 0,
                upvotes: 0
            });

            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Erreur lors de la création du post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Nouveau Post</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Pseudo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Votre pseudo
                        </label>
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            placeholder="Anonyme"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Titre du problème *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Problème avec useEffect en React"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Description détaillée *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Décrivez votre problème en détail..."
                            required
                            rows={6}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Media Previews */}
                    {mediaPreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {mediaPreviews.map((media, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden">
                                    {media.type === 'video' ? (
                                        <video src={media.url} className="w-full h-32 object-cover" />
                                    ) : (
                                        <img src={media.url} alt="" className="w-full h-32 object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeMedia(index)}
                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
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
                                className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                            >
                                <Image className="w-4 h-4" />
                                <span className="text-sm">Image/Vidéo</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || !content.trim()}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
