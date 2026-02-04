import { useState, useEffect } from 'react';
import { Clock, MessageSquare, Image, Video, ChevronUp, User } from 'lucide-react';

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

    return (
        <div
            onClick={onClick}
            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg"
        >
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="w-3 h-3" />
                </div>
                <span className="font-medium text-slate-300">{post.authorPseudo || 'Anonyme'}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {post.title}
            </h3>

            {/* Content Preview */}
            <p className="text-slate-400 text-sm mb-3 line-clamp-3">
                {post.content}
            </p>

            {/* Media Preview */}
            {hasMedia && (
                <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                        src={post.mediaUrls[0]}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />
                    {post.mediaUrls.length > 1 && (
                        <div className="bg-black/50 text-white text-xs px-2 py-1 absolute bottom-2 right-2 rounded">
                            +{post.mediaUrls.length - 1}
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <ChevronUp className="w-4 h-4" />
                    <span>{post.upvotes || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentCount || 0} commentaires</span>
                </div>
                {hasMedia && (
                    <div className="flex items-center gap-1">
                        <Image className="w-4 h-4" />
                    </div>
                )}
                {hasVideo && (
                    <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
}
