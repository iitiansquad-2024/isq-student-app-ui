"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type StreakProps = {
  goal?: number;
  size?: number;
  currentDays?: number;
  showText?: boolean;
  variant?: "circle" | "bar";
};

function formatDateLocal(iso?: string) {
  if (!iso) return "unknown";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function Streak({
  goal = 30,
  size = 56,
  variant = "circle",
  currentDays = 1,
  showText = true,
}: StreakProps) {
  const [days, setDays] = useState<number>(currentDays);
  const [firstIso, setFirstIso] = useState<string | null>(null);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [itemHeight, setItemHeight] = useState<number>(0);

  useEffect(() => {
    try {
      const key = "iit_first_visit";
      const stored = localStorage.getItem(key);
      const today = new Date();
      if (!stored) {
        const iso = today.toISOString();
        localStorage.setItem(key, iso);
        setFirstIso(iso);
      } else {
        setFirstIso(stored);
        const first = new Date(stored);
        const utcToday = Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const utcFirst = Date.UTC(
          first.getFullYear(),
          first.getMonth(),
          first.getDate()
        );
        const diffDays =
          Math.floor((utcToday - utcFirst) / (24 * 60 * 60 * 1000)) + 1;
        // setDays(diffDays > 0 ? diffDays : 1)
      }
    } catch (e) {
      setDays(1);
    }
  }, []);

  // measure the height of a single number row so we can translate the scroller precisely
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const setH = () => setItemHeight(el.getBoundingClientRect().height);
    setH();

    // keep measurement updated if font size or layout changes
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => setH());
      ro.observe(el);
    } else {
      window.addEventListener("resize", setH);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", setH);
    };
  }, [itemRef.current]);

  const pct = Math.min(1, days / (goal || 1));

  const title = firstIso
    ? `Started on ${formatDateLocal(firstIso)} — ${days} day(s)`
    : `${days} day(s)`;

  if (variant === "bar") {
    const pctStr = `${Math.round(pct * 100)}%`;
    return (
      <div
        className="flex items-center gap-3"
        title={title}
        aria-label={`Streak ${pctStr}`}
      >
        <div className="flex flex-col">
          <div className="mb-1 flex items-baseline gap-2">
            <div className="text-sm font-semibold">{days}d</div>
            <div className="text-xs text-muted-foreground">streak</div>
          </div>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-2 rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>
    );
  }

  // circle variant
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  // battery sizing relative to the overall circle size
  const batteryWidth = Math.max(12, Math.round(size * 0.36));
  const batteryHeight = Math.max(8, Math.round(size * 0.22));

  return (
    <div
      className="flex items-center gap-3"
      title={title}
      aria-label={`Streak ${Math.round(pct * 100)}%`}
    >
      <div style={{ width: size, height: size }} className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          <g transform={`translate(${size / 2},${size / 2})`}>
            <circle
              r={radius}
              fill="none"
              stroke="var(--color-stone-100)"
              strokeWidth="6"
              opacity="1"
            />
            <motion.circle
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - dash }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </g>
        </svg>

        {/* centered icon overlay: thunderbolt while progressing, trophy when goal reached */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative flex items-center justify-center"
            style={{ width: batteryWidth, height: batteryHeight }}
            aria-hidden
          >
            {pct >= 1 ? (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={Math.round(batteryHeight * 1.2)}
                height={Math.round(batteryHeight * 1.2)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1.06, 1], opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                className="block"
              >
                <path
                  fill="var(--primary-dark)"
                  d="M12 2c-1.1 0-2 .9-2 2v1H8c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v5c0 1.1.9 2 2 2s2-.9 2-2v-5h1c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2V4c0-1.1-.9-2-2-2z"
                />
              </motion.svg>
            ) : (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={Math.round(batteryHeight * 1.2)}
                height={Math.round(batteryHeight * 1.2)}
                initial={{ y: 0, scale: 0.95, opacity: 0.9 }}
                animate={{ y: [0, -4, 0], scale: [0.98, 1.02, 1], opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="block"
              >
                <path
                  fill="var(--primary-dark)"
                  d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                />
              </motion.svg>
            )}
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col items-start leading-tight">
          {/* animated vertical number scroller */}
          <div
            className="text-sm font-semibold overflow-hidden"
            style={{ height: itemHeight || 16 }}
            aria-hidden
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{
                y: itemHeight ? -Math.max(0, days - 1) * itemHeight : 0,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
              {Array.from({ length: Math.max(1, days) }).map((_, i) => (
                <div
                  key={i}
                  ref={i === 0 ? itemRef : undefined}
                  className="leading-tight"
                  style={{ display: "block" }}
                >
                  {i + 1}d
                </div>
              ))}
            </motion.div>
          </div>
          <div className="text-xs text-muted-foreground">current streak</div>
        </div>
      )}
    </div>
  );
}
