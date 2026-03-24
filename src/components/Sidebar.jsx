import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Headphones, Bolt } from 'lucide-react';
import { cn } from '../lib/utils';

const CHANNELS = [
  { id: 'groove', name: 'Groove Salad', desc: 'Ambient / Downtempo', url: 'https://ice2.somafm.com/groovesalad-128-mp3', icon: '🌿' },
  { id: 'drone', name: 'Drone Zone', desc: 'Atmospheric / Space', url: 'https://ice4.somafm.com/dronezone-128-mp3', icon: '🌌' },
  { id: 'deepspace', name: 'Deep Space One', desc: 'Deep ambient', url: 'https://ice2.somafm.com/deepspaceone-128-mp3', icon: '🚀' },
  { id: 'lush', name: 'Lush', desc: 'Chillout / Smooth', url: 'https://ice4.somafm.com/lush-128-mp3', icon: '☕' },
  { id: 'beat', name: 'Beat Blender', desc: 'Deep House', url: 'https://ice2.somafm.com/beatblender-128-mp3', icon: '🎧' },
  { id: 'space', name: 'Space Station', desc: 'Electronica', url: 'https://ice4.somafm.com/spacestation-128-mp3', icon: '🛸' },
];

export default function Sidebar() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = activeChannel.url;
      audioRef.current.play().catch(err => console.error("Playback error:", err));
      setIsPlaying(true);
    }
  };

  const selectChannel = (channel) => {
    setActiveChannel(channel);
    if (isPlaying) {
      audioRef.current.src = channel.url;
      audioRef.current.play().catch(err => console.error("Playback error:", err));
    }
  };

  return (
    <aside className="w-[280px] min-w-[280px] bg-[#0c4a6e] bg-gradient-to-b from-[#0c4a6e] to-[#065f46] text-white p-6 flex flex-col h-screen border-r border-emerald-500/10">
      <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-pastel via-teal-pastel to-mint-pastel flex items-center justify-center shadow-lg shadow-sky-400/20">
          <Bolt className="w-5 h-5 text-slate-900 fill-slate-900" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">Smart Work</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Đo Lường Thời Gian</p>
        </div>
      </div>

      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 px-2 mb-4 flex items-center gap-2">
        <Headphones className="w-3 h-3" />
        Nhạc nền tập trung
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-2">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => selectChannel(ch)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-md transition-all duration-200 group text-left",
              activeChannel.id === ch.id 
                ? "bg-white/10 ring-1 ring-white/10 text-white" 
                : "text-white/50 hover:bg-white/5"
            )}
          >
            <span className="text-lg">{ch.icon}</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{ch.name}</span>
              <span className="text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">{ch.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-deep to-mint-deep flex items-center justify-center text-slate-900 hover:scale-110 transition-transform shadow-lg shadow-sky-400/20 flex-shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-between">
               <Volume2 className="w-3 h-3 text-white/30" />
               <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", isPlaying ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : "bg-white/5 text-white/30")}>
                 {isPlaying ? "● Đang phát" : "○ Sẵn sàng"}
               </span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] text-white/20">Phát triển bởi <strong className="text-white/40">Anh Phương</strong></p>
        </div>
      </div>
    </aside>
  );
}
