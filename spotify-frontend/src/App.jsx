import { useState, useEffect } from "react";

const API = "http://127.0.0.1:5098";

// ─── Styles ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green: #1DB954;
    --green-glow: rgba(29,185,84,0.15);
    --bg: #080808;
    --surface: #111;
    --surface2: #181818;
    --border: rgba(255,255,255,0.07);
    --text: #efefef;
    --muted: #5a5a5a;
    --font: 'Syne', sans-serif;
    --mono: 'DM Mono', monospace;
  }
  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font); -webkit-font-smoothing: antialiased; }
  ::selection { background: var(--green); color: #000; }

  nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: clamp(12px, 2vw, 20px) clamp(16px, 4vw, 48px);
    border-bottom: 1px solid var(--border);
    background: rgba(8,8,8,0.9); backdrop-filter: blur(16px);
    position: sticky; top: 0; z-index: 50;
  }
  .logo { font-size: clamp(.85rem, 1.5vw, 1rem); font-weight: 800; letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 10px var(--green); animation: breathe 2.5s ease-in-out infinite; }
  @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

  main {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: clamp(24px, 5vw, 56px) clamp(16px, 5vw, 80px);
  }

  .login { min-height: 65vh; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(18px, 3vw, 32px); text-align: center; animation: up .5s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .login h1 { font-size: clamp(1.8rem, 5vw, 4.5rem); font-weight: 800; letter-spacing: -.03em; line-height: 1.05; }
  .login h1 em { font-style: normal; color: var(--green); }
  .login p { color: var(--muted); font-size: clamp(.85rem, 1.5vw, 1rem); max-width: min(480px, 80vw); line-height: 1.7; }
  .login-btn { background: var(--green); color: #000; font-family: var(--font); font-weight: 800; font-size: clamp(.78rem, 1.2vw, .9rem); letter-spacing: .05em; padding: clamp(10px,1.5vw,14px) clamp(22px,3vw,36px); border: none; border-radius: 50px; cursor: pointer; transition: all .18s; }
  .login-btn:hover { background: #1ed760; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(29,185,84,.3); }

  .search-row { display: flex; gap: 10px; margin-bottom: clamp(20px, 4vw, 40px); animation: up .4s ease both; flex-wrap: wrap; max-width: min(1200px, 100%); margin-left: auto; margin-right: auto; }
  .search-wrap { flex: 1; min-width: 200px; position: relative; }
  .search-wrap input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--font); font-size: clamp(.8rem, 1.3vw, .92rem); padding: clamp(10px,1.5vw,13px) 16px clamp(10px,1.5vw,13px) 42px; outline: none; transition: border-color .18s; }
  .search-wrap input::placeholder { color: var(--muted); }
  .search-wrap input:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--green-glow); }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
  .search-btn { background: var(--green); color: #000; font-family: var(--font); font-weight: 700; font-size: clamp(.78rem, 1.2vw, .85rem); padding: clamp(10px,1.5vw,13px) clamp(16px,2vw,24px); border: none; border-radius: 8px; cursor: pointer; transition: all .18s; white-space: nowrap; }
  .search-btn:hover { background: #1ed760; }
  .search-btn:disabled { opacity: .45; cursor: not-allowed; }

  .track-card { background: var(--surface); border: 1px solid var(--border); border-radius: clamp(10px,1.5vw,16px); overflow: hidden; animation: up .4s ease both; max-width: min(1200px, 100%); margin-left: auto; margin-right: auto; }
  .card-top { display: flex; flex-wrap: wrap; }
  .album-art { width: clamp(140px, 22vw, 280px); height: clamp(140px, 22vw, 280px); object-fit: cover; flex-shrink: 0; display: block; }
  .album-art-ph { width: clamp(140px, 22vw, 280px); height: clamp(140px, 22vw, 280px); background: var(--surface2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: clamp(2rem, 5vw, 4rem); border-right: 1px solid var(--border); }
  .card-info { padding: clamp(18px, 3vw, 32px); flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: clamp(8px, 1.2vw, 12px); }
  .card-label { font-family: var(--mono); font-size: clamp(.58rem, .9vw, .65rem); color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
  .track-name { font-size: clamp(1.2rem, 3vw, 2rem); font-weight: 800; letter-spacing: -.025em; line-height: 1.1; }
  .artist-name { color: var(--green); font-size: clamp(.88rem, 1.5vw, 1.05rem); font-weight: 600; }
  .album-line { color: var(--muted); font-size: clamp(.74rem, 1.1vw, .84rem); font-family: var(--mono); }
  .chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
  .chip { font-family: var(--mono); font-size: clamp(.6rem, .9vw, .7rem); padding: 3px 9px; border-radius: 20px; border: 1px solid var(--border); color: var(--muted); }
  .chip.g { border-color: rgba(29,185,84,.4); color: var(--green); background: var(--green-glow); }
  .chip.r { border-color: rgba(255,77,77,.3); color: #ff6b6b; background: rgba(255,77,77,.07); }
  .sp-link { margin-top: auto; display: inline-flex; align-items: center; gap: 8px; background: var(--green); color: #000; font-family: var(--font); font-weight: 700; font-size: clamp(.72rem, 1.1vw, .82rem); padding: clamp(8px,1.2vw,10px) clamp(14px,2vw,20px); border-radius: 6px; text-decoration: none; width: fit-content; transition: all .18s; }
  .sp-link:hover { background: #1ed760; }

  .tracklist { border-top: 1px solid var(--border); }
  .tl-header { display: flex; align-items: center; justify-content: space-between; padding: clamp(10px,1.5vw,16px) clamp(16px,2.5vw,28px); background: var(--surface2); flex-wrap: wrap; gap: 6px; }
  .tl-header span { font-size: clamp(.75rem, 1.2vw, .85rem); font-weight: 700; }
  .tl-header small { font-family: var(--mono); font-size: clamp(.62rem, .9vw, .7rem); color: var(--muted); }
  table { width: 100%; border-collapse: collapse; }
  th { font-family: var(--mono); font-size: clamp(.58rem, .85vw, .65rem); color: var(--muted); letter-spacing: .08em; text-transform: uppercase; padding: clamp(8px,1.2vw,12px) clamp(12px,2vw,24px); text-align: left; background: var(--surface2); border-bottom: 1px solid var(--border); }
  tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr.active { background: rgba(29,185,84,.08); }
  tbody tr:not(.active):hover { background: var(--surface2); }
  td { padding: clamp(9px,1.3vw,13px) clamp(12px,2vw,24px); font-size: clamp(.78rem, 1.2vw, .86rem); vertical-align: middle; }
  .td-n { font-family: var(--mono); font-size: clamp(.66rem, 1vw, .74rem); color: var(--muted); width: 36px; }
  .td-dur { font-family: var(--mono); font-size: clamp(.68rem, 1vw, .76rem); color: var(--muted); text-align: right; }
  .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); margin-right: 6px; vertical-align: middle; }
  .exp { color: #ff6b6b; font-family: var(--mono); font-size: .6rem; margin-left: 6px; }

  /* Hide artists column on small screens */
  @media (max-width: 600px) {
    .col-artists { display: none; }
    .album-art, .album-art-ph { width: 100%; height: auto; aspect-ratio: 1; border-right: none; border-bottom: 1px solid var(--border); }
    .card-top { flex-direction: column; }
  }

  .json-wrap { margin-top: clamp(16px, 2.5vw, 28px); max-width: min(1200px, 100%); margin-left: auto; margin-right: auto; }
  .json-btn { font-family: var(--mono); font-size: clamp(.66rem, 1vw, .74rem); color: var(--muted); background: none; border: 1px solid var(--border); border-radius: 6px; padding: 7px 14px; cursor: pointer; transition: all .15s; margin-bottom: 8px; }
  .json-btn:hover { color: var(--text); border-color: rgba(255,255,255,.2); }
  pre { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: clamp(12px, 2vw, 20px); font-family: var(--mono); font-size: clamp(.64rem, 1vw, .72rem); color: #777; overflow-x: auto; white-space: pre-wrap; word-break: break-all; line-height: 1.65; max-height: 40vh; overflow-y: auto; }

  .state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: clamp(36px, 8vw, 72px) 20px; color: var(--muted); font-size: clamp(.8rem, 1.2vw, .9rem); }
  .spinner { width: 26px; height: 26px; border: 2px solid var(--border); border-top-color: var(--green); border-radius: 50%; animation: spin .75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .err { max-width: min(1200px, 100%); margin-left: auto; margin-right: auto; background: rgba(255,77,77,.07); border: 1px solid rgba(255,77,77,.2); border-radius: 8px; padding: clamp(10px,1.5vw,14px) clamp(12px,2vw,18px); font-family: var(--mono); font-size: clamp(.7rem, 1vw, .78rem); color: #ff6b6b; margin-bottom: 20px; }

  .hint { margin-top: clamp(20px, 3.5vw, 36px); background: var(--surface); border: 1px solid var(--border); border-radius: clamp(8px,1.2vw,14px); padding: clamp(16px,2.5vw,26px); animation: up .6s ease both; max-width: min(1200px, 100%); margin-left: auto; margin-right: auto; }
  .hint h3 { font-size: clamp(.76rem, 1.1vw, .84rem); font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .hint h3::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--green); display: inline-block; flex-shrink: 0; }
  .ep { display: flex; align-items: flex-start; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border); }
  .ep:last-of-type { border-bottom: none; }
  .method { font-family: var(--mono); font-size: clamp(.58rem, .85vw, .64rem); font-weight: 500; padding: 3px 7px; border-radius: 4px; flex-shrink: 0; margin-top: 2px; background: var(--green-glow); color: var(--green); border: 1px solid rgba(29,185,84,.3); }
  .ep-path { font-family: var(--mono); font-size: clamp(.7rem, 1vw, .78rem); }
  .ep-desc { font-size: clamp(.68rem, 1vw, .76rem); color: var(--muted); margin-top: 2px; line-height: 1.5; }
  .note { margin-top: 14px; font-size: clamp(.66rem, 1vw, .74rem); color: var(--muted); font-family: var(--mono); line-height: 1.7; background: var(--surface2); border-radius: 8px; padding: clamp(10px,1.5vw,14px); }

  .nav-right { display: flex; align-items: center; gap: 12px; }
  .ghost { background: none; border: 1px solid var(--border); color: var(--muted); font-family: var(--font); font-size: clamp(.72rem, 1.1vw, .8rem); padding: clamp(6px,1vw,8px) clamp(10px,1.5vw,16px); border-radius: 6px; cursor: pointer; transition: all .15s; }
  .ghost:hover { color: var(--text); border-color: rgba(255,255,255,.2); }
`;

function msToTime(ms) {
  if (!ms) return "—";
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("sp_token") || "");
  const [trackId, setTrackId] = useState("4cOdK2wGLETKBW3PvgPWqT");
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showJson, setShowJson] = useState(false);

  // Pick up token returned as plain text from GET /api/spotify/callback
  // If your backend redirects back to this page with ?token=..., this handles it
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || params.get("access_token");
    if (t) {
      setToken(t);
      sessionStorage.setItem("sp_token", t);
      window.history.replaceState({}, "", "/");
    }
  }, []);
  const fetchAlbum = async (id) => {
    const res = await fetch(`${API}/api/spotify/album/${id}`);
    const data = await res.json();
    setAlbum(data);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API}/api/spotify/album/${encodeURIComponent(id)}`, { headers });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${body ? ` — ${body.slice(0, 150)}` : ""}`);
      }
      const data = await res.json();
      setAlbum(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }

  };

  const fetchTrack = async () => {
    const tid = trackId.trim();
    if (!tid) return;
    setLoading(true);
    setError("");
    setTrack(null);
    setShowJson(false);
    try {
      // Calls: GET /api/spotify/track/{id}
      // SpotifyService uses Client Credentials so no auth header needed,
      // but we send it anyway if the user has logged in via OAuth
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API}/api/spotify/track/${encodeURIComponent(tid)}`, { headers });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${body ? ` — ${body.slice(0, 150)}` : ""}`);
      }
      const data = await res.json();
      setTrack(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // SpotifyAPI.Web FullTrack uses camelCase from the C# SDK serializer
  // but can also be snake_case if you configure the serializer — handle both
  const art = track?.album?.images?.[0]?.url;
  const name = track?.name;
  const artists = track?.artists?.map(a => a.name).join(", ") ?? "—";
  const albumName = track?.album?.name;
  const releaseDate = track?.album?.releaseDate ?? track?.album?.release_date;
  const popularity = track?.popularity;
  const explicit = track?.explicit;
  const durMs = track?.durationMs ?? track?.duration_ms;
  const spotifyUrl = track?.externalUrls?.spotify ?? track?.external_urls?.spotify;
  const trackNum = track?.trackNumber ?? track?.track_number;
  const albumTracks = track?.album?.tracks?.items ?? [];
  const albumTotal = track?.album?.totalTracks ?? track?.album?.total_tracks ?? albumTracks.length;

  return (
    <>
      <style>{css}</style>

      <nav>
        <div className="logo">
          <span className="logo-dot" />
          Trackvault
        </div>
        <div className="nav-right">
          {!token
            ? <button className="ghost" onClick={() => { window.location.href = `${API}/api/spotify/login`; }}>
              Connect Spotify
            </button>
            : <button className="ghost" onClick={() => { setToken(""); sessionStorage.removeItem("sp_token"); }}>
              Sign out
            </button>
          }
        </div>
      </nav>

      <main>
        {/* Hero — only when nothing has been searched yet */}
        {!track && !loading && !error && (
          <div className="login">
            <h1>Look up any<br /><em>Spotify track.</em></h1>
            <p>Paste a Spotify track ID below to pull its full data from your ASP.NET service. No login needed for track lookups — your backend uses Client Credentials.</p>
            <button className="login-btn" onClick={() => { window.location.href = `${API}/api/spotify/login`; }}>
              ♫ Connect Spotify (OAuth)
            </button>
          </div>
        )}

        {/* Search */}
        <div className="search-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              value={trackId}
              onChange={e => setTrackId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchTrack()}
              placeholder="Spotify Track ID  (e.g. 4cOdK2wGLETKBW3PvgPWqT)"
            />
          </div>
          <button className="search-btn" onClick={fetchTrack} disabled={loading}>
            {loading ? "Loading…" : "Fetch Track"}
          </button>
        </div>

        {error && <div className="err">⚠ {error}</div>}

        {loading && (
          <div className="state">
            <div className="spinner" />
            <span>Calling {API}/api/spotify/track/…</span>
          </div>
        )}

        {/* Track result */}
        {track && !loading && (
          <>
            <div className="track-card">
              <div className="card-top">
                {art
                  ? <img src={art} alt="album art" className="album-art" />
                  : <div className="album-art-ph">🎵</div>
                }
                <div className="card-info">
                  <div>
                    <div className="card-label">Now viewing</div>
                    <div className="track-name">{name}</div>
                  </div>
                  <div className="artist-name">{artists}</div>
                  <div className="album-line">💿 {albumName}{releaseDate ? ` · ${releaseDate}` : ""}</div>
                  <div className="chips">
                    {popularity != null && <span className="chip g">Popularity {popularity}/100</span>}
                    {durMs && <span className="chip">⏱ {msToTime(durMs)}</span>}
                    {trackNum && <span className="chip">Track {trackNum}</span>}
                    {explicit && <span className="chip r">EXPLICIT</span>}
                    {albumTotal > 0 && <span className="chip">{albumTotal} tracks</span>}
                  </div>
                  {spotifyUrl && (
                    <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="sp-link">
                      ♫ Open in Spotify
                    </a>
                  )}
                </div>
              </div>

              {/* Album tracklist — shown if FullTrack includes album.tracks */}
              {albumTracks.length > 0 && (
                <div className="tracklist">
                  <div className="tl-header">
                    <span>Album Tracklist</span>
                    <small>{albumName} · {albumTotal} tracks</small>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th className="col-artists">Artists</th>
                        <th style={{ textAlign: "right" }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {albumTracks.map((t) => {
                        const isActive = t.id === track.id;
                        return (
                          <tr key={t.id} className={isActive ? "active" : ""}>
                            <td className="td-n">
                              {isActive ? <span className="dot" /> : (t.trackNumber ?? t.track_number)}
                            </td>
                            <td>
                              <strong style={{ fontWeight: 600 }}>{t.name}</strong>
                              {t.explicit && <span className="exp">E</span>}
                            </td>
                            <td className="col-artists" style={{ color: "var(--muted)", fontSize: ".78rem" }}>
                              {t.artists?.map(a => a.name).join(", ")}
                            </td>
                            <td className="td-dur">{msToTime(t.durationMs ?? t.duration_ms)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Raw JSON */}
            <div className="json-wrap">
              <button className="json-btn" onClick={() => setShowJson(v => !v)}>
                {showJson ? "▲ Hide" : "▼ Show"} raw API response (FullTrack JSON)
              </button>
              {showJson && <pre>{JSON.stringify(track, null, 2)}</pre>}
            </div>
          </>
        )}

        {/* Backend hint — shown on empty state */}
        {!track && !loading && (
          <div className="hint">
            <h3>Your current backend endpoints</h3>
            {[
              { path: "GET /api/spotify/login", desc: "Starts Spotify OAuth flow. Redirects to Spotify." },
              { path: "GET /api/spotify/callback?code=", desc: "Spotify returns here after auth. Returns raw access token string." },
              { path: "GET /api/spotify/track/{id}", desc: "Fetches a FullTrack from Spotify using Client Credentials. No user login needed." },
            ].map(ep => (
              <div className="ep" key={ep.path}>
                <span className="method">GET</span>
                <div>
                  <div className="ep-path">{ep.path}</div>
                  <div className="ep-desc">{ep.desc}</div>
                </div>
              </div>
            ))}
            <div className="note">
              💡 <strong>Next steps you might want to add to your backend:</strong><br />
              — <code>GET /api/spotify/me</code> — return current user profile (needs user token)<br />
              — <code>GET /api/spotify/search?q=</code> — search tracks by name<br />
              — <code>GET /api/spotify/album/&#123;id&#125;</code> — full album + all tracks<br />
              — Store the token in a session/cookie instead of returning it raw from /callback
            </div>
          </div>
        )}
      </main>
    </>
  );
}
