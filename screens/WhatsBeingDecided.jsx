// What's being decided: Catalog + Detail (Overview/Timeline/Documents/Discussion) + Feedback form

// Smoothly bring an element to the top of its scroll container (or the window),
// just below the sticky header. Avoids scrollIntoView (which can disrupt the app).
function ccScrollIntoView(el, instant) {
  if (!el) return;
  let sc = el.parentElement;
  while (sc && sc !== document.body && sc !== document.documentElement) {
    const oy = window.getComputedStyle(sc).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && sc.scrollHeight > sc.clientHeight + 4) break;
    sc = sc.parentElement;
  }
  const behavior = instant ? 'auto' : 'smooth';
  try {
    if (!sc || sc === document.body || sc === document.documentElement) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: Math.max(0, top), behavior });
    } else {
      const delta = el.getBoundingClientRect().top - sc.getBoundingClientRect().top - 16;
      sc.scrollTo({ top: sc.scrollTop + delta, behavior });
    }
  } catch (e) {
    if (sc && sc !== document.body && sc !== document.documentElement) {
      sc.scrollTop += el.getBoundingClientRect().top - sc.getBoundingClientRect().top - 16;
    }
  }
}

function WhatsBeingDecided() {
  const { state, nav } = window.useStore();
  const id = state.route.id;
  if (id) return <ProposalDetail id={id} />;
  return <Catalog />;
}

