import { useState, useEffect } from 'react';
import { Clock, MessageSquare, Image, Video, ChevronUp, User, Tag, AlertCircle } from 'lucide-react';

export default function PostCard({ post, onClick }) {
    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'maintenant';
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        return `${Math.floor(seconds / 86400)}j`;
    };

    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const hasVideo = post.videoUrl;
    const isUrgent = post.urgent;

    return (
        <div
            onClick={onClick}
            className={`relative bg-slate-800/50 hover:bg-slate-800 border rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl group ${isUrgent ? 'border-red-500/50 hover:border-red-500' : 'border-slate-700 hover:border-slate-600'
                }`}
        >
            {/* Urgent Badge */}
            {isUrgent && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    URGENT
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <span className="font-medium text-white">{post.authorPseudo || 'Anonyme'}</span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                {post.title}
            </h3>

            {/* Content Preview */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {post.content.replace(/```[\s\S]*?```/g, '[code]').replace(/`[^`]+`/g, '[code]')}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg border border-slate-600/50"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Media Preview */}
            {hasMedia && (
                <div className="mb-4 rounded-lg overflow-hidden relative">
                    <img
                        src={post.mediaUrls[0]}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                    />
                    {post.mediaUrls.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                            +{post.mediaUrls.length - 1} images
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 text-sm pt-3 border-t border-slate-700/50">
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-blue-600 rounded-lg text-slate-300 hover:text-white transition-all"
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <ChevronUp className="w-4 h-4" />
                    <span className="font-medium">{post.upvotes || 0}</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentCount || 0} commentaires</span>
                </div>

                {hasMedia && (
                    <div className="flex items-center gap-1 text-slate-500">
                        <Image className="w-4 h-4" />
                    </div>
                )}

                {hasVideo && (
                    <div className="flex items-center gap-1 text-slate-500">
                        <Video className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
}
