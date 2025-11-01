"use client";

export function EntryList({ entries, onDelete }) {
  if (!entries || entries.length === 0) {
    return <div className="badge">No entries yet</div>;
  }

  const grouped = groupBy(entries, (e) => e.date);

  return (
    <div className="list">
      {Object.keys(grouped)
        .sort((a, b) => (a < b ? 1 : -1))
        .map((date) => (
          <div key={date}>
            <div className="badge" style={{ marginBottom: 8 }}>{formatDate(date)}</div>
            {grouped[date].map((e) => (
              <div className="item" key={e.id}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {e.type === "strength" ? e.strength.exercise : e.cardio.activity}
                  </div>
                  <div className="meta">
                    {e.type === "strength" ? (
                      <>
                        <span>{e.strength.sets} x {e.strength.reps}</span>
                        <span>?</span>
                        <span>{e.strength.weight} kg</span>
                      </>
                    ) : (
                      <>
                        <span>{e.cardio.durationMin} min</span>
                        {e.cardio.distanceKm ? (<><span>?</span><span>{e.cardio.distanceKm} km</span></>) : null}
                      </>
                    )}
                    {e.notes ? (<><span>?</span><span>{e.notes}</span></>) : null}
                  </div>
                </div>
                <button onClick={() => onDelete(e.id)} className="btn secondary" title="Delete">Delete</button>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] = acc[k] || [];
    acc[k].push(item);
    return acc;
  }, {});
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
