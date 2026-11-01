// Bottom sheets: rules, add players, saved teams, manage people & teams, leaderboard.

const byName = (a, b) => a.name.localeCompare(b.name);
const pct = (wins, played) => (played ? Math.round((wins / played) * 100) : 0);

function Sheet({ title, subtitle, subtitleColor, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-auto rounded-t-2xl p-6 safe-bottom font-body max-h-[85vh] overflow-y-auto"
        style={{ background: "#211B16", border: "1px solid #4A4038" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-display text-2xl chisel uppercase" style={{ color: "#F1E9D8" }}>{title}</p>
            {subtitle && (
              <p className="text-sm" style={{ color: subtitleColor || "#9A8C77" }}>{subtitle}</p>
            )}
          </div>
          <button onClick={onClose} aria-label="Close"><X size={22} color="#C9BBA3" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SheetDoneButton({ onClick, label = "DONE" }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl py-3 font-display text-xl chisel"
      style={{ background: "#E8A33D", color: "#1B1712" }}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------- rules

function RulesSheet({ onClose }) {
  return (
    <Sheet title="How to play" onClose={onClose}>
      <ul className="text-sm space-y-3" style={{ color: "#C9BBA3" }}>
        <li>• One player (the Wordsmith) sees a word and must get their team to guess it in 60 seconds.</li>
        <li>• Clues can only use <b>one-syllable words</b>. "A," "the," "of" are fine.</li>
        <li>• No rhyming, no spelling, no sounds-like clues.</li>
        <li>• The <b>other team</b> listens closely — the moment a multi-syllable word slips out, they tap <b>Bonk!</b> The card is lost and the turn ends immediately.</li>
        <li>• Tap <b>Skip</b> to pass a hard card to the back of the deck. You get 3 free skips per turn — after that, every skip costs your team 1 point.</li>
        <li>• Tap <b>Correct</b> the instant your team guesses right — points add up live.</li>
        <li>• First team to the target score wins the game.</li>
        <li>• The leaderboard counts <b>games won</b>, not correct guesses.</li>
      </ul>
    </Sheet>
  );
}

// ---------------------------------------------------------------- add players to a team

// Pick from everyone created so far, or create someone new. Names are unique
// (ignoring case), so typing "oak" when "Oak" exists just selects Oak.
function PlayerPickerSheet({ teamName, color, players, selectedIds, takenBy, onToggle, onCreate, onClose }) {
  const [text, setText] = useState("");
  const [note, setNote] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const name = cleanName(text);
    if (!name) return;
    const r = onCreate(name);
    setText("");
    if (r.blocked) setNote(`${r.player.name} is already on ${r.blocked}.`);
    else if (r.existed) setNote(`${r.player.name} is already on your player list, so that entry was used.`);
    else setNote(`Added ${r.player.name}.`);
  };

  return (
    <Sheet title="Add players" subtitle={teamName} subtitleColor={color} onClose={onClose}>
      <form onSubmit={submit} className="flex gap-2 mb-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={20}
          autoCapitalize="words"
          enterKeyHint="done"
          placeholder="New player name"
          className="flex-1 min-w-0 rounded-xl px-4 py-3 text-base font-body outline-none"
          style={{ background: "#241E18", border: "2px solid #4A4038", color: "#F1E9D8" }}
        />
        <button
          type="submit"
          className="rounded-xl px-5 font-medium"
          style={{ background: color, color: "#100D0A" }}
        >
          Add
        </button>
      </form>
      <p className="text-xs mb-4" style={{ color: "#9A8C77", minHeight: "1rem" }}>{note}</p>

      {players.length === 0 ? (
        <p className="text-sm mb-5" style={{ color: "#6B5F50" }}>
          No players yet. Type a name above to create the first one. Once created, anyone can be picked here in any future game.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-5">
          {players.slice().sort(byName).map((p) => {
            const selected = selectedIds.includes(p.id);
            const elsewhere = takenBy[p.id];
            return (
              <button
                key={p.id}
                disabled={!!elsewhere}
                onClick={() => onToggle(p.id)}
                className="rounded-full px-4 py-2 text-base"
                style={{
                  background: selected ? color : "#2A231C",
                  color: selected ? "#100D0A" : "#F1E9D8",
                  border: `1px solid ${selected ? color : "#4A4038"}`,
                  opacity: elsewhere ? 0.4 : 1,
                }}
              >
                {p.name}
                {elsewhere ? <span className="text-xs"> · {elsewhere}</span> : null}
              </button>
            );
          })}
        </div>
      )}
      <SheetDoneButton onClick={onClose} />
    </Sheet>
  );
}

// ---------------------------------------------------------------- load a saved team

function SavedTeamsSheet({ teams, playerById, blockedReason, onLoad, onClose }) {
  return (
    <Sheet title="Saved teams" subtitle="Tap one to fill this team in" onClose={onClose}>
      <div className="space-y-2">
        {teams.slice().sort(byName).map((t) => {
          const why = blockedReason(t);
          const members = t.playerIds.map((id) => playerById[id] && playerById[id].name).filter(Boolean);
          return (
            <button
              key={t.id}
              disabled={!!why}
              onClick={() => onLoad(t)}
              className="w-full text-left rounded-xl px-4 py-3"
              style={{ background: "#241E18", border: "1px solid #4A4038", opacity: why ? 0.45 : 1 }}
            >
              <p className="text-base" style={{ color: "#F1E9D8" }}>{t.name}</p>
              <p className="text-xs" style={{ color: "#9A8C77" }}>
                {why || (members.length ? members.join(", ") : "No players saved")}
              </p>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------- manage people & teams

// One list row that can be renamed (to fix a typo) or deleted.
// onRename(value) returns null on success or an error string.
function EditableRow({ name, sub, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(name);
  const [err, setErr] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    if (!confirmDel) return;
    const t = setTimeout(() => setConfirmDel(false), 3000);
    return () => clearTimeout(t);
  }, [confirmDel]);

  const stop = () => {
    setEditing(false);
    setErr("");
  };
  const save = () => {
    const r = onRename(val);
    if (!r) return stop();
    setErr(r);
  };

  const small = "text-xs rounded-full px-3 py-1";
  if (editing) {
    return (
      <div className="rounded-lg px-3 py-3" style={{ background: "#241E18", border: "1px solid #4A4038" }}>
        <input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setErr("");
          }}
          maxLength={20}
          autoFocus
          className="w-full rounded-lg px-3 py-2 text-base font-body outline-none"
          style={{ background: "#1D1712", border: "1px solid #6B5F50", color: "#F1E9D8" }}
        />
        {err && <p className="text-xs mt-2" style={{ color: "#E8917A" }}>{err}</p>}
        <div className="flex gap-2 mt-3">
          <button onClick={save} className={small} style={{ background: "#E8A33D", color: "#1B1712" }}>
            Save
          </button>
          <button onClick={stop} className={small} style={{ border: "1px solid #4A4038", color: "#C9BBA3" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2" style={{ background: "#241E18" }}>
      <div className="min-w-0">
        <p className="truncate" style={{ color: "#F1E9D8" }}>{name}</p>
        {sub && <p className="text-xs truncate" style={{ color: "#9A8C77" }}>{sub}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => {
            setVal(name);
            setEditing(true);
            setConfirmDel(false);
          }}
          className={small}
          style={{ border: "1px solid #4A4038", color: "#C9BBA3" }}
        >
          Edit
        </button>
        <button
          onClick={() => (confirmDel ? onDelete() : setConfirmDel(true))}
          className={small}
          style={{
            border: `1px solid ${confirmDel ? "#C1502E" : "#4A4038"}`,
            background: confirmDel ? "#C1502E" : "transparent",
            color: confirmDel ? "#2A0F08" : "#C9BBA3",
          }}
        >
          {confirmDel ? "Tap to confirm" : "Delete"}
        </button>
      </div>
    </div>
  );
}

function ManageSheet({ store, setStore, onClose }) {
  const playerById = {};
  store.players.forEach((p) => (playerById[p.id] = p));
  const teamsOf = (pid) => store.teams.filter((t) => t.playerIds.includes(pid)).map((t) => t.name);

  return (
    <Sheet title="Players & teams" onClose={onClose}>
      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#9A8C77" }}>
        Players ({store.players.length})
      </p>
      <div className="space-y-2 mb-5">
        {store.players.slice().sort(byName).map((p) => (
          <EditableRow
            key={p.id}
            name={p.name}
            sub={teamsOf(p.id).join(", ")}
            onRename={(v) => {
              const r = renamePlayer(store, p.id, v);
              if (r.error) return r.error;
              setStore(r.store);
              return null;
            }}
            onDelete={() => setStore(deletePlayer(store, p.id))}
          />
        ))}
        {store.players.length === 0 && (
          <p className="text-sm" style={{ color: "#6B5F50" }}>
            No players yet. Add them from a team on the setup screen.
          </p>
        )}
      </div>

      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#9A8C77" }}>
        Saved teams ({store.teams.length})
      </p>
      <div className="space-y-2 mb-5">
        {store.teams.slice().sort(byName).map((t) => (
          <EditableRow
            key={t.id}
            name={t.name}
            sub={t.playerIds.map((id) => playerById[id] && playerById[id].name).filter(Boolean).join(", ")}
            onRename={(v) => {
              const r = renameTeam(store, t.id, v);
              if (r.error) return r.error;
              setStore(r.store);
              return null;
            }}
            onDelete={() => setStore(deleteTeam(store, t.id))}
          />
        ))}
        {store.teams.length === 0 && (
          <p className="text-sm" style={{ color: "#6B5F50" }}>
            Teams are saved automatically when you start a game.
          </p>
        )}
      </div>

      <p className="text-xs mb-4" style={{ color: "#6B5F50" }}>
        Players are created once and picked from the list from then on. Rename fixes a typo; deleting a player or team also removes their win record.
      </p>
      <SheetDoneButton onClick={onClose} />
    </Sheet>
  );
}

// ---------------------------------------------------------------- leaderboard

function LeaderRows({ rows, color, empty }) {
  if (rows.length === 0) return <p className="text-sm" style={{ color: "#6B5F50" }}>{empty}</p>;
  let rank = 0;
  return (
    <div className="space-y-2">
      {rows.map((r, i) => {
        // tied rows share a rank
        if (i === 0 || r.wins !== rows[i - 1].wins || r.played !== rows[i - 1].played) rank = i + 1;
        return (
          <div key={r.id} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: "#241E18" }}>
            <span className="font-display text-xl w-6 text-center" style={{ color: rank === 1 ? color : "#6B5F50" }}>{rank}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate" style={{ color: "#F1E9D8" }}>{r.name}</p>
              <p className="text-xs truncate" style={{ color: "#9A8C77" }}>
                {r.played} game{r.played === 1 ? "" : "s"} · {pct(r.wins, r.played)}% won
                {r.sub ? ` · ${r.sub}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-3xl leading-none chisel" style={{ color: "#E8A33D" }}>{r.wins}</p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "#9A8C77" }}>win{r.wins === 1 ? "" : "s"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeaderboardSheet({ store, onReset, onClose }) {
  const [confirm, setConfirm] = useState(false);
  const playerById = {};
  store.players.forEach((p) => (playerById[p.id] = p));

  const rank = (items, statsMap, extra) =>
    items
      .map((it) => {
        const s = statsMap[it.id] || { wins: 0, played: 0 };
        return { id: it.id, name: it.name, wins: s.wins, played: s.played, sub: extra ? extra(it) : "" };
      })
      .filter((r) => r.played > 0)
      .sort((a, b) => b.wins - a.wins || pct(b.wins, b.played) - pct(a.wins, a.played) || b.played - a.played || a.name.localeCompare(b.name));

  const teamRows = rank(store.teams, store.stats.teams, (t) =>
    t.playerIds.map((id) => playerById[id] && playerById[id].name).filter(Boolean).join(", ")
  );
  const playerRows = rank(store.players, store.stats.players);

  return (
    <Sheet title="Leaderboard" subtitle="Score = games won" onClose={onClose}>
      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#9A8C77" }}>Teams</p>
      <div className="mb-5">
        <LeaderRows rows={teamRows} color={TEAM_COLORS[0]} empty="No finished games yet." />
      </div>

      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#9A8C77" }}>Players</p>
      <div className="mb-5">
        <LeaderRows
          rows={playerRows}
          color={TEAM_COLORS[0]}
          empty="No players have finished a game yet. Add players to a team on the setup screen."
        />
      </div>

      <button
        onClick={() => {
          if (confirm) {
            onReset();
            setConfirm(false);
          } else setConfirm(true);
        }}
        className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-sm"
        style={{
          background: confirm ? "#C1502E" : "#241E18",
          color: confirm ? "#2A0F08" : "#C9BBA3",
          border: "2px solid #4A4038",
        }}
      >
        <Trash2 size={16} /> {confirm ? "Tap again: wins reset, players and teams kept" : "Reset win counts"}
      </button>
      <p className="text-xs text-center mt-3" style={{ color: "#6B5F50" }}>
        Only finished games count, and only the winning team and its players get a win. Saved on this device.
      </p>
    </Sheet>
  );
}
