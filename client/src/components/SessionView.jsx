import { useState, useEffect } from 'react';
import { Timer, Mic, Video, PhoneOff, MessageSquare } from 'lucide-react';

export default function SessionView({ session, onEndSession }) {
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) {
            if (timeLeft === 0) onEndSession();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onEndSession]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progressPercentage = (timeLeft / 180) * 100;

    // Color shifts based on urgency
    let timerColor = "text-white";
    let ringColor = "stroke-cyan-400";

    if (timeLeft < 60) {
        timerColor = "text-yellow-400";
        ringColor = "stroke-yellow-400";
    }
    if (timeLeft < 10) {
        timerColor = "text-red-500 animate-pulse";
        ringColor = "stroke-red-500 animate-pulse";
    }

    return (
        <div className="flex flex-col h-screen bg-slate-900 overflow-hidden relative">

            {/* Top Bar */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg">
                        {session.mentor.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold flex items-center gap-2">
                            {session.mentor.name}
                            <span className="text-xs bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded-full">Expert</span>
                        </h3>
                        <div className="flex gap-1">
                            {session.mentor.expertise.map(skill => (
                                <span key={skill} className="text-xs text-slate-400">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`text-2xl font-mono font-bold ${timerColor} flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg backdrop-blur`}>
                    <ClockRing progress={progressPercentage} color={ringColor} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Main Video Area (Mock) */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-4xl h-full max-h-[70vh] bg-slate-800 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700">
                    {/* Placeholder for Video Feed */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center opacity-30">
                            <Video className="w-24 h-24 mx-auto mb-4" />
                            <p className="text-xl">Mentor Video Feed</p>
                        </div>
                    </div>

                    {/* Self View */}
                    <div className="absolute bottom-6 right-6 w-48 h-32 bg-slate-900 rounded-xl border border-slate-600 shadow-xl flex items-center justify-center">
                        <div className="text-center opacity-50">
                            <p className="text-xs">You</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-8 flex justify-center gap-6 items-center bg-gradient-to-t from-black/80 to-transparent">
                <button className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all">
                    <Mic className="w-6 h-6" />
                </button>
                <button className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all">
                    <Video className="w-6 h-6" />
                </button>
                <button
                    onClick={onEndSession}
                    className="p-6 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg hover:scale-110 transition-all"
                >
                    <PhoneOff className="w-8 h-8 fill-current" />
                </button>
                <button className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all">
                    <MessageSquare className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

// Simple SVG Ring for the countdown
function ClockRing({ progress, color }) {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
            <circle
                className="text-slate-700"
                strokeWidth="3"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="12"
                cy="12"
            />
            <circle
                className={`${color} transition-all duration-1000 ease-linear`}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="12"
                cy="12"
            />
        </svg>
    )
}
