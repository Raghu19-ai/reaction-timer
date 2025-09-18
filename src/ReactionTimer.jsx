import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function ReactionTimer({ userEmail, onLogout }) {
  const [username, setUsername] = useState(userEmail || "Guest");
  const [message, setMessage] = useState("Click Start to begin");
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [scores, setScores] = useState([]);

  // Update username when userEmail prop changes
  useEffect(() => {
    setUsername(userEmail || "Guest");
  }, [userEmail]);

  // Load scores from localStorage (per user)
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem(`scores-${username}`));
    if (savedScores) {
      setScores(savedScores);
    }
  }, [username]);

  // Save scores to localStorage whenever they change
  useEffect(() => {
    if (scores.length > 0) {
      localStorage.setItem(`scores-${username}`, JSON.stringify(scores));
    }
  }, [scores, username]);

  const startGame = () => {
    setMessage("Wait for green...");
    setReactionTime(null);
    setWaiting(true);

    const delay = Math.floor(Math.random() * 3000) + 2000; // 2–5 sec
    setTimeout(() => {
      setMessage("CLICK NOW!");
      setStartTime(Date.now());
      setWaiting(false);
    }, delay);
  };

  const handleClick = () => {
    if (waiting) {
      setMessage("Too soon! Click Start again.");
    } else if (startTime) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setScores((prev) => [...prev, time]); // add to history
      setMessage(`Your reaction time: ${time} ms`);
      setStartTime(null);
    }
  };

  // Find best score (minimum ms)
  const bestScore = scores.length > 0 ? Math.min(...scores) : null;

  // Reset leaderboard
  const resetScores = () => {
    setScores([]);
    localStorage.removeItem(`scores-${username}`);
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-orb-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-orb-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-sky-500/5 rounded-full blur-3xl animate-orb-3"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="relative w-full max-w-3xl">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-indigo-500/40 via-cyan-400/30 to-emerald-400/40 blur opacity-60" />
          <div className="relative rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                  ⚡ Reaction Timer
                </h1>
                <p className="text-sm text-white/70">Welcome, {username} 👋</p>
              </div>
              <button
                onClick={handleLogout}
                className="self-start sm:self-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white/90 hover:bg-white/15"
              >
                Logout
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Play Panel */}
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                    waiting
                      ? "bg-yellow-500/20 text-yellow-300"
                      : startTime
                      ? "bg-green-500/20 text-green-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  <span>{message}</span>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={startGame}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-700/20 hover:brightness-110"
                  >
                    Start
                  </button>
                  <button
                    onClick={handleClick}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 hover:brightness-110"
                  >
                    Click!
                  </button>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                  <p className="text-sm text-white/60">Your reaction time</p>
                  <p className="mt-2 text-5xl font-extrabold text-white tracking-wide">
                    {reactionTime ? `${reactionTime} ms` : "—"}
                  </p>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white/90">
                    🏆 Leaderboard
                  </h2>
                  {bestScore && (
                    <span className="rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold px-3 py-1">
                      Best: {bestScore} ms
                    </span>
                  )}
                </div>
                <div className="mt-4 h-64 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-4">
                  {scores.length === 0 ? (
                    <p className="text-sm text-white/60">No scores yet</p>
                  ) : (
                    <ol className="list-decimal list-inside space-y-1 text-white/90">
                      {scores.map((s, i) => (
                        <li key={i}>{s} ms</li>
                      ))}
                    </ol>
                  )}
                </div>
                {scores.length > 0 && (
                  <button
                    onClick={resetScores}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 px-4 py-2 text-white font-semibold hover:brightness-110"
                  >
                    Reset Leaderboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
