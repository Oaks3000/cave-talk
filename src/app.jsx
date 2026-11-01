const { useState, useEffect, useRef, useCallback } = React;

const TEAM_COLORS = ["#6E9B7A", "#C1502E", "#4E7FA8"];
const TEAM_COLORS_DIM = ["#3E5A47", "#6B2D19", "#2C465A"];
const ROUND_SECONDS = 60;
const FREE_SKIPS = 3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const blankSlots = () => DEFAULT_TEAM_NAMES.map(() => ({ name: "", playerIds: [] }));

function CaveTalk() {
  const [phase, setPhase] = useState("setup");
  const [teamCount, setTeamCount] = useState(2);
  const [store, setStore] = useState(loadStore); // roster, saved teams, win counts
  const [slots, setSlots] = useState(blankSlots); // setup-screen team lines (name text + player ids)
  const [teamNames, setTeamNames] = useState(DEFAULT_TEAM_NAMES); // names locked in for the running game
  const [setupError, setSetupError] = useState("");
  const [sheet, setSheet] = useState(null); // null | "rules" | "leaderboard" | "manage" | {type, slot}
  const [targetScore, setTargetScore] = useState(15);
  const [scores, setScores] = useState([0, 0, 0]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [roundScore, setRoundScore] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [roundEndReason, setRoundEndReason] = useState(null);
  const [shake, setShake] = useState(false);
  const intervalRef = useRef(null);
  const scoresRef = useRef([0, 0, 0]); // always-current scores, so ending a round never reads stale state
  const gameRef = useRef(null); // { teamIds, memberIds } of the running game, for recording the result
  const roundLiveRef = useRef(false); // true while a round is running; stops bonk + timer ending it twice

  // Save the roster / teams / wins whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (e) {
      // storage unavailable (private browsing, etc.) -- the game still works
    }
  }, [store]);

  const playerById = {};
  store.players.forEach((p) => (playerById[p.id] = p));

  // ---- setup helpers ----
  const slotName = (i) => cleanName(slots[i].name) || DEFAULT_TEAM_NAMES[i];
  const updateSlot = (i, patch) => {
    setSlots((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
    setSetupError("");
  };
  // which other (active) team each player is already on: { playerId: teamName }
  const takenByFor = (i) => {
    const m = {};
    for (let j = 0; j < teamCount; j++) {
      if (j !== i) slots[j].playerIds.forEach((id) => (m[id] = slotName(j)));
    }
    return m;
  };
  const togglePlayer = (i, id) => {
    const cur = slots[i].playerIds;
    updateSlot(i, { playerIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  };
  const createPlayer = (i, rawName) => {
    const r = addPlayer(store, rawName);
    const blocked = takenByFor(i)[r.player.id];
    if (!blocked) {
      if (!r.existed) setStore(r.store);
      if (!slots[i].playerIds.includes(r.player.id)) {
        updateSlot(i, { playerIds: [...slots[i].playerIds, r.player.id] });
      }
    }
    return { player: r.player, existed: r.existed, blocked };
  };
  // why a saved team can't be loaded into slot i right now (or "")
  const loadBlockReason = (i, t) => {
    for (let j = 0; j < teamCount; j++) {
      if (j !== i && nameKey(slotName(j)) === nameKey(t.name)) return "Already in this game";
    }
    const taken = takenByFor(i);
    const clash = t.playerIds.find((id) => taken[id]);
    if (clash) return `${playerById[clash].name} is on ${taken[clash]}`;
    return "";
  };
  const loadTeam = (i, t) => {
    updateSlot(i, { name: t.name, playerIds: t.playerIds.filter((id) => playerById[id]) });
    setSheet(null);
  };
  // Typing the name of a saved team into an empty slot loads its players.
  const autoLoadOnBlur = (i) => {
    if (slots[i].playerIds.length) return;
    const t = store.teams.find((x) => nameKey(x.name) === nameKey(slots[i].name));
    if (t && t.playerIds.length && !loadBlockReason(i, t)) {
      updateSlot(i, { name: t.name, playerIds: t.playerIds.filter((id) => playerById[id]) });
    }
  };
  // Deleting a player in Manage must not leave a dangling id on the setup screen.
  useEffect(() => {
    setSlots((prev) => {
      if (prev.every((s) => s.playerIds.every((id) => playerById[id]))) return prev;
      return prev.map((s) => ({ ...s, playerIds: s.playerIds.filter((id) => playerById[id]) }));
    });
  }, [store.players]);

  const drawFrom = useCallback((currentDeck) => {
    if (currentDeck.length === 0) {
      const fresh = shuffle(WORDS);
      return { card: fresh[0], rest: fresh.slice(1) };
    }
    return { card: currentDeck[0], rest: currentDeck.slice(1) };
  }, []);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const changeScore = (team, delta) => {
    const next = [...scoresRef.current];
    next[team] = Math.max(0, next[team] + delta);
    scoresRef.current = next;
    setScores(next);
  };

  // Ends the running round. Safe to call more than once (bonk and the timer can race).
  // The game result is recorded exactly once, here, when a team has reached the target.
  const endRound = useCallback(
    (reason) => {
      if (!roundLiveRef.current) return;
      roundLiveRef.current = false;
      clearTimer();
      setRoundEndReason(reason);
      if (scoresRef.current[currentTeam] >= targetScore) {
        const game = gameRef.current;
        setStore((s) => recordGame(s, game, currentTeam));
        setPhase("gameOver");
      } else {
        setPhase("roundEnd");
      }
    },
    [currentTeam, targetScore]
  );

  useEffect(() => {
    if (phase !== "playing") return;
    intervalRef.current = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return clearTimer;
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && timeLeft <= 0) endRound("time");
  }, [phase, timeLeft, endRound]);

  // Phone-app behaviour: keep the screen awake while a round is running, so the
  // display doesn't dim mid-clue. Re-acquired if the app returns to the foreground.
  useEffect(() => {
    if (phase !== "playing" || !("wakeLock" in navigator)) return;
    let lock = null;
    let cancelled = false;
    const acquire = async () => {
      try {
        const l = await navigator.wakeLock.request("screen");
        if (cancelled) l.release().catch(() => {});
        else lock = l;
      } catch (e) {
        // not allowed (e.g. low battery mode) -- the game still works
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && (!lock || lock.released)) acquire();
    };
    acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      if (lock) lock.release().catch(() => {});
    };
  }, [phase]);

  // Lets the service-worker updater (index.html) know when it's safe to reload
  // into a freshly-installed version: only from the bare setup screen, never mid-game
  // and never while a sheet is open.
  useEffect(() => {
    document.documentElement.dataset.phase = sheet ? "sheet" : phase;
  }, [phase, sheet]);

  const beginGame = () => {
    scoresRef.current = [0, 0, 0];
    setScores([0, 0, 0]);
    setCurrentTeam(0);
    setDeck(shuffle(WORDS));
    setPhase("ready");
  };

  // Locks in the teams (saving each as a reusable team) and starts the game.
  const startGame = () => {
    const active = slots.slice(0, teamCount);
    const names = active.map((_, i) => slotName(i));
    if (new Set(names.map(nameKey)).size !== names.length) {
      setSetupError("Each team needs its own name.");
      return;
    }
    const allIds = active.flatMap((s) => s.playerIds);
    if (new Set(allIds).size !== allIds.length) {
      setSetupError("A player can only be on one team.");
      return;
    }
    let s = store;
    const teamIds = [];
    const memberIds = [];
    const finalNames = [];
    active.forEach((slot, i) => {
      const ids = slot.playerIds.filter((id) => s.players.some((p) => p.id === id));
      const r = commitTeam(s, names[i], ids);
      s = r.store;
      teamIds.push(r.team.id);
      memberIds.push(ids);
      finalNames.push(r.team.name);
    });
    setStore(s);
    gameRef.current = { teamIds, memberIds };
    setTeamNames(finalNames);
    setSetupError("");
    beginGame();
  };

  const startRound = () => {
    const { card, rest } = drawFrom(deck);
    setDeck(rest);
    setCurrentCard(card);
    setTimeLeft(ROUND_SECONDS);
    setRoundScore(0);
    setSkipsUsed(0);
    roundLiveRef.current = true;
    setPhase("playing");
  };

  const handleCorrect = () => {
    changeScore(currentTeam, currentCard.pts);
    setRoundScore((r) => r + currentCard.pts);
    const { card, rest } = drawFrom(deck);
    setDeck(rest);
    setCurrentCard(card);
  };

  const handleSkip = () => {
    const nextSkipCount = skipsUsed + 1;
    setSkipsUsed(nextSkipCount);
    if (nextSkipCount > FREE_SKIPS) {
      changeScore(currentTeam, -1);
      setRoundScore((r) => r - 1);
    }
    const { card, rest } = drawFrom(deck);
    setDeck([...rest, currentCard]);
    setCurrentCard(card);
  };

  const handleBonk = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
    setTimeout(() => endRound("bonk"), 350);
  };

  const nextTurn = () => {
    setCurrentTeam((t) => (t + 1) % teamCount);
    setPhase("ready");
  };

  const playAgain = () => beginGame(); // same teams, fresh game
  const changeTeams = () => setPhase("setup");

  const winner = currentTeam; // a game only ends on the turn of the team that reached the target

  return (
    <div
      className="app-shell w-full flex flex-col items-center"
      style={{ background: "radial-gradient(ellipse at 50% -10%, #2A2118 0%, #1B1712 55%, #100D0A 100%)", color: "#F1E9D8" }}
    >
      <style>{`
        .font-display { font-family: 'Big Shoulders Stencil', sans-serif; letter-spacing: 0.02em; }
        .font-body { font-family: 'Space Grotesk', sans-serif; }
        @keyframes flicker {
          0%,100% { opacity: 1; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.85; transform: scale(1.05) rotate(-2deg); }
          50% { opacity: 0.95; transform: scale(0.97) rotate(2deg); }
          75% { opacity: 0.9; transform: scale(1.03) rotate(-1deg); }
        }
        .flicker { animation: flicker 2.2s ease-in-out infinite; }
        @keyframes shakeAnim {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-10px) rotate(-1deg); }
          40% { transform: translateX(9px) rotate(1deg); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .shake { animation: shakeAnim 0.4s ease-in-out; }
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-in { animation: cardIn 0.25s ease-out; }
        .chisel { text-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 -1px 0 rgba(0,0,0,0.6); }
      `}</style>

      <div className="w-full max-w-md flex-1 flex flex-col px-5 pt-6 pb-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="flicker" size={22} color="#E8A33D" />
            <h1 className="font-display text-3xl chisel" style={{ color: "#F1E9D8" }}>CAVE TALK</h1>
          </div>
          <div className="flex items-center gap-2">
            {phase === "setup" && (
              <button
                onClick={() => setSheet("manage")}
                className="rounded-full p-2 border"
                style={{ borderColor: "#4A4038" }}
                aria-label="Players and teams"
              >
                <Users size={20} color="#C9BBA3" />
              </button>
            )}
            <button
              onClick={() => setSheet("leaderboard")}
              className="rounded-full p-2 border"
              style={{ borderColor: "#4A4038" }}
              aria-label="Leaderboard"
            >
              <Trophy size={20} color="#C9BBA3" />
            </button>
            <button
              onClick={() => setSheet("rules")}
              className="rounded-full p-2 border"
              style={{ borderColor: "#4A4038" }}
              aria-label="Show rules"
            >
              <HelpCircle size={20} color="#C9BBA3" />
            </button>
          </div>
        </div>
        <p className="font-body text-xs mb-6" style={{ color: "#9A8C77" }}>
          One-syllable clues only. Slip up, get bonked.
        </p>

        {/* SETUP */}
        {phase === "setup" && (
          <div className="flex flex-col gap-5 font-body">
            <div>
              <label className="text-xs uppercase tracking-wide" style={{ color: "#9A8C77" }}>Teams</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTeamCount(n)}
                    className="rounded-xl py-3 font-body font-medium"
                    style={{
                      background: teamCount === n ? "#E8A33D" : "#241E18",
                      color: teamCount === n ? "#1B1712" : "#C9BBA3",
                      border: "2px solid #4A4038",
                    }}
                  >
                    {n} Teams
                  </button>
                ))}
              </div>
            </div>

            {Array.from({ length: teamCount }, (_, i) => i).map((i) => {
              const defaultName = DEFAULT_TEAM_NAMES[i];
              const members = slots[i].playerIds.map((id) => playerById[id]).filter(Boolean);
              const savedTeams = store.teams.filter((t) => !isPlaceholderTeam(t));
              const smallBtn = "rounded-full px-3 py-1 text-sm";
              return (
                <div key={i}>
                  <label className="text-xs uppercase tracking-wide" style={{ color: TEAM_COLORS[i] }}>
                    Team {i + 1}
                  </label>
                  <input
                    value={slots[i].name}
                    onChange={(e) => updateSlot(i, { name: e.target.value })}
                    onBlur={() => autoLoadOnBlur(i)}
                    maxLength={20}
                    className="mt-1 w-full rounded-xl px-4 py-3 text-lg font-body outline-none"
                    style={{ background: "#241E18", border: `2px solid ${TEAM_COLORS[i]}`, color: "#F1E9D8" }}
                    placeholder={defaultName}
                  />
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {members.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => togglePlayer(i, p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="rounded-full pl-3 pr-2 py-1 text-sm flex items-center gap-1"
                        style={{ background: TEAM_COLORS[i], color: "#100D0A" }}
                      >
                        {p.name} <X size={12} color="#100D0A" />
                      </button>
                    ))}
                    <button
                      onClick={() => setSheet({ type: "players", slot: i })}
                      className={smallBtn}
                      style={{ border: `1px dashed ${TEAM_COLORS[i]}`, color: TEAM_COLORS[i] }}
                    >
                      + Players
                    </button>
                    {savedTeams.length > 0 && (
                      <button
                        onClick={() => setSheet({ type: "teams", slot: i })}
                        className={smallBtn}
                        style={{ border: "1px solid #4A4038", color: "#C9BBA3" }}
                      >
                        Saved teams
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div>
              <label className="text-xs uppercase tracking-wide" style={{ color: "#9A8C77" }}>Play to</label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {[10, 15, 20, 30].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTargetScore(n)}
                    className="rounded-xl py-3 text-sm font-body font-medium"
                    style={{
                      background: targetScore === n ? "#E8A33D" : "#241E18",
                      color: targetScore === n ? "#1B1712" : "#C9BBA3",
                      border: "2px solid #4A4038",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {setupError && (
              <p className="text-sm text-center -mb-2" style={{ color: "#E8917A" }}>{setupError}</p>
            )}
            <button
              onClick={startGame}
              className="mt-2 rounded-xl py-4 font-display text-2xl flex items-center justify-center gap-2 chisel"
              style={{ background: "#E8A33D", color: "#1B1712" }}
            >
              <Play size={22} /> START GAME
            </button>
          </div>
        )}

        {/* READY (between turns) */}
        {phase === "ready" && (
          <div className="flex-1 flex flex-col">
            <ScoreBar teamNames={teamNames} scores={scores} targetScore={targetScore} currentTeam={currentTeam} teamCount={teamCount} />
            <div className="flex-1 flex flex-col items-center justify-center gap-6 font-body">
              <Users size={36} color={TEAM_COLORS[currentTeam]} />
              <div className="text-center">
                <p className="text-sm" style={{ color: "#9A8C77" }}>Up next</p>
                <p className="font-display text-4xl chisel" style={{ color: TEAM_COLORS[currentTeam] }}>
                  {teamNames[currentTeam]}
                </p>
              </div>
              <p className="text-sm text-center px-6" style={{ color: "#9A8C77" }}>
                Pass the phone to your Wordsmith. 60 seconds, one-syllable clues only.
              </p>
              <button
                onClick={startRound}
                className="rounded-xl px-8 py-4 font-display text-2xl flex items-center gap-2 chisel"
                style={{ background: TEAM_COLORS[currentTeam], color: "#100D0A" }}
              >
                <Play size={22} /> START ROUND
              </button>
            </div>
          </div>
        )}

        {/* PLAYING */}
        {phase === "playing" && currentCard && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 font-body">
              <span className="text-sm" style={{ color: TEAM_COLORS[currentTeam] }}>{teamNames[currentTeam]}</span>
              <span
                className="font-display text-4xl chisel tabular-nums"
                style={{ color: timeLeft <= 10 ? "#C1502E" : "#F1E9D8" }}
              >
                {timeLeft}
              </span>
              <span className="text-sm" style={{ color: "#9A8C77" }}>+{roundScore} this round</span>
            </div>

            <div
              key={currentCard.w}
              className="card-in flex-1 rounded-2xl flex flex-col items-center justify-center px-6 py-10 mb-5"
              style={{ background: "linear-gradient(160deg, #2E2721 0%, #221C17 100%)", border: "1px solid #4A4038" }}
            >
              <span
                className="text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-5 font-body"
                style={{ background: "#3A2F26", color: "#E8A33D" }}
              >
                {currentCard.tier} · {currentCard.pts} pt{currentCard.pts > 1 ? "s" : ""}
              </span>
              <p className="font-display text-5xl text-center chisel leading-tight" style={{ color: "#F1E9D8" }}>
                {currentCard.w}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 font-body">
              <button
                onClick={handleSkip}
                className="rounded-xl py-4 flex flex-col items-center gap-1"
                style={{
                  background: "#241E18",
                  border: `2px solid ${skipsUsed >= FREE_SKIPS ? "#C1502E" : "#4A4038"}`,
                  color: skipsUsed >= FREE_SKIPS ? "#E8917A" : "#C9BBA3",
                }}
              >
                <SkipForward size={20} />
                <span className="text-xs">
                  {skipsUsed >= FREE_SKIPS ? "Skip (-1 pt)" : `Skip (${FREE_SKIPS - skipsUsed} left)`}
                </span>
              </button>
              <button
                onClick={handleCorrect}
                className="rounded-xl py-4 flex flex-col items-center gap-1"
                style={{ background: "#6E9B7A", color: "#10241A" }}
              >
                <Check size={22} />
                <span className="text-xs font-medium">Correct</span>
              </button>
              <button
                onClick={handleBonk}
                className={`rounded-xl py-4 flex flex-col items-center gap-1 ${shake ? "shake" : ""}`}
                style={{ background: "#C1502E", color: "#2A0F08" }}
              >
                <Hammer size={20} />
                <span className="text-xs font-medium">Bonk!</span>
              </button>
            </div>
            <p className="text-center text-xs mt-3" style={{ color: "#6B5F50" }}>
              Other team: bonk the second a multi-syllable word slips out.
            </p>
          </div>
        )}

        {/* ROUND END */}
        {phase === "roundEnd" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 font-body text-center">
            <p className="font-display text-3xl chisel" style={{ color: roundEndReason === "bonk" ? "#C1502E" : "#E8A33D" }}>
              {roundEndReason === "bonk" ? "BONKED!" : "TIME'S UP"}
            </p>
            <p style={{ color: "#C9BBA3" }}>
              {teamNames[currentTeam]} scored <span style={{ color: TEAM_COLORS[currentTeam] }}>+{roundScore}</span> this round
            </p>
            <ScoreBar teamNames={teamNames} scores={scores} targetScore={targetScore} currentTeam={currentTeam} teamCount={teamCount} />
            <button
              onClick={nextTurn}
              className="mt-4 rounded-xl px-8 py-4 font-display text-xl chisel uppercase"
              style={{ background: "#E8A33D", color: "#1B1712" }}
            >
              {teamNames[(currentTeam + 1) % teamCount]}'S TURN
            </button>
          </div>
        )}

        {/* GAME OVER */}
        {phase === "gameOver" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 font-body text-center">
            <Trophy size={48} color={TEAM_COLORS[winner]} />
            <p className="font-display text-4xl chisel uppercase" style={{ color: TEAM_COLORS[winner] }}>
              {teamNames[winner]} WINS
            </p>
            <p style={{ color: "#C9BBA3" }} className="flex items-center gap-3">
              {Array.from({ length: teamCount }, (_, i) => i).map((i) => (
                <span key={i} style={{ color: i === winner ? TEAM_COLORS[i] : "#C9BBA3" }}>
                  {teamNames[i]} {scores[i]}
                </span>
              ))}
            </p>
            <button
              onClick={playAgain}
              className="mt-4 rounded-xl px-8 py-4 font-display text-xl flex items-center gap-2 chisel"
              style={{ background: "#E8A33D", color: "#1B1712" }}
            >
              <RotateCcw size={20} /> PLAY AGAIN
            </button>
            <button
              onClick={changeTeams}
              className="rounded-xl px-6 py-3 font-body text-sm"
              style={{ border: "2px solid #4A4038", color: "#C9BBA3" }}
            >
              Change teams
            </button>
          </div>
        )}
      </div>

      {sheet === "rules" && <RulesSheet onClose={() => setSheet(null)} />}
      {sheet === "leaderboard" && (
        <LeaderboardSheet store={store} onReset={() => setStore(resetStats(store))} onClose={() => setSheet(null)} />
      )}
      {sheet === "manage" && (
        <ManageSheet store={store} setStore={setStore} onClose={() => setSheet(null)} />
      )}
      {sheet && sheet.type === "players" && (
        <PlayerPickerSheet
          teamName={slotName(sheet.slot)}
          color={TEAM_COLORS[sheet.slot]}
          players={store.players}
          selectedIds={slots[sheet.slot].playerIds}
          takenBy={takenByFor(sheet.slot)}
          onToggle={(id) => togglePlayer(sheet.slot, id)}
          onCreate={(name) => createPlayer(sheet.slot, name)}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet && sheet.type === "teams" && (
        <SavedTeamsSheet
          teams={store.teams.filter((t) => !isPlaceholderTeam(t))}
          playerById={playerById}
          blockedReason={(t) => loadBlockReason(sheet.slot, t)}
          onLoad={(t) => loadTeam(sheet.slot, t)}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
}

function ScoreBar({ teamNames, scores, targetScore, currentTeam, teamCount }) {
  return (
    <div className="flex gap-3 mb-2 font-body">
      {Array.from({ length: teamCount }, (_, i) => i).map((i) => (
        <div
          key={i}
          className="flex-1 rounded-xl px-3 py-2"
          style={{
            background: "#241E18",
            border: `2px solid ${i === currentTeam ? TEAM_COLORS[i] : "#3A322A"}`,
          }}
        >
          <p className="text-xs truncate" style={{ color: TEAM_COLORS[i] }}>{teamNames[i]}</p>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-2xl chisel" style={{ color: "#F1E9D8" }}>{scores[i]}</span>
            <span className="text-[10px]" style={{ color: "#6B5F50" }}>/ {targetScore}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CaveTalk />);
