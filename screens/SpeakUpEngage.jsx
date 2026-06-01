// Speak Up sub-tabs: Earn points (activity list), Badges, Leaderboard, Rewards.

const CAT_ORDER = ['Feedback', 'Events', 'Township meetings', 'Community', 'Platform feedback'];
const CAT_ICON = { 'Feedback': 'speak', 'Events': 'cal', 'Township meetings': 'decide', 'Community': 'me', 'Platform feedback': 'settings' };

// === Tab 3: Earn points (replaces Bingo) ===
function EarnPoints() {
  const { state, dispatch, nav, guardedSubmit } = window.useStore();
  const { Icon, SketchyButton, Field, LikertScale, FeedbackValueReminder } = window.CC_UI;
  const D = window.CC_DATA;
  const opted = state.engagesOptedIn;
  const [filter, setFilter] = React.useState('All');
  const [sort, setSort] = React.useState('points');
  const [modal, setModal] = React.useState(null); // activity being completed via rating
  const [rating, setRating] = React.useState(0);
  const [text, setText] = React.useState('');
  const [confirmId, setConfirmId] = React.useState(null);
  const focus = state.route.focus;

  const done = state.completedActivities || {};
  const available = D.earnActivities.filter(a => !done[a.id]);
  const completed = D.earnActivities.filter(a => done[a.id]);

  const FILTERS = ['All', 'Quick wins (under 5 min)', 'Feedback', 'Events', 'Township meetings', 'Community'];
  const passesFilter = (a) => {
    if (filter === 'All') return true;
    if (filter === 'Quick wins (under 5 min)') return a.mins != null && a.mins < 5;
    return a.cat === filter;
  };
  const filtered = available.filter(passesFilter);

  const sortFn = (a, b) => {
    if (sort === 'points') return b.points - a.points;
    if (sort === 'time') return (a.mins == null ? 1e6 : a.mins) - (b.mins == null ? 1e6 : b.mins);
    if (sort === 'recent') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sort === 'expiring') return (a.deadline ? 0 : 1) - (b.deadline ? 0 : 1);
    return 0;
  };

  // Group filtered list by category, preserving CAT_ORDER; sort within group.
  const groups = CAT_ORDER.map(cat => ({
    cat,
    items: filtered.filter(a => a.cat === cat).sort(sortFn)
  })).filter(g => g.items.length);

  const timeLabel = (a) => a.minsLabel || (a.mins == null ? '-' : a.mins >= 60 ? `${a.mins} min` : `${a.mins} min`);

  const openActivity = (a) => {
    if (a.rating) { setModal(a); setRating(0); setText(''); return; }
    if (a.route) { nav(a.route); return; }
  };

  const submitRating = () => guardedSubmit(() => {
    dispatch({ type: 'EARN_ACTIVITY', id: modal.id, points: modal.points });
    setConfirmId(modal.id);
  });

  const totalAvailable = available.length;

  return (
    <div>
      {/* Header strip */}
      <div data-tour="earn-list" style={{ padding: '12px 14px', background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 14.5, color: '#7A5A00', fontWeight: 700, lineHeight: 1.4 }}>
          {opted
            ? <>You have earned <strong>{state.points} points</strong> this period. There are <strong>{totalAvailable} more activities</strong> available to earn from.</>
            : <>There are <strong>{totalAvailable} ways</strong> to weigh in right now. Pick anything below to get started.</>}
        </div>
      </div>

      <FeedbackValueReminder />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 8 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, padding: '6px 12px', minHeight: 32,
            border: '1.5px solid #1F3864', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap',
            background: filter === f ? '#1F3864' : '#FFF', color: filter === f ? '#FFF' : '#1F3864'
          }}>{f}</button>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 12.5, color: '#595959', fontWeight: 600 }}>Sort by</span>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ flex: 1, padding: 8, fontFamily: 'inherit', fontSize: 13, border: '1.5px solid #BFBFBF', borderRadius: 6, background: '#FFF' }}>
          <option value="points">Most points</option>
          <option value="time">Least time required</option>
          <option value="recent">Recently added</option>
          <option value="expiring">Almost expired</option>
        </select>
      </div>

      {/* Grouped activity list */}
      {groups.map(g => (
        <div key={g.cat} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name={CAT_ICON[g.cat]} color="#1F3864" size={18} />
            <span style={{ fontSize: 15, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em' }}>{g.cat}</span>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {g.items.map(a => {
              const isFocus = focus && focus === a.id;
              return (
                <div key={a.id} style={{
                  padding: 12, background: '#FFF', borderRadius: 8,
                  border: isFocus ? '2px solid #D4A017' : '1.5px solid #222',
                  boxShadow: isFocus ? '0 0 0 4px rgba(212,160,23,0.25)' : 'none',
                  display: 'flex', gap: 10, alignItems: 'flex-start'
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F2F2F2', border: '1.5px solid #BFBFBF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={CAT_ICON[a.cat]} color="#1F3864" size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: '#222', lineHeight: 1.25 }}>{a.name}</span>
                      {a.isNew && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.5, color: '#7A5A00', background: '#FFE9AE', border: '1px solid #D4A017', borderRadius: 3, padding: '1px 5px' }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: 12.5, color: '#595959', marginTop: 3, lineHeight: 1.4 }}>{a.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 7, flexWrap: 'wrap' }}>
                      {opted && <span style={{ fontSize: 12, fontWeight: 800, color: '#7A5A00' }}>+{a.points} pts{a.pointsSuffix ? ' ' + a.pointsSuffix : ''}</span>}
                      <span style={{ fontSize: 12, color: '#595959' }}>⏱ {timeLabel(a)}</span>
                      {a.deadline && <span style={{ fontSize: 11.5, color: '#C65911', fontWeight: 600 }}>Deadline {a.deadline}</span>}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <SketchyButton small primary onClick={() => openActivity(a)}>Do this now</SketchyButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 30, color: '#595959', fontSize: 14 }}>Nothing matches that filter right now. Try a different one.</div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#595959', marginBottom: 8 }}>Done this period</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {completed.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F2F2F2', border: '1.5px solid #E0E0E0', borderRadius: 8, opacity: 0.85 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#548235', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</div>
                <div style={{ flex: 1, fontSize: 13.5, color: '#595959', textDecoration: 'line-through' }}>{a.name}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#548235', background: '#E6F2DD', border: '1px solid #548235', borderRadius: 999, padding: '2px 8px' }}>DONE</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating completion modal */}
      {modal && (
        <div onClick={() => { setModal(null); setConfirmId(null); }} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 520, padding: 22, borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', maxHeight: '92vh', overflowY: 'auto' }}>
            {confirmId === modal.id ? (
              <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E2EFD9', border: '2.5px solid #548235', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <span style={{ fontSize: 34, color: '#548235' }}>✓</span>
                </div>
                <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 800 }}>Logged. Thank you.</div>
                <div style={{ fontSize: 13.5, color: '#222', marginTop: 10, lineHeight: 1.5, textAlign: 'left', padding: '12px 14px', background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 8 }}>
                  Your rating goes into the township's monthly review. Amy Medway reads every one, and patterns across many residents get a public response on the home screen.{opted && <strong> +{modal.points} points</strong>}
                </div>
                <SketchyButton primary onClick={() => { setModal(null); setConfirmId(null); }} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>Done</SketchyButton>
              </div>
            ) : (
              <>
                {opted && <div style={{ fontSize: 12, color: '#7A5A00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Worth {modal.points} pts</div>}
                <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 800, lineHeight: 1.2, marginBottom: 6, marginTop: 4 }}>{modal.name}</div>
                <div style={{ fontSize: 13.5, color: '#595959', marginBottom: 14, lineHeight: 1.45 }}>{modal.desc}</div>
                <FeedbackValueReminder />
                <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 8 }}>Your rating</div>
                <div style={{ marginBottom: 16 }}>
                  <LikertScale value={rating} onChange={setRating} labelSet={modal.rating} ariaLabel={modal.name} />
                </div>
                <Field label="Tell us more" required multiline value={text} onChange={setText} placeholder="10+ characters." min={10} />
                <window.PostingGuidance />
                <SketchyButton primary disabled={rating === 0 || text.length < 10} onClick={submitRating} style={{ width: '100%', justifyContent: 'center' }}>Submit{opted ? ` (+${modal.points} pts)` : ''}</SketchyButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// === Tab 2: Badges (renamed from Passport) ===
function Badges() {
  const { state, nav } = window.useStore();
  const D = window.CC_DATA;
  const opted = state.engagesOptedIn;
  const [open, setOpen] = React.useState(null);
  const earnedCount = D.badges.filter(b => b.earned).length;

  return (
    <div>
      <div style={{ fontSize: 14, color: '#595959', marginBottom: 14 }}>{earnedCount} of {D.badges.length} earned. Tap a locked badge to see how to earn it.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {D.badges.map(b => (
          <button key={b.id} onClick={() => setOpen(b)} style={{
            padding: 10, fontFamily: 'inherit', cursor: 'pointer',
            background: b.earned ? '#FFF4D6' : '#F2F2F2',
            border: '1.8px solid ' + (b.earned ? '#D4A017' : '#BFBFBF'),
            borderRadius: 10, opacity: b.earned ? 1 : 0.6,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center'
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: b.earned ? '#D4A017' : '#BFBFBF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              {b.earned ? <window.CC_UI.Icon name="badge" color="#FFF" size={26} /> : <span style={{ fontSize: 20 }}>🔒</span>}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: b.earned ? '#7A5A00' : '#595959' }}>{b.name}</div>
          </button>
        ))}
      </div>

      {open && (
        <div onClick={() => setOpen(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', padding: 22, borderRadius: 14, border: '2px solid #222', maxWidth: 360, width: '100%' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: open.earned ? '#D4A017' : '#BFBFBF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', margin: '0 auto 12px' }}>
              {open.earned ? <window.CC_UI.Icon name="badge" color="#FFF" size={36} /> : <span style={{ fontSize: 30 }}>🔒</span>}
            </div>
            <div style={{ fontSize: 26, color: '#1F3864', fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>{open.name}</div>
            <div style={{ fontSize: 14, color: '#222', textAlign: 'center', marginBottom: 16, marginTop: 4, lineHeight: 1.45 }}>{open.desc}</div>
            {!open.earned && open.dest && (
              <button onClick={() => {
                setOpen(null);
                const [seg, sub] = open.dest.split('/');
                if (seg === 'speak') nav({ name: 'speak', tab: sub }, { replace: true });
                else if (seg === 'me') nav({ name: 'me', sub });
                else nav({ name: seg });
              }} style={{ width: '100%', padding: 12, background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Start working toward this →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// === Tab 4: Leaderboard ===
function Leaderboard() {
  const { Icon } = window.CC_UI;
  const D = window.CC_DATA;
  const [tab, setTab] = React.useState('neighborhoods');
  const [showCalc, setShowCalc] = React.useState(false);

  const trendGlyph = (t) => t === 'up' ? '↑' : t === 'down' ? '↓' : '→';
  const trendColor = (t) => t === 'up' ? '#548235' : t === 'down' ? '#C00000' : '#595959';

  return (
    <div>
      {tab === 'neighborhoods' && (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em' }}>Neighborhood leaderboard</div>
            <div style={{ fontSize: 12.5, color: '#595959', fontWeight: 600 }}>July 2026</div>
          </div>
          <button onClick={() => setShowCalc(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: '4px 0 0', color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
            How is this calculated?
          </button>
          <div style={{ fontSize: 12.5, color: '#595959', lineHeight: 1.45, marginTop: 4 }}>
            Rankings are based on average points per household, not raw totals. No single resident can contribute more than 500 points per month.
          </div>
          <div style={{ borderTop: '1.5px solid #E0E0E0', margin: '12px 0 14px' }}></div>
          <div style={{ marginBottom: 14, padding: 14, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 10, color: '#7A5A00', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 6 }}>This month's winning neighborhood gets $500 for neighborhood improvements.</div>
            <div style={{ fontSize: 13 }}>The winner is the neighborhood with the highest per-household average at the end of the month. The neighborhood decides together how the $500 is spent through a quick vote, with options proposed by the township based on past community feedback.</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>Last month, Rennerdale won. They voted to put the money toward basketball court resurfacing at Rennerdale Park.</div>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {['neighborhoods', 'individuals'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: 8, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, textTransform: 'capitalize', background: tab === t ? '#1F3864' : '#FFF', color: tab === t ? '#FFF' : '#222', border: '1.5px solid #1F3864', borderRadius: 999, cursor: 'pointer' }}>{t}</button>
        ))}
      </div>

      {tab === 'neighborhoods' ? (
        <>
          <div style={{ display: 'grid', gap: 6 }}>
            {D.leaderboard.map((row, i) => (
              <div key={row.neighborhood} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: 12, background: row.isUser ? '#DBE5F1' : '#FFF', border: '1.5px solid ' + (row.isUser ? '#1F3864' : '#BFBFBF'), borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: i === 0 ? '#D4A017' : '#BFBFBF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: row.isUser ? 800 : 600, lineHeight: 1.2 }}>{row.neighborhood}{row.isUser && ' (you)'}</div>
                    <div style={{ fontSize: 11.5, color: '#595959', marginTop: 1 }}>{row.points.toLocaleString()} total points across {row.households} households</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800, lineHeight: 1 }}>{row.avg}</div>
                  <div style={{ fontSize: 10.5, color: '#595959' }}>pts / household</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: trendColor(row.trend), marginTop: 2 }}>
                    {trendGlyph(row.trend)}{row.spots > 0 ? ` ${row.spots}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div style={{ fontSize: 12, color: '#595959', marginBottom: 8 }}>Names hidden by default. Opt to show yours in Profile &gt; Profile & preferences.</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {D.individualLeaderboard.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: p.isUser ? '#DBE5F1' : '#FFF', border: '1.5px solid ' + (p.isUser ? '#1F3864' : '#BFBFBF'), borderRadius: 6, fontSize: 13 }}>
                <span>{i + 1}. {p.name}{p.isUser && ' (you)'}</span>
                <span style={{ fontWeight: 700 }}>{p.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCalc && <LeaderboardCalcModal onClose={() => setShowCalc(false)} />}
    </div>
  );
}

function LeaderboardCalcModal({ onClose }) {
  const { SketchyButton, Icon } = window.CC_UI;
  const { nav } = window.useStore();
  const goRules = () => { onClose(); nav({ name: 'speak', screen: 'rules' }); };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ fontSize: 21, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', lineHeight: 1.2 }}>How the neighborhood leaderboard is calculated</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', flexShrink: 0, fontSize: 16, color: '#222' }} aria-label="Close">✕</button>
        </div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.55, marginBottom: 16 }}>Two rules make the leaderboard fair. They are designed so that smaller neighborhoods have a real path to winning, and so that no single resident can carry their neighborhood by themselves.</div>

        <div style={{ fontSize: 15, fontWeight: 800, color: '#1F3864', marginBottom: 4 }}>Rule 1: We average, we don't sum.</div>
        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginBottom: 6 }}>Each neighborhood's score is the total points earned divided by the number of households in that neighborhood. So a neighborhood of 180 households can finish ahead of a neighborhood of 560 households if its per-household engagement is higher. We use household counts from the township's official records, refreshed every year.</div>
        <div style={{ fontSize: 13.5, color: '#595959', lineHeight: 1.5, marginBottom: 16 }}><strong>Why this matters:</strong> a leaderboard based on raw totals would just reward population. Rennerdale would win every month because there are simply more people there. That would make the competition pointless for the rest of us. The average makes every neighborhood's effort count equally, regardless of size.</div>

        <div style={{ fontSize: 15, fontWeight: 800, color: '#1F3864', marginBottom: 4 }}>Rule 2: Each resident can contribute up to 500 points per month.</div>
        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginBottom: 6 }}>No single resident can contribute more than 500 points to their neighborhood's score in any given month. Above 500, points still count toward your personal tier, badges, and rewards. They just do not push your neighborhood up the leaderboard.</div>
        <div style={{ fontSize: 13.5, color: '#595959', lineHeight: 1.5, marginBottom: 16 }}><strong>Why this matters:</strong> without this cap, one resident who spent every spare hour on the platform could single-handedly determine where their neighborhood ranks. The cap ensures the leaderboard rewards broad participation, not one person's marathon. 500 points is roughly what a very active resident earns in a typical month, so the cap does not constrain real engagement.</div>

        <div style={{ fontSize: 15, fontWeight: 800, color: '#1F3864', marginBottom: 6 }}>What this looks like in practice.</div>
        <div style={{ padding: 14, background: '#F2F2F2', borderRadius: 8, marginBottom: 16, fontSize: 13.5, color: '#222', lineHeight: 1.55 }}>
          Last month, before adjustment, Rennerdale's residents earned <strong>4,820 total points</strong> - the most of any neighborhood. But Rennerdale has 560 households, so the per-household average works out to <strong>8.6 points</strong>. Nevillewood's residents earned 4,210 total points, less than Rennerdale, but Nevillewood has 240 households, so the average works out to <strong>17.5 points</strong>. On the adjusted leaderboard, Nevillewood finishes ahead of Rennerdale, because per resident, Nevillewood was more engaged.
          <div style={{ marginTop: 8 }}>Walkers Mill, the smallest neighborhood with 180 households, finished second this month. That is the kind of outcome the fairness rules are designed to make possible.</div>
        </div>

        <div style={{ fontSize: 15, fontWeight: 800, color: '#1F3864', marginBottom: 4 }}>What about the individual leaderboard?</div>
        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginBottom: 16 }}>The individual leaderboard is a separate ranking. Residents who consistently engage at high levels rise on it regardless of which neighborhood they live in. The fairness rules above apply only to how individual engagement contributes to the neighborhood leaderboard.</div>

        <div style={{ fontSize: 15, fontWeight: 800, color: '#1F3864', marginBottom: 4 }}>What happens if these rules need to change?</div>
        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginBottom: 16 }}>The township reviews the leaderboard rules every six months. If patterns emerge that suggest the rules need adjusting, the rules will be updated and the change will be announced in the response loop on the home screen, with the reasoning explained.</div>

        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginBottom: 16 }}>If you have feedback on the leaderboard rules, you can share it like any other feedback: open the activity called "Give feedback on platform rules" (worth 15 points) and tell us what you think.</div>

        <div style={{ display: 'flex', gap: 8 }}>
          <SketchyButton onClick={goRules} style={{ flex: 1, justifyContent: 'center' }} icon="settings">Give feedback on rules</SketchyButton>
          <SketchyButton primary onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Close</SketchyButton>
        </div>
      </div>
    </div>
  );
}

// === Tab 5: Rewards ===
function Rewards() {
  const { state, dispatch, nav } = window.useStore();
  const { SketchyButton } = window.CC_UI;
  const D = window.CC_DATA;
  const [modal, setModal] = React.useState(null);
  const [voucher, setVoucher] = React.useState(null);

  // Not opted in: rewards are part of the optional Engages module.
  if (!state.engagesOptedIn) {
    return (
      <div style={{ padding: '30px 6px', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#F2F2F2', border: '1.8px solid #BFBFBF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <span style={{ fontSize: 28 }}>🔒</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864', marginBottom: 8 }}>Rewards are part of the optional Engages module</div>
        <div style={{ fontSize: 14, color: '#595959', lineHeight: 1.55, maxWidth: 380, margin: '0 auto 18px' }}>
          If you would like to see rewards for your engagement, you can opt in any time in Profile, under Manage your engagement preferences.
        </div>
        <SketchyButton primary onClick={() => nav({ name: 'me', sub: 'speakprefs' })} style={{ justifyContent: 'center' }}>Manage your engagement preferences</SketchyButton>
      </div>
    );
  }

  const redeem = (r) => {
    dispatch({ type: 'REDEEM_REWARD', rewardId: r.id });
    const code = 'COLLIER-' + r.business.split(' ')[0].toUpperCase().slice(0, 5) + '-2026-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    setModal(null);
    setVoucher({ ...r, code });
  };

  const available = D.rewards.filter(r => !r.locked);
  const locked = D.rewards.filter(r => r.locked);

  return (
    <div>
      <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800, marginBottom: 8 }}>Available to you now</div>
      <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
        {available.map(r => (
          <button key={r.id} onClick={() => setModal(r)} style={{ display: 'flex', gap: 12, padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', alignItems: 'center' }}>
            <div style={{ fontSize: 32 }}>{r.logo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: '#595959' }}>{r.business}</div>
            </div>
            <div style={{ fontSize: 20, color: state.points >= r.cost ? '#1F3864' : '#BFBFBF', fontWeight: 700 }}>{r.cost} pts</div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 20, color: '#7A5A00', fontWeight: 800, marginBottom: 8 }}>Coming up (Champion tier)</div>
      <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
        {locked.map(r => (
          <div key={r.id} style={{ display: 'flex', gap: 12, padding: 12, background: '#F2F2F2', border: '1.5px dashed #BFBFBF', borderRadius: 8, alignItems: 'center', opacity: 0.75 }}>
            <div style={{ fontSize: 32 }}>🔒</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: '#595959' }}>Unlock at Champion tier</div>
            </div>
            <div style={{ fontSize: 20, color: '#595959', fontWeight: 700 }}>{r.cost} pts</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800, marginBottom: 8 }}>My rewards</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {state.myRewards.map(mr => (
          <div key={mr.id} style={{ padding: 12, background: mr.status === 'Used' ? '#F2F2F2' : '#FFF4D6', border: '1.5px solid ' + (mr.status === 'Used' ? '#BFBFBF' : '#D4A017'), borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{mr.name}</div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: mr.status === 'Used' ? '#BFBFBF' : '#D4A017', color: '#FFF', fontWeight: 700 }}>{mr.status.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, marginTop: 6, color: '#595959' }}>{mr.code}</div>
            <div style={{ fontSize: 11, color: '#595959' }}>Redeemed {mr.redeemed} · Expires {mr.expires}</div>
          </div>
        ))}
      </div>

      {modal && (
        <RewardModal r={modal} onClose={() => setModal(null)} onRedeem={() => redeem(modal)} canRedeem={state.points >= modal.cost} balance={state.points} />
      )}
      {voucher && <VoucherModal v={voucher} onClose={() => setVoucher(null)} />}
    </div>
  );
}

function RewardModal({ r, onClose, onRedeem, canRedeem, balance }) {
  const { SketchyButton } = window.CC_UI;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', padding: 22, borderRadius: 14, border: '2px solid #222', maxWidth: 400, width: '100%' }}>
        <div style={{ fontSize: 56, textAlign: 'center' }}>{r.logo}</div>
        <div style={{ fontSize: 26, color: '#1F3864', fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>{r.name}</div>
        <div style={{ fontSize: 13, color: '#595959', textAlign: 'center', marginBottom: 10 }}>{r.business}</div>
        <div style={{ fontSize: 14, marginBottom: 10 }}>{r.desc}</div>
        <div style={{ fontSize: 12, color: '#595959', marginBottom: 14 }}>{r.expiry}</div>
        <div style={{ padding: 10, background: '#F2F2F2', borderRadius: 6, marginBottom: 14, fontSize: 13, textAlign: 'center' }}>
          {canRedeem ? `Redeem for ${r.cost} pts? You\u0027ll have ${balance - r.cost} pts left.` : `You need ${r.cost - balance} more pts.`}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SketchyButton onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Not yet</SketchyButton>
          <SketchyButton primary disabled={!canRedeem} onClick={onRedeem} style={{ flex: 1, justifyContent: 'center' }}>Redeem</SketchyButton>
        </div>
      </div>
    </div>
  );
}

function VoucherModal({ v, onClose }) {
  const { SketchyButton } = window.CC_UI;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF4D6', padding: 22, borderRadius: 14, border: '2.5px solid #D4A017', maxWidth: 360, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>{v.logo}</div>
        <div style={{ fontSize: 24, color: '#1F3864', fontWeight: 800, lineHeight: 1.2 }}>{v.name}</div>
        <div style={{ fontSize: 13, color: '#7A5A00', marginBottom: 14 }}>{v.business}</div>

        <div style={{ width: 140, height: 140, margin: '0 auto 12px', background: '#FFF', border: '2px solid #222', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg width="120" height="120" viewBox="0 0 12 12">
            {Array.from({ length: 12 }).map((_, y) => Array.from({ length: 12 }).map((_, x) => {
              const seed = (x * 31 + y * 17 + v.code.charCodeAt(x % v.code.length)) % 100;
              return seed > 55 ? <rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill="#222" /> : null;
            }))}
            <rect x="0" y="0" width="3" height="3" fill="#FFF" stroke="#222" />
            <rect x="9" y="0" width="3" height="3" fill="#FFF" stroke="#222" />
            <rect x="0" y="9" width="3" height="3" fill="#FFF" stroke="#222" />
            <rect x="1" y="1" width="1" height="1" fill="#222" />
            <rect x="10" y="1" width="1" height="1" fill="#222" />
            <rect x="1" y="10" width="1" height="1" fill="#222" />
          </svg>
        </div>

        <div style={{ fontFamily: 'monospace', fontSize: 13, padding: 8, background: '#FFF', border: '1.5px dashed #7A5A00', borderRadius: 4, marginBottom: 14 }}>{v.code}</div>
        <div style={{ fontSize: 12, color: '#7A5A00', marginBottom: 18 }}>Show this at the business. Saved to My Rewards.</div>
        <SketchyButton primary onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Done</SketchyButton>
      </div>
    </div>
  );
}

Object.assign(window, { EarnPoints, Badges, Leaderboard, Rewards });