function Catalog() {
  const { state, dispatch, nav } = window.useStore();
  const { SketchyCard, Pill, Icon, FollowButton } = window.CC_UI;
  const D = window.CC_DATA;
  const myNb = state.user.neighborhood;
  const [search, setSearch] = React.useState('');
  const [cats, setCats] = React.useState([]); // multi-select categories
  const [nb, setNb] = React.useState('All neighborhoods');
  const [sortBy, setSortBy] = React.useState('Most recent');
  const [manage, setManage] = React.useState(false);

  const CATS = ['Parks and Recreation', 'Traffic and Safety', 'Zoning and Planning', 'Infrastructure', 'Public Safety'];
  const catColors = {
    'Parks and Recreation': ['#7030A0', '#EFE0F4'],
    'Traffic and Safety': ['#C65911', '#FBE5D6'],
    'Zoning and Planning': ['#1F3864', '#DBE5F1'],
    'Infrastructure': ['#2E74B5', '#DBE5F1'],
    'Public Safety': ['#548235', '#E6F2DD']
  };
  const RECENT_SORT = { p4: 1, p5: 2, p8: 3, p6: 4, p1: 5, p2: 6, p3: 7, p7: 8 };
  const DEADLINE_SORT = { p1: 1, p2: 2, p6: 3, p4: 4, p8: 5, p5: 6, p3: 7, p7: 8 };
  const sortFns = {
    'Most recent': (a, b) => (RECENT_SORT[a.id] || 99) - (RECENT_SORT[b.id] || 99),
    'Deadline soonest': (a, b) => (DEADLINE_SORT[a.id] || 99) - (DEADLINE_SORT[b.id] || 99),
    'Most discussed': (a, b) => b.comments.length - a.comments.length
  };

  const effNb = nb === 'My neighborhood' ? myNb : nb;
  const matchesNb = (p) => effNb === 'All neighborhoods' || p.neighborhoods.some(x => x === effNb || x === 'All neighborhoods');
  const toggleCat = (c) => setCats(cats.includes(c) ? cats.filter(x => x !== c) : [...cats, c]);

  const filtered = D.proposals.filter(p => {
    if (cats.length && !cats.includes(p.category)) return false;
    if (!matchesNb(p)) return false;
    if (search) { const q = search.toLowerCase(); if (!p.title.toLowerCase().includes(q) && !p.summary.toLowerCase().includes(q)) return false; }
    return true;
  }).sort(sortFns[sortBy] || sortFns['Most recent']);

  const specificNb = effNb !== 'All neighborhoods';
  const showCombo = cats.length === 1 && specificNb;

  return (
    <div style={{ padding: '20px 18px 100px' }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#FFF', border: '1.8px solid #222', borderRadius: 999, marginBottom: 12 }}>
        <Icon name="search" size={18} color="#595959" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search proposals..." style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 15, background: 'transparent' }} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }} aria-label="Clear search"><Icon name="close" size={14} color="#595959" /></button>}
      </div>

      {/* Category chips (multi-select) with star-follow */}
      <div data-tour="cat-chips" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 8 }}>
        <button onClick={() => setCats([])} style={{ flexShrink: 0, padding: '6px 12px', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, background: cats.length === 0 ? '#1F3864' : '#FFF', color: cats.length === 0 ? '#FFF' : '#1F3864', border: '1.5px solid #1F3864', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap' }}>All</button>
        {CATS.map(c => {
          const active = cats.includes(c);
          const followed = !!(state.followedCategories || {})[c];
          return (
            <span key={c} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px 4px 12px', background: active ? '#1F3864' : '#FFF', border: '1.5px solid #1F3864', borderRadius: 999, whiteSpace: 'nowrap' }}>
              <button onClick={() => toggleCat(c)} style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, color: active ? '#FFF' : '#1F3864', cursor: 'pointer' }}>{c}</button>
              <button onClick={() => dispatch({ type: 'TOGGLE_FOLLOW_CATEGORY', value: c })} title={followed ? 'Following this category' : 'Follow this category'} aria-label="Follow category" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 1, fontSize: 14, color: followed ? '#D4A017' : (active ? '#CFE0F5' : '#BFBFBF') }}>{followed ? '★' : '☆'}</button>
            </span>
          );
        })}
      </div>

      {/* Neighborhood dropdown + follow link + manage link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <select value={nb} onChange={e => setNb(e.target.value)} style={{ padding: '8px 10px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, border: '1.5px solid #1F3864', borderRadius: 8, background: '#FFF', color: '#1F3864', cursor: 'pointer' }}>
          <option value="All neighborhoods">All neighborhoods</option>
          <option value="My neighborhood">My neighborhood ({myNb})</option>
          {D.neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        {specificNb && (
          <button onClick={() => dispatch({ type: 'TOGGLE_FOLLOW_NEIGHBORHOOD', value: effNb })} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <span style={{ color: (state.followedNeighborhoods || {})[effNb] ? '#D4A017' : '#2E74B5' }}>{(state.followedNeighborhoods || {})[effNb] ? '★' : '☆'}</span>
            {(state.followedNeighborhoods || {})[effNb] ? 'Following ' + effNb : 'Follow ' + effNb}
          </button>
        )}
        <button onClick={() => setManage(true)} style={{ marginLeft: 'auto', background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Manage what you follow</button>
      </div>

      {/* Combination follow banner */}
      {showCombo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, fontSize: 13, color: '#7A5A00', lineHeight: 1.4 }}>Get notified about new <strong>{cats[0]}</strong> proposals affecting <strong>{effNb}</strong>.</div>
          <button onClick={() => { dispatch({ type: 'TOGGLE_FOLLOW_CATEGORY', value: cats[0] }); dispatch({ type: 'TOGGLE_FOLLOW_NEIGHBORHOOD', value: effNb }); }} style={{ flexShrink: 0, padding: '6px 12px', background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 6, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Follow</button>
        </div>
      )}

      {/* Result count + sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: '#595959' }}>Showing {filtered.length} of {D.proposals.length} proposals</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#595959' }}>
          <span>Sort:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '4px 8px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, border: '1.5px solid #BFBFBF', borderRadius: 6, background: '#FFF', color: '#1F3864', cursor: 'pointer' }}>
            <option>Most recent</option>
            <option>Deadline soonest</option>
            <option>Most discussed</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map(p => {
          const [c, bg] = catColors[p.category] || ['#1F3864', '#DBE5F1'];
          return (
            <SketchyCard key={p.id} dataTour={p.id === 'p1' ? 'proposal-card' : undefined} accent={c} onClick={() => nav({ name: 'decide', id: p.id })}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>{p.title}</div>
                <Pill bg={p.status === 'In design' ? '#FFF4D6' : '#E6F2DD'} fg={p.status === 'In design' ? '#7A5A00' : '#548235'}>{p.status}</Pill>
              </div>
              <div style={{ marginTop: 6 }}><Pill bg={bg} fg={c}>{p.category}</Pill></div>
              <div style={{ fontSize: 13, color: '#595959', marginTop: 6 }}>💰 {p.cost} · 👥 {p.affected} · ⏱ {p.deadline} · 💬 {p.comments.length}</div>
              <div style={{ fontSize: 13, marginTop: 6, color: '#222', lineHeight: 1.4 }}>{p.summary}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.neighborhoods.map(n => <Pill key={n} bg="#F2F2F2" fg="#1F3864">{n}</Pill>)}
              </div>
            </SketchyCard>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#595959', background: '#FFF', border: '1.5px dashed #BFBFBF', borderRadius: 10 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#222', marginBottom: 4 }}>No proposals match these filters right now.</div>
            <div style={{ fontSize: 13, marginBottom: 12 }}>Try adjusting your filters, or follow them so we can notify you when new proposals come up.</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setSearch(''); setCats([]); setNb('All neighborhoods'); }} style={{ padding: '8px 14px', background: '#FFF', color: '#1F3864', border: '1.5px solid #1F3864', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Clear filters</button>
              {cats.length === 1 && <button onClick={() => dispatch({ type: 'TOGGLE_FOLLOW_CATEGORY', value: cats[0] })} style={{ padding: '8px 14px', background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Follow {cats[0]}</button>}
            </div>
          </div>
        )}
      </div>

      {manage && <ManageFollowModal onClose={() => setManage(false)} />}
    </div>
  );
}

function ManageFollowModal({ onClose }) {
  const { state, dispatch } = window.useStore();
  const { SketchyButton } = window.CC_UI;
  const D = window.CC_DATA;
  const CATS = ['Parks and Recreation', 'Traffic and Safety', 'Zoning and Planning', 'Infrastructure', 'Public Safety'];
  const fc = state.followedCategories || {};
  const fn = state.followedNeighborhoods || {};
  const nCat = Object.values(fc).filter(Boolean).length;
  const nNb = Object.values(fn).filter(Boolean).length;
  const Toggle = ({ on, onClick, label }) => (
    <button onClick={onClick} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', marginBottom: 6, background: '#FFF', border: '1.5px solid ' + (on ? '#1F3864' : '#BFBFBF'), borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, color: '#222' }}>
      <span>{label}</span><span style={{ color: on ? '#D4A017' : '#BFBFBF', fontSize: 16 }}>{on ? '★' : '☆'}</span>
    </button>
  );
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864' }}>Manage what you follow</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', flexShrink: 0, fontSize: 15, color: '#222' }} aria-label="Close">✕</button>
        </div>
        <div style={{ fontSize: 12.5, color: '#595959', marginBottom: 14 }}>You currently follow {nCat} categor{nCat === 1 ? 'y' : 'ies'} and {nNb} neighborhood{nNb === 1 ? '' : 's'}. We notify you when new proposals match.</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1F3864', marginBottom: 8 }}>Categories</div>
        {CATS.map(c => <Toggle key={c} on={!!fc[c]} label={c} onClick={() => dispatch({ type: 'TOGGLE_FOLLOW_CATEGORY', value: c })} />)}
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1F3864', margin: '12px 0 8px' }}>Neighborhoods</div>
        {D.neighborhoods.map(n => <Toggle key={n} on={!!fn[n]} label={n} onClick={() => dispatch({ type: 'TOGGLE_FOLLOW_NEIGHBORHOOD', value: n })} />)}
        <SketchyButton primary onClick={onClose} style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Done</SketchyButton>
      </div>
    </div>
  );
}

function ProposalDetail({ id }) {
  const { state, dispatch, nav, back } = window.useStore();
  const { SketchyButton, Icon, Pill } = window.CC_UI;
  const D = window.CC_DATA;
  const p = D.proposals.find(x => x.id === id);
  const [tab, setTab] = React.useState(state.route.tab || 'overview');
  // Give-feedback sections are expanded by default (per Round 3 addendum).
  const [fbOpen, setFbOpen] = React.useState(true);
  const [tlFbOpen, setTlFbOpen] = React.useState(true);
  // Incremented by the sticky "Give feedback" button to open + scroll the in-context form.
  const [fbNonce, setFbNonce] = React.useState(0);
  if (!p) return null;
  const followed = !!state.followed[p.id];

  return (
    <div style={{ paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back to catalog
        </button>
        <div style={{ marginTop: 12 }}>
          <Pill bg={p.status === 'In design' ? '#FFF4D6' : '#E6F2DD'} fg={p.status === 'In design' ? '#7A5A00' : '#548235'}>{p.status}</Pill>
        </div>
        <div style={{ fontSize: 26, color: '#1F3864', fontWeight: 700, lineHeight: 1.2, marginTop: 6 }}>{p.title}</div>
        <div style={{ fontSize: 14, color: '#595959', marginTop: 4 }}>💰 {p.cost} · 👥 {p.affected} · Deadline {p.deadline}</div>
      </div>

      {/* Tabs */}
      <div style={{ position: 'sticky', top: 0, background: '#FAFAF7', zIndex: 4, padding: '8px 12px 0', borderBottom: '1.5px solid #E0E0E0', marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
          {['overview', 'timeline', 'documents', 'discussion'].map(t => (
            <button key={t} data-tour={'ptab-' + t} onClick={() => setTab(t)} style={{
              padding: '10px 6px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tab === t ? '#1F3864' : '#595959',
              borderBottom: tab === t ? '3px solid #1F3864' : '3px solid transparent',
              textTransform: 'capitalize', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4
            }}>
              <span>{t}</span>
              {t === 'discussion' && (
                <span style={{ fontSize: 10, fontWeight: 700, background: tab === t ? '#1F3864' : '#BFBFBF', color: '#FFF', borderRadius: 8, padding: '1px 5px', minWidth: 16, textAlign: 'center', lineHeight: 1.3 }}>{p.comments.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 18 }}>
        {tab === 'overview' && <OverviewTab p={p} fbOpen={fbOpen} setFbOpen={setFbOpen} fbNonce={fbNonce} />}
        {tab === 'timeline' && <TimelineTab p={p} tlFbOpen={tlFbOpen} setTlFbOpen={setTlFbOpen} fbNonce={fbNonce} />}
        {tab === 'documents' && <DocumentsTab p={p} />}
        {tab === 'discussion' && <DiscussionTab p={p} />}
      </div>

      {/* Sticky bottom CTA */}
      {(tab === 'overview' || tab === 'timeline') && (
        <div style={{ position: 'sticky', bottom: 0, background: 'rgba(250, 250, 247, 0.96)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', borderTop: '1.5px solid #BFBFBF', padding: 12, display: 'flex', gap: 8, zIndex: 5 }}>
          <SketchyButton primary onClick={() => setFbNonce(n => n + 1)} style={{ flex: 1, justifyContent: 'center' }} icon="chat">Give feedback</SketchyButton>
          <span data-tour="proposal-follow"><window.CC_UI.FollowButton id={p.id} type="proposal" /></span>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ p, fbOpen, setFbOpen, fbNonce }) {
  const { state } = window.useStore();
  const { SketchyCard } = window.CC_UI;
  // Impact area map (mini abstract map with shaded region)
  return (
    <div>
      <SketchyCard style={{ background: '#F5F1E8' }}>
        <div style={{ fontSize: 11, color: '#595959', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 6 }}>Impact area</div>
        <svg width="100%" height="120" viewBox="0 0 300 120">
          <defs><pattern id="grid2" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#D4CCA8" strokeWidth="0.3" /></pattern></defs>
          <rect width="300" height="120" fill="url(#grid2)" />
          <path d="M 10 30 Q 80 20 160 30 T 290 35 L 290 90 Q 200 100 130 92 T 10 88 Z" fill="#E8E0C8" stroke="#B8AC80" strokeWidth="0.6" />
          <circle cx="160" cy="60" r="45" fill="rgba(112,48,160,0.25)" stroke="#7030A0" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="160" cy="60" r="6" fill="#7030A0" stroke="#FFF" strokeWidth="2" />
          <text x="160" y="105" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#7A6E40">{p.neighborhoods.join(', ')}</text>
        </svg>
      </SketchyCard>

      <div style={{ marginTop: 16 }}>
        {p.paragraphs.map((para, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: 1.55, color: '#222', marginBottom: 12 }}>{para}</p>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 14, background: '#DBE5F1', border: '1.8px solid #1F3864', borderRadius: 10 }}>
        <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, marginBottom: 4 }}>What this means for you</div>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>{p.forYou}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, marginBottom: 6 }}>Cost breakdown</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, border: '1.5px solid #BFBFBF' }}>
          <tbody>
            {p.costBreakdown.map((c, i) => (
              <tr key={i} style={{ background: i % 2 ? '#F2F2F2' : '#FFF' }}>
                <td style={{ padding: '8px 10px', border: '1px solid #E0E0E0' }}>{c.label}</td>
                <td style={{ padding: '8px 10px', border: '1px solid #E0E0E0', textAlign: 'right', fontWeight: 600 }}>{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, marginBottom: 6 }}>Where we are now</div>
        <MiniTimeline p={p} />
      </div>

      <FeedbackSection p={p} open={fbOpen} setOpen={setFbOpen} requestNonce={fbNonce} />
    </div>
  );
}

function MiniTimeline({ p }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8, overflowX: 'auto' }}>
      {p.stages.map((s, i) => (
        <React.Fragment key={s.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, minWidth: 70 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: s.status === 'done' ? '#1F3864' : s.status === 'current' ? '#FFF4D6' : '#FFF',
              border: '2px solid ' + (s.status === 'upcoming' ? '#BFBFBF' : '#1F3864'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: s.status === 'done' ? '#FFF' : '#1F3864', fontWeight: 700, fontSize: 12,
              boxShadow: s.status === 'current' ? '0 0 0 4px rgba(212,160,23,0.3)' : 'none'
            }}>{s.status === 'done' ? '✓' : i + 1}</div>
            <div style={{ fontSize: 10, marginTop: 4, color: '#595959', textAlign: 'center', maxWidth: 70 }}>{s.name}</div>
            <div style={{ fontSize: 9, color: '#999' }}>{s.date.split(',')[0]}</div>
          </div>
          {i < p.stages.length - 1 && <div style={{ flexShrink: 0, width: 24, height: 2, background: s.status === 'done' ? '#1F3864' : '#BFBFBF' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

const STAGE_COMMENTS = {
  p1: {
    p1s2: [
      { author: 'Tom from Ewingsville', body: 'Glad to see the comment period opened on time and is being widely publicized. The last vendor change wasn\u0027t communicated like this.', date: '10 days ago', up: 6 },
      { author: 'Manager\u0027s Office - Amy Medway', staff: true, replyTo: 'Tom from Ewingsville', body: 'Thanks Tom. We learned from that last time. This time we are using all the channels we have, including the printed newsletter, the Facebook page, the platform, and door-to-door if we need to.', date: '9 days ago', up: 8 },
      { author: 'Collier Resident from Beechmont', body: 'Where can I find the vendor cost comparison data referenced in the proposal summary? I want to see the numbers before I vote my conscience.', date: '7 days ago', up: 3 },
      { author: 'Manager\u0027s Office - Amy Medway', staff: true, replyTo: 'Collier Resident from Beechmont', body: 'Documents tab has it. Look for \u0022Vendor cost estimate.pdf\u0022 and \u0022Comparable township programs.pdf\u0022. Both are linked from the Documents tab on this proposal.', date: '7 days ago', up: 5 }
    ]
  },
  p3: {
    p3s3: [
      { author: 'Carol from Presto', body: 'Thrilled to see this approved. The vote was 4 to 1. Want to publicly thank Commissioner Butler for casting the swing vote in favor.', date: '3 weeks ago', up: 9 },
      { author: 'Collier Resident from Presto', replyTo: 'Carol from Presto', body: 'Agreed. The compromise on the parking expansion was the right call.', date: '3 weeks ago', up: 4 },
      { author: 'Tom from Ewingsville', body: 'Genuine question: how were the 47 public comments factored into the final vote? I\u0027d love to see the analysis.', date: '2 weeks ago', up: 6 },
      { author: 'Manager\u0027s Office - Amy Medway', staff: true, replyTo: 'Tom from Ewingsville', body: 'Great question. The \u0022how recent feedback shaped this\u0022 callout above this section walks through the four substantive changes we made based on public comment. The board meeting minutes (linked in Documents) capture the specific motions and the discussion of public input.', date: '2 weeks ago', up: 10 }
    ]
  },
  p2: {
    p2s1: [
      { author: 'Collier Resident from Presto', body: 'Will the engineering study be made public? I want to see the technical findings about which catch basins are the worst.', date: '5 weeks ago', up: 5 },
      { author: 'Engineering - Mike Sullivan', staff: true, replyTo: 'Collier Resident from Presto', body: 'Yes, the full study is in the Documents tab as \u0022Engineering study summary.pdf\u0022. The longer technical report (about 80 pages) is available on request by emailing engineering@colliertwp.net. We summarized it down to the parts most relevant to residents.', date: '5 weeks ago', up: 7 },
      { author: 'Carol from Presto', body: 'Read the summary. The five catch basins the study identified match exactly what I have been telling the township for the past three storms. Glad someone is finally listening.', date: '4 weeks ago', up: 8 }
    ]
  }
};

function TimelineTab({ p, tlFbOpen, setTlFbOpen, fbNonce }) {
  const { SketchyButton, Pill, ItemComments } = window.CC_UI;
  const stageComments = STAGE_COMMENTS[p.id] || {};
  const [open, setOpen] = React.useState(p.stages.findIndex(s => s.status === 'current'));

  return (
    <div>
      <div data-tour="proposal-timeline" style={{ fontSize: 14, color: '#595959', marginBottom: 14 }}>Tap a stage to see what happened, documents, and feedback from neighbors during that period.</div>
      <div style={{ position: 'relative' }}>
        {p.stages.map((s, i) => {
          const isOpen = open === i;
          const c = s.status === 'done' ? '#1F3864' : s.status === 'current' ? '#D4A017' : '#BFBFBF';
          return (
            <div key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: s.status === 'done' ? '#1F3864' : s.status === 'current' ? '#FFF4D6' : '#FFF',
                  border: '2.5px solid ' + c,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.status === 'done' ? '#FFF' : c, fontWeight: 700, fontSize: 13,
                  boxShadow: s.status === 'current' ? '0 0 0 5px rgba(212,160,23,0.3)' : 'none',
                  animation: s.status === 'current' ? 'pulse 2s infinite' : 'none'
                }}>{s.status === 'done' ? '✓' : i + 1}</div>
                {i < p.stages.length - 1 && <div style={{ flex: 1, width: 2, minHeight: 24, background: s.status === 'done' ? '#1F3864' : '#BFBFBF', marginTop: 2 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 18, cursor: 'pointer' }} onClick={() => setOpen(isOpen ? -1 : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: s.status === 'upcoming' ? '#595959' : '#222' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#595959' }}>{s.date} {s.status === 'current' && <Pill bg="#FFF4D6" fg="#7A5A00">Current</Pill>}</div>
                  </div>
                  <div style={{ color: '#595959', fontSize: 12 }}>{isOpen ? '▴' : '▾'}</div>
                </div>
                {isOpen && (
                  <div onClick={e => e.stopPropagation()} style={{ marginTop: 8, padding: 12, background: '#FFF', border: '1.5px solid #BFBFBF', borderRadius: 8 }}>
                    <div style={{ fontSize: 14, lineHeight: 1.5, color: '#222' }}>{s.detail}</div>
                    {s.docs && s.docs.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#595959' }}>Documents</div>
                        {s.docs.map(d => <div key={d} style={{ fontSize: 13, color: '#2E74B5', marginTop: 2 }}>📄 {d}</div>)}
                      </div>
                    )}
                    {(stageComments[s.id] && s.status !== 'upcoming')
                      ? <ItemComments title="Comments on this stage" seed={stageComments[s.id]} placeholder="Comment on this stage of the decision..." />
                      : (s.comments > 0 && <div style={{ fontSize: 12, color: '#595959', marginTop: 8 }}>{s.comments} resident comments during this stage.</div>)}
                    {s.feedbackShaped && (
                      <div style={{ marginTop: 10, padding: 10, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 6 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#7A5A00', textTransform: 'uppercase' }}>How recent feedback shaped this</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>{s.feedbackShaped}</div>
                      </div>
                    )}
                    {(s.status === 'current' || stageComments[s.id]) && s.status !== 'upcoming' && (
                      <FeedbackSection p={p} stageId={s.id} />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* General (proposal-wide) feedback, expanded by default. The sticky "Give feedback"
          button opens + scrolls to this without leaving the Timeline tab. */}
      <FeedbackSection p={p} open={tlFbOpen} setOpen={setTlFbOpen} requestNonce={fbNonce} />
    </div>
  );
}

function DocumentsTab({ p }) {
  const { nav } = window.useStore();
  return (
    <div>
      <div style={{ fontSize: 14, color: '#595959', marginBottom: 14 }}>All documents related to this proposal. Click any to open.</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {p.documents.map(d => (
          <div key={d.name} onClick={() => nav({ name: 'placeholder', kind: 'pdf', label: d.name })}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8, cursor: 'pointer' }}>
            <div style={{ width: 36, height: 44, background: '#FBE5D6', border: '1.5px solid #C65911', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#C65911' }}>PDF</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: '#595959' }}>{d.date} · {d.size}</div>
            </div>
            <div style={{ fontSize: 12, color: '#2E74B5', fontWeight: 600 }}>Open →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscussionTab({ p }) {
  const { state, dispatch, guardedSubmit } = window.useStore();
  const { SketchyButton, Field } = window.CC_UI;
  const draftKey = 'proposal:' + p.id;
  const [comment, setComment] = React.useState(state.drafts[draftKey] || '');
  const [sort, setSort] = React.useState('recent');

  // Pick up a revise-and-re-post draft if one was set (e.g. from a removed post)
  React.useEffect(() => {
    if (state.drafts[draftKey]) {
      setComment(state.drafts[draftKey]);
      dispatch({ type: 'SET_DRAFT', key: draftKey, value: '' });
    }
  }, [state.drafts[draftKey]]);

  const baseComments = p.comments;
  const myComments = state.comments[p.id] || [];
  const all = [...myComments, ...baseComments];
  if (sort === 'reactions') all.sort((a, b) => (b.reactions?.up || 0) - (a.reactions?.up || 0));

  const post = () => guardedSubmit(() => { dispatch({ type: 'ADD_COMMENT', proposalId: p.id, body: comment }); setComment(''); });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 24, color: '#1F3864', fontWeight: 700 }}>Community discussion · {all.length}</div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '4px 8px', fontFamily: 'inherit', border: '1.5px solid #222', borderRadius: 4, background: '#FFF' }}>
          <option value="recent">Most recent</option>
          <option value="reactions">Most reactions</option>
        </select>
      </div>

      <div style={{ marginBottom: 14, padding: 12, background: '#FFF', border: '1.8px solid #222', borderRadius: 8 }}>
        <window.PostingGuidance />
        <Field label="Add your comment" multiline value={comment} onChange={setComment} placeholder="Share your perspective. Be neighborly." />
        <div style={{ fontSize: 11, color: '#595959', marginBottom: 8 }}>Posting as <strong>{state.displayName}</strong> (change in Profile &gt; Profile & preferences)</div>
        <SketchyButton primary small disabled={comment.length < 10} onClick={post}>Post comment</SketchyButton>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {all.map((c, i) => (
          <Comment key={c.id + i} c={c} />
        ))}
      </div>
    </div>
  );
}

function Comment({ c }) {
  const { state, dispatch } = window.useStore();
  const reaction = state.reactions[c.id];
  const up = (c.reactions?.up || 0) + (reaction === 'up' ? 1 : 0);
  const down = (c.reactions?.down || 0) + (reaction === 'down' ? 1 : 0);
  return (
    <div style={{
      padding: 12,
      background: c.staff ? '#FFF4D6' : (c.isMine ? '#DBE5F1' : '#FFF'),
      border: '1.5px solid ' + (c.staff ? '#D4A017' : c.isMine ? '#1F3864' : '#BFBFBF'),
      borderRadius: 8
    }}>
      {c.staff && (
        <div style={{ display: 'inline-block', fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, color: '#7A5A00', background: '#FFE9AE', border: '1px solid #D4A017', borderRadius: 3, padding: '1px 6px', marginBottom: 4 }}>TOWNSHIP STAFF</div>
      )}
      <div style={{ fontSize: 12, fontWeight: 600, color: c.staff ? '#7A5A00' : '#1F3864' }}>
        {c.author} {c.isMine && <span style={{ color: '#2E74B5' }}>· you</span>} <span style={{ color: '#595959', fontWeight: 400 }}>· {c.date}</span>
      </div>
      <div style={{ fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>{c.body}</div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, fontSize: 12 }}>
        <button onClick={() => dispatch({ type: 'REACT', commentId: c.id, value: reaction === 'up' ? null : 'up' })}
          style={{ background: reaction === 'up' ? '#DBE5F1' : 'transparent', border: '1px solid #BFBFBF', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>👍 {up}</button>
        {!c.staff && (
          <button onClick={() => dispatch({ type: 'REACT', commentId: c.id, value: reaction === 'down' ? null : 'down' })}
            style={{ background: reaction === 'down' ? '#FBE0E0' : 'transparent', border: '1px solid #BFBFBF', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>👎 {down}</button>
        )}
        <button style={{ background: 'transparent', border: 'none', color: '#2E74B5', cursor: 'pointer', fontFamily: 'inherit' }}>Reply</button>
      </div>
    </div>
  );
}

// Inline expand/collapse feedback section (same chevron pattern as map pin cards).
function FeedbackSection({ p, stageId, open: openProp, setOpen: setOpenProp, requestNonce }) {
  const { state, dispatch, guardedSubmit } = window.useStore();
  const { SketchyButton, Field, Icon, LikertScale, FeedbackValueReminder } = window.CC_UI;
  const [openInternal, setOpenInternal] = React.useState(false);
  const open = openProp !== undefined ? openProp : openInternal;
  const setOpen = setOpenProp || setOpenInternal;
  const [rating, setRating] = React.useState(0);
  const [body, setBody] = React.useState('');
  const [publicly, setPublicly] = React.useState(false);
  const [notify, setNotify] = React.useState(true);
  const [phase, setPhase] = React.useState('form'); // form | confirm | done
  const [submittedOn, setSubmittedOn] = React.useState(null);

  const scopeLabel = stageId ? 'this stage' : 'this proposal';

  const submit = () => guardedSubmit(() => {
    if (publicly && !stageId) dispatch({ type: 'ADD_COMMENT', proposalId: p.id, body: `[${['Very dissatisfied','Dissatisfied','Neutral','Satisfied','Very satisfied'][rating-1]}] ${body}` });
    setSubmittedOn('July 22');
    setPhase('confirm');
    setTimeout(() => { setPhase('done'); setOpen(false); }, 3000);
  });

  const reopen = () => { setPhase('form'); setRating(0); setBody(''); setOpen(true); };

  // === Auto-scroll + focus when the form opens ===
  const sectionRef = React.useRef(null);
  const runScrollFocus = React.useCallback(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      ccScrollIntoView(sectionRef.current, reduce);
      setTimeout(() => {
        const ta = sectionRef.current && sectionRef.current.querySelector('textarea');
        if (ta) { try { ta.focus({ preventScroll: true }); } catch (e) { ta.focus(); } }
      }, reduce ? 0 : 420);
    });
  }, []);

  // Scroll/focus on every open AFTER mount (so a default-open section doesn't jump on landing).
  const didMount = React.useRef(false);
  React.useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; }
    if (open && phase === 'form') runScrollFocus();
  }, [open]);

  // The sticky "Give feedback" button bumps requestNonce to open + scroll this section in place.
  const lastNonce = React.useRef(requestNonce);
  React.useEffect(() => {
    if (requestNonce === undefined || requestNonce === lastNonce.current) return;
    lastNonce.current = requestNonce;
    if (phase === 'done') reopen();
    else if (open) runScrollFocus();
    else setOpen(true);
  }, [requestNonce]);

  const tint = stageId ? '#EEF3F9' : '#DBE5F1';

  return (
    <div ref={sectionRef} style={{ marginTop: 16, background: tint, border: '1.8px solid #1F3864', borderRadius: 12, overflow: 'hidden', scrollMarginTop: 80 }}>
      {/* Header row (tap to toggle) */}
      <button onClick={() => (phase === 'done' ? reopen() : setOpen(!open))} style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '12px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {phase === 'done' && <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#548235', color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</span>}
            <span style={{ fontSize: 16, fontWeight: 800, color: '#1F3864' }}>Give feedback on {scopeLabel}</span>
          </div>
          <div style={{ fontSize: 12.5, color: '#3A567F', marginTop: 3 }}>
            {phase === 'done'
              ? <>You submitted feedback on {submittedOn}. <span style={{ color: '#2E74B5', fontWeight: 700 }}>Submit again →</span></>
              : 'Tell the township how you feel. Your feedback goes to the proposal reviewer.'}
          </div>
        </div>
        <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#FFF', border: '1.8px solid #1F3864', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease-out' }}><Icon name="chevDown" size={16} color="#1F3864" /></span>
        </span>
      </button>

      {open && phase !== 'done' && (
        <div style={{ padding: '4px 14px 16px' }}>
          {phase === 'confirm' ? (
            <div style={{ padding: '16px 8px' }}>
              <div style={{ fontSize: 40, marginBottom: 8, textAlign: 'center' }}>✉️</div>
              <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800, textAlign: 'center' }}>Thank you, {state.user.name.split(' ')[0]}. Your feedback is in.</div>
              <div style={{ fontSize: 13.5, color: '#222', marginTop: 10, lineHeight: 1.55 }}>We have just sent an email receipt to <strong>{state.user.email}</strong> confirming your submission and including a copy of what you wrote. Keep this for your records.</div>
              <div style={{ fontSize: 13.5, color: '#222', marginTop: 10, lineHeight: 1.55 }}>The township will review your feedback and respond within 2 weeks via your chosen notification channel. You can also check the status anytime under <strong>Profile &gt; My Submitted Items</strong>.</div>
            </div>
          ) : (
            <>
              <FeedbackValueReminder />
              <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 8 }}>How do you feel about {scopeLabel}?</div>
              <div style={{ marginBottom: 14 }}>
                <LikertScale value={rating} onChange={setRating} labelSet="satisfaction" ariaLabel="Your reaction" />
              </div>
              <Field label="Tell us why, or what would change your mind" required multiline value={body} onChange={setBody} placeholder="A sentence or two will do." min={10} />
              <window.PostingGuidance />
              {!stageId && (
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: '#FFF', border: '1.5px solid #BFBFBF', borderRadius: 6, marginBottom: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={publicly} onChange={e => setPublicly(e.target.checked)} />
                  Display my comment publicly with my pseudonym ({state.displayName})
                </label>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: '#FFF', border: '1.5px solid #BFBFBF', borderRadius: 6, marginBottom: 14, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
                Send me a response when this is reviewed
              </label>
              <SketchyButton primary disabled={rating === 0 || body.length < 10} onClick={submit} style={{ width: '100%', justifyContent: 'center' }}>Submit feedback</SketchyButton>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Close</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

window.WhatsBeingDecided = WhatsBeingDecided;
