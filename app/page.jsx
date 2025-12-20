"use client";
import { useState, useEffect } from "react";

const USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

export default function Page() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [page, setPage] = useState("list");
  const [levels, setLevels] = useState([]);
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);

  const [player, setPlayer] = useState("");
  const [progress, setProgress] = useState(100);
  const [video, setVideo] = useState("");

  useEffect(() => {
    setLevels(JSON.parse(localStorage.getItem("levels")) || [
      { id: 1, rank: 1, name: "Bloodbath", creator: "Riot", verifier: "Riot" }
    ]);
    setRecords(JSON.parse(localStorage.getItem("records")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("levels", JSON.stringify(levels));
    localStorage.setItem("records", JSON.stringify(records));
  }, [levels, records]);

  const login = () => {
    const found = USERS.find(
      u => u.username === username && u.password === password
    );
    if (found) setUser(found);
  };

  const submitRecord = () => {
    setRecords([
      ...records,
      {
        id: Date.now(),
        levelId: selected.id,
        player,
        progress,
        video,
        status: "pending"
      }
    ]);
    setPlayer(""); setVideo("");
    setPage("list");
  };

  const approve = (id) => {
    setRecords(records.map(r =>
      r.id === id ? { ...r, status: "approved" } : r
    ));
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Pointercrate Clone</h1>

      {!user && (
        <div className="card">
          <input placeholder="username" onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
          <p>admin / admin123 | user / user123</p>
        </div>
      )}

      {page === "list" && (
        <div>
          {levels.map(l => (
            <div key={l.id} className="card" onClick={()=>{
              setSelected(l); setPage("level");
            }}>
              #{l.rank} {l.name}
            </div>
          ))}
        </div>
      )}

      {page === "level" && selected && (
        <div>
          <button onClick={()=>setPage("list")}>← Back</button>
          <h2>{selected.name}</h2>

          {user?.role === "user" && (
            <div className="card">
              <h3>Submit Record</h3>
              <input placeholder="Player" value={player} onChange={e=>setPlayer(e.target.value)} />
              <input type="number" value={progress} onChange={e=>setProgress(+e.target.value)} />
              <input placeholder="Video URL" value={video} onChange={e=>setVideo(e.target.value)} />
              <button onClick={submitRecord}>Send</button>
            </div>
          )}

          {user?.role === "admin" && (
            <div className="card">
              <h3>Records</h3>
              {records
                .filter(r => r.levelId === selected.id)
                .map(r => (
                  <div key={r.id}>
                    {r.player} – {r.progress}% – {r.status}
                    {r.status === "pending" && (
                      <button onClick={()=>approve(r.id)}>Approve</button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
