const { useState, useEffect, useRef, useCallback } = React;

const TEAM_COLORS = ["#6E9B7A", "#C1502E", "#4E7FA8"];
const TEAM_COLORS_DIM = ["#3E5A47", "#6B2D19", "#2C465A"];
const ROUND_SECONDS = 60;
const FREE_SKIPS = 3;
const STORAGE_TEAM_KEY = "cavetalk:stats:teams";
const STORAGE_PLAYER_KEY = "cavetalk:stats:players";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CaveTalk() {
  const [phase, setPhase] = useState("setup");
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState(["Team A", "Team B", "Team C"]);
  const [teamPlayers, setTeamPlayers] = useState(["", "", ""]);
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
  const [showRules, setShowRules] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [teamStats, setTeamStats] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [statsLoaded, setStatsLoaded] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_TEAM_KEY);
      if (t) setTeamStats(JSON.parse(t));
    } catch (e) {
      // no team stats saved yet
    }
    try {
      const p = localStorage.getItem(STORAGE_PLAYER_KEY);
      if (p) setPlayerStats(JSON.parse(p));
    } catch (e) {
      // no player stats saved yet
    }
    setStatsLoaded(true);
  }, []);

  const saveStats = (key, obj) => {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      // storage unavailable (private browsing, etc.) -- fail silently
    }
  };

  const parsePlayers = (str) =>
    (str || "").split(",").map((s) => s.trim()).filter(Boolean);

  const recordMatchStart = () => {
    const activeTeamNames = teamNames.slice(0, teamCount);
    const allPlayers = teamPlayers.slice(0, teamCount).flatMap(parsePlayers);
    setTeamStats((prev) => {
      const next = { ...prev };
      activeTeamNames.forEach((name) => {
        const cur = next[name] || { wins: 0, played: 0 };
        next[name] = { ...cur, played: cur.played + 1 };
      });
      saveStats(STORAGE_TEAM_KEY, next);
      return next;
    });
    if (allPlayers.length) {
      setPlayerStats((prev) => {
        const next = { ...prev };
        allPlayers.forEach((name) => {
          const cur = next[name] || { wins: 0, played: 0 };
          next[name] = { ...cur, played: cur.played + 1 };
        });
        saveStats(STORAGE_PLAYER_KEY, next);
        return next;
      });
    }
  };

  const recordWin = (winnerIdx) => {
    const winnerName = teamNames[winnerIdx];
    setTeamStats((prev) => {
      const next = { ...prev };
      const cur = next[winnerName] || { wins: 0, played: 0 };
      next[winnerName] = { ...cur, wins: cur.wins + 1 };
      saveStats(STORAGE_TEAM_KEY, next);
      return next;
    });
    const winners = parsePlayers(teamPlayers[winnerIdx]);
    if (winners.length) {
      setPlayerStats((prev) => {
        const next = { ...prev };
        winners.forEach((name) => {
          const cur = next[name] || { wins: 0, played: 0 };
          next[name] = { ...cur, wins: cur.wins + 1 };
        });
        saveStats(STORAGE_PLAYER_KEY, next);
        return next;
      });
    }
  };

  const resetStats = () => {
    setTeamStats({});
    setPlayerStats({});
    saveStats(STORAGE_TEAM_KEY, {});
    saveStats(STORAGE_PLAYER_KEY, {});
  };

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

  const endRound = useCallback((reason) => {
    clearTimer();
    setRoundEndReason(reason);
    setScores((prev) => {
      const next = [...prev];
      if (next[currentTeam] >= targetScore) {
        setPhase("gameOver");
        recordWin(currentTeam);
      } else {
        setPhase("roundEnd");
      }
      return next;
    });
  }, [currentTeam, targetScore, teamNames, teamPlayers, teamCount]);

  useEffect(() => {
    if (phase !== "playing") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endRound("time");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, endRound]);

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
  // into a freshly-installed version: only from the setup screen, never mid-game.
  useEffect(() => {
    document.documentElement.dataset.phase = phase;
  }, [phase]);

  const startGame = () => {
    setScores(Array(teamCount).fill(0));
    setCurrentTeam(0);
    setDeck(shuffle(WORDS));
    recordMatchStart();
    setPhase("ready");
  };

  const startRound = () => {
    const { card, rest } = drawFrom(deck);
    setDeck(rest);
    setCurrentCard(card);
    setTimeLeft(ROUND_SECONDS);
    setRoundScore(0);
    setSkipsUsed(0);
    setPhase("playing");
  };

  const handleCorrect = () => {
    setScores((prev) => {
      const next = [...prev];
      next[currentTeam] += currentCard.pts;
      return next;
    });
    setRoundScore((r) => r + currentCard.pts);
    const { card, rest } = drawFrom(deck);
    setDeck(rest);
    setCurrentCard(card);
  };

  const handleSkip = () => {
    const nextSkipCount = skipsUsed + 1;
    setSkipsUsed(nextSkipCount);
    const penalized = nextSkipCount > FREE_SKIPS;
    if (penalized) {
      setScores((prev) => {
        const next = [...prev];
        next[currentTeam] = Math.max(0, next[currentTeam] - 1);
        return next;
      });
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

  const playAgain = () => {
    setScores(Array(teamCount).fill(0));
    setCurrentTeam(0);
    setDeck(shuffle(WORDS));
    recordMatchStart();
    setPhase("ready");
  };

  const winner = scores.slice(0, teamCount).findIndex((s) => s >= targetScore);
  const hasWinner = winner !== -1;

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
            <button
              onClick={() => setShowLeaderboard(true)}
              className="rounded-full p-2 border"
              style={{ borderColor: "#4A4038" }}
              aria-label="Leaderboard"
            >
              <Trophy size={20} color="#C9BBA3" />
            </button>
            <button
              onClick={() => setShowRules(true)}
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
              const defaultName = ["Team A", "Team B", "Team C"][i];
              return (
                <div key={i}>
                  <label className="text-xs uppercase tracking-wide" style={{ color: TEAM_COLORS[i] }}>
                    Team {i + 1}
                  </label>
                  <input
                    value={teamNames[i]}
                    onChange={(e) => {
                      const next = [...teamNames];
                      next[i] = e.target.value || defaultName;
                      setTeamNames(next);
                    }}
                    className="mt-1 w-full rounded-xl px-4 py-3 text-lg font-body outline-none"
                    style={{ background: "#241E18", border: `2px solid ${TEAM_COLORS[i]}`, color: "#F1E9D8" }}
                    placeholder={defaultName}
                  />
                  <input
                    value={teamPlayers[i]}
                    onChange={(e) => {
                      const next = [...teamPlayers];
                      next[i] = e.target.value;
                      setTeamPlayers(next);
                    }}
                    className="mt-2 w-full rounded-xl px-4 py-2 text-base font-body outline-none"
                    style={{ background: "#1D1712", border: "1px solid #3A322A", color: "#C9BBA3" }}
                    placeholder="Players (optional, comma separated)"
                  />
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

            <button
              onClick={startGame}
              className="mt-4 rounded-xl py-4 font-display text-2xl flex items-center justify-center gap-2 chisel"
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
        {phase === "gameOver" && hasWinner && (
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
          </div>
        )}
      </div>

      {/* RULES OVERLAY */}
      {showRules && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowRules(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto rounded-t-2xl p-6 safe-bottom font-body max-h-[80vh] overflow-y-auto"
            style={{ background: "#211B16", border: "1px solid #4A4038" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-2xl chisel" style={{ color: "#F1E9D8" }}>HOW TO PLAY</p>
              <button onClick={() => setShowRules(false)}><X size={22} color="#C9BBA3" /></button>
            </div>
            <ul className="text-sm space-y-3" style={{ color: "#C9BBA3" }}>
              <li>• One player (the Wordsmith) sees a word and must get their team to guess it in 60 seconds.</li>
              <li>• Clues can only use <b>one-syllable words</b>. "A," "the," "of" are fine.</li>
              <li>• No rhyming, no spelling, no sounds-like clues.</li>
              <li>• The <b>other team</b> listens closely — the moment a multi-syllable word slips out, they tap <b>Bonk!</b> The card is lost and the turn ends immediately.</li>
              <li>• Tap <b>Skip</b> to pass a hard card to the back of the deck. You get 3 free skips per turn — after that, every skip costs your team 1 point.</li>
              <li>• Tap <b>Correct</b> the instant your team guesses right — points add up live.</li>
              <li>• First team to the target score wins.</li>
            </ul>
          </div>
        </div>
      )}

      {/* LEADERBOARD OVERLAY */}
      {showLeaderboard && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => {
            setShowLeaderboard(false);
            setConfirmReset(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto rounded-t-2xl p-6 safe-bottom font-body max-h-[80vh] overflow-y-auto"
            style={{ background: "#211B16", border: "1px solid #4A4038" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-2xl chisel" style={{ color: "#F1E9D8" }}>LEADERBOARD</p>
              <button
                onClick={() => {
                  setShowLeaderboard(false);
                  setConfirmReset(false);
                }}
              >
                <X size={22} color="#C9BBA3" />
              </button>
            </div>

            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#9A8C77" }}>Teams</p>
            <div className="space-y-2 mb-5">
              {Object.entries(teamStats)
                .sort((a, b) => b[1].wins - a[1].wins)
                .map(([name, s]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: "#241E18" }}
                  >
                    <span style={{ color: "#F1E9D8" }}>{name}</span>
                    <span className="text-sm" style={{ color: "#E8A33D" }}>
                      {s.wins}W · {s.played}P
                    </span>
                  </div>
                ))}
              {Object.keys(teamStats).length === 0 && (
                <p className="text-sm" style={{ color: "#6B5F50" }}>No games recorded yet.</p>
              )}
            </div>

            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#9A8C77" }}>Players</p>
            <div className="space-y-2 mb-5">
              {Object.entries(playerStats)
                .sort((a, b) => b[1].wins - a[1].wins)
                .map(([name, s]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: "#241E18" }}
                  >
                    <span style={{ color: "#F1E9D8" }}>{name}</span>
                    <span className="text-sm" style={{ color: "#E8A33D" }}>
                      {s.wins}W · {s.played}P
                    </span>
                  </div>
                ))}
              {Object.keys(playerStats).length === 0 && (
                <p className="text-sm" style={{ color: "#6B5F50" }}>
                  Add player names at setup (comma separated) to track individuals.
                </p>
              )}
            </div>

            <button
              onClick={() => {
                if (confirmReset) {
                  resetStats();
                  setConfirmReset(false);
                } else {
                  setConfirmReset(true);
                }
              }}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-sm"
              style={{
                background: confirmReset ? "#C1502E" : "#241E18",
                color: confirmReset ? "#2A0F08" : "#C9BBA3",
                border: "2px solid #4A4038",
              }}
            >
              <Trash2 size={16} /> {confirmReset ? "Tap again to confirm reset" : "Reset stats"}
            </button>
            <p className="text-xs text-center mt-3" style={{ color: "#6B5F50" }}>
              Stats are saved on this device and persist across games.
            </p>
          </div>
        </div>
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
