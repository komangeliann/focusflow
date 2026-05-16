/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// FOCUSFLOW
// Focus timer + mood check-in + tasks + analytics + onboarding + settings.
// Ready for src/App.jsx in a Vite React project.
// ============================================================================

const THEME = {
  page: "#060711",
  phone: "rgba(12, 14, 24, 0.9)",
  surface: "rgba(255, 255, 255, 0.075)",
  surfaceUp: "rgba(255, 255, 255, 0.12)",
  border: "rgba(255, 255, 255, 0.12)",
  borderStrong: "rgba(255, 255, 255, 0.2)",
  text: "#F7F3EF",
  muted: "rgba(247, 243, 239, 0.58)",
  dim: "rgba(247, 243, 239, 0.28)",
  accent: "#FF7A45",
  accentSoft: "rgba(255, 122, 69, 0.14)",
  accentMid: "rgba(255, 122, 69, 0.32)",
  green: "#5EF2B8",
  greenSoft: "rgba(94, 242, 184, 0.14)",
  blue: "#7AB7FF",
  blueSoft: "rgba(122, 183, 255, 0.14)",
  yellow: "#FFE08A",
  yellowSoft: "rgba(255, 224, 138, 0.14)",
  purple: "#B49CFF",
  purpleSoft: "rgba(180, 156, 255, 0.14)",
  red: "#FF6B7A",
  redSoft: "rgba(255, 107, 122, 0.14)",
};

const STORAGE_KEYS = {
  tasks: "focusflow:tasks",
  sessions: "focusflow:sessions",
  mood: "focusflow:mood",
  settings: "focusflow:settings",
  onboarded: "focusflow:onboarded",
};

const TAGS = ["WORK", "PERSONAL", "HEALTH", "STUDY"];
const TAG_COLORS = {
  WORK: THEME.blue,
  PERSONAL: THEME.purple,
  HEALTH: THEME.green,
  STUDY: THEME.yellow,
};

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const PRIORITY_COLORS = {
  LOW: THEME.green,
  MEDIUM: THEME.yellow,
  HIGH: THEME.red,
};

const MOODS = ["😤", "😴", "😐", "😊", "🚀"];
const MOOD_LABELS = ["Stressed", "Tired", "Neutral", "Good", "Pumped"];
const MOOD_SUGGESTIONS = [
  "Start light. One short focus block is already progress.",
  "Keep it gentle. Try 25 minutes, then rest properly.",
  "A standard Pomodoro is enough to build momentum.",
  "You are in a good zone. Try a deeper 45-minute session.",
  "Full energy. This is a good time for a 60-minute deep-work block.",
];

const DURATIONS = [
  { label: "25 min", seconds: 25 * 60 },
  { label: "45 min", seconds: 45 * 60 },
  { label: "60 min", seconds: 60 * 60 },
];

const DEFAULT_SETTINGS = {
  name: "El",
  defaultDurationIndex: 0,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakAfter: 4,
  autoStartBreak: true,
  soundEnabled: true,
  notificationsEnabled: false,
  defaultTaskTarget: 2,
};

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function todayKey() {
  return new Date().toDateString();
}

function dateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

function todayLabel() {
  return new Date()
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    .toUpperCase();
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function loadStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
}

function saveStorage(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createInitialTasks() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  return [
    {
      id: createId(),
      name: "Review UI dashboard concept",
      done: true,
      tag: "WORK",
      priority: "HIGH",
      dueDate: dateInputValue(),
      focusSessions: 2,
      targetSessions: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      name: "Finish React component cleanup",
      done: false,
      tag: "WORK",
      priority: "HIGH",
      dueDate: dateInputValue(tomorrow),
      focusSessions: 1,
      targetSessions: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      name: "Read 20 pages of design book",
      done: false,
      tag: "PERSONAL",
      priority: "MEDIUM",
      dueDate: dateInputValue(nextWeek),
      focusSessions: 0,
      targetSessions: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      name: "Workout — upper body",
      done: false,
      tag: "HEALTH",
      priority: "LOW",
      dueDate: dateInputValue(tomorrow),
      focusSessions: 0,
      targetSessions: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      name: "Practice JavaScript array methods",
      done: false,
      tag: "STUDY",
      priority: "MEDIUM",
      dueDate: dateInputValue(nextWeek),
      focusSessions: 0,
      targetSessions: 3,
      createdAt: new Date().toISOString(),
    },
  ];
}

function createInitialSessions() {
  const now = new Date();
  const pattern = [25, 45, 0, 60, 25, 45, 25];

  return pattern
    .map((minutes, index) => {
      if (minutes === 0) return null;
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));

      return {
        id: createId(),
        date: date.toDateString(),
        duration: minutes * 60,
        mood: index % MOODS.length,
        taskId: null,
        createdAt: date.toISOString(),
      };
    })
    .filter(Boolean);
}

function requestBrowserNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (window.Notification.permission === "default") {
    window.Notification.requestPermission();
  }
}

function sendBrowserNotification(title, body) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (window.Notification.permission === "granted") {
    new window.Notification(title, { body });
  }
}

function playFocusCompleteSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();

    [523, 659, 784, 1047].forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const startAt = ctx.currentTime + index * 0.16;

      oscillator.type = "sine";
      oscillator.frequency.value = freq;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.001, startAt);
      gain.gain.linearRampToValueAtTime(0.18, startAt + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.45);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.5);
    });
  } catch {
    // Browser may block audio until user interaction.
  }
}

function playBreakCompleteSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.6);
  } catch {
    // Browser may block audio until user interaction.
  }
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html,
      body,
      #root {
        min-height: 100%;
      }

      body {
        min-height: 100vh;
        background:
          radial-gradient(circle at 18% 12%, rgba(255, 122, 69, 0.2), transparent 28%),
          radial-gradient(circle at 82% 18%, rgba(122, 183, 255, 0.18), transparent 32%),
          radial-gradient(circle at 50% 92%, rgba(180, 156, 255, 0.16), transparent 30%),
          ${THEME.page};
        color: ${THEME.text};
        font-family: 'DM Mono', monospace;
      }

      button, input, select { font-family: 'DM Mono', monospace; }

      select,
      select option,
      select optgroup {
        background-color: #151827;
        color: ${THEME.text};
      }

      select { color-scheme: dark; }

      input[type="date"],
      input[type="number"] { color-scheme: dark; }

      input::placeholder { color: ${THEME.dim}; }
      ::-webkit-scrollbar { width: 0; }

      @media (max-width: 480px) {
        html,
        body,
        #root {
          width: 100%;
          min-height: 100%;
          overflow: hidden;
          background: ${THEME.page};
        }
      }

      @keyframes popIn {
        0% { transform: scale(0.86); opacity: 0; }
        70% { transform: scale(1.04); }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }

      @keyframes confettiDrop {
        0% { transform: translate3d(0, -20px, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate3d(var(--x), 120vh, 0) rotate(720deg); opacity: 0; }
      }

      .ff-pop { animation: popIn 0.35s cubic-bezier(.34,1.56,.64,1) both; }
      .ff-fade { animation: fadeUp 0.3s ease both; }
      .ff-pulse { animation: pulse 1.5s ease-in-out infinite; }
    `}</style>
  );
}

function useIsMobileViewport() {
  const getValue = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 480px)").matches;
  };

  const [isMobile, setIsMobile] = useState(getValue);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 480px)");
    const handleChange = () => setIsMobile(media.matches);

    handleChange();
    media.addEventListener?.("change", handleChange);

    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  return isMobile;
}

function useRealViewportHeight() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const setHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    setHeight();
    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);

    return () => {
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);
}

function Card({ children, style, onClick, className = "" }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: THEME.surface,
        border: `1px solid ${THEME.border}`,
        borderRadius: 24,
        padding: "18px 20px",
        cursor: onClick ? "pointer" : "default",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "border-color 0.2s, transform 0.2s, background 0.2s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", style, disabled = false, type = "button" }) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  const isDanger = variant === "danger";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "13px 18px",
        borderRadius: 16,
        border: isOutline ? `1px solid ${THEME.border}` : "none",
        background: isDanger ? THEME.redSoft : isPrimary ? THEME.accent : THEME.surfaceUp,
        color: isDanger ? THEME.red : isPrimary ? "#FFFFFF" : THEME.text,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function IconButton({ children, onClick, label, style }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 14,
        border: `1px solid ${THEME.border}`,
        background: THEME.surface,
        color: THEME.text,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(18px)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Pill({ children, color = THEME.accent }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 99,
        background: `${color}18`,
        color,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.12em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children, style }) {
  return <p style={{ fontSize: 9, letterSpacing: "0.2em", color: THEME.muted, marginBottom: 12, ...style }}>{children}</p>;
}

function ProgressBar({ value, max, color = THEME.accent, height = 5 }) {
  const percentage = Math.min((value / Math.max(max, 1)) * 100, 100);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${percentage}%`, background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 9, color: THEME.muted, letterSpacing: "0.14em", marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        minHeight: 42,
        border: `1px solid ${THEME.border}`,
        borderRadius: 14,
        background: THEME.surfaceUp,
        color: THEME.text,
        outline: "none",
        padding: "0 13px",
        fontSize: 12,
        ...props.style,
      }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        minHeight: 42,
        border: `1px solid ${THEME.border}`,
        borderRadius: 14,
        background: THEME.surfaceUp,
        color: THEME.text,
        outline: "none",
        padding: "0 13px",
        fontSize: 12,
        ...props.style,
      }}
    />
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3200);
    return () => clearTimeout(timeout);
  }, [onClose]);

  const background = type === "success" ? THEME.green : type === "break" ? THEME.blue : type === "danger" ? THEME.red : THEME.accent;

  return (
    <div
      className="ff-pop"
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background,
        color: "#071018",
        padding: "12px 20px",
        borderRadius: 16,
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.04em",
        zIndex: 999,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {message}
    </div>
  );
}

function Confetti({ active }) {
  if (!active) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 998 }}>
      {Array.from({ length: 34 }).map((_, index) => {
        const colors = [THEME.accent, THEME.blue, THEME.green, THEME.yellow, THEME.purple];
        return (
          <span
            key={index}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: -20,
              width: 8,
              height: 14,
              borderRadius: 3,
              background: colors[index % colors.length],
              animation: `confettiDrop ${1.2 + Math.random() * 1.2}s ease-in forwards`,
              animationDelay: `${Math.random() * 0.2}s`,
              "--x": `${-80 + Math.random() * 160}px`,
            }}
          />
        );
      })}
    </div>
  );
}

function StatusBar() {
  const getTime = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px 6px", fontSize: 12, fontWeight: 700 }}>
      <span>{time}</span>
      <div style={{ width: 100, height: 22, background: "rgba(255,255,255,0.1)", border: `1px solid ${THEME.border}`, backdropFilter: "blur(12px)", borderRadius: 11 }} />
      <span style={{ fontSize: 10 }}>●●●</span>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "home", icon: "⌂", label: "HOME" },
  { id: "timer", icon: "◉", label: "FOCUS" },
  { id: "tasks", icon: "✦", label: "TASKS" },
  { id: "stats", icon: "⌇", label: "STATS" },
];

