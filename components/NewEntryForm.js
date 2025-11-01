"use client";
import { useMemo, useState } from "react";
import { clsx } from "clsx";

export function NewEntryForm({ onAdd }) {
  const [type, setType] = useState("strength");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // strength
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  // cardio
  const [activity, setActivity] = useState("Run");
  const [durationMin, setDurationMin] = useState(30);
  const [distanceKm, setDistanceKm] = useState(0);

  const [notes, setNotes] = useState("");

  const canSave = useMemo(() => {
    if (type === "strength") return exercise.trim().length > 0 && sets > 0 && reps > 0;
    return durationMin > 0 && activity.trim().length > 0;
  }, [type, exercise, sets, reps, durationMin, activity]);

  function submit(e) {
    e.preventDefault();
    if (!canSave) return;
    const entry = {
      id: crypto.randomUUID(),
      type,
      date,
      notes: notes.trim() || undefined,
      strength: type === "strength" ? { exercise, sets: Number(sets), reps: Number(reps), weight: Number(weight) } : undefined,
      cardio: type === "cardio" ? { activity, durationMin: Number(durationMin), distanceKm: Number(distanceKm) || undefined } : undefined
    };
    onAdd(entry);
    reset();
  }

  function reset() {
    setExercise("");
    setSets(3);
    setReps(10);
    setWeight(0);
    setActivity("Run");
    setDurationMin(30);
    setDistanceKm(0);
    setNotes("");
  }

  return (
    <form onSubmit={submit} className="form">
      <div className="row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
        </select>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {type === "strength" ? (
        <div className="row-3" style={{ marginTop: 8 }}>
          <input className="input" placeholder="Exercise (e.g., Bench Press)" value={exercise} onChange={(e) => setExercise(e.target.value)} />
          <input className="input" type="number" min="1" placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} />
          <input className="input" type="number" min="1" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} />
        </div>
      ) : (
        <div className="row-3" style={{ marginTop: 8 }}>
          <input className="input" placeholder="Activity (e.g., Run)" value={activity} onChange={(e) => setActivity(e.target.value)} />
          <input className="input" type="number" min="1" placeholder="Minutes" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} />
          <input className="input" type="number" min="0" step="0.1" placeholder="Km (optional)" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} />
        </div>
      )}

      {type === "strength" && (
        <div className="row" style={{ marginTop: 8 }}>
          <input className="input" type="number" min="0" step="0.5" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <input className="input" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      )}

      {type === "cardio" && (
        <div style={{ marginTop: 8 }}>
          <input className="input" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className={clsx("btn", !canSave && "disabled")} type="submit" disabled={!canSave}>Add</button>
        <button type="button" className="btn secondary" onClick={reset}>Reset</button>
      </div>
      <div className="footer"><small className="hint">Tip: Toggle type to switch modes</small></div>
    </form>
  );
}
