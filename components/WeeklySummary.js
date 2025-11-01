"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function WeeklySummary({ entries, stats }) {
  const labels = stats.days.slice().reverse().map((d) => d.date.slice(5));
  const data = {
    labels,
    datasets: [
      {
        label: "Workouts",
        data: stats.days.slice().reverse().map((d) => d.count),
        backgroundColor: "rgba(45, 212, 191, 0.6)",
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#8892b0" } },
      y: { grid: { color: "#1f2430" }, ticks: { color: "#8892b0", precision: 0 } }
    }
  };

  return (
    <div>
      <div className="stat-grid">
        <StatCard label="7d Workouts" value={stats.totalWorkouts7} />
        <StatCard label="7d Minutes" value={stats.totalMinutes7} />
        <StatCard label="7d Volume" value={abbrev(stats.totalVolume7)} />
        <StatCard label="Streak" value={`${stats.streakDays}d`} />
      </div>
      <hr className="sep" />
      <Bar data={data} options={options} height={140} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}

function abbrev(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return String(n);
}