function BottomNav({ screen, setScreen }) {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderTop: `1px solid ${THEME.border}`, backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", padding: "6px 8px 8px" }}>
      {NAV_ITEMS.map((item) => {
        const active = screen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setScreen(item.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 0 8px",
              gap: 5,
              cursor: "pointer",
              color: active ? THEME.accent : THEME.dim,
              background: active ? "rgba(255,122,69,0.1)" : "transparent",
              border: "none",
              borderRadius: 18,
              transition: "color 0.2s, background 0.2s",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 8, letterSpacing: "0.15em" }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function OnboardingScreen({ onFinish }) {
  const slides = [
    { icon: "🎯", title: "Focus with intention", body: "Pick one task, run a focus block, and make your progress visible." },
    { icon: "🌤️", title: "Mood-aware productivity", body: "Log your mood so your work session feels realistic, not forced." },
    { icon: "📊", title: "Track your rhythm", body: "See focus minutes, task progress, and mood patterns over time." },
  ];
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  return (
    <main style={{ flex: 1, padding: "24px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <SectionTitle>WELCOME TO FOCUSFLOW</SectionTitle>
        <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="ff-pop" style={{ width: 176, height: 176, borderRadius: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, background: `linear-gradient(135deg, ${THEME.accentSoft}, ${THEME.blueSoft})`, border: `1px solid ${THEME.border}` }}>
            {slide.icon}
          </div>
        </div>
        <h1 style={{ fontFamily: "Syne", fontSize: 32, lineHeight: 1.05, marginBottom: 12 }}>{slide.title}</h1>
        <p style={{ color: THEME.muted, fontSize: 12, lineHeight: 1.8 }}>{slide.body}</p>
      </div>

      <div>
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {slides.map((_, slideIndex) => (
            <div key={slideIndex} style={{ flex: 1, height: 5, borderRadius: 99, background: slideIndex <= index ? THEME.accent : THEME.border }} />
          ))}
        </div>
        {index < slides.length - 1 ? <Button onClick={() => setIndex((current) => current + 1)}>NEXT</Button> : <Button onClick={onFinish}>START USING APP</Button>}
        <button type="button" onClick={onFinish} style={{ width: "100%", marginTop: 12, background: "transparent", border: "none", color: THEME.muted, fontSize: 11, cursor: "pointer" }}>
          SKIP ONBOARDING
        </button>
      </div>
    </main>
  );
}

function HomeScreen({ tasks, sessions, mood, settings, setScreen }) {
  const todaySessions = useMemo(() => sessions.filter((session) => session.date === todayKey()), [sessions]);
  const totalMinutesToday = Math.round(todaySessions.reduce((total, session) => total + session.duration, 0) / 60);
  const completedTaskCount = tasks.filter((task) => task.done).length;
  const pendingTasks = tasks.filter((task) => !task.done);
  const highPriorityCount = pendingTasks.filter((task) => task.priority === "HIGH").length;

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px" }}>
      <header style={{ marginBottom: 22, display: "flex", gap: 14, alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 10, color: THEME.muted, letterSpacing: "0.15em", marginBottom: 6 }}>{todayLabel()}</p>
          <h1 style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>
            {mood !== null ? `Feeling ${MOOD_LABELS[mood]},` : "Ready to focus,"}
            <br />
            <span style={{ color: THEME.accent }}>{settings.name || "El"}.</span>
          </h1>
        </div>
        <IconButton onClick={() => setScreen("settings")} label="Open settings">⚙</IconButton>
      </header>

      {mood === null ? (
        <Card onClick={() => setScreen("mood")} style={{ background: THEME.accentSoft, border: `1px solid ${THEME.accentMid}`, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🌤️</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: THEME.accent, fontWeight: 800, letterSpacing: "0.08em", marginBottom: 3 }}>HOW ARE YOU FEELING?</p>
              <p style={{ fontSize: 11, color: THEME.muted }}>Check in before your first session</p>
            </div>
            <span style={{ color: THEME.accent, fontSize: 20 }}>›</span>
          </div>
        </Card>
      ) : (
        <Card style={{ background: THEME.accentSoft, border: `1px solid ${THEME.accentMid}`, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>{MOODS[mood]}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: THEME.accent, letterSpacing: "0.08em" }}>MOOD LOGGED</p>
              <p style={{ fontSize: 11, color: THEME.muted }}>{MOOD_LABELS[mood]} today</p>
            </div>
            <Button onClick={() => setScreen("timer")} style={{ width: "auto", padding: "10px 16px" }}>
              FOCUS →
            </Button>
          </div>
        </Card>
      )}

      <section style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        {[
          { label: "TODAY", value: totalMinutesToday ? `${totalMinutesToday}m` : "0m", color: THEME.accent },
          { label: "HIGH", value: highPriorityCount || "—", color: THEME.red },
          { label: "TASKS", value: `${completedTaskCount}/${tasks.length}`, color: THEME.green },
        ].map((stat) => (
          <Card key={stat.label} style={{ flex: 1, padding: "14px 12px", textAlign: "center" }}>
            <p style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
            <p style={{ fontSize: 8, color: THEME.muted, marginTop: 5, letterSpacing: "0.12em" }}>{stat.label}</p>
          </Card>
        ))}
      </section>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 800 }}>Quick Session</p>
          <Pill>{DURATIONS[settings.defaultDurationIndex]?.label || "25 min"}</Pill>
        </div>
        <Button onClick={() => setScreen("timer")}>▶ START FOCUS SESSION</Button>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 800 }}>Today's Tasks</p>
          <button type="button" onClick={() => setScreen("tasks")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: THEME.accent, letterSpacing: "0.1em" }}>
            SEE ALL ›
          </button>
        </div>

        {tasks.length === 0 ? (
          <EmptyState icon="✦" title="No tasks yet" body="Add a task with due date, priority, and focus target." />
        ) : (
          pendingTasks.slice(0, 3).map((task) => <MiniTaskRow key={task.id} task={task} />)
        )}
      </Card>
    </main>
  );
}

