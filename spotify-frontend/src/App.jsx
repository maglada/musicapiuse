import { useState, useEffect, useRef } from "react";

const API = "http://127.0.0.1:5098";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0a0a;
    --paper: #f2efe8;
    --paper2: #e8e4da;
    --paper3: #ddd9ce;
    --accent: #c8f542;
    --accent2: #ff4d2e;
    --text: #1a1a1a;
    --muted: #7a7568;
    --border: #c8c4b8;
    --display: 'Bebas Neue', sans-serif;
    --body: 'Instrument Sans', sans-serif;
    --mono: 'Space Mono', monospace;
  }

  html, body, #root {
    min-height: 100%;
    background: var(--paper);
    color: var(--text);
    font-family: var(--body);
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--accent); color: var(--ink); }

  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: .035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: stretch;
    border-bottom: 2px solid var(--ink);
    background: var(--paper);
  }
  .nav-logo {
    font-family: var(--display);
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    letter-spacing: .04em;
    padding: 14px clamp(16px, 3vw, 32px);
    border-right: 2px solid var(--ink);
    display: flex; align-items: center; gap: 10px;
    user-select: none;
  }
  .nav-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--accent); border: 2px solid var(--ink);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(.65)} }

  .nav-tabs {
    display: flex; align-items: stretch; flex: 1;
    overflow-x: auto; scrollbar-width: none;
  }
  .nav-tabs::-webkit-scrollbar { display: none; }

  .tab {
    font-family: var(--mono); font-size: clamp(.6rem, 1vw, .72rem);
    letter-spacing: .06em; text-transform: uppercase;
    padding: 0 clamp(12px, 2vw, 24px);
    border: none; border-right: 1px solid var(--border);
    background: none; cursor: pointer; color: var(--muted);
    transition: all .15s; white-space: nowrap;
  }
  .tab:hover { background: var(--paper2); color: var(--text); }
  .tab.active { background: var(--ink); color: var(--accent); border-right-color: var(--ink); }

  .nav-auth {
    margin-left: auto; display: flex; align-items: center;
    padding: 0 clamp(12px, 2vw, 24px);
    border-left: 2px solid var(--ink); gap: 8px;
  }
  .auth-status { font-family: var(--mono); font-size: .62rem; color: var(--muted); letter-spacing: .05em; }
  .auth-btn {
    font-family: var(--mono); font-size: .65rem; letter-spacing: .06em;
    text-transform: uppercase; padding: 7px 14px;
    border: 2px solid var(--ink); border-radius: 2px;
    background: var(--accent); color: var(--ink);
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .auth-btn:hover { background: var(--ink); color: var(--accent); }
  .auth-btn.out { background: none; color: var(--muted); }
  .auth-btn.out:hover { background: var(--accent2); color: #fff; border-color: var(--accent2); }

  main {
    position: relative; z-index: 1;
    max-width: 1400px; margin: 0 auto;
    padding: clamp(24px, 4vw, 56px) clamp(16px, 4vw, 48px);
  }

  .hero {
    padding: clamp(40px, 8vw, 100px) 0 clamp(32px, 6vw, 72px);
    border-bottom: 2px solid var(--ink);
    margin-bottom: clamp(24px, 4vw, 48px);
    animation: fadeUp .5s ease both;
  }
  .hero-eyebrow {
    font-family: var(--mono); font-size: clamp(.6rem, 1vw, .7rem);
    letter-spacing: .15em; text-transform: uppercase; color: var(--muted);
    margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  .hero-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: var(--muted); }
  .hero h1 {
    font-family: var(--display);
    font-size: clamp(4rem, 12vw, 10rem);
    line-height: .9; letter-spacing: .02em; text-transform: uppercase;
  }
  .hero h1 em { font-style: normal; -webkit-text-stroke: 2px var(--ink); color: transparent; }
  .hero-sub { margin-top: clamp(16px, 2vw, 24px); font-size: clamp(.82rem, 1.4vw, .98rem); color: var(--muted); max-width: 480px; line-height: 1.7; }

  .input-block {
    display: flex; gap: 0;
    margin-bottom: clamp(20px, 3vw, 36px);
    animation: fadeUp .4s ease both;
    border: 2px solid var(--ink); border-radius: 4px; overflow: hidden;
  }
  .input-block input {
    flex: 1; min-width: 0;
    background: #fff; border: none; outline: none;
    font-family: var(--mono); font-size: clamp(.75rem, 1.2vw, .88rem);
    padding: clamp(12px, 1.8vw, 16px) clamp(14px, 2vw, 20px);
    color: var(--text);
  }
  .input-block input::placeholder { color: var(--muted); }
  .go-btn {
    font-family: var(--display); font-size: clamp(.9rem, 1.5vw, 1.1rem); letter-spacing: .08em;
    padding: 0 clamp(20px, 3vw, 36px);
    background: var(--ink); color: var(--accent);
    border: none; cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .go-btn:hover { background: #222; }
  .go-btn:disabled { opacity: .4; cursor: not-allowed; }

  .err {
    border: 2px solid var(--accent2); border-radius: 4px;
    padding: 12px 16px; margin-bottom: 20px;
    font-family: var(--mono); font-size: .74rem; color: var(--accent2);
    animation: fadeUp .3s ease both;
  }
  .loading {
    display: flex; align-items: center; gap: 12px;
    padding: 40px 0; color: var(--muted);
    font-family: var(--mono); font-size: .74rem;
    animation: fadeUp .3s ease both;
  }
  .loader { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--ink); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .card { border: 2px solid var(--ink); border-radius: 4px; overflow: hidden; animation: fadeUp .4s ease both; background: #fff; }
  .card-hero { display: flex; align-items: stretch; border-bottom: 2px solid var(--ink); }
  .card-art { width: clamp(120px, 20vw, 260px); height: clamp(120px, 20vw, 260px); object-fit: cover; flex-shrink: 0; display: block; border-right: 2px solid var(--ink); }
  .card-art-ph { width: clamp(120px, 20vw, 260px); height: clamp(120px, 20vw, 260px); background: var(--paper2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: clamp(2rem, 5vw, 3.5rem); border-right: 2px solid var(--ink); }
  .card-meta { padding: clamp(16px, 2.5vw, 28px); flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .card-type { font-family: var(--mono); font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .card-title { font-family: var(--display); font-size: clamp(1.6rem, 4vw, 3.2rem); line-height: 1; letter-spacing: .02em; text-transform: uppercase; }
  .card-artists { font-size: clamp(.82rem, 1.3vw, .96rem); font-weight: 600; color: var(--muted); }
  .card-album { font-family: var(--mono); font-size: clamp(.62rem, 1vw, .72rem); color: var(--muted); margin-top: 4px; }
  .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
  .tag { font-family: var(--mono); font-size: .6rem; letter-spacing: .06em; text-transform: uppercase; padding: 4px 9px; border-radius: 2px; border: 1.5px solid var(--border); color: var(--muted); background: var(--paper); }
  .tag.hi { border-color: var(--ink); color: var(--ink); background: var(--accent); }
  .tag.red { border-color: var(--accent2); color: var(--accent2); background: #fff0ee; }
  .sp-link { margin-top: 12px; align-self: flex-start; font-family: var(--mono); font-size: .65rem; letter-spacing: .06em; text-transform: uppercase; text-decoration: none; padding: 8px 16px; border: 2px solid var(--ink); border-radius: 2px; background: var(--ink); color: var(--accent); transition: all .15s; display: inline-block; }
  .sp-link:hover { background: #222; }

  .now-playing { border: 2px solid var(--ink); border-radius: 4px; overflow: hidden; animation: fadeUp .4s ease both; background: var(--ink); color: var(--paper); }
  .np-header { display: flex; align-items: center; gap: 10px; padding: 12px 20px; border-bottom: 1px solid #333; font-family: var(--mono); font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: #666; }
  .np-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 1.2s ease-in-out infinite; }
  .np-body { display: flex; align-items: stretch; }
  .np-art { width: clamp(90px, 14vw, 180px); height: clamp(90px, 14vw, 180px); object-fit: cover; flex-shrink: 0; border-right: 1px solid #333; }
  .np-art-ph { width: clamp(90px, 14vw, 180px); height: clamp(90px, 14vw, 180px); background: #1a1a1a; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 2rem; border-right: 1px solid #333; }
  .np-info { padding: clamp(14px, 2vw, 24px); flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .np-title { font-family: var(--display); font-size: clamp(1.4rem, 3.5vw, 2.6rem); line-height: 1; letter-spacing: .02em; text-transform: uppercase; color: var(--accent); }
  .np-artist { font-size: .9rem; font-weight: 500; color: #aaa; }
  .np-album { font-family: var(--mono); font-size: .62rem; color: #555; margin-top: 2px; }
  .np-progress { margin-top: 10px; display: flex; align-items: center; gap: 10px; }
  .progress-bar { flex: 1; height: 3px; background: #333; border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--accent); transition: width .5s linear; }
  .np-time { font-family: var(--mono); font-size: .6rem; color: #555; white-space: nowrap; }

  .results-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid var(--ink); }
  .results-header h2 { font-family: var(--display); font-size: clamp(1.2rem, 3vw, 2rem); letter-spacing: .04em; text-transform: uppercase; }
  .results-count { font-family: var(--mono); font-size: .65rem; color: var(--muted); }
  .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); gap: 2px; }
  .result-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #fff; border: 1px solid var(--border); cursor: pointer; transition: all .12s; animation: fadeUp .3s ease both; }
  .result-item:hover { background: var(--paper2); border-color: var(--ink); }
  .result-thumb { width: 44px; height: 44px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border); }
  .result-thumb-ph { width: 44px; height: 44px; background: var(--paper2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid var(--border); }
  .result-info { min-width: 0; flex: 1; }
  .result-name { font-size: .84rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .result-sub { font-family: var(--mono); font-size: .62rem; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; }
  .result-dur { font-family: var(--mono); font-size: .62rem; color: var(--muted); flex-shrink: 0; }

  .tracklist { border-top: 2px solid var(--ink); }
  .tl-head { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; background: var(--paper2); border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: .65rem; letter-spacing: .06em; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; }
  th { font-family: var(--mono); font-size: .58rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); padding: 8px clamp(10px, 1.5vw, 20px); text-align: left; background: var(--paper2); border-bottom: 1px solid var(--border); }
  tbody tr { border-bottom: 1px solid var(--border); transition: background .1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr.active-row { background: #f0ffe0; }
  tbody tr:not(.active-row):hover { background: var(--paper2); }
  td { padding: clamp(8px, 1.2vw, 12px) clamp(10px, 1.5vw, 20px); font-size: clamp(.76rem, 1.1vw, .84rem); vertical-align: middle; }
  .td-num { font-family: var(--mono); font-size: .66rem; color: var(--muted); width: 32px; }
  .td-dur { font-family: var(--mono); font-size: .68rem; color: var(--muted); text-align: right; }
  .active-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }
  .exp-tag { font-family: var(--mono); font-size: .54rem; color: var(--accent2); margin-left: 6px; vertical-align: middle; }

  .json-section { margin-top: 20px; }
  .json-toggle { font-family: var(--mono); font-size: .65rem; letter-spacing: .05em; background: none; border: 1.5px solid var(--border); border-radius: 2px; padding: 6px 14px; cursor: pointer; color: var(--muted); transition: all .12s; margin-bottom: 8px; }
  .json-toggle:hover { border-color: var(--ink); color: var(--text); }
  pre { background: var(--ink); color: #888; border-radius: 4px; padding: clamp(14px, 2vw, 20px); font-family: var(--mono); font-size: clamp(.62rem, .9vw, .7rem); overflow: auto; max-height: 40vh; line-height: 1.7; white-space: pre-wrap; word-break: break-all; }

  .empty { padding: clamp(36px, 8vw, 80px) 0; display: flex; flex-direction: column; gap: 4px; animation: fadeUp .5s ease both; }
  .empty-label { font-family: var(--mono); font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .empty-endpoints { margin-top: 20px; display: flex; flex-direction: column; gap: 0; border: 2px solid var(--ink); border-radius: 4px; overflow: hidden; }
  .endpoint { display: flex; align-items: center; gap: 0; border-bottom: 1px solid var(--border); }
  .endpoint:last-child { border-bottom: none; }
  .ep-method { font-family: var(--mono); font-size: .6rem; letter-spacing: .06em; padding: 10px 14px; background: var(--ink); color: var(--accent); border-right: 2px solid var(--ink); flex-shrink: 0; min-width: 52px; text-align: center; }
  .ep-path { font-family: var(--mono); font-size: clamp(.65rem, 1vw, .74rem); padding: 10px 16px; flex: 1; background: #fff; border-right: 1px solid var(--border); }
  .ep-desc { font-size: clamp(.65rem, 1vw, .74rem); color: var(--muted); padding: 10px 16px; background: var(--paper2); flex: 1.2; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 640px) {
    .card-hero, .np-body { flex-direction: column; }
    .card-art, .card-art-ph { width: 100%; height: auto; aspect-ratio: 1; border-right: none; border-bottom: 2px solid var(--ink); }
    .np-art, .np-art-ph { width: 100%; height: auto; aspect-ratio: 1; border-right: none; border-bottom: 1px solid #333; }
    .col-artists, .ep-desc { display: none; }
    .hero h1 { font-size: clamp(3rem, 18vw, 6rem); }
  }
`;

function msToTime(ms) {
  if (!ms) return "—";
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function extractId(input) {
  const match = input.trim().match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : input.trim();
}

function getTrackDisplay(t) {
  return {
    art: t?.coverUrl ?? t?.album?.images?.[0]?.url,
    name: t?.title ?? t?.name,
    artists: Array.isArray(t?.artists)
      ? t.artists.map(a => typeof a === "string" ? a : a.name).join(", ")
      : "—",
    albumName: typeof t?.album === "string" ? t.album : t?.album?.name,
    duration: t?.duration ? t.duration * 1000 : (t?.durationMs ?? t?.duration_ms),
    popularity: t?.popularity,
    explicit: t?.explicit,
    spotifyUrl: t?.externalUrls?.spotify ?? t?.external_urls?.spotify,
    trackNumber: t?.trackNumber ?? t?.track_number,
    albumTracks: t?.album?.tracks?.items ?? [],
    albumTotal: t?.album?.totalTracks ?? t?.album?.total_tracks ?? 0,
    releaseDate: t?.album?.releaseDate ?? t?.album?.release_date,
  };
}

export default function App() {
  const [tab, setTab] = useState("track");
  const [token, setToken] = useState(() => sessionStorage.getItem("sp_token") || "");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [progressMs, setProgressMs] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || params.get("access_token");
    if (t) {
      setToken(t);
      sessionStorage.setItem("sp_token", t);
      window.history.replaceState({}, "", "/");
      setTab("now-playing");
    }
  }, []);

  useEffect(() => {
    if (!nowPlaying?.isPlaying) return;
    const id = setInterval(() => setProgressMs(p => p + 1000), 1000);
    return () => clearInterval(id);
  }, [nowPlaying]);

  const reset = () => {
    setError(""); setLoading(true);
    setTrackResult(null); setSearchResults(null);
    setSelectedTrack(null); setShowJson(false); setNowPlaying(null);
  };

  const fetchTrack = async () => {
    const id = extractId(query);
    if (!id) return;
    reset();
    try {
      const res = await fetch(`${API}/api/spotify/track/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text().catch(() => "")).slice(0, 120)}`);
      setTrackResult(await res.json());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fetchSearch = async () => {
    if (!query.trim()) return;
    reset();
    try {
      const res = await fetch(`${API}/api/spotify/search?query=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text().catch(() => "")).slice(0, 120)}`);
      const data = await res.json();
      setSearchResults(data?.tracks?.items ?? []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fetchNowPlaying = async () => {
    if (!token) return;
    reset();
    try {
      const res = await fetch(`${API}/api/spotify/current`);
      if (res.status === 204) { setLoading(false); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text().catch(() => "")).slice(0, 120)}`);
      const data = await res.json();
      setNowPlaying(data);
      setProgressMs(data.progressMs ?? 0);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleGo = () => {
    if (tab === "track") fetchTrack();
    else if (tab === "search") fetchSearch();
    else fetchNowPlaying();
  };

  const hasResult = trackResult || searchResults || nowPlaying;

  return (
    <>
      <style>{css}</style>
      <nav>
        <div className="nav-logo"><span className="nav-dot" />BREAKMUSIC</div>
        <div className="nav-tabs">
          {[["track", "Track Lookup"], ["search", "Search"], ["now-playing", "Now Playing"]].map(([id, label]) => (
            <button key={id} className={`tab${tab === id ? " active" : ""}`} onClick={() => { setTab(id); setError(""); }}>
              {label}
            </button>
          ))}
        </div>
        <div className="nav-auth">
          {token
            ? <><span className="auth-status">● connected</span><button className="auth-btn out" onClick={() => { setToken(""); sessionStorage.removeItem("sp_token"); }}>Sign out</button></>
            : <button className="auth-btn" onClick={() => { window.location.href = `${API}/api/spotify/login`; }}>Connect Spotify</button>
          }
        </div>
      </nav>

      <main>
        {!hasResult && !loading && !error && (
          <div className="hero">
            <div className="hero-eyebrow">Spotify API Explorer</div>
            <h1>Break<br /><em>Music.</em></h1>
            <p className="hero-sub">
              {tab === "track" && "Look up any track by ID or Spotify URL."}
              {tab === "search" && "Search Spotify's catalog by track name or artist."}
              {tab === "now-playing" && !token && "Connect your Spotify account to see what's playing."}
              {tab === "now-playing" && token && "Fetch your current Spotify playback."}
            </p>
          </div>
        )}

        <div className="input-block">
          <input
            value={tab === "now-playing" ? "" : query}
            onChange={e => tab !== "now-playing" && setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGo()}
            readOnly={tab === "now-playing"}
            placeholder={
              tab === "track" ? "Track ID or Spotify URL" :
                tab === "search" ? "Search for a track…" :
                  token ? "Fetches your current Spotify playback" : "Connect Spotify first"
            }
            style={tab === "now-playing" ? { cursor: "default", color: "var(--muted)" } : {}}
          />
          <button className="go-btn" onClick={handleGo} disabled={loading || (tab === "now-playing" && !token)}>
            {loading ? "…" : tab === "now-playing" ? "Refresh" : "GO"}
          </button>
        </div>

        {error && <div className="err">⚠ {error}</div>}
        {loading && <div className="loading"><div className="loader" /><span>Fetching…</span></div>}

        {/* Track result */}
        {tab === "track" && trackResult && !loading && (() => {
          const d = getTrackDisplay(trackResult);
          return (
            <>
              <div className="card">
                <div className="card-hero">
                  {d.art ? <img src={d.art} alt="art" className="card-art" /> : <div className="card-art-ph">♪</div>}
                  <div className="card-meta">
                    <div className="card-type">Track</div>
                    <div className="card-title">{d.name}</div>
                    <div className="card-artists">{d.artists}</div>
                    {d.albumName && <div className="card-album">💿 {d.albumName}{d.releaseDate ? ` · ${d.releaseDate}` : ""}</div>}
                    <div className="tags">
                      {d.popularity != null && <span className="tag hi">Pop {d.popularity}</span>}
                      {d.duration && <span className="tag">{msToTime(d.duration)}</span>}
                      {d.trackNumber && <span className="tag">#{d.trackNumber}</span>}
                      {d.explicit && <span className="tag red">EXPLICIT</span>}
                      {d.albumTotal > 0 && <span className="tag">{d.albumTotal} tracks</span>}
                    </div>
                    {d.spotifyUrl && <a href={d.spotifyUrl} target="_blank" rel="noopener noreferrer" className="sp-link">Open in Spotify ↗</a>}
                  </div>
                </div>
                {d.albumTracks.length > 0 && (
                  <div className="tracklist">
                    <div className="tl-head"><span>Tracklist</span><span>{d.albumTotal} tracks</span></div>
                    <table>
                      <thead><tr><th>#</th><th>Title</th><th className="col-artists">Artists</th><th style={{ textAlign: "right" }}>Dur</th></tr></thead>
                      <tbody>
                        {d.albumTracks.map(t => {
                          const isActive = t.id === (trackResult.id ?? trackResult.Id);
                          return (
                            <tr key={t.id} className={isActive ? "active-row" : ""}>
                              <td className="td-num">{isActive ? <span className="active-dot" /> : (t.trackNumber ?? t.track_number)}</td>
                              <td><strong style={{ fontWeight: 600 }}>{t.name}</strong>{t.explicit && <span className="exp-tag">E</span>}</td>
                              <td className="col-artists" style={{ color: "var(--muted)", fontSize: ".76rem" }}>{t.artists?.map(a => a.name).join(", ")}</td>
                              <td className="td-dur">{msToTime(t.durationMs ?? t.duration_ms)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="json-section">
                <button className="json-toggle" onClick={() => setShowJson(v => !v)}>{showJson ? "▲ Hide" : "▼ Show"} raw JSON</button>
                {showJson && <pre>{JSON.stringify(trackResult, null, 2)}</pre>}
              </div>
            </>
          );
        })()}

        {/* Search results */}
        {tab === "search" && searchResults && !loading && (
          selectedTrack ? (() => {
            const d = getTrackDisplay(selectedTrack);
            return (
              <>
                <button className="json-toggle" style={{ marginBottom: 16 }} onClick={() => setSelectedTrack(null)}>← Back to results</button>
                <div className="card">
                  <div className="card-hero">
                    {d.art ? <img src={d.art} alt="art" className="card-art" /> : <div className="card-art-ph">♪</div>}
                    <div className="card-meta">
                      <div className="card-type">Track</div>
                      <div className="card-title">{d.name}</div>
                      <div className="card-artists">{d.artists}</div>
                      {d.albumName && <div className="card-album">💿 {d.albumName}</div>}
                      <div className="tags">
                        {d.popularity != null && <span className="tag hi">Pop {d.popularity}</span>}
                        {d.duration && <span className="tag">{msToTime(d.duration)}</span>}
                        {d.explicit && <span className="tag red">EXPLICIT</span>}
                      </div>
                      {d.spotifyUrl && <a href={d.spotifyUrl} target="_blank" rel="noopener noreferrer" className="sp-link">Open in Spotify ↗</a>}
                    </div>
                  </div>
                </div>
              </>
            );
          })() : (
            <>
              <div className="results-header">
                <h2>Results</h2>
                <span className="results-count">{searchResults.length} tracks</span>
              </div>
              <div className="results-grid">
                {searchResults.map((t, i) => {
                  const d = getTrackDisplay(t);
                  const thumb = d.art ?? t?.album?.images?.[2]?.url;
                  return (
                    <div key={t.id ?? i} className="result-item" onClick={() => setSelectedTrack(t)}>
                      {thumb ? <img src={thumb} alt="" className="result-thumb" /> : <div className="result-thumb-ph">♪</div>}
                      <div className="result-info">
                        <div className="result-name">{d.name}</div>
                        <div className="result-sub">{d.artists} · {t?.album?.name}</div>
                      </div>
                      <div className="result-dur">{msToTime(d.duration)}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )
        )}

        {/* Now playing */}
        {tab === "now-playing" && nowPlaying && !loading && (() => {
          const art = nowPlaying?.album?.images?.[0]?.url ?? nowPlaying?.coverUrl;
          const name = nowPlaying?.name ?? nowPlaying?.title;
          const artists = Array.isArray(nowPlaying?.artists)
            ? nowPlaying.artists.map(a => typeof a === "string" ? a : a.name).join(", ")
            : "—";
          const albumName = nowPlaying?.album?.name ?? (typeof nowPlaying?.album === "string" ? nowPlaying.album : null);
          const duration = nowPlaying?.durationMs ?? nowPlaying?.duration_ms ?? (nowPlaying?.duration ? nowPlaying.duration * 1000 : 0);
          const progress = Math.min(progressMs, duration);
          const pct = duration ? (progress / duration) * 100 : 0;
          return (
            <div className="now-playing">
              <div className="np-header"><span className="np-dot" />Now Playing</div>
              <div className="np-body">
                {art ? <img src={art} alt="art" className="np-art" /> : <div className="np-art-ph">♪</div>}
                <div className="np-info">
                  <div className="np-title">{name}</div>
                  <div className="np-artist">{artists}</div>
                  {albumName && <div className="np-album">💿 {albumName}</div>}
                  <div className="np-progress">
                    <span className="np-time">{msToTime(progress)}</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    <span className="np-time">{msToTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {tab === "now-playing" && !nowPlaying && !loading && !error && token && (
          <div className="empty">
            <div className="empty-label">No playback detected</div>
            <p style={{ color: "var(--muted)", fontSize: ".84rem" }}>Nothing is currently playing. Start something on Spotify and hit Refresh.</p>
          </div>
        )}

        {!hasResult && !loading && !error && (
          <div className="empty">
            <div className="empty-label">Backend endpoints</div>
            <div className="empty-endpoints">
              {[
                ["/api/spotify/login", "Start OAuth flow"],
                ["/api/spotify/callback?code=", "OAuth callback, stores user token"],
                ["/api/spotify/track/{id}", "Fetch track by ID"],
                ["/api/spotify/album/{id}", "Fetch album by ID"],
                ["/api/spotify/search?query=", "Search tracks"],
                ["/api/spotify/current", "Currently playing (OAuth)"],
              ].map(([path, desc]) => (
                <div className="endpoint" key={path}>
                  <span className="ep-method">GET</span>
                  <span className="ep-path">{path}</span>
                  <span className="ep-desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
