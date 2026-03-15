import { useState, useEffect } from "react";

const API = "http://127.0.0.1:5098";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0a0a;
    --paper: #f2efe8;
    --paper2: #e8e4da;
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
    min-height: 100vh; width: 100%;
    background: var(--paper); color: var(--text);
    font-family: var(--body); -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ::selection { background: var(--accent); color: var(--ink); }

  body::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: .03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* NAV */
  nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: stretch;
    border-bottom: 2px solid var(--ink);
    background: var(--paper);
    min-height: 52px;
  }
  .nav-logo {
    font-family: var(--display); font-size: clamp(1.1rem, 2.5vw, 1.7rem);
    letter-spacing: .04em; padding: 0 clamp(14px, 2.5vw, 28px);
    border-right: 2px solid var(--ink);
    display: flex; align-items: center; gap: 8px; user-select: none; flex-shrink: 0;
  }
  .nav-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: var(--accent); border: 2px solid var(--ink);
    animation: pulse 2s ease-in-out infinite; flex-shrink: 0;
  }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(.6)} }

  .nav-tabs { display: flex; align-items: stretch; flex: 1; overflow-x: auto; scrollbar-width: none; }
  .nav-tabs::-webkit-scrollbar { display: none; }
  .tab {
    font-family: var(--mono); font-size: clamp(.58rem, .9vw, .7rem);
    letter-spacing: .06em; text-transform: uppercase;
    padding: 0 clamp(10px, 1.8vw, 22px);
    border: none; border-right: 1px solid var(--border);
    background: none; cursor: pointer; color: var(--muted);
    transition: all .15s; white-space: nowrap; flex-shrink: 0;
  }
  .tab:hover { background: var(--paper2); color: var(--text); }
  .tab.active { background: var(--ink); color: var(--accent); border-right-color: var(--ink); }

  .nav-auth {
    display: flex; align-items: center; flex-shrink: 0;
    padding: 0 clamp(10px, 1.8vw, 22px);
    border-left: 2px solid var(--ink); gap: 8px;
  }
  .auth-status { font-family: var(--mono); font-size: .6rem; color: var(--muted); letter-spacing: .05em; white-space: nowrap; }
  .auth-btn {
    font-family: var(--mono); font-size: .63rem; letter-spacing: .06em;
    text-transform: uppercase; padding: 6px 12px;
    border: 2px solid var(--ink); border-radius: 2px;
    background: var(--accent); color: var(--ink);
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .auth-btn:hover { background: var(--ink); color: var(--accent); }
  .auth-btn.out { background: none; color: var(--muted); }
  .auth-btn.out:hover { background: var(--accent2); color: #fff; border-color: var(--accent2); }

  /* MAIN */
  main {
    position: relative; z-index: 1;
    width: 100%; max-width: 1200px; margin: 0 auto;
    padding: clamp(20px, 4vw, 52px) clamp(14px, 3.5vw, 44px);
  }

  /* HERO */
  .hero {
    padding: clamp(32px, 7vw, 88px) 0 clamp(28px, 5vw, 60px);
    border-bottom: 2px solid var(--ink);
    margin-bottom: clamp(20px, 3.5vw, 40px);
    animation: fadeUp .5s ease both;
  }
  .hero-eyebrow {
    font-family: var(--mono); font-size: clamp(.58rem, .9vw, .68rem);
    letter-spacing: .15em; text-transform: uppercase; color: var(--muted);
    margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
  }
  .hero-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: var(--muted); }
  .hero h1 {
    font-family: var(--display);
    font-size: clamp(3.2rem, 10vw, 9rem);
    line-height: .9; letter-spacing: .02em; text-transform: uppercase;
  }
  .hero h1 em { font-style: normal; -webkit-text-stroke: 2px var(--ink); color: transparent; }
  .hero-sub { margin-top: clamp(12px, 2vw, 20px); font-size: clamp(.8rem, 1.3vw, .95rem); color: var(--muted); max-width: 440px; line-height: 1.7; }

  /* INPUT */
  .input-area { margin-bottom: clamp(16px, 2.5vw, 32px); animation: fadeUp .4s ease both; }
  .input-block {
    display: flex; border: 2px solid var(--ink); border-radius: 4px; overflow: hidden;
  }
  .input-block input {
    flex: 1; min-width: 0;
    background: #fff; border: none; outline: none;
    font-family: var(--mono); font-size: clamp(.73rem, 1.1vw, .85rem);
    padding: clamp(11px, 1.6vw, 15px) clamp(12px, 1.8vw, 18px);
    color: var(--text);
  }
  .input-block input::placeholder { color: var(--muted); }
  .go-btn {
    font-family: var(--display); font-size: clamp(.85rem, 1.3vw, 1.05rem); letter-spacing: .08em;
    padding: 0 clamp(16px, 2.5vw, 32px);
    background: var(--ink); color: var(--accent);
    border: none; cursor: pointer; transition: background .15s; white-space: nowrap; flex-shrink: 0;
  }
  .go-btn:hover { background: #222; }
  .go-btn:disabled { opacity: .4; cursor: not-allowed; }

  /* TYPE SELECTOR */
  .type-row {
    display: flex; gap: 0; margin-top: 8px;
    border: 1.5px solid var(--border); border-radius: 3px; overflow: hidden;
    width: fit-content;
  }
  .type-btn {
    font-family: var(--mono); font-size: clamp(.58rem, .85vw, .66rem);
    letter-spacing: .07em; text-transform: uppercase;
    padding: 5px 14px; border: none; border-right: 1px solid var(--border);
    background: #fff; color: var(--muted); cursor: pointer; transition: all .12s;
  }
  .type-btn:last-child { border-right: none; }
  .type-btn:hover { background: var(--paper2); color: var(--text); }
  .type-btn.active { background: var(--ink); color: var(--accent); }

  /* FEEDBACK */
  .err { border: 2px solid var(--accent2); border-radius: 4px; padding: 10px 14px; margin-bottom: 16px; font-family: var(--mono); font-size: .72rem; color: var(--accent2); animation: fadeUp .3s ease both; }
  .loading { display: flex; align-items: center; gap: 10px; padding: 36px 0; color: var(--muted); font-family: var(--mono); font-size: .72rem; animation: fadeUp .3s ease both; }
  .loader { width: 18px; height: 18px; border: 2px solid var(--border); border-top-color: var(--ink); border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* CARD */
  .card { border: 2px solid var(--ink); border-radius: 4px; overflow: hidden; animation: fadeUp .4s ease both; background: #fff; }
  .card-hero { display: flex; align-items: stretch; border-bottom: 2px solid var(--ink); }
  .card-art { width: clamp(110px, 18vw, 240px); height: clamp(110px, 18vw, 240px); object-fit: cover; flex-shrink: 0; display: block; border-right: 2px solid var(--ink); }
  .card-art-ph { width: clamp(110px, 18vw, 240px); height: clamp(110px, 18vw, 240px); background: var(--paper2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: clamp(1.8rem, 4vw, 3rem); border-right: 2px solid var(--ink); }
  .card-meta { padding: clamp(14px, 2.2vw, 26px); flex: 1; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .card-type { font-family: var(--mono); font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .card-title { font-family: var(--display); font-size: clamp(1.4rem, 3.5vw, 2.8rem); line-height: 1; letter-spacing: .02em; text-transform: uppercase; word-break: break-word; }
  .card-artists { font-size: clamp(.8rem, 1.2vw, .92rem); font-weight: 600; color: var(--muted); }
  .card-album { font-family: var(--mono); font-size: clamp(.6rem, .9vw, .7rem); color: var(--muted); margin-top: 2px; }
  .tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 6px; }
  .tag { font-family: var(--mono); font-size: .58rem; letter-spacing: .06em; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; border: 1.5px solid var(--border); color: var(--muted); background: var(--paper); }
  .tag.hi { border-color: var(--ink); color: var(--ink); background: var(--accent); }
  .tag.red { border-color: var(--accent2); color: var(--accent2); background: #fff0ee; }
  .sp-link { margin-top: 10px; align-self: flex-start; font-family: var(--mono); font-size: .62rem; letter-spacing: .06em; text-transform: uppercase; text-decoration: none; padding: 7px 14px; border: 2px solid var(--ink); border-radius: 2px; background: var(--ink); color: var(--accent); transition: background .15s; display: inline-block; }
  .sp-link:hover { background: #222; }

  /* NOW PLAYING */
  .now-playing { border: 2px solid var(--ink); border-radius: 4px; overflow: hidden; animation: fadeUp .4s ease both; background: #fff; }
  .np-header { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-bottom: 2px solid var(--ink); font-family: var(--mono); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: var(--paper2); }
  .np-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ink); border: 1.5px solid var(--ink); animation: pulse 1.2s ease-in-out infinite; flex-shrink: 0; }
  .np-body { display: flex; align-items: stretch; }
  .np-art { width: clamp(110px, 18vw, 240px); height: clamp(110px, 18vw, 240px); object-fit: cover; flex-shrink: 0; border-right: 2px solid var(--ink); display: block; }
  .np-art-ph { width: clamp(110px, 18vw, 240px); height: clamp(110px, 18vw, 240px); background: var(--paper2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 2rem; border-right: 2px solid var(--ink); }
  .np-info { padding: clamp(14px, 2.2vw, 26px); flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .np-title { font-family: var(--display); font-size: clamp(1.4rem, 3.5vw, 2.8rem); line-height: 1; letter-spacing: .02em; text-transform: uppercase; color: var(--ink); word-break: break-word; }
  .np-artist { font-size: clamp(.8rem, 1.2vw, .92rem); font-weight: 600; color: var(--muted); }
  .np-album { font-family: var(--mono); font-size: .6rem; color: var(--muted); margin-top: 1px; }
  .np-progress { margin-top: 10px; display: flex; align-items: center; gap: 8px; }
  .progress-bar { flex: 1; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; min-width: 0; }
  .progress-fill { height: 100%; background: var(--ink); transition: width .5s linear; }
  .np-time { font-family: var(--mono); font-size: .58rem; color: var(--muted); white-space: nowrap; flex-shrink: 0; }

  /* TRACKLIST */
  .tracklist { border-top: 2px solid var(--ink); overflow-x: auto; }
  .tl-head { display: flex; align-items: center; justify-content: space-between; padding: 9px 18px; background: var(--paper2); border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: .62rem; letter-spacing: .06em; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; min-width: 320px; }
  th { font-family: var(--mono); font-size: .56rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); padding: 7px clamp(10px, 1.5vw, 18px); text-align: left; background: var(--paper2); border-bottom: 1px solid var(--border); white-space: nowrap; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background .1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr.active-row { background: #f0ffe0; }
  tbody tr:not(.active-row):hover { background: var(--paper2); }
  td { padding: clamp(7px, 1.1vw, 11px) clamp(10px, 1.5vw, 18px); font-size: clamp(.74rem, 1vw, .82rem); vertical-align: middle; }
  .td-num { font-family: var(--mono); font-size: .64rem; color: var(--muted); width: 28px; }
  .td-dur { font-family: var(--mono); font-size: .66rem; color: var(--muted); text-align: right; white-space: nowrap; }
  .active-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }
  .exp-tag { font-family: var(--mono); font-size: .52rem; color: var(--accent2); margin-left: 5px; vertical-align: middle; }

  /* RESULTS */
  .results-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 2px solid var(--ink); gap: 10px; }
  .results-header h2 { font-family: var(--display); font-size: clamp(1.1rem, 2.5vw, 1.8rem); letter-spacing: .04em; text-transform: uppercase; }
  .results-count { font-family: var(--mono); font-size: .62rem; color: var(--muted); white-space: nowrap; }
  .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(480px, 100%), 1fr)); gap: 3px; }

  .result-item { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: #fff; border: 1px solid var(--border); cursor: pointer; transition: all .12s; animation: fadeUp .3s ease both; }
  .result-item:hover { background: var(--paper2); border-color: var(--ink); }
  .result-thumb { width: 64px; height: 64px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border); display: block; }
  .result-thumb-ph { width: 64px; height: 64px; background: var(--paper2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid var(--border); }
  .result-info { min-width: 0; flex: 1; }
  .result-name { font-size: .96rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .result-sub { font-family: var(--mono); font-size: .66rem; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 4px; }
  .result-meta { font-family: var(--mono); font-size: .66rem; color: var(--muted); flex-shrink: 0; text-align: right; }

  /* ARTIST RESULT ITEM */
  .artist-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: #fff; border: 1px solid var(--border); animation: fadeUp .3s ease both; }
  .artist-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid var(--ink); display: block; }
  .artist-avatar-ph { width: 64px; height: 64px; border-radius: 50%; background: var(--paper2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 2px solid var(--ink); }
  .artist-info { min-width: 0; flex: 1; }
  .artist-name-text { font-size: .96rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .artist-sub { font-family: var(--mono); font-size: .64rem; color: var(--muted); margin-top: 4px; }

  /* ALBUM RESULT ITEM */
  .album-item { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: #fff; border: 1px solid var(--border); animation: fadeUp .3s ease both; }
  .album-thumb { width: 64px; height: 64px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border); display: block; }
  .album-thumb-ph { width: 64px; height: 64px; background: var(--paper2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid var(--border); }
  .album-info { min-width: 0; flex: 1; }
  .album-name-text { font-size: .94rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .album-sub { font-family: var(--mono); font-size: .64rem; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 4px; }
  .album-meta { font-family: var(--mono); font-size: .64rem; color: var(--muted); flex-shrink: 0; text-align: right; }

  /* JSON */
  .json-section { margin-top: 18px; }
  .json-toggle { font-family: var(--mono); font-size: .63rem; letter-spacing: .05em; background: none; border: 1.5px solid var(--border); border-radius: 2px; padding: 5px 12px; cursor: pointer; color: var(--muted); transition: all .12s; margin-bottom: 6px; }
  .json-toggle:hover { border-color: var(--ink); color: var(--text); }
  pre { background: var(--ink); color: #777; border-radius: 4px; padding: clamp(12px, 1.8vw, 18px); font-family: var(--mono); font-size: clamp(.6rem, .85vw, .68rem); overflow: auto; max-height: 38vh; line-height: 1.7; white-space: pre-wrap; word-break: break-all; }

  /* EMPTY */
  .empty { padding: clamp(28px, 6vw, 68px) 0; display: flex; flex-direction: column; gap: 4px; animation: fadeUp .5s ease both; }
  .empty-label { font-family: var(--mono); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .empty-endpoints { display: flex; flex-direction: column; margin-top: 16px; border: 2px solid var(--ink); border-radius: 4px; overflow: hidden; }
  .endpoint { display: flex; align-items: stretch; border-bottom: 1px solid var(--border); }
  .endpoint:last-child { border-bottom: none; }
  .ep-method { font-family: var(--mono); font-size: .58rem; letter-spacing: .06em; padding: 9px 12px; background: var(--ink); color: var(--accent); flex-shrink: 0; min-width: 48px; text-align: center; display: flex; align-items: center; justify-content: center; }
  .ep-path { font-family: var(--mono); font-size: clamp(.63rem, .95vw, .72rem); padding: 9px 14px; flex: 1; background: #fff; border-right: 1px solid var(--border); word-break: break-all; }
  .ep-desc { font-size: clamp(.63rem, .95vw, .72rem); color: var(--muted); padding: 9px 14px; background: var(--paper2); flex: 1.2; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 600px) {
    .card-hero { flex-direction: column; }
    .card-art, .card-art-ph { width: 100%; height: auto; aspect-ratio: 1 / 1; border-right: none; border-bottom: 2px solid var(--ink); }
    .np-body { flex-direction: column; }
    .np-art, .np-art-ph { width: 100%; height: auto; aspect-ratio: 1 / 1; border-right: none; border-bottom: 2px solid var(--ink); }
    .col-artists, .ep-desc { display: none; }
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
  const [searchType, setSearchType] = useState("track");
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
      const res = await fetch(`${API}/api/spotify/search?query=${encodeURIComponent(query.trim())}&type=${searchType}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text().catch(() => "")).slice(0, 120)}`);
      const data = await res.json();
      if (searchType === "track") setSearchResults({ type: "track", items: data?.tracks?.items ?? [] });
      else if (searchType === "album") setSearchResults({ type: "album", items: data?.albums?.items ?? [] });
      else if (searchType === "artist") setSearchResults({ type: "artist", items: data?.artists?.items ?? [] });
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

  const placeholder = tab === "track" ? "Track ID or Spotify URL"
    : tab === "search" ? "Search…"
      : token ? "Fetches your current playback" : "Connect Spotify first";

  return (
    <>
      <style>{css}</style>

      <nav>
        <div className="nav-logo"><span className="nav-dot" />BREAKMUSIC</div>
        <div className="nav-tabs">
          {[["track", "Track"], ["search", "Search"], ["now-playing", "Now Playing"]].map(([id, label]) => (
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
              {tab === "search" && "Search tracks, albums, or artists across Spotify's catalog."}
              {tab === "now-playing" && !token && "Connect your Spotify account to see what's playing."}
              {tab === "now-playing" && token && "Fetch your current Spotify playback."}
            </p>
          </div>
        )}

        <div className="input-area">
          <div className="input-block">
            <input
              value={tab === "now-playing" ? "" : query}
              onChange={e => tab !== "now-playing" && setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGo()}
              readOnly={tab === "now-playing"}
              placeholder={placeholder}
              style={tab === "now-playing" ? { cursor: "default", color: "var(--muted)" } : {}}
            />
            <button className="go-btn" onClick={handleGo} disabled={loading || (tab === "now-playing" && !token)}>
              {loading ? "…" : tab === "now-playing" ? "Refresh" : "GO"}
            </button>
          </div>

          {tab === "search" && (
            <div className="type-row">
              {["track", "album", "artist"].map(t => (
                <button key={t} className={`type-btn${searchType === t ? " active" : ""}`} onClick={() => setSearchType(t)}>
                  {t}
                </button>
              ))}
            </div>
          )}
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
                              <td className="col-artists" style={{ color: "var(--muted)", fontSize: ".74rem" }}>{t.artists?.map(a => a.name).join(", ")}</td>
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
                <button className="json-toggle" style={{ marginBottom: 14 }} onClick={() => setSelectedTrack(null)}>← Back</button>
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
                <span className="results-count">{searchResults.items.length} {searchResults.type}s</span>
              </div>
              <div className="results-grid">
                {searchResults.type === "track" && searchResults.items.map((t, i) => {
                  const d = getTrackDisplay(t);
                  const thumb = d.art ?? t?.album?.images?.[2]?.url;
                  return (
                    <div key={t.id ?? i} className="result-item" onClick={() => setSelectedTrack(t)}>
                      {thumb ? <img src={thumb} alt="" className="result-thumb" /> : <div className="result-thumb-ph">♪</div>}
                      <div className="result-info">
                        <div className="result-name">{d.name}</div>
                        <div className="result-sub">{d.artists} · {t?.album?.name}</div>
                      </div>
                      <div className="result-meta">{msToTime(d.duration)}</div>
                    </div>
                  );
                })}

                {searchResults.type === "artist" && searchResults.items.map((a, i) => {
                  const img = a?.images?.[1]?.url ?? a?.images?.[0]?.url;
                  return (
                    <div key={a.id ?? i} className="artist-item">
                      {img ? <img src={img} alt="" className="artist-avatar" /> : <div className="artist-avatar-ph">👤</div>}
                      <div className="artist-info">
                        <div className="artist-name-text">{a.name}</div>
                        <div className="artist-sub">
                          {a.popularity != null ? `Pop ${a.popularity}` : "Artist"}
                          {a.genres?.length ? ` · ${a.genres.slice(0, 2).join(", ")}` : ""}
                        </div>
                      </div>
                      {a.externalUrls?.spotify && (
                        <a href={a.externalUrls.spotify} target="_blank" rel="noopener noreferrer" className="sp-link" style={{ marginTop: 0 }}>↗</a>
                      )}
                    </div>
                  );
                })}

                {searchResults.type === "album" && searchResults.items.map((a, i) => {
                  const img = a?.images?.[1]?.url ?? a?.images?.[0]?.url;
                  const artistNames = a?.artists?.map(x => x.name).join(", ");
                  return (
                    <div key={a.id ?? i} className="album-item">
                      {img ? <img src={img} alt="" className="album-thumb" /> : <div className="album-thumb-ph">💿</div>}
                      <div className="album-info">
                        <div className="album-name-text">{a.name}</div>
                        <div className="album-sub">{artistNames}{a.releaseDate ? ` · ${a.releaseDate.slice(0, 4)}` : ""}</div>
                      </div>
                      <div className="album-meta">
                        {a.totalTracks} tracks
                        {a.externalUrls?.spotify && (
                          <><br /><a href={a.externalUrls.spotify} target="_blank" rel="noopener noreferrer" className="sp-link" style={{ marginTop: 6, padding: "4px 8px" }}>↗</a></>
                        )}
                      </div>
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
            <p style={{ color: "var(--muted)", fontSize: ".82rem" }}>Nothing is currently playing. Start something on Spotify and hit Refresh.</p>
          </div>
        )}

        {!hasResult && !loading && !error && (
          <div className="empty">
            <div className="empty-label">Backend endpoints</div>
            <div className="empty-endpoints">
              {[
                ["/api/spotify/login", "Start OAuth flow"],
                ["/api/spotify/callback?code=", "OAuth callback"],
                ["/api/spotify/track/{id}", "Fetch track by ID"],
                ["/api/spotify/album/{id}", "Fetch album by ID"],
                ["/api/spotify/search?query=&type=", "Search tracks / albums / artists"],
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