function MiniTaskRow({ task }) {
  return (
    <div style={{ padding: "11px 0", borderBottom: `1px solid ${THEME.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
        <div style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, border: `2px solid ${task.done ? THEME.accent : THEME.border}`, background: task.done ? THEME.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#FFFFFF" }}>
          {task.done && "✓"}
        </div>
        <p style={{ flex: 1, fontSize: 12, textDecoration: task.done ? "line-through" : "none", color: task.done ? THEME.muted : THEME.text }}>{task.name}</p>
        <Pill color={PRIORITY_COLORS[task.priority]}>{task.priority}</Pill>
      </div>
      <ProgressBar value={task.focusSessions || 0} max={task.targetSessions || 1} color={TAG_COLORS[task.tag]} height={4} />
    </div>
  );
}

function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 12px", color: THEME.muted }}>
      <div style={{ width: 74, height: 74, margin: "0 auto 14px", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, background: THEME.surfaceUp, border: `1px solid ${THEME.border}` }}>{icon}</div>
      <p style={{ color: THEME.text, fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 11, lineHeight: 1.6 }}>{body}</p>
      {action}
    </div>
  );
}

function MoodScreen({ mood, setMood, setScreen }) {
  const [selectedMood, setSelectedMood] = useState(mood);

  function saveMoodAndStart() {
    if (selectedMood === null) return;
    setMood(selectedMood);
    setScreen("timer");
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
      <SectionTitle>MOOD CHECK-IN</SectionTitle>
      <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, lineHeight: 1.15, marginBottom: 8 }}>
        How are you
        <br />
        <span style={{ color: THEME.accent }}>feeling right now?</span>
      </h1>
      <p style={{ fontSize: 11, color: THEME.muted, lineHeight: 1.8, marginBottom: 28 }}>Your mood shapes your session recommendation.</p>

      <section style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {MOODS.map((moodIcon, index) => {
          const active = selectedMood === index;
          return (
            <button
              key={MOOD_LABELS[index]}
              type="button"
              onClick={() => setSelectedMood(index)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "14px 6px",
                borderRadius: 16,
                border: `2px solid ${active ? THEME.accent : THEME.border}`,
                background: active ? THEME.accentSoft : "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 26 }}>{moodIcon}</span>
              <span style={{ fontSize: 8, letterSpacing: "0.05em", color: active ? THEME.accent : THEME.muted }}>{MOOD_LABELS[index].toUpperCase()}</span>
            </button>
          );
        })}
      </section>

      <div style={{ minHeight: 92, marginBottom: 24, opacity: selectedMood !== null ? 1 : 0, transition: "opacity 0.3s" }}>
        {selectedMood !== null && (
          <Card style={{ background: THEME.accentSoft, border: `1px solid ${THEME.accentMid}` }}>
            <p style={{ fontSize: 10, color: THEME.accent, letterSpacing: "0.15em", marginBottom: 6 }}>✦ SESSION SUGGESTION</p>
            <p style={{ fontSize: 13, color: THEME.text, lineHeight: 1.7 }}>{MOOD_SUGGESTIONS[selectedMood]}</p>
          </Card>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="outline" onClick={() => setScreen("home")} style={{ flex: "0 0 80px", width: "auto" }}>BACK</Button>
        <Button onClick={saveMoodAndStart} disabled={selectedMood === null} style={{ flex: 1 }}>START SESSION →</Button>
      </div>
    </main>
  );
}

function TimerScreen({ tasks, settings, mood, selectedTaskId, setSelectedTaskId, onSessionComplete, showToast, triggerConfetti }) {
  const [durationIndex, setDurationIndex] = useState(settings.defaultDurationIndex || 0);
  const [seconds, setSeconds] = useState(DURATIONS[settings.defaultDurationIndex || 0].seconds);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("focus");
  const [sessionNumber, setSessionNumber] = useState(1);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const intervalRef = useRef(null);

  const focusSeconds = DURATIONS[durationIndex].seconds;
  const shortBreakSeconds = Math.max(Number(settings.shortBreakMinutes) || 5, 1) * 60;
  const longBreakSeconds = Math.max(Number(settings.longBreakMinutes) || 15, 1) * 60;
  const longBreakAfter = Math.max(Number(settings.longBreakAfter) || 4, 1);
  const totalSeconds = phase === "focus" ? focusSeconds : phase === "longBreak" ? longBreakSeconds : shortBreakSeconds;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
  const circleRadius = 108;
  const circumference = 2 * Math.PI * circleRadius;
  const phaseColor = phase === "focus" ? THEME.accent : phase === "longBreak" ? THEME.purple : THEME.green;
  const incompleteTasks = tasks.filter((task) => !task.done);
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  useEffect(() => {
    if (!running && phase === "focus") setSeconds(DURATIONS[durationIndex].seconds);
  }, [durationIndex, phase, running]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((previousSeconds) => {
        if (previousSeconds > 1) return previousSeconds - 1;

        clearInterval(intervalRef.current);
        setRunning(false);

        if (phase === "focus") {
          const nextCompleted = completedFocusSessions + 1;
          const isLongBreak = nextCompleted % longBreakAfter === 0;
          const nextPhase = isLongBreak ? "longBreak" : "shortBreak";
          const nextSeconds = isLongBreak ? longBreakSeconds : shortBreakSeconds;

          setCompletedFocusSessions(nextCompleted);
          setSessionNumber((current) => current + 1);
          onSessionComplete({ duration: focusSeconds, date: todayKey(), mood, taskId: selectedTaskId });
          triggerConfetti();

          if (settings.soundEnabled) playFocusCompleteSound();
          if (settings.notificationsEnabled) sendBrowserNotification("FocusFlow", isLongBreak ? "Long break unlocked. Great work." : "Focus session complete. Take a short break.");

          showToast(isLongBreak ? "🎉 Long break unlocked!" : selectedTask ? "✅ Session complete. Task progress updated." : "✅ Session complete.", "success");
          setPhase(nextPhase);
          setSeconds(nextSeconds);

          if (settings.autoStartBreak) {
            setTimeout(() => setRunning(true), 650);
          }
        } else {
          if (settings.soundEnabled) playBreakCompleteSound();
          if (settings.notificationsEnabled) sendBrowserNotification("FocusFlow", "Break is over. Ready for the next focus block?");
          showToast("⏱ Break over — time to focus!", "break");
          setPhase("focus");
          setSeconds(focusSeconds);
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, phase, completedFocusSessions, longBreakAfter, longBreakSeconds, shortBreakSeconds, focusSeconds, mood, selectedTaskId, selectedTask, settings, onSessionComplete, showToast, triggerConfetti]);

  function resetTimer() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSeconds(totalSeconds);
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SectionTitle style={{ margin: 0 }}>SESSION {sessionNumber}</SectionTitle>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: longBreakAfter }).map((_, index) => (
            <div
              key={index}
              style={{
                width: index < completedFocusSessions % longBreakAfter ? 20 : 8,
                height: 6,
                borderRadius: 99,
                background: index < completedFocusSessions % longBreakAfter ? THEME.green : index === completedFocusSessions % longBreakAfter && phase === "focus" ? THEME.accent : THEME.border,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </header>

      {!running && phase === "focus" && (
        <section className="ff-fade" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {DURATIONS.map((duration, index) => {
            const active = durationIndex === index;
            return (
              <button
                key={duration.label}
                type="button"
                onClick={() => setDurationIndex(index)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  borderRadius: 12,
                  border: `1.5px solid ${active ? THEME.accent : THEME.border}`,
                  background: active ? THEME.accentSoft : "transparent",
                  color: active ? THEME.accent : THEME.muted,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {duration.label}
              </button>
            );
          })}
        </section>
      )}

      <section style={{ display: "flex", justifyContent: "center", margin: "8px 0 20px" }}>
        <div style={{ position: "relative", width: 248, height: 248 }}>
          <svg width="248" height="248" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
            <circle cx="124" cy="124" r={circleRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="124"
              cy="124"
              r={circleRadius}
              fill="none"
              stroke={phaseColor}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.5s" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <p style={{ fontSize: 9, color: THEME.muted, letterSpacing: "0.2em" }}>{phase === "focus" ? "FOCUS" : phase === "longBreak" ? "LONG BREAK" : "SHORT BREAK"}</p>
            <p className={running ? "ff-pulse" : ""} style={{ fontFamily: "Syne", fontSize: 50, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: phaseColor, transition: "color 0.5s" }}>
              {formatTimer(seconds)}
            </p>
            <p style={{ fontSize: 9, color: THEME.muted }}>{completedFocusSessions} focus block{completedFocusSessions !== 1 ? "s" : ""} completed</p>
          </div>
        </div>
      </section>

      {phase === "focus" && (
        <Card style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 9, color: THEME.muted, letterSpacing: "0.15em", marginBottom: 10 }}>WORKING ON</p>
          {incompleteTasks.length === 0 ? (
            <p style={{ fontSize: 12, color: THEME.muted }}>No task yet. Add a task in the Tasks tab.</p>
          ) : (
            incompleteTasks.slice(0, 4).map((task) => {
              const selected = selectedTaskId === task.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedTaskId(selected ? null : task.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 14,
                    cursor: "pointer",
                    marginBottom: 7,
                    border: `1.5px solid ${selected ? THEME.accent : THEME.border}`,
                    background: selected ? THEME.accentSoft : THEME.surfaceUp,
                    color: THEME.text,
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, border: `2px solid ${selected ? THEME.accent : THEME.border}`, background: selected ? THEME.accent : "transparent" }} />
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 12 }}>{task.name}</span>
                    <span style={{ display: "block", fontSize: 9, color: THEME.muted, marginTop: 3 }}>{task.focusSessions || 0}/{task.targetSessions || 1} sessions</span>
                  </span>
                  <Pill color={PRIORITY_COLORS[task.priority]}>{task.priority}</Pill>
                </button>
              );
            })
          )}
        </Card>
      )}

      {phase !== "focus" && (
        <Card className="ff-fade" style={{ marginBottom: 12, background: phase === "longBreak" ? THEME.purpleSoft : THEME.greenSoft, border: `1px solid ${phaseColor}30`, textAlign: "center" }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>{phase === "longBreak" ? "🏆" : "☕"}</p>
          <p style={{ fontSize: 13, color: phaseColor, fontWeight: 800, marginBottom: 4 }}>{phase === "longBreak" ? "Great work! Long break time." : "Short break — stretch a bit!"}</p>
          <p style={{ fontSize: 11, color: THEME.muted }}>{settings.autoStartBreak ? "Break starts automatically." : "Press start when you are ready."}</p>
        </Card>
      )}

      <section style={{ display: "flex", gap: 10, marginTop: "auto" }}>
        <Button variant="outline" onClick={resetTimer} style={{ flex: "0 0 56px", width: "auto", padding: 14 }}>↺</Button>
        <Button onClick={() => setRunning((current) => !current)} style={{ flex: 1, background: running ? THEME.surfaceUp : THEME.accent, color: running ? THEME.text : "#FFFFFF" }}>
          {running ? "⏸ PAUSE" : phase === "focus" ? "▶ START FOCUS" : phase === "longBreak" ? "▶ LONG BREAK" : "☕ START BREAK"}
        </Button>
      </section>
    </main>
  );
}

function TasksScreen({ tasks, setTasks, settings, selectedTaskId, setSelectedTaskId, showToast }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const pendingTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);

  function saveTask(taskData) {
    if (!taskData.name.trim()) return;

    if (taskData.id) {
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskData.id ? { ...task, ...taskData, name: taskData.name.trim() } : task)));
      showToast("Task updated.", "success");
    } else {
      setTasks((currentTasks) => [
        ...currentTasks,
        {
          id: createId(),
          name: taskData.name.trim(),
          done: false,
          tag: taskData.tag,
          priority: taskData.priority,
          dueDate: taskData.dueDate,
          targetSessions: Number(taskData.targetSessions) || settings.defaultTaskTarget || 1,
          focusSessions: 0,
          createdAt: new Date().toISOString(),
        },
      ]);
      showToast("Task added.", "success");
    }

    setIsAdding(false);
    setEditingTask(null);
  }

  function toggleTask(id) {
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function removeTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
    showToast("Task removed.", "danger");
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <SectionTitle>TODAY</SectionTitle>
          <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800 }}>Tasks</h1>
        </div>
        <Pill>{pendingTasks.length} pending</Pill>
      </header>

      {tasks.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: 12 }}>Completion</p>
            <p style={{ fontSize: 12, color: THEME.accent, fontWeight: 800 }}>{completedTasks.length}/{tasks.length}</p>
          </div>
          <ProgressBar value={completedTasks.length} max={tasks.length} />
        </Card>
      )}

      {isAdding || editingTask ? (
        <TaskForm
          initialTask={editingTask}
          defaultTarget={settings.defaultTaskTarget}
          onCancel={() => {
            setIsAdding(false);
            setEditingTask(null);
          }}
          onSave={saveTask}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          style={{ width: "100%", padding: 14, borderRadius: 16, cursor: "pointer", border: `1.5px dashed ${THEME.border}`, background: "transparent", color: THEME.muted, fontSize: 12, letterSpacing: "0.08em", marginBottom: 14 }}
        >
          + ADD TASK
        </button>
      )}

      {pendingTasks.length > 0 && (
        <section>
          <SectionTitle>PENDING</SectionTitle>
          {pendingTasks.map((task) => (
            <TaskItem key={task.id} task={task} selected={selectedTaskId === task.id} onSelect={() => setSelectedTaskId(task.id)} onToggle={toggleTask} onEdit={() => setEditingTask(task)} onRemove={removeTask} />
          ))}
        </section>
      )}

      {completedTasks.length > 0 && (
        <section style={{ marginTop: 16 }}>
          <SectionTitle>COMPLETED</SectionTitle>
          {completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} selected={selectedTaskId === task.id} onSelect={() => setSelectedTaskId(task.id)} onToggle={toggleTask} onEdit={() => setEditingTask(task)} onRemove={removeTask} />
          ))}
        </section>
      )}

      {tasks.length === 0 && <EmptyState icon="✦" title="No tasks yet" body="Create your first task with a deadline, priority, and focus target." />}
    </main>
  );
}

function TaskForm({ initialTask, defaultTarget, onCancel, onSave }) {
  const [form, setForm] = useState(
    initialTask || {
      name: "",
      tag: "WORK",
      priority: "MEDIUM",
      dueDate: dateInputValue(),
      targetSessions: defaultTarget || 2,
    }
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <Card className="ff-fade" style={{ marginBottom: 14 }}>
      <Field label="TASK NAME">
        <Input autoFocus value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="What do you need to finish?" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="CATEGORY">
          <Select value={form.tag} onChange={(event) => updateField("tag", event.target.value)}>
            {TAGS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </Select>
        </Field>
        <Field label="PRIORITY">
          <Select value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
            {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </Select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="DUE DATE">
          <Input type="date" value={form.dueDate || ""} onChange={(event) => updateField("dueDate", event.target.value)} />
        </Field>
        <Field label="TARGET SESSIONS">
          <Input type="number" min="1" max="12" value={form.targetSessions} onChange={(event) => updateField("targetSessions", event.target.value)} />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="outline" onClick={onCancel} style={{ flex: "0 0 88px", width: "auto" }}>CANCEL</Button>
        <Button onClick={() => onSave(form)} style={{ flex: 1 }} disabled={!form.name.trim()}>{initialTask ? "SAVE CHANGES" : "ADD TASK"}</Button>
      </div>
    </Card>
  );
}

function TaskItem({ task, selected, onSelect, onToggle, onEdit, onRemove }) {
  return (
    <Card style={{ marginBottom: 9, padding: 14, opacity: task.done ? 0.62 : 1, border: selected ? `1px solid ${THEME.accentMid}` : `1px solid ${THEME.border}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, cursor: "pointer", border: `2px solid ${task.done ? THEME.accent : THEME.dim}`, background: task.done ? THEME.accent : "transparent", color: "#FFFFFF", fontSize: 11 }}
        >
          {task.done && "✓"}
        </button>

        <button type="button" onClick={onSelect} style={{ flex: 1, background: "transparent", border: "none", textAlign: "left", cursor: "pointer" }}>
          <p style={{ color: task.done ? THEME.muted : THEME.text, fontSize: 13, fontWeight: 800, lineHeight: 1.45, textDecoration: task.done ? "line-through" : "none" }}>{task.name}</p>
          <p style={{ color: THEME.muted, fontSize: 10, marginTop: 5 }}>Due {task.dueDate || "No date"} • {task.focusSessions || 0}/{task.targetSessions || 1} focus</p>
        </button>

        <div style={{ display: "flex", gap: 6 }}>
          <IconButton onClick={onEdit} label="Edit task" style={{ width: 32, height: 32, borderRadius: 11 }}>✎</IconButton>
          <IconButton onClick={() => onRemove(task.id)} label="Remove task" style={{ width: 32, height: 32, borderRadius: 11, color: THEME.red }}>×</IconButton>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 7 }}>
          <Pill color={TAG_COLORS[task.tag]}>{task.tag}</Pill>
          <Pill color={PRIORITY_COLORS[task.priority]}>{task.priority}</Pill>
        </div>
        {selected && <Pill>SELECTED</Pill>}
      </div>
      <ProgressBar value={task.focusSessions || 0} max={task.targetSessions || 1} color={TAG_COLORS[task.tag]} />
    </Card>
  );
}

