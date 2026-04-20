import React, { useState, useEffect } from 'react';

const DoomLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoomData() {
      try {
        const response = await fetch('/api/game/global-doom');
        const data = await response.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error('Error fetching global doom:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoomData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
        <p className="text-xl font-bold italic">Calculating Global Regret...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-xl border-2 border-red-600 shadow-2xl text-white max-w-4xl mx-auto my-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black tracking-tighter text-red-500 uppercase italic">
          Global Doom Leaderboard
        </h2>
        <p className="text-gray-400 italic">Where is the most regret being generated in real-time?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stylized Map Visualization */}
        <div className="relative bg-black rounded-lg p-4 border border-gray-800 overflow-hidden group">
          <div className="absolute inset-0 bg-red-900/10 group-hover:bg-red-900/20 transition-colors pointer-events-none"></div>
          <svg viewBox="0 0 1000 500" className="w-full h-auto fill-gray-700 stroke-gray-600 stroke-1">
             {/* Simplified World Map Paths */}
             <path d="M150,150 L250,150 L250,250 L150,250 Z" className="transition-colors duration-500" fill={leaderboard.some(l => l.location.includes('North America')) ? 'rgb(255,0,0)' : 'rgb(55,65,81)'} />
             <path d="M450,100 L550,100 L550,200 L450,200 Z" className="transition-colors duration-500" fill={leaderboard.some(l => l.location.includes('Europe')) ? 'rgb(255,0,0)' : 'rgb(55,65,81)'} />
             <path d="M600,200 L750,200 L750,350 L600,350 Z" className="transition-colors duration-500" fill={leaderboard.some(l => l.location.includes('Asia')) ? 'rgb(255,0,0)' : 'rgb(55,65,81)'} />
             <path d="M450,250 L550,250 L550,400 L450,400 Z" className="transition-colors duration-500" fill={leaderboard.some(l => l.location.includes('Africa')) ? 'rgb(255,0,0)' : 'rgb(55,65,81)'} />
             <path d="M700,350 L850,350 L850,450 L700,450 Z" className="transition-colors duration-500" fill={leaderboard.some(l => l.location.includes('South America')) ? 'rgb(255,0,0)' : 'rgb(55,65,81)'} />
             <text x="500" y="480" textAnchor="middle" className="fill-gray-500 text-xs font-mono uppercase">Simplified Doom Heatmap</text>
          </svg>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-red-400 bg-black/50 px-2 py-1 rounded">
            LIVE DATA FEED
          </div>
        </div>

        {/* Top Regions List */}
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border-l-4 border-red-600 hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-mono text-sm">#{index + 1}</span>
                <span className="font-bold group-hover:text-red-400 transition-colors">{entry.location}</span>
              </div>
              <div className="text-right">
                <div className="text-red-500 font-black">{entry.totalDoom} Doom</div>
                <div className="text-[10px] text-gray-500 uppercase font-mono">Avg: {entry.avgDoom}%</div>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-gray-500 italic">
              No doom data yet. Spin the wheel to create regret!
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-mono text-gray-600 uppercase tracking-widest">
        WayaWheel Intelligence Network &copy; 2026
      </div>
    </div>
  );
};

export default DoomLeaderboard;