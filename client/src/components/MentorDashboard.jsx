import { useState } from 'react';
import { demoPosts, platformStats } from '../data/demoData';
import { Search, Filter, Bell, User, Star, Clock, Video, CheckCircle, Zap, TrendingUp, DollarSign } from 'lucide-react';

export default function MentorDashboard() {
    const urgentPosts = demoPosts.filter(p => p.urgent);
    const regularPosts = demoPosts.filter(p => !p.urgent);

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord Mentor</h1>
                    <p className="text-slate-400">Bienvenue, <span className="text-blue-400 font-semibold">Marcus Chen</span>. Vous avez 3 nouvelles opportunités d'aide.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                            <Zap className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Crédits</p>
                            <p className="text-lg font-bold text-white">450 <span className="text-xs text-slate-400">points</span></p>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg cursor-pointer">
                        <User className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <StatBox icon={<Star className="text-yellow-400" />} label="Note moyenne" value="4.95" />
                <StatBox icon={<Video className="text-blue-400" />} label="Sessions" value="156" />
                <StatBox icon={<Clock className="text-green-400" />} label="Temps total" value="7.8h" />
                <StatBox icon={<DollarSign className="text-purple-400" />} label="Gains (estim.)" value="€1,248" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Available Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-red-500" />
                            Requêtes prioritaires
                        </h2>
                        <div className="flex gap-2">
                            <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {urgentPosts.map(post => (
                            <MentorRequestCard key={post.id} post={post} priority />
                        ))}
                    </div>

                    <h2 className="text-xl font-bold text-white pt-6">Recommandé pour votre expertise</h2>
                    <div className="space-y-4">
                        {regularPosts.slice(0, 3).map(post => (
                            <MentorRequestCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Activity */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Activité récente
                        </h3>
                        <div className="space-y-6">
                            <ActivityItem
                                title="Session terminée"
                                desc="Aide sur Bug React - Julia S."
                                time="Il y a 2h"
                                points="+30"
                            />
                            <ActivityItem
                                title="Commentaire aimé"
                                desc="Sur le post API Rest de Thomas"
                                time="Il y a 5h"
                                points="+5"
                            />
                            <ActivityItem
                                title="Session terminée"
                                desc="Architecture Node - Marc L."
                                time="Hier"
                                points="+50"
                            />
                        </div>
                        <button className="w-full mt-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Voir tout l'historique
                        </button>
                    </div>

                    {/* Top Skills */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4">Vos expertises stars</h3>
                        <div className="space-y-3">
                            <SkillBar name="React" percent={95} color="bg-blue-500" />
                            <SkillBar name="Node.js" percent={82} color="bg-green-500" />
                            <SkillBar name="Architecture" percent={64} color="bg-purple-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon, label, value }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-900 rounded-lg">{icon}</div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    );
}

function MentorRequestCard({ post, priority }) {
    return (
        <div className={`bg-slate-800/30 border rounded-2xl p-5 hover:bg-slate-800/60 transition-all cursor-pointer group ${priority ? 'border-red-500/30' : 'border-slate-700'
            }`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {post.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 text-[10px] rounded-full uppercase tracking-tighter">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-blue-400 font-bold">30 pts</p>
                    <p className="text-[10px] text-slate-500">3 minutes</p>
                </div>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                {post.content}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="w-3 h-3" />
                    <span>Posté par {post.authorPseudo}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{priority ? 'URGENT' : 'Il y a 20 min'}</span>
                </div>
                <button className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all hover:scale-105 ${priority ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}>
                    Proposer mon aide
                </button>
            </div>
        </div>
    );
}

function ActivityItem({ title, desc, time, points }) {
    return (
        <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-bold text-white">{title}</p>
                    <span className="text-[10px] text-slate-500 uppercase">{time}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{desc}</p>
            </div>
            <div className="text-sm font-bold text-blue-400">{points}</div>
        </div>
    );
}

function SkillBar({ name, percent, color }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{name}</span>
                <span className="text-slate-500">{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-1000`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}