function StatsScreen({ sessions, tasks, setScreen }) {
  const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const focusByDay = dayLabels.map((_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    return sessions.filter((session) => session.date === day.toDateString()).reduce((total, session) => total + session.duration / 60, 0);
  });

  const maxFocusMinutes = Math.max(...focusByDay, 60);
  const totalMinutes = Math.round(sessions.reduce((total, session) => total + session.duration, 0) / 60);
  const completedTasks = tasks.filter((task) => task.done).length;
  const hasData = sessions.length > 0;

  const moodMap = sessions.reduce((result, session) => {
    if (session.mood !== null && session.mood !== undefined) result[session.mood] = (result[session.mood] || 0) + 1;
    return result;
  }, {});
  const maxMood = Math.max(...Object.values(moodMap), 1);

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <SectionTitle>THIS WEEK</SectionTitle>
          <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800 }}>Analytics</h1>
        </div>
        <IconButton onClick={() => setScreen("settings")} label="Open settings">⚙</IconButton>
      </div>

      {!hasData ? (
        <EmptyState
          icon="📊"
          title="No focus data yet"
          body="Complete your first focus session to unlock weekly analytics, mood patterns, and task progress."
          action={<Button onClick={() => setScreen("timer")} style={{ marginTop: 16 }}>START FIRST SESSION</Button>}
        />
      ) : (
        <>
          <section style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {[
              { label: "SESSIONS", value: sessions.length || "—", color: THEME.accent },
              { label: "MINUTES", value: totalMinutes || "—", color: THEME.blue },
              { label: "DONE", value: completedTasks || "—", color: THEME.green },
            ].map((stat) => (
              <Card key={stat.label} style={{ flex: 1, padding: "14px 12px", textAlign: "center" }}>
                <p style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                <p style={{ fontSize: 8, color: THEME.muted, marginTop: 5, letterSpacing: "0.12em" }}>{stat.label}</p>
              </Card>
            ))}
          </section>

          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>DAILY FOCUS (MIN)</SectionTitle>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
              {dayLabels.map((day, index) => {
                const minutes = focusByDay[index];
                const isToday = index === 6;
                const height = Math.max((minutes / maxFocusMinutes) * 72, minutes > 0 ? 8 : 4);
                return (
                  <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                      <div style={{ width: "100%", height, background: isToday ? THEME.accent : minutes > 0 ? THEME.surfaceUp : THEME.border, borderRadius: "6px 6px 4px 4px", transition: "height 0.6s ease" }} />
                    </div>
                    <p style={{ fontSize: 8, color: isToday ? THEME.accent : THEME.muted }}>{day}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <SectionTitle>MOOD × SESSIONS</SectionTitle>
            {MOODS.map((moodIcon, index) => (
              <div key={MOOD_LABELS[index]} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12 }}>{moodIcon} {MOOD_LABELS[index]}</span>
                  <span style={{ fontSize: 11, color: THEME.muted }}>{moodMap[index] || 0} sessions</span>
                </div>
                <ProgressBar value={moodMap[index] || 0} max={maxMood} color={index >= 3 ? THEME.green : index === 2 ? THEME.yellow : THEME.accent} />
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle>TASKS BY CATEGORY</SectionTitle>
            {TAGS.map((tag) => {
              const categoryTasks = tasks.filter((task) => task.tag === tag);
              const completedCategoryTasks = categoryTasks.filter((task) => task.done).length;
              return (
                <div key={tag} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Pill color={TAG_COLORS[tag]}>{tag}</Pill>
                    <span style={{ fontSize: 11, color: THEME.muted }}>{completedCategoryTasks}/{categoryTasks.length}</span>
                  </div>
                  <ProgressBar value={completedCategoryTasks} max={Math.max(categoryTasks.length, 1)} color={TAG_COLORS[tag]} />
                </div>
              );
            })}
          </Card>
        </>
      )}
    </main>
  );
}

function SettingsScreen({ settings, setSettings, setScreen, showToast, resetData }) {
  const [form, setForm] = useState(settings);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveSettings() {
    const nextSettings = {
      ...form,
      defaultDurationIndex: Number(form.defaultDurationIndex),
      shortBreakMinutes: Number(form.shortBreakMinutes) || 5,
      longBreakMinutes: Number(form.longBreakMinutes) || 15,
      longBreakAfter: Number(form.longBreakAfter) || 4,
      defaultTaskTarget: Number(form.defaultTaskTarget) || 2,
    };

    if (nextSettings.notificationsEnabled) requestBrowserNotificationPermission();
    setSettings(nextSettings);
    showToast("Settings saved.", "success");
    setScreen("home");
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <IconButton onClick={() => setScreen("home")} label="Back">‹</IconButton>
        <div>
          <SectionTitle style={{ marginBottom: 4 }}>PREFERENCES</SectionTitle>
          <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800 }}>Settings</h1>
        </div>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <Field label="YOUR NAME">
          <Input value={form.name} onChange={(event) => update("name", event.target.value)} />
        </Field>
        <Field label="DEFAULT FOCUS DURATION">
          <Select value={form.defaultDurationIndex} onChange={(event) => update("defaultDurationIndex", event.target.value)}>
            {DURATIONS.map((duration, index) => <option key={duration.label} value={index}>{duration.label}</option>)}
          </Select>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="SHORT BREAK">
            <Input type="number" min="1" value={form.shortBreakMinutes} onChange={(event) => update("shortBreakMinutes", event.target.value)} />
          </Field>
          <Field label="LONG BREAK">
            <Input type="number" min="1" value={form.longBreakMinutes} onChange={(event) => update("longBreakMinutes", event.target.value)} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="LONG BREAK AFTER">
            <Input type="number" min="1" value={form.longBreakAfter} onChange={(event) => update("longBreakAfter", event.target.value)} />
          </Field>
          <Field label="DEFAULT TASK TARGET">
            <Input type="number" min="1" value={form.defaultTaskTarget} onChange={(event) => update("defaultTaskTarget", event.target.value)} />
          </Field>
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <ToggleRow label="Auto-start break" desc="Break timer starts right after a focus block." checked={form.autoStartBreak} onChange={(value) => update("autoStartBreak", value)} />
        <ToggleRow label="Sound alert" desc="Play sound when focus or break ends." checked={form.soundEnabled} onChange={(value) => update("soundEnabled", value)} />
        <ToggleRow label="Browser notification" desc="Ask permission and show browser alert." checked={form.notificationsEnabled} onChange={(value) => update("notificationsEnabled", value)} />
      </Card>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <Button variant="outline" onClick={() => setScreen("home")} style={{ flex: "0 0 90px", width: "auto" }}>CANCEL</Button>
        <Button onClick={saveSettings} style={{ flex: 1 }}>SAVE SETTINGS</Button>
      </div>
      <Button
        variant="danger"
        onClick={resetData}
        style={{
          minHeight: 48,
          padding: "14px 18px",
          borderRadius: 16,
        }}
      >
        RESET APP DATA
      </Button>
    </main>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 0", borderBottom: `1px solid ${THEME.border}` }}>
      <div>
        <p style={{ color: THEME.text, fontSize: 12, fontWeight: 800, marginBottom: 4 }}>{label}</p>
        <p style={{ color: THEME.muted, fontSize: 10, lineHeight: 1.5 }}>{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 52,
          height: 30,
          borderRadius: 99,
          border: `1px solid ${checked ? THEME.accentMid : THEME.border}`,
          background: checked ? THEME.accentSoft : THEME.surfaceUp,
          padding: 3,
          cursor: "pointer",
        }}
      >
        <span style={{ display: "block", width: 22, height: 22, borderRadius: "50%", background: checked ? THEME.accent : THEME.dim, transform: checked ? "translateX(20px)" : "translateX(0)", transition: "all 0.2s" }} />
      </button>
    </div>
  );
}

