// Persisted data: the player roster, saved teams and win counts.
//
// Players and teams have ids, and stats hang off the ids, so a person can only
// exist once however their name is typed ("oak", "Oak " and "OAK" are all the
// same player). Everything here is pure: functions take a store and return a new one.
//
//   store = {
//     v: 2,
//     players: [{ id, name }],
//     teams:   [{ id, name, playerIds: [] }],
//     stats:   { players: { [id]: { wins, played } }, teams: { [id]: { wins, played } } }
//   }
//
// "Score" in this app means GAMES WON. Correct guesses only count inside a game.

const STORE_KEY = "cavetalk:v2";
const OLD_TEAM_KEY = "cavetalk:stats:teams"; // v1 stored win counts keyed by typed name
const OLD_PLAYER_KEY = "cavetalk:stats:players";
const DEFAULT_TEAM_NAMES = ["Team A", "Team B", "Team C"];

const cleanName = (s) => (s || "").replace(/\s+/g, " ").trim();
const nameKey = (s) => cleanName(s).toLowerCase();

let idSeq = 0;
const newId = () => Date.now().toString(36) + (idSeq++).toString(36) + Math.random().toString(36).slice(2, 6);

const emptyStore = () => ({ v: 2, players: [], teams: [], stats: { players: {}, teams: {} } });

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.v === 2 && Array.isArray(s.players) && Array.isArray(s.teams) && s.stats) return s;
    }
  } catch (e) {
    // fall through to a fresh / migrated store
  }
  return migrateV1();
}

// Version 1 kept { "Oak": { wins, played } } by name. Fold those into the roster
// (merging names that differ only by case/spacing) so nobody loses their history.
function migrateV1() {
  const store = emptyStore();
  const readOld = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      return {};
    }
  };
  const fold = (oldStats, list, statsKey, makeItem) => {
    Object.keys(oldStats).forEach((rawName) => {
      const name = cleanName(rawName);
      if (!name) return;
      let item = list.find((x) => nameKey(x.name) === nameKey(name));
      if (!item) {
        item = makeItem(name);
        list.push(item);
      }
      const st = oldStats[rawName] || {};
      store.stats[statsKey] = bumpStats(store.stats[statsKey], item.id, st.wins | 0, st.played | 0);
    });
  };
  fold(readOld(OLD_PLAYER_KEY), store.players, "players", (name) => ({ id: newId(), name }));
  fold(readOld(OLD_TEAM_KEY), store.teams, "teams", (name) => ({ id: newId(), name, playerIds: [] }));
  return store;
}

function bumpStats(map, id, wins, played) {
  const cur = map[id] || { wins: 0, played: 0 };
  return { ...map, [id]: { wins: cur.wins + wins, played: cur.played + played } };
}

// ---- roster ----------------------------------------------------------------

// Finds the player with this name (ignoring case/spacing) or creates them.
function addPlayer(store, rawName) {
  const name = cleanName(rawName);
  const existing = store.players.find((p) => nameKey(p.name) === nameKey(name));
  if (existing) return { store, player: existing, existed: true };
  const player = { id: newId(), name };
  return { store: { ...store, players: [...store.players, player] }, player, existed: false };
}

// Names are unique, so a rename that matches someone else is refused (never merged).
// Returns { error } | { store }
function renamePlayer(store, id, rawName) {
  const name = cleanName(rawName);
  if (!name) return { error: "Enter a name" };
  if (store.players.some((p) => p.id !== id && nameKey(p.name) === nameKey(name))) {
    return { error: "Someone with that name already exists" };
  }
  return { store: { ...store, players: store.players.map((p) => (p.id === id ? { ...p, name } : p)) } };
}

function deletePlayer(store, id) {
  const stats = { ...store.stats.players };
  delete stats[id];
  return {
    ...store,
    players: store.players.filter((p) => p.id !== id),
    teams: store.teams.map((t) => ({ ...t, playerIds: t.playerIds.filter((x) => x !== id) })),
    stats: { ...store.stats, players: stats },
  };
}

// ---- saved teams -----------------------------------------------------------

// Saves (or updates) the team with this name and its current line-up.
function commitTeam(store, rawName, playerIds) {
  const name = cleanName(rawName);
  const ids = playerIds.filter((id) => store.players.some((p) => p.id === id));
  const existing = store.teams.find((t) => nameKey(t.name) === nameKey(name));
  if (existing) {
    const team = { ...existing, playerIds: ids };
    return { store: { ...store, teams: store.teams.map((t) => (t.id === team.id ? team : t)) }, team };
  }
  const team = { id: newId(), name, playerIds: ids };
  return { store: { ...store, teams: [...store.teams, team] }, team };
}

// Returns { error } | { store }
function renameTeam(store, id, rawName) {
  const name = cleanName(rawName);
  if (!name) return { error: "Enter a name" };
  if (store.teams.some((t) => t.id !== id && nameKey(t.name) === nameKey(name))) {
    return { error: "A team with that name already exists" };
  }
  return { store: { ...store, teams: store.teams.map((t) => (t.id === id ? { ...t, name } : t)) } };
}

function deleteTeam(store, id) {
  const stats = { ...store.stats.teams };
  delete stats[id];
  return {
    ...store,
    teams: store.teams.filter((t) => t.id !== id),
    stats: { ...store.stats, teams: stats },
  };
}

// A team nobody would want in a "saved teams" list: an unchanged default with no players.
const isPlaceholderTeam = (t) =>
  t.playerIds.length === 0 && DEFAULT_TEAM_NAMES.some((n) => nameKey(n) === nameKey(t.name));

// ---- results ---------------------------------------------------------------

// Called once when a game finishes. game = { teamIds: [...], memberIds: [[...], ...] }
// Every team and player in the game gets +1 played; the winners also get +1 win.
function recordGame(store, game, winnerIdx) {
  if (!game) return store;
  let teams = store.stats.teams;
  let players = store.stats.players;
  game.teamIds.forEach((teamId, i) => {
    const won = i === winnerIdx ? 1 : 0;
    teams = bumpStats(teams, teamId, won, 1);
    game.memberIds[i].forEach((pid) => {
      players = bumpStats(players, pid, won, 1);
    });
  });
  return { ...store, stats: { players, teams } };
}

const resetStats = (store) => ({ ...store, stats: { players: {}, teams: {} } });
