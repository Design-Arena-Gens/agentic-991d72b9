"use client";
import { useEffect, useMemo, useState } from "react";
import { EntryList } from "@/components/EntryList";
import { NewEntryForm } from "@/components/NewEntryForm";
import { WeeklySummary } from "@/components/WeeklySummary";

const STORAGE_KEY = "fitness.entries.v1";

function loadEntries() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export default function Page() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  useEffect(() => {
    if (entries.length) saveEntries(entries);
  }, [entries]);

  const stats = useMemo(() => computeStats(entries), [entries]);

  function addEntry(entry) {
    setEntries((prev) => [entry, ...prev]);
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Minimal <span>Fitness</span> Dashboard</h1>
        <span className="badge">Local data ? No signup</span>
      </header>

      <div className="grid">
        <section className="card">
          <h3>Log workout</h3>
          <NewEntryForm onAdd={addEntry} />
        </section>

        <section className="card">
          <h3>Your week</h3>
          <WeeklySummary entries={entries} stats={stats} />
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>History</h3>
        <EntryList entries={entries} onDelete={deleteEntry} />
        <div className="footer">
          <span>Data is stored in your browser. Export coming soon.</span>
        </div>
      </section>
    </div>
  );
}

function computeStats(entries) {
  if (!entries || entries.length === 0) {
    return {
      totalWorkouts7: 0,
      totalMinutes7: 0,
      totalVolume7: 0,
      streakDays: 0,
      days: recentDays(7).map((d) => ({ date: d, count: 0, minutes: 0 }))
    };
  }

  const byDate = new Map();
  for (const e of entries) {
    const bucket = byDate.get(e.date) || { count: 0, minutes: 0, volume: 0 };
    bucket.count += 1;
    if (e.type === "cardio") bucket.minutes += Number(e.cardio?.durationMin || 0);
    if (e.type === "strength") {
      const s = e.strength;
      const vol = Number(s?.sets || 0) * Number(s?.reps || 0) * Number(s?.weight || 0);
      bucket.volume += vol;
    }
    byDate.set(e.date, bucket);
  }

  const last7 = recentDays(7);
  const days = last7.map((d) => {
    const v = byDate.get(d) || { count: 0, minutes: 0, volume: 0 };
    return { date: d, count: v.count, minutes: v.minutes, volume: v.volume };
  });

  let streak = 0;
  for (const day of recentDays(30)) {
    const v = byDate.get(day);
    if (v && v.count > 0) streak += 1; else break;
  }

  return {
    totalWorkouts7: days.reduce((a, b) => a + b.count, 0),
    totalMinutes7: days.reduce((a, b) => a + b.minutes, 0),
    totalVolume7: days.reduce((a, b) => a + b.volume, 0),
    streakDays: streak,
    days
  };
}

function recentDays(n) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
