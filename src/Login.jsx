// src/Login.jsx
import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login({ onLogin }) {
  const vantaRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let vantaEffect = null;

    const checkScriptsLoaded = () => {
      return (
        window.THREE &&
        window.THREE.PerspectiveCamera &&
        window.VANTA &&
        window.VANTA.BIRDS
      );
    };

    const initializeVanta = () => {
      try {
        if (checkScriptsLoaded() && vantaRef.current) {
          console.log("Initializing Vanta BIRDS effect...");
          vantaEffect = window.VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x0a0a0a,
            color1: 0xff9900,
            color2: 0x00aaff,
          });
          console.log("Vanta BIRDS effect initialized successfully");
        } else {
          console.warn(
            "Required scripts not loaded, using fallback background"
          );
          setFallbackBackground();
        }
      } catch (err) {
        console.warn("Vanta BIRDS effect failed to initialize:", err);
        setFallbackBackground();
      }
    };

    const setFallbackBackground = () => {
      if (vantaRef.current) {
        vantaRef.current.style.background =
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)";
      }
    };

    // Set fallback background immediately
    setFallbackBackground();

    // Try to initialize Vanta with multiple attempts
    let attempts = 0;
    const maxAttempts = 10;

    const tryInitialize = () => {
      attempts++;
      if (checkScriptsLoaded()) {
        initializeVanta();
      } else if (attempts < maxAttempts) {
        setTimeout(tryInitialize, 200);
      } else {
        console.warn(
          "Failed to load Vanta scripts after",
          maxAttempts,
          "attempts"
        );
        setFallbackBackground();
      }
    };

    // Start trying to initialize after a short delay
    const timeoutId = setTimeout(tryInitialize, 300);

    return () => {
      clearTimeout(timeoutId);
      if (vantaEffect && typeof vantaEffect.destroy === "function") {
        vantaEffect.destroy();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data, error;
      if (isSignUp) {
        ({ data, error } = await supabase.auth.signUp({ email, password }));
      } else {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        }));
      }

      if (error) setError(error.message);
      else {
        console.log("Success:", data);
        if (!isSignUp && onLogin) onLogin(email);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div
      ref={vantaRef}
      className="h-screen w-screen flex items-center justify-center px-4"
    >
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-blue-500/40 via-white/10 to-orange-500/40 blur opacity-60" />
        <div className="relative rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
          <div className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-white">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="mt-1 text-sm text-white/70">
                {isSignUp ? "Sign up to get started" : "Sign in to continue"}
              </p>
            </div>

            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
              >
                {loading
                  ? isSignUp
                    ? "Signing up..."
                    : "Signing in..."
                  : isSignUp
                  ? "Sign Up"
                  : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/60">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-orange-300 hover:text-orange-200"
              >
                {isSignUp ? "Login" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