export default function FocusFlow() {
  const [screen, setScreen] = useState("home");
  const [tasks, setTasks] = useState(createInitialTasks());
  const [sessions, setSessions] = useState(createInitialSessions());
  const [mood, setMood] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const isMobileViewport = useIsMobileViewport();
  useRealViewportHeight();

  useEffect(() => {
    const savedSettings = { ...DEFAULT_SETTINGS, ...loadStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS) };
    const savedMood = loadStorage(STORAGE_KEYS.mood, null);
    const savedTasks = loadStorage(STORAGE_KEYS.tasks, createInitialTasks());
    const savedSessions = loadStorage(STORAGE_KEYS.sessions, createInitialSessions());
    const savedOnboarded = loadStorage(STORAGE_KEYS.onboarded, false);

    setSettings(savedSettings);
    setTasks(savedTasks);
    setSessions(savedSessions);
    setMood(savedMood?.date === todayKey() ? savedMood.value ?? null : null);
    setOnboarded(savedOnboarded);
    setSelectedTaskId(savedTasks.find((task) => !task.done)?.id || null);
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) saveStorage(STORAGE_KEYS.tasks, tasks); }, [tasks, loaded]);
  useEffect(() => { if (loaded) saveStorage(STORAGE_KEYS.sessions, sessions); }, [sessions, loaded]);
  useEffect(() => { if (loaded) saveStorage(STORAGE_KEYS.settings, settings); }, [settings, loaded]);
  useEffect(() => { if (loaded) saveStorage(STORAGE_KEYS.onboarded, onboarded); }, [onboarded, loaded]);

  const handleMoodChange = useCallback((value) => {
    setMood(value);
    saveStorage(STORAGE_KEYS.mood, { value, date: todayKey() });
  }, []);

  const showToast = useCallback((message, type = "info") => {
    setToast({ id: createId(), message, type });
  }, []);

  const triggerConfetti = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1800);
  }, []);

  const handleSessionComplete = useCallback((session) => {
    setSessions((currentSessions) => [...currentSessions, { ...session, id: createId(), createdAt: new Date().toISOString() }]);

    if (session.taskId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task.id !== session.taskId) return task;
          const nextFocusSessions = (task.focusSessions || 0) + 1;
          const reachedTarget = nextFocusSessions >= (task.targetSessions || 1);
          return {
            ...task,
            focusSessions: nextFocusSessions,
            done: reachedTarget ? true : task.done,
          };
        })
      );
    }
  }, []);

  function finishOnboarding() {
    setOnboarded(true);
    setScreen("home");
  }

  function resetData() {
    const freshTasks = createInitialTasks();
    const freshSessions = createInitialSessions();
    setTasks(freshTasks);
    setSessions(freshSessions);
    setMood(null);
    setSettings(DEFAULT_SETTINGS);
    setSelectedTaskId(freshTasks.find((task) => !task.done)?.id || null);
    saveStorage(STORAGE_KEYS.tasks, freshTasks);
    saveStorage(STORAGE_KEYS.sessions, freshSessions);
    saveStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    saveStorage(STORAGE_KEYS.mood, null);
    showToast("App data reset.", "success");
    setScreen("home");
  }

  if (!loaded) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "transparent" }}>
        <GlobalStyles />
        <p style={{ fontSize: 11, color: THEME.muted, letterSpacing: "0.2em" }}>LOADING...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: isMobileViewport ? "var(--app-height, 100dvh)" : "100vh",
        height: isMobileViewport ? "var(--app-height, 100dvh)" : "auto",
        background: "transparent",
        padding: isMobileViewport ? 0 : "20px 0",
        overflow: isMobileViewport ? "hidden" : "visible",
      }}
    >
      <GlobalStyles />
      <Confetti active={confetti} />
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobileViewport ? 0 : 16,
          width: isMobileViewport ? "100%" : "auto",
          height: isMobileViewport ? "var(--app-height, 100dvh)" : "auto",
        }}
      >
        {!isMobileViewport && <p style={{ fontSize: 9, letterSpacing: "0.25em", color: THEME.muted }}>✦ FOCUSFLOW ✦</p>}

        <div
          style={{
            width: isMobileViewport ? "100vw" : 375,
            height: isMobileViewport ? "var(--app-height, 100dvh)" : 780,
            maxWidth: isMobileViewport ? "100vw" : 375,
            paddingTop: isMobileViewport ? "max(env(safe-area-inset-top), 14px)" : 0,
            paddingBottom: isMobileViewport ? "env(safe-area-inset-bottom)" : 0,
            background: "linear-gradient(180deg, rgba(18,20,34,0.92), rgba(8,9,18,0.96))",
            borderRadius: isMobileViewport ? 0 : 50,
            border: isMobileViewport ? "none" : `1px solid ${THEME.borderStrong}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: isMobileViewport ? "none" : "0 40px 120px rgba(0,0,0,0.55), 0 0 0 8px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {!isMobileViewport && <StatusBar />}

          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {!onboarded && <OnboardingScreen onFinish={finishOnboarding} />}
            {onboarded && screen === "home" && <HomeScreen tasks={tasks} sessions={sessions} mood={mood} settings={settings} setScreen={setScreen} />}
            {onboarded && screen === "mood" && <MoodScreen mood={mood} setMood={handleMoodChange} setScreen={setScreen} />}
            {onboarded && screen === "timer" && (
              <TimerScreen
                tasks={tasks}
                settings={settings}
                mood={mood}
                selectedTaskId={selectedTaskId}
                setSelectedTaskId={setSelectedTaskId}
                onSessionComplete={handleSessionComplete}
                showToast={showToast}
                triggerConfetti={triggerConfetti}
              />
            )}
            {onboarded && screen === "tasks" && (
              <TasksScreen
                tasks={tasks}
                setTasks={setTasks}
                settings={settings}
                selectedTaskId={selectedTaskId}
                setSelectedTaskId={setSelectedTaskId}
                showToast={showToast}
              />
            )}
            {onboarded && screen === "stats" && <StatsScreen sessions={sessions} tasks={tasks} setScreen={setScreen} />}
            {onboarded && screen === "settings" && <SettingsScreen settings={settings} setSettings={setSettings} setScreen={setScreen} showToast={showToast} resetData={resetData} />}
          </div>

          {onboarded && screen !== "settings" && <BottomNav screen={screen} setScreen={setScreen} />}
        </div>
      </div>
    </div>
  );
}
