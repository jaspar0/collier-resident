// What's Happening: Map / Calendar / List + pin detail

// Pin indicator shown inside each filter chip (Round 3 addendum). Mirrors the map pin head:
// a white disc + the pin-color ring + the SAME glyph drawn on the map, so the chip and its
// pins are recognizable by both color and symbol. The white disc keeps it legible on the
// navy selected chip.
const ChipPinDot = ({ kind }) => {
  // Community events render on the map as a filled blue dot (vs. the calendar glyph for
  // township events); both live under the Events filter.
  if (kind === 'community') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" fill="#FFF" stroke="#2E74B5" strokeWidth="1.7" />
        <circle cx="8" cy="8" r="2.4" fill="#2E74B5" />
      </svg>
    );
  }
  const colors = { events: '#2E74B5', projects: '#548235', issues: '#7030A0', notices: '#D4A017' };
  const glyphKind = { events: 'event', projects: 'project', issues: 'ticket', notices: 'notice' }[kind];
  // translate the map glyph (centered near 15,13 in the 30x36 pin) into this 16x16 badge (8,8)
  const glyph = <g transform="translate(-7,-5)"><PinGlyph kind={glyphKind} color={kind === 'notices' ? '#7A5A00' : colors[kind]} /></g>;
  if (kind === 'notices') {
    // Notices & Alerts covers two colors — split amber/orange ring around the notice glyph.
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" fill="#FFF" />
        <path d="M8 1 A7 7 0 0 0 8 15" fill="none" stroke="#D4A017" strokeWidth="1.8" />
        <path d="M8 1 A7 7 0 0 1 8 15" fill="none" stroke="#C65911" strokeWidth="1.8" />
        {glyph}
      </svg>
    );
  }
  const color = colors[kind] || '#1F3864';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" fill="#FFF" stroke={color} strokeWidth="1.7" />
      {glyph}
    </svg>
  );
};

function WhatsHappening() {
  const { state, dispatch, nav } = window.useStore();
  const { Icon, Chip, SketchyButton } = window.CC_UI;
  const view = state.happeningView;
  const filters = state.happeningFilters;
  const detail = state.route.detail;
  const [showTypes, setShowTypes] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Sub-nav */}
      <div style={{ flexShrink: 0, background: '#FAFAF7', zIndex: 4, padding: '14px 16px 8px', borderBottom: '1.5px solid #E0E0E0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#595959', textTransform: 'uppercase', letterSpacing: 0.6, flexShrink: 0 }}>View</span>
          <div data-tour="happening-views" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: 3, background: '#E8E4D6', borderRadius: 10, border: '1.5px solid #BFBFBF' }}>
            {[['map', 'Map', 'map'], ['calendar', 'Calendar', 'cal'], ['list', 'List', 'list']].map(([k, lbl, ic]) =>
            <button key={k} data-tour={'view-' + k} onClick={() => dispatch({ type: 'SET_HAPPENING_VIEW', value: k })}
            style={{
              padding: '8px 6px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: view === k ? '#FFF' : 'transparent',
              color: view === k ? '#1F3864' : '#595959',
              border: 'none',
              borderRadius: 7,
              boxShadow: view === k ? '0 1px 3px rgba(0,0,0,0.15), 0 0 0 1px rgba(31,56,100,0.1)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer',
              transition: 'all 120ms ease'
            }}>
                <Icon name={ic} size={15} color={view === k ? '#1F3864' : '#595959'} />{lbl}
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[['events', 'Events', '#2E74B5'], ['projects', 'Projects', '#548235'], ['issues', 'Tickets', '#7030A0'], ['notices', 'Notices & Alerts', '#D4A017']].map(([k, lbl, c]) =>
          <button key={k} onClick={() => dispatch({ type: 'TOGGLE_FILTER', key: k })}
            style={{
              fontFamily: 'inherit', fontSize: 13, padding: '6px 6px', minHeight: 32,
              border: '1.5px solid #1F3864',
              background: filters[k] ? '#1F3864' : '#FFF',
              color: filters[k] ? '#FFF' : '#1F3864',
              borderRadius: 999, cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              whiteSpace: 'nowrap', flex: '1 1 auto'
            }}
            aria-pressed={filters[k]}>
              <ChipPinDot kind={k} />{k === 'events' && <ChipPinDot kind="community" />}{lbl}
            </button>
          )}
        </div>
        <button onClick={() => setShowTypes(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', padding: '8px 0 0', color: '#2E74B5', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
          What's the difference between these?
        </button>
      </div>

      {/* Main content - scrolls between sub-nav and action bar */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {view === 'map' && <MapView onPin={(d) => nav({ name: 'happening', detail: d }, { replace: true })} />}
        {view === 'calendar' && <CalendarView onItem={(d) => nav({ name: 'happening', detail: d }, { replace: true })} />}
        {view === 'list' && <ListView onItem={(d) => nav({ name: 'happening', detail: d }, { replace: true })} />}
      </div>

      {/* Pin detail card (modal slide-up) */}
      {detail && <PinDetail detail={detail} onClose={() => nav({ name: 'happening', detail: null }, { replace: true })} />}

      {showTypes && <ContentTypesModal onClose={() => setShowTypes(false)} />}

      {/* Persistent action bar - its own row; content above stops here */}
      <ActionBar />
    </div>);

}

function ActionBar() {
  const { nav } = window.useStore();
  const { Icon } = window.CC_UI;
  return (
    <div style={{ flexShrink: 0, position: 'sticky', bottom: 0, background: '#FAFAF7', borderTop: '1.5px solid #BFBFBF', padding: 12, display: 'flex', gap: 10, zIndex: 8 }}>
      <button onClick={() => nav({ name: 'speak', screen: 'submit' })} data-tour="submit-ticket"
        style={{ flex: 1, minWidth: 0, height: 46, padding: '0 12px', borderRadius: 10, background: '#C65911', color: '#FFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
        <Icon name="warn" size={18} color="#FFF" strokeWidth={2.4} /> Submit a ticket
      </button>
      <button onClick={() => nav({ name: 'eventRequest', step: 'qualify' })}
        style={{ flex: 1, minWidth: 0, height: 46, padding: '0 12px', borderRadius: 10, background: '#1F3864', color: '#FFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
        <Icon name="cal" size={18} color="#FFF" strokeWidth={2.4} /> Request an event
      </button>
    </div>
  );
}

function SpeedDial() {
  return null;
}

// Coordinates roughly matching the neighborhood text labels on the abstract map
const NEIGHBORHOOD_COORDS = {
  'Nevillewood': { x: 22, y: 28 },
  'Rennerdale': { x: 80, y: 58 },
  'Walkers Mill': { x: 38, y: 73 },
  'Webb': { x: 36, y: 88 },
  'Hilltop': { x: 50, y: 50 },
  'Bridgeville Heights': { x: 82, y: 88 },
  'Settlers Point': { x: 65, y: 35 }
};

// "You are here" marker - distinct from the categorical pins
const HomeMarker = ({ neighborhood }) => {
  const coord = NEIGHBORHOOD_COORDS[neighborhood] || NEIGHBORHOOD_COORDS['Rennerdale'];
  return (
    <div style={{
      position: 'absolute',
      left: `${coord.x}%`,
      top: `${coord.y}%`,
      transform: 'translate(-50%, -100%)',
      pointerEvents: 'none',
      zIndex: 3
    }}>
      {/* Pulsing halo */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: -8,
        width: 42,
        height: 42,
        marginLeft: -21,
        borderRadius: '50%',
        background: 'rgba(31, 56, 100, 0.18)',
        animation: 'homepulse 2.2s ease-out infinite'
      }} />
      {/* Marker */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{
          background: '#1F3864',
          color: '#FFF',
          padding: '3px 9px',
          fontSize: 11,
          fontWeight: 800,
          borderRadius: 4,
          border: '1.5px solid #FFF',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          letterSpacing: '-0.005em',
          whiteSpace: 'nowrap',
          marginBottom: -1
        }}>You're here</div>
        <svg width="34" height="34" viewBox="0 0 34 34" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
          <circle cx="17" cy="17" r="14" fill="#1F3864" stroke="#FFF" strokeWidth="2.5" />
          {/* House icon */}
          <path d="M 9 18 L 17 11 L 25 18 L 25 25 L 9 25 Z" fill="none" stroke="#FFF" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 14.5 25 L 14.5 20 L 19.5 20 L 19.5 25" fill="none" stroke="#FFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

// === Map view: abstract grid + blobs + pins ===
// Small status badge color for a ticket pin (upper-right dot). Submitted = no badge (hollow pin).
function ticketBadgeColor(status) {
  switch (status) {
    case 'Received': case 'Under Review': return '#2E74B5';
    case 'Needs more info': return '#D4A017';
    case 'Approved for work': return '#548235';
    case 'Planning': return '#D4A017';
    case 'In Progress': return '#C65911';
    case 'Resolved': return '#548235';
    case 'Declined': return '#C00000';
    default: return null;
  }
}

const PinGlyph = ({ kind, color }) => {
  switch (kind) {
    case 'event':
      return (
        <g>
          <rect x="11.5" y="11" width="7" height="5" rx="0.6" fill="none" stroke={color} strokeWidth="1.3" />
          <line x1="11.5" y1="12.6" x2="18.5" y2="12.6" stroke={color} strokeWidth="1.3" />
          <line x1="13" y1="10.2" x2="13" y2="11.4" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
          <line x1="17" y1="10.2" x2="17" y2="11.4" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
        </g>
      );
    case 'project':
      return (
        <g>
          <path d="M 11.5 15.2 L 15 10.2 L 18.5 15.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="11" y1="16" x2="19" y2="16" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      );
    case 'ticket':
      return (
        <g>
          <line x1="15" y1="9.6" x2="15" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="15" cy="16" r="1" fill={color} />
        </g>
      );
    case 'notice':
      return (
        <g>
          <circle cx="15" cy="10.2" r="1" fill={color} />
          <line x1="15" y1="12.2" x2="15" y2="16.4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};

function MapView({ onPin }) {
  const { state, dispatch, nav } = window.useStore();
  const D = window.CC_DATA;
  const filters = state.happeningFilters;

  // Pin positions on the abstract map
  const allPins = [];
  if (filters.events) D.events.filter((e) => !e.isNotice).forEach((e, i) => {
    allPins.push({ x: 25 + i % 4 * 15, y: 30 + Math.floor(i / 4) * 18 + i * 3 % 10, color: '#2E74B5', kind: 'event', id: e.id, label: e.name });
  });
  if (filters.events) D.communityEvents.forEach((e, i) => {
    allPins.push({ x: 30 + i % 3 * 18, y: 42 + i % 2 * 14, color: '#2E74B5', kind: 'event', id: e.id, label: e.name, community: true });
  });
  if (filters.projects) D.projects.forEach((p, i) => {
    allPins.push({ x: 70 - i % 3 * 18, y: 25 + i % 4 * 17, color: '#548235', kind: 'project', id: p.id, label: p.name, phaseNum: ({ design: 3, construction: 5 }[p.phase] || 2) });
  });
  if (filters.issues) {
    [...D.tickets, ...D.otherTickets, ...state.submittedTickets]
      .filter((t) => t.status !== 'Resolved')
      .forEach((t, i) => {
        allPins.push({ x: 35 + i % 5 * 11, y: 55 + i % 3 * 12 + i * 4 % 8, color: '#7030A0', kind: 'ticket', id: t.id, label: t.location, status: t.status });
    });
  }
  if (filters.notices) D.notices.filter((n) => !n.expired).forEach((n, i) => {
    allPins.push({ x: 50 + i % 3 * 10, y: 75 + i % 2 * 8, color: n.kind === 'alert' ? '#C65911' : '#D4A017', kind: 'notice', id: n.id, label: n.name });
  });

  return (
    <div style={{ padding: 16 }}>
      <div style={{ position: 'relative', width: '100%', height: 460, background: '#F5F1E8', border: '1.8px solid #222', borderRadius: '10px 14px 11px 13px', overflow: 'hidden' }}>
        {/* Grid */}
        <svg width="100%" height="100%" viewBox="0 0 100 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="gridp" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#D4CCA8" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="80" fill="url(#gridp)" />
          {/* Abstract land blobs */}
          <path d="M 5 20 Q 20 10 35 18 T 65 22 Q 80 18 95 25 L 95 65 Q 80 75 60 70 T 25 72 Q 10 75 5 65 Z" fill="#E8E0C8" stroke="#B8AC80" strokeWidth="0.3" />
          {/* Rivers / roads */}
          <path d="M 0 45 Q 30 40 50 48 T 100 50" stroke="#A4B8D4" strokeWidth="1" fill="none" />
          <path d="M 20 0 Q 25 30 30 50 T 35 80" stroke="#C8C8C8" strokeWidth="0.6" strokeDasharray="2 1" fill="none" />
          <path d="M 60 0 Q 65 25 70 45 T 75 80" stroke="#C8C8C8" strokeWidth="0.6" strokeDasharray="2 1" fill="none" />
          <path d="M 0 30 Q 40 28 80 32 L 100 33" stroke="#C8C8C8" strokeWidth="0.6" strokeDasharray="2 1" fill="none" />
        </svg>

        {/* Neighborhood labels */}
        <div style={{ position: 'absolute', top: 26, left: 14, fontSize: 14, fontStyle: 'italic', fontWeight: 500, color: '#7A6E40' }}>Nevillewood</div>
        <div style={{ position: 'absolute', top: 60, right: 18, fontSize: 14, fontStyle: 'italic', fontWeight: 500, color: '#7A6E40' }}>Rennerdale</div>
        <div style={{ position: 'absolute', bottom: 38, left: 30, fontSize: 14, fontStyle: 'italic', fontWeight: 500, color: '#7A6E40' }}>Walkers Mill</div>
        <div style={{ position: 'absolute', bottom: 16, right: 80, fontSize: 14, fontStyle: 'italic', fontWeight: 500, color: '#7A6E40' }}>Ewingsville</div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 16, fontStyle: 'italic', color: '#7A6E40', fontWeight: 700 }}>Presto</div>
        <div style={{ position: 'absolute', bottom: 8, right: 6, fontSize: 14, color: '#7A6E40' }}>Kirwan Heights</div>

        {/* "You are here" marker - anchored on the user's neighborhood */}
        <HomeMarker neighborhood={state.user.neighborhood} />

        {/* Pins */}
        {allPins.map((p, i) => {
          const hollow = p.kind === 'ticket' && p.status === 'Submitted';
          const fill = hollow ? '#FFF' : p.color;
          const stroke = hollow ? p.color : '#222';
          const glyphColor = p.color;
          const badge = p.kind === 'ticket' ? ticketBadgeColor(p.status) : null;
          return (
        <button key={i} onClick={() => onPin({ kind: p.kind, id: p.id })}
        style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          transform: 'translate(-50%, -100%)',
          width: 30, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0
        }}
        title={p.label}>
            <svg width="30" height="36" viewBox="0 0 30 36">
              <path d="M 15 34 C 15 34 27 22 27 13 A 12 12 0 1 0 3 13 C 3 22 15 34 15 34 Z" fill={fill} stroke={stroke} strokeWidth={hollow ? 2 : 1.5} />
              <circle cx="15" cy="13" r="6.2" fill="#FFF" stroke="#222" strokeWidth="0.6" />
              {p.community ? <circle cx="15" cy="13" r="2.6" fill="#2E74B5" /> : <PinGlyph kind={p.kind} color={glyphColor} />}
              {badge && <circle cx="23.5" cy="6.5" r="4.2" fill={badge} stroke="#FFF" strokeWidth="1.4" />}
              {p.kind === 'project' && p.phaseNum && <g><circle cx="23" cy="22" r="5.4" fill="#1F3864" stroke="#FFF" strokeWidth="1.2" /><text x="23" y="24.7" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#FFF">{p.phaseNum}</text></g>}
            </svg>
          </button>
          );
        })}
      </div>

      {/* What neighbors are following */}
      <div style={{ marginTop: 14, padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 10 }}>
        <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, marginBottom: 6 }}>What neighbors are following in Rennerdale</div>
        {[
        { id: 'pr2', kind: 'project', name: 'Boyce Road stormwater design', count: 87 },
        { id: 'TKT-2026-0817', kind: 'ticket', name: 'Pothole on Boyce at Hilltop', count: 54 },
        { id: 'e3', kind: 'event', name: 'Movies in the Park: The Princess Bride', count: 39 },
        { id: 'p3', kind: 'proposal', name: 'Hilltop Park Expansion', count: 31 },
        { id: 'e6', kind: 'event', name: 'Summer Concert: Bridgeville Brass', count: 22 }].
        map((f, i) => {
          const followed = !!state.followed[f.id];
          const go = () => {
            if (f.kind === 'proposal') nav({ name: 'decide', id: f.id });
            else onPin({ kind: f.kind, id: f.id });
          };
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i > 0 ? '1px dashed #E0E0E0' : 'none' }}>
              <button onClick={go} style={{ flex: 1, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#222', lineHeight: 1.3 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: '#595959' }}>{f.count + (followed ? 1 : 0)} following</div>
              </button>
              <button onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', id: f.id })}
                style={{
                  flexShrink: 0, fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
                  padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                  background: followed ? '#1F3864' : '#FFF',
                  color: followed ? '#FFF' : '#1F3864',
                  border: '1.5px solid #1F3864',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  whiteSpace: 'nowrap'
                }}
                aria-pressed={followed}>
                {followed ? '✓ Following' : '+ Follow'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 14, padding: 10, fontSize: 12, color: '#595959', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px' }}>
        {[
          { c: '#2E74B5', kind: 'event', l: 'Events' },
          { c: '#548235', kind: 'project', l: 'Projects' },
          { c: '#7030A0', kind: 'ticket', l: 'Tickets' },
          { c: '#D4A017', kind: 'notice', l: 'Notices & Alerts' }
        ].map((row) =>
        <span key={row.l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="22" viewBox="0 0 30 36" style={{ flexShrink: 0 }}>
            <path d="M 15 34 C 15 34 27 22 27 13 A 12 12 0 1 0 3 13 C 3 22 15 34 15 34 Z" fill={row.c} stroke="#222" strokeWidth="1.5" />
            <circle cx="15" cy="13" r="6.2" fill="#FFF" stroke="#222" strokeWidth="0.6" />
            <PinGlyph kind={row.kind} color={row.c} />
          </svg>
          {row.l}
        </span>
        )}
      </div>
    </div>);

}

// === Calendar view ===
function CalendarView({ onItem }) {
  const { state, dispatch } = window.useStore();
  const D = window.CC_DATA;
  const { Icon, SketchyButton } = window.CC_UI;
  const { nav } = window.useStore();
  const month = state.calMonth;
  const year = state.calYear;
  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long' });

  // Build day grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let day = 1 - firstDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    weeks.push(week);
    if (day > daysInMonth) break;
  }

  // Items by day
  const byDay = {};
  D.events.forEach((e) => {
    if (e.isNotice) {
      // brush collection week: spread across multi days
      [14, 15, 16, 17, 18].forEach((d) => {
        if (month === 6) {
          byDay[d] = byDay[d] || [];
          byDay[d].push({ kind: 'notice', id: 'n2', name: 'Brush', color: '#D4A017' });
        }
      });
    } else {
      const [y, m, d] = e.date.split('-').map(Number);
      if (y === year && m - 1 === month) {
        byDay[d] = byDay[d] || [];
        byDay[d].push({ kind: 'event', id: e.id, name: e.name, color: '#2E74B5' });
      }
    }
  });
  D.notices.forEach((n) => {
    const [y, m, d] = n.date.split('-').map(Number);
    if (y === year && m - 1 === month && n.id !== 'n2') {
      byDay[d] = byDay[d] || [];
      byDay[d].push({ kind: 'notice', id: n.id, name: n.name, color: n.kind === 'alert' ? '#C65911' : '#D4A017' });
    }
  });
  D.communityEvents.forEach((e) => {
    const [y, m, d] = e.date.split('-').map(Number);
    if (y === year && m - 1 === month) {
      byDay[d] = byDay[d] || [];
      byDay[d].push({ kind: 'event', id: e.id, name: e.name, color: '#2E74B5', community: true });
    }
  });
  // Construction multi-day
  if (month === 6) {
    for (let d = 15; d <= 31; d++) {
      byDay[d] = byDay[d] || [];
      byDay[d].push({ kind: 'notice', id: 'n3', name: 'Wash. Pike', color: '#C65911' });
    }
    [21, 22, 23].forEach((d) => {
      byDay[d] = byDay[d] || [];
      byDay[d].push({ kind: 'notice', id: 'n4', name: 'Boyce', color: '#C65911' });
    });
  }

  // Projects (placed on their last-update date) and tickets (on their submitted date),
  // so the green/purple palette in the legend actually appears on the calendar.
  const filters = state.happeningFilters;
  const short = (s) => (s || '').split(/[\s,]/)[0];
  if (filters.projects) D.projects.forEach((p) => {
    const dt = new Date(p.updateDate || '');
    if (!isNaN(dt) && dt.getFullYear() === year && dt.getMonth() === month) {
      const d = dt.getDate();
      byDay[d] = byDay[d] || [];
      byDay[d].push({ kind: 'project', id: p.id, name: short(p.name), color: '#548235' });
    }
  });
  if (filters.issues) [...D.tickets, ...D.otherTickets, ...state.submittedTickets]
    .filter((t) => t.status !== 'Resolved').forEach((t) => {
      const dt = new Date(t.date || '');
      if (!isNaN(dt) && dt.getFullYear() === year && dt.getMonth() === month) {
        const d = dt.getDate();
        byDay[d] = byDay[d] || [];
        byDay[d].push({ kind: 'ticket', id: t.id, name: short(t.location), color: '#7030A0' });
      }
    });

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => dispatch({ type: 'CAL_NAV', delta: -1 })} style={navBtnStyle}><Icon name="back" size={18} /></button>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#1F3864' }}>{monthName} {year}</div>
        <button onClick={() => dispatch({ type: 'CAL_NAV', delta: 1 })} style={navBtnStyle}><Icon name="chev" size={18} /></button>
      </div>

      <span data-tour="cal-subscribe" style={{ display: 'inline-block' }}>
        <SketchyButton small onClick={() => nav({ name: 'placeholder', kind: 'ical' })} style={{ marginBottom: 12 }} icon="cal">Subscribe to township calendar</SketchyButton>
      </span>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, fontSize: 11, color: '#595959', textAlign: 'center', marginBottom: 4, fontWeight: 600 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div data-tour="cal-view" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {weeks.flat().map((d, i) =>
        <div key={i} style={{
          aspectRatio: '1 / 1.1',
          background: d ? '#FFF' : '#F4F4F4',
          border: '1.2px solid ' + (d ? '#222' : '#E0E0E0'),
          borderRadius: 4,
          padding: 4,
          display: 'flex', flexDirection: 'column',
          minHeight: 56,
          overflow: 'hidden'
        }}>
            {d && <>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#222' }}>{d}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                {(byDay[d] || []).slice(0, 3).map((it, j) =>
              <button key={j} onClick={() => onItem({ kind: it.kind, id: it.id })}
              style={{ background: it.color, color: '#FFF', border: 'none', fontSize: 9, fontWeight: 600, padding: '1px 2px', borderRadius: 2, textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative' }}>
                    {it.community ? '◦ ' : ''}{it.name}
                  </button>
              )}
                {(byDay[d] || []).length > 3 && <div style={{ fontSize: 9, color: '#595959' }}>+{(byDay[d] || []).length - 3}</div>}
              </div>
            </>}
          </div>
        )}
      </div>

      <div style={{ marginTop: 14, padding: 10, fontSize: 12, color: '#595959', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {[['#2E74B5', 'Events'], ['#548235', 'Projects'], ['#7030A0', 'Tickets'], ['#D4A017', 'Notices'], ['#C65911', 'Alerts']].map(([c, l]) =>
        <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, border: '1px solid #222' }} />{l}
          </span>
        )}
      </div>
    </div>);

}

const navBtnStyle = { width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #1F3864', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F3864' };

// === List view ===
function ListView({ onItem }) {
  const { state } = window.useStore();
  const D = window.CC_DATA;
  const { Pill } = window.CC_UI;
  const filters = state.happeningFilters;

  const items = [];
  if (filters.events) D.events.filter((e) => !e.isNotice).forEach((e) => items.push({ date: e.date, time: e.time, name: e.name, location: e.location, desc: e.description, color: '#2E74B5', kind: 'event', id: e.id, badge: 'EVENT', caption: 'Township event' }));
  if (filters.events) D.communityEvents.forEach((e) => items.push({ date: e.date, time: e.time, name: e.name, location: e.location, desc: e.description, color: '#2E74B5', kind: 'event', id: e.id, badge: 'COMMUNITY', caption: 'Community event, organized by ' + e.organizer }));
  if (filters.notices) D.notices.filter((n) => !n.expired).forEach((n) => items.push({ date: n.date, time: n.dateLabel, name: n.name, location: n.area, desc: n.body, color: n.kind === 'alert' ? '#C65911' : '#D4A017', kind: 'notice', id: n.id, badge: n.kind === 'alert' ? 'ALERT' : 'NOTICE' }));
  if (filters.projects) D.projects.forEach((p) => items.push({ date: '2026-07-01', time: 'Ongoing', name: p.name, location: p.location, desc: p.update, color: '#548235', kind: 'project', id: p.id, badge: 'PROJECT' }));
  if (filters.issues) [...D.tickets, ...D.otherTickets, ...state.submittedTickets].filter((t) => t.status !== 'Resolved').forEach((t) => {
    items.push({ date: t.date, time: t.status, name: t.location, location: t.type, desc: t.description, color: '#7030A0', kind: 'ticket', id: t.id, badge: t.status.toUpperCase() });
  });

  items.sort((a, b) => a.date < b.date ? -1 : 1);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((it, i) =>
        <div key={i} data-tour={i === 0 ? 'event-card' : undefined} onClick={() => onItem({ kind: it.kind, id: it.id })} style={{
          display: 'flex', gap: 12, padding: 12,
          background: '#FFF',
          border: '1.5px solid #222', borderLeft: `5px solid ${it.color}`,
          borderRadius: '8px 11px 8px 10px', cursor: 'pointer'
        }}>
            <div style={{ minWidth: 60, fontSize: 12, color: '#595959', textAlign: 'center', borderRight: '1px dashed #BFBFBF', paddingRight: 8 }}>
              <div style={{ fontWeight: 700, color: '#1F3864', fontSize: 18 }}>{it.date.split('-')[2] || '·'}</div>
              <div>{new Date(it.date + 'T00:00').toLocaleDateString('en-US', { month: 'short' })}</div>
              <div style={{ marginTop: 4 }}>{it.time}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Pill bg="#F2F2F2" fg={it.color}>{it.badge}</Pill>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{it.name}</div>
              <div style={{ fontSize: 12, color: '#595959', marginBottom: 4 }}>{it.location}</div>
              {it.caption && <div style={{ fontSize: 11, color: '#2E74B5', fontWeight: 600, marginBottom: 4 }}>{it.caption}</div>}
              <div style={{ fontSize: 13, color: '#222', lineHeight: 1.4 }}>{it.desc}</div>
            </div>
          </div>
        )}
        {items.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#595959' }}>No items match your filters. Try enabling more chips above.</div>}
      </div>
    </div>);

}

// === Pin detail modal ===
function PinDetail({ detail, onClose }) {
  const { state, dispatch, nav } = window.useStore();
  const D = window.CC_DATA;
  const { SketchyButton, Icon, Pill, PhotoBox, Field } = window.CC_UI;
  const [expanded, setExpanded] = React.useState(true);
  const [dragHeight, setDragHeight] = React.useState(null);
  const [dragState, setDragState] = React.useState(null);
  const sheetRef = React.useRef(null);

  React.useEffect(() => {
    if (!dragState) return;
    const move = (ev) => {
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const dy = dragState.startY - y;
      const newH = dragState.startHeight + dy;
      const parent = sheetRef.current && sheetRef.current.parentElement;
      const parentH = parent ? parent.offsetHeight : window.innerHeight;
      const max = parentH * 0.95;
      const min = parentH * 0.28;
      setDragHeight(Math.max(min, Math.min(max, newH)));
    };
    const end = () => {
      setDragHeight((prev) => {
        if (prev !== null) {
          const parent = sheetRef.current && sheetRef.current.parentElement;
          const parentH = parent ? parent.offsetHeight : window.innerHeight;
          const halfPx = parentH * 0.5;
          setExpanded(prev > halfPx + 60);
        }
        return null;
      });
      setDragState(null);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
  }, [dragState]);

  const startDrag = (ev) => {
    const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
    const h = sheetRef.current ? sheetRef.current.offsetHeight : window.innerHeight * 0.5;
    setDragState({ startY: y, startHeight: h });
    ev.preventDefault();
  };

  let item = null;
  if (detail.kind === 'event') item = [...D.events, ...D.communityEvents].find((e) => e.id === detail.id);
  if (detail.kind === 'project') item = D.projects.find((p) => p.id === detail.id);
  if (detail.kind === 'ticket') item = [...D.tickets, ...D.otherTickets, ...state.submittedTickets].find((t) => t.id === detail.id);
  if (detail.kind === 'notice') item = D.notices.find((n) => n.id === detail.id);
  if (!item) return null;

  const sheetHeight = dragHeight !== null ? dragHeight + 'px' : (expanded ? '95%' : '50%');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    onClick={onClose}>
      <div ref={sheetRef} onClick={(e) => e.stopPropagation()} style={{
        background: '#FAFAF7', width: '100%', maxWidth: 560, height: sheetHeight,
        borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        transition: dragState ? 'none' : 'height 250ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Header: expand toggle + drag handle + close */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1.5px solid #E0E0E0', background: '#FFF', borderRadius: '16px 16px 0 0' }}>
          <button onClick={() => setExpanded((e) => !e)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px',
            color: '#1F3864', fontSize: 12, fontWeight: 600
          }} aria-label={expanded ? 'Collapse to half height' : 'Expand to full height'}>
            <Icon name={expanded ? 'chevDown' : 'chev'} size={14} color="#1F3864" strokeWidth={2.2} />
            <span>{expanded ? 'Collapse' : 'Expand'}</span>
          </button>

          <div
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            style={{
              flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: dragState ? 'grabbing' : 'grab', padding: '8px 4px',
              touchAction: 'none', userSelect: 'none'
            }}
            aria-label="Drag to resize"
            role="separator">
            <div style={{ width: 44, height: 4, background: '#BFBFBF', borderRadius: 2 }} />
          </div>

          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px',
            color: '#1F3864', fontSize: 12, fontWeight: 600
          }} aria-label="Close">
            <span>Close</span>
            <Icon name="close" size={14} color="#1F3864" strokeWidth={2.2} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          {detail.kind === 'event' && <EventDetail e={item} onClose={onClose} />}
          {detail.kind === 'project' && <ProjectDetail p={item} onClose={onClose} />}
          {detail.kind === 'ticket' && <TicketDetail t={item} onClose={onClose} />}
          {detail.kind === 'notice' && <NoticeDetail n={item} onClose={onClose} />}
        </div>
      </div>
    </div>);

}

function EventDetail({ e, onClose }) {
  const { state, dispatch, nav, guardedSubmit } = window.useStore();
  const { SketchyButton, Icon, Pill, PhotoBox, Field } = window.CC_UI;
  const rsvp = state.rsvps[e.id];
  const followed = !!state.followed[e.id];
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([
  { author: 'Collier Resident from Presto', body: 'Bringing the kids and the dog. See you there.', date: 'Jul 6' },
  { author: 'Collier Resident from Ewingsville', body: 'What about parking? Lot was full last year.', date: 'Jul 5' },
  { author: 'Parks & Rec - Rita Chen', body: 'Overflow parking opens at the Municipal Building lot, 5-min walk.', date: 'Jul 5', staff: true }]
  );

  return (
    <div>
      <Pill bg="#DBE5F1" fg="#1F3864">{e.community ? 'COMMUNITY EVENT' : 'EVENT'}</Pill>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#1F3864', lineHeight: 1.2, marginTop: 6 }}>{e.name}</div>
      <div style={{ fontSize: 14, color: '#595959', marginTop: 4 }}>{window.prettyDate(e.date)} · {e.time}</div>
      {e.community && (
        <div style={{ fontSize: 13, color: '#595959', marginTop: 2 }}>
          Organized by {e.organizerGroup ? `${e.organizerGroup} (contact: ${e.organizer})` : e.organizer}
        </div>
      )}
      <div style={{ fontSize: 14, color: '#222', marginTop: 2 }}>📍 {e.location}</div>
      <PhotoBox src={window.EVENT_PHOTOS[e.id]} alt={e.name} height={160} style={{ marginTop: 12 }} />
      <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5 }}>{e.description}</div>

      <div style={{ marginTop: 16, padding: 12, background: '#F2F2F2', borderRadius: 8 }}>
        <div style={{ fontSize: 13, color: '#595959', marginBottom: 8 }}>Are you going? ({(e.attending || 0) + (rsvp === 'yes' ? 1 : 0)} attending)</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['yes', 'I\u0027ll be there'], ['maybe', 'Maybe'], ['no', 'Can\u0027t make it']].map(([k, l]) =>
          <button key={k} onClick={() => dispatch({ type: 'SET_RSVP', eventId: e.id, choice: k })}
          style={{
            flex: 1, padding: '8px 6px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            background: rsvp === k ? '#1F3864' : '#FFF', color: rsvp === k ? '#FFF' : '#222',
            border: '1.5px solid #1F3864', borderRadius: 6, cursor: 'pointer'
          }}>{l}</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <SketchyButton small onClick={() => nav({ name: 'placeholder', kind: 'calendar' })} icon="cal">Add to my calendar</SketchyButton>
        <window.CC_UI.FollowButton id={e.id} type="event" />
        {e.community && (
          <SketchyButton small onClick={() => nav({ name: 'placeholder', kind: 'organizer', label: 'Email ' + e.organizer })} icon="chat">Contact organizer</SketchyButton>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700 }}>Comments</div>
        {comments.map((c, i) =>
        <div key={i} style={{ padding: 10, marginBottom: 8, background: c.staff ? '#FFF4D6' : '#FFF', border: '1.5px solid ' + (c.staff ? '#D4A017' : '#BFBFBF'), borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: c.staff ? '#7A5A00' : '#1F3864' }}>{c.author} · <span style={{ color: '#595959', fontWeight: 400 }}>{c.date}</span></div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{c.body}</div>
          </div>
        )}
        <window.PostingGuidance />
        <Field label="Add a comment" multiline value={comment} onChange={setComment} placeholder="Say something neighborly..." />
        <SketchyButton primary small disabled={comment.length < 5} onClick={() => guardedSubmit(() => {setComments([...comments, { author: state.displayName, body: comment, date: 'Just now' }]);setComment('');})}>Post comment</SketchyButton>
      </div>
    </div>);

}

function ProjectDetail({ p }) {
  const { state, dispatch, nav } = window.useStore();
  const { SketchyButton, Pill, PhotoBox, Icon } = window.CC_UI;
  const followed = !!state.followed[p.id];
  const [openPhase, setOpenPhase] = React.useState(null);
  const phases = ['Proposed', 'Approved', 'Design', 'Bid', 'Construction', 'Complete'];
  const phaseIdx = { design: 2, construction: 4 }[p.phase] || 1;

  return (
    <div>
      <Pill bg="#E6F2DD" fg="#548235">TOWNSHIP PROJECT</Pill>
      <div style={{ fontSize: 30, color: '#1F3864', fontWeight: 700, marginTop: 6 }}>{p.name}</div>
      <div style={{ fontSize: 14, color: '#595959' }}>📍 {p.location}</div>
      <div style={{ marginTop: 6 }}><Pill bg="#E6F2DD" fg="#548235">{p.status}</Pill></div>

      {/* Phase tracker */}
      <div style={{ marginTop: 16, padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#595959' }}>PROJECT PHASE</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#548235', background: '#E6F2DD', border: '1px solid #548235', borderRadius: 999, padding: '2px 8px' }}>{p.status}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {phases.map((ph, i) => {
            const isDone = i < phaseIdx;
            const isCurrent = i === phaseIdx;
            const completedAt = p.phaseHistory && p.phaseHistory[ph];
            const clickable = isDone && completedAt;
            return (
            <React.Fragment key={ph}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 0 }}>
                <button
                  onClick={clickable ? () => setOpenPhase(openPhase === ph ? null : ph) : undefined}
                  disabled={!clickable}
                  aria-label={clickable ? `${ph} - see completion date` : ph}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', padding: 0,
                    background: isDone ? '#1F3864' : isCurrent ? '#FFF4D6' : '#FFF',
                    border: '2px solid ' + (i <= phaseIdx ? '#1F3864' : '#BFBFBF'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: isDone ? '#FFF' : '#222', fontWeight: 700,
                    cursor: clickable ? 'pointer' : 'default',
                    fontFamily: 'inherit',
                    boxShadow: openPhase === ph ? '0 0 0 3px rgba(31,56,100,0.25)' : 'none'
                  }}>{isDone ? '✓' : i + 1}</button>
                <div style={{ fontSize: 9, marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap', color: isCurrent ? '#1F3864' : '#595959', fontWeight: isCurrent ? 700 : 400 }}>{ph}</div>
              </div>
              {i < phases.length - 1 && <div style={{ flex: 1, height: 2, background: i < phaseIdx ? '#1F3864' : '#BFBFBF', margin: '0 2px', marginBottom: 14 }} />}
            </React.Fragment>
            );
          })}
        </div>

        {openPhase && p.phaseHistory && p.phaseHistory[openPhase] && (
          <div style={{ marginTop: 12, padding: 10, background: '#DBE5F1', border: '1.5px solid #1F3864', borderRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icon name="check" size={15} color="#1F3864" strokeWidth={2.4} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1F3864' }}>{openPhase} phase completed</div>
              <div style={{ fontSize: 12, color: '#222', marginTop: 1 }}>Marked complete by the township on <strong>{p.phaseHistory[openPhase]}</strong></div>
            </div>
            <button onClick={() => setOpenPhase(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} aria-label="Close">
              <Icon name="close" size={13} color="#1F3864" />
            </button>
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 11, color: '#595959', fontStyle: 'italic' }}>Tip: tap a completed (✓) phase to see when it finished.</div>

        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #E0E0E0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="refresh" size={13} color="#595959" />
          <span style={{ fontSize: 11.5, color: '#595959' }}>Phase last updated by the township <strong style={{ color: '#222', fontWeight: 600 }}>{p.phaseUpdated}</strong></span>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.5 }}>{p.description}</div>

      <div style={{ marginTop: 14, padding: 12, background: '#FFF4D6', border: '1.8px solid #D4A017', borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#7A5A00', marginBottom: 4 }}>LATEST UPDATE · {p.updateDate}</div>
        <div style={{ fontSize: 14, color: '#222' }}>{p.update}</div>
        <div style={{ fontSize: 12, color: '#7A5A00', marginTop: 4 }}>- {p.staff}</div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <window.CC_UI.FollowButton id={p.id} type="project" />
        <SketchyButton small onClick={() => nav({ name: 'placeholder', kind: 'pdf', label: 'Project documents' })} icon="doc">View documents</SketchyButton>
      </div>

      <window.CC_UI.ItemComments title="Discussion" seed={PROJECT_COMMENTS[p.id] || []} sortable placeholder="Ask a question, share a concern, or offer support..." />
    </div>);

}

const TICKET_STAGES = [
  { label: 'Submitted by you', est: 'Logged the moment you hit submit.' },
  { label: 'Received and under review', est: 'Most tickets stay here 1 to 3 business days.' },
  { label: 'Approved for work', est: 'Approved tickets move on to planning.' },
  { label: 'Planning the details', est: 'Most tickets are in this stage 3 to 14 days.' },
  { label: 'Being worked on', est: 'Can be a single visit or several days of work.' },
  { label: 'Resolved', est: 'Complete - with a public note on what was done.' }
];

function ticketStageIndex(status) {
  switch (status) {
    case 'Submitted': return 0;
    case 'Received': case 'Under Review': case 'Needs more info': return 1;
    case 'Approved for work': case 'Escalated': return 2;
    case 'Planning': case 'Planning the details': return 3;
    case 'In Progress': return 4;
    case 'Resolved': return 5;
    case 'Declined': return 2;
    default: return 1;
  }
}

function TicketPhaseTracker({ t }) {
  const declined = t.status === 'Declined';
  const resolved = t.status === 'Resolved';
  const mine = t.owner === 'Jane';
  const idx = ticketStageIndex(t.status);
  const [open, setOpen] = React.useState(null);
  // For a declined ticket, the timeline ends at stage 2 (shown as Declined).
  const count = declined ? 3 : 6;

  return (
    <div data-tour="ticket-phases" style={{ marginTop: 14, padding: '14px 14px 8px', background: '#FFF', border: '1.5px solid #222', borderRadius: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#595959', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Ticket progress</div>
      {TICKET_STAGES.slice(0, count).map((st, i) => {
        const isDeclinedNode = declined && i === 2;
        const done = !isDeclinedNode && (resolved ? true : i < idx);
        const current = !resolved && !isDeclinedNode && i === idx;
        const last = i === count - 1;
        const lineColor = (resolved || i < idx) ? '#1F3864' : '#BFBFBF';
        const label = isDeclinedNode ? 'Declined' : (i === 0 && !mine ? 'Submitted' : st.label);

        let circleBg = '#FFF', circleBorder = '#BFBFBF', circleColor = '#222', content = i + 1;
        if (done) { circleBg = '#1F3864'; circleBorder = '#1F3864'; circleColor = '#FFF'; content = '✓'; }
        else if (current) { circleBg = '#FFF4D6'; circleBorder = '#1F3864'; circleColor = '#1F3864'; }
        if (isDeclinedNode) { circleBg = '#FBE0E0'; circleBorder = '#C00000'; circleColor = '#C00000'; content = '✕'; }

        return (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: circleBg, border: '2px solid ' + circleBorder, color: circleColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                animation: current ? 'pulse 2s infinite' : 'none'
              }}>{content}</div>
              {!last && <div style={{ flex: 1, width: 2, minHeight: 18, background: lineColor, margin: '2px 0' }} />}
            </div>
            <div style={{ paddingBottom: last ? 2 : 14, flex: 1 }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                fontSize: 14, lineHeight: 1.25,
                fontWeight: (current || isDeclinedNode) ? 800 : (done ? 600 : 500),
                color: isDeclinedNode ? '#C00000' : (current ? '#1F3864' : done ? '#222' : '#595959')
              }}>{label}</button>
              {open === i && !isDeclinedNode && (
                <div style={{ fontSize: 11.5, color: '#595959', marginTop: 3, lineHeight: 1.4 }}>{st.est}</div>
              )}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: '#595959', fontStyle: 'italic', marginTop: 2 }}>Tip: tap a stage to see how long it usually takes.</div>
    </div>
  );
}

function TicketDetail({ t }) {
  const { state, dispatch, nav, guardedSubmit } = window.useStore();
  const { SketchyButton, Pill, Field, Icon, LikertScale, FeedbackValueReminder } = window.CC_UI;
  const statusColors = {
    'Submitted': ['#595959', '#F2F2F2'],
    'Received': ['#2E74B5', '#DBE5F1'],
    'Under Review': ['#2E74B5', '#DBE5F1'],
    'Approved for work': ['#7A5A00', '#FFF4D6'],
    'Planning': ['#2E74B5', '#DBE5F1'],
    'In Progress': ['#C65911', '#FBE5D6'],
    'Resolved': ['#548235', '#E6F2DD'],
    'Needs more info': ['#7A5A00', '#FFF4D6'],
    'Declined': ['#C00000', '#FBE0E0'],
    'Escalated': ['#7030A0', '#EFE0F4']
  };
  const [c, cBg] = statusColors[t.status] || ['#C00000', '#FBE0E0'];
  const [thanks, setThanks] = React.useState('');
  const [resolvedRating, setResolvedRating] = React.useState(0);
  const affectedCount = (t.affected || 0) + (state.affectsMe[t.id] ? 1 : 0);
  const replied = state.ticketReplies && state.ticketReplies[t.id];
  const mine = t.owner === 'Jane';

  // Plain-language status message by stage (six-stage model)
  const statusMsg = (() => {
    if (!mine) {
      // Another resident's ticket, viewed by Jane: neutral, third-person, no personal actions.
      const staff = t.staff || 'The Manager\u0027s Office';
      switch (t.status) {
        case 'Submitted': return { body: 'Submitted and awaiting the township\u0027s confirmation of receipt.' };
        case 'Received': case 'Under Review': return { body: 'Received on ' + (t.receivedDate || t.reviewedDate || t.date) + '. ' + staff + ' is reviewing it.' };
        case 'Approved for work': return { body: 'Approved on ' + (t.approvedDate || t.date) + '. Assigned to ' + (t.department || 'the right department') + '. ' + staff + ' is responsible.' };
        case 'Planning': return { body: 'In planning. ' + staff + ' is working out timing, materials, and coordination.' };
        case 'In Progress': return { body: 'Work in progress as of ' + (t.inProgressDate || t.date) + '. Expected to be complete by ' + (t.completeBy || 'soon') + '.' };
        case 'Resolved': return { body: 'Resolved on ' + (t.resolvedDate || '') + '. ' + (t.response ? t.response.body : 'The ticket was addressed.'), sig: t.response ? t.response.staff : t.staff };
        case 'Needs more info': return { body: 'The township asked the resident who submitted this for more information before it can move forward.' };
        case 'Declined': return { body: 'Declined on ' + (t.declinedDate || t.date) + '. ' + (t.reviewerNote || ''), sig: t.reviewer || t.staff };
        case 'Escalated': return { body: 'This ticket was escalated to a township project because many neighbors reported the same thing. Follow the project below to track the work.' };
        default: return { body: 'This ticket is in the township\u0027s queue.' };
      }
    }
    switch (t.status) {
      case 'Submitted': return { body: 'Your ticket is submitted. The township confirms receipt within one business day.' };
      case 'Received': case 'Under Review': return { body: 'Received on ' + (t.receivedDate || t.reviewedDate || t.date) + '. ' + (t.staff || 'The Manager\u0027s Office') + ' will complete the review within three business days.' };
      case 'Approved for work': return { body: 'Approved on ' + (t.approvedDate || t.date) + '. Assigned to ' + (t.department || 'the right department') + '. ' + (t.staff || 'A staff member') + ' is the person responsible. They will let you know when planning is complete.' };
      case 'Planning': return { body: 'Planning is underway. ' + (t.staff || 'The responsible department') + ' is working on timing, materials, and any needed coordination. The work will be scheduled soon.' };
      case 'In Progress': return { body: 'Work in progress. Crews are on it as of ' + (t.inProgressDate || t.date) + '. Expected to be complete by ' + (t.completeBy || 'soon') + '.' };
      case 'Resolved': return { body: 'Resolved on ' + (t.resolvedDate || '') + '. Here is what we did: ' + (t.response ? t.response.body : 'the ticket was addressed.') + ' If you see this come back, please report it again. We appreciate you helping keep Collier in good shape.', sig: t.response ? t.response.staff : t.staff };
      case 'Needs more info': return { body: 'The reviewer has a question before this can move forward. ' + (t.reviewerNote || ''), sig: t.staff, needsReply: true };
      case 'Declined': return { body: 'Declined on ' + (t.declinedDate || t.date) + '. ' + (t.reviewerNote || ''), sig: t.reviewer || t.staff, declined: true };
      case 'Escalated': return { body: 'This ticket was escalated to a township project because many neighbors reported the same thing. Follow the project below to track the work.' };
      default: return { body: 'Your ticket is in.' };
    }
  })();

  return (
    <div>
      <Pill bg={cBg} fg={c}>RESIDENT TICKET · {t.status.toUpperCase()}</Pill>
      <div style={{ fontSize: 28, color: '#1F3864', fontWeight: 700, marginTop: 6, lineHeight: 1.2 }}>{t.location}</div>
      <div style={{ fontSize: 13, color: '#595959', marginTop: 2 }}>{t.type} · {t.date} · {mine ? 'Submitted by you' : 'Submitted by ' + (t.submittedBy || 'a neighbor')}</div>

      {/* Phase tracker */}
      <TicketPhaseTracker t={t} />

      {/* Status message bar */}
      <div style={{ marginTop: 12, padding: '12px 14px', background: cBg, borderLeft: '8px solid ' + c, borderRadius: '4px 8px 8px 4px' }}>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.5 }}>{statusMsg.body}</div>
        {statusMsg.sig && <div style={{ fontSize: 12, color: '#595959', marginTop: 6, fontStyle: 'italic' }}>- {statusMsg.sig}</div>}
        {statusMsg.needsReply && (
          replied ? (
            <div style={{ marginTop: 10, fontSize: 13, color: '#548235', fontWeight: 600 }}>✓ Your reply was sent to {t.staff}.</div>
          ) : (
            <div style={{ marginTop: 10 }}>
              <SketchyButton small icon="chat" onClick={() => { dispatch({ type: 'REPLY_TICKET', id: t.id }); nav({ name: 'placeholder', kind: 'email', label: 'Reply to ' + t.staff, returnTo: { name: 'happening', detail: { kind: 'ticket', id: t.id } } }); }}>Reply to reviewer</SketchyButton>
            </div>
          )
        )}
        {statusMsg.declined && (
          <div style={{ marginTop: 10 }}>
            <SketchyButton small icon="refresh" onClick={() => nav({ name: 'speak', screen: 'submit' })}>Revise and resubmit</SketchyButton>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5 }}>{t.description}</div>

      <div style={{ marginTop: 14, padding: 10, background: '#F2F2F2', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <SketchyButton small onClick={() => dispatch({ type: 'TOGGLE_AFFECTS', id: t.id })}>{state.affectsMe[t.id] ? '✓ This affects me too' : 'This affects me too'}</SketchyButton>
        <div style={{ fontSize: 13, color: '#595959' }}>{affectedCount} neighbors affected</div>
        <span data-tour="ticket-follow" style={{ marginLeft: 'auto' }}><window.CC_UI.FollowButton id={t.id} type="ticket" /></span>
      </div>

      {t.response &&
      <div style={{ marginTop: 14, padding: 12, background: '#FFF4D6', border: '1.8px solid #D4A017', borderRadius: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#7A5A00', marginBottom: 4 }}>RESPONSE FROM TOWNSHIP</div>
          <div style={{ fontSize: 14 }}>{t.response.body}</div>
          <div style={{ fontSize: 12, color: '#7A5A00', marginTop: 6 }}>- {t.response.staff}</div>
        </div>
      }

      {t.linkedProject &&
      <div style={{ marginTop: 14, padding: 10, background: '#EFE0F4', border: '1.5px solid #7030A0', borderRadius: 8, fontSize: 13 }}>
          🔗 Escalated to township project: <strong>{t.linkedProject}</strong>
        </div>
      }

      {mine && t.status === 'Resolved' &&
      <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800 }}>How was this resolved?</div>
          <div style={{ fontSize: 13, color: '#595959', marginBottom: 8 }}>Your rating helps the township track service quality.</div>
          <FeedbackValueReminder />
          <LikertScale value={resolvedRating} onChange={setResolvedRating} labelSet="satisfaction" ariaLabel="How was this resolved?" />

          <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800, marginTop: 18 }}>Leave a thank-you</div>
          {state.thanks[t.id] ?
        <div style={{ padding: 10, background: '#E6F2DD', border: '1.5px solid #548235', borderRadius: 8, fontSize: 13, color: '#548235', marginTop: 6 }}>✓ Thanks shared with {t.response ? t.response.staff : 'Public Works'}. Your rating and note go into the township's monthly review.</div> :

        <>
              <window.PostingGuidance />
              <Field label="Your thanks" multiline value={thanks} onChange={setThanks} placeholder="Thanks so much, really appreciate it..." />
              <SketchyButton primary small disabled={thanks.length < 5} onClick={() => guardedSubmit(() => {dispatch({ type: 'THANK', ticketId: t.id });setThanks('');})}>Send thanks</SketchyButton>
            </>
        }
        </div>
      }

      {/* Comment thread — same component as events, projects, and proposals */}
      <window.CC_UI.ItemComments
        title="Comments"
        seed={SEED_TICKET_COMMENTS[t.id] || []}
        sortable
        placeholder="Add context, ask a question, or support a neighbor's report..." />
    </div>);

}

function ContentTypesModal({ onClose }) {
  const { SketchyButton } = window.CC_UI;
  const Block = ({ color, title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: '#1F3864' }}>{title}</span>
      </div>
      <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.55 }}>{children}</div>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Tickets, notices, and alerts: what's the difference?</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', flexShrink: 0, fontSize: 16, color: '#222' }} aria-label="Close">✕</button>
        </div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.55, marginBottom: 16 }}>These three things all show up on the map and in the calendar. They look different and behave differently because they serve different purposes.</div>
        <Block color="#7030A0" title="Tickets">
          <strong>Come from residents like you.</strong> When you or a neighbor reports a pothole, a broken streetlight, an overgrown trail, or any other problem, that becomes a ticket. Tickets get assigned to township staff, who work through a six-step process to either resolve them or explain why they cannot. Tap a ticket to see exactly what stage it is in - the pin color changes from gray (submitted) to blue (planning) to orange (in progress) to dark green (resolved), or red if it was declined.
        </Block>
        <Block color="#D4A017" title="Notices">
          <strong>Come from the township.</strong> They tell you about routine, scheduled, or expected things - brush collection week, holiday garbage delays, library closures, leaf pickup. Notices are amber on the map and in the calendar. You can set how you hear about them in Profile, under Notifications.
        </Block>
        <Block color="#C65911" title="Alerts">
          <strong>Also come from the township, but they are urgent.</strong> They tell you about things that need your attention right now or very soon - a road closure, a water main break, an emergency weather warning. Alerts are orange and can send you a real-time notification when something new pops up.
        </Block>
        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.55, marginBottom: 18, padding: 12, background: '#F2F2F2', borderRadius: 8 }}>One more thing: an alert can be linked to a township project, like a road resurfacing. When it is, you can open the alert and tap through to the full project timeline - so you understand not just that the road is closed, but why and for how long.</div>
        <SketchyButton primary onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Close</SketchyButton>
      </div>
    </div>
  );
}

function NoticeDetail({ n }) {
  const { state, dispatch, nav, guardedSubmit } = window.useStore();
  const { SketchyButton, Pill, Field } = window.CC_UI;
  const isAlert = n.kind === 'alert';
  const followed = !!state.followed[n.id];
  const affectedCount = (n.affected || 6) + (state.affectsMe[n.id] ? 1 : 0);
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState(SEED_NOTICE_COMMENTS[n.id] || []);
  return (
    <div>
      <Pill bg={isAlert ? '#FBE5D6' : '#FFF4D6'} fg={isAlert ? '#C65911' : '#7A5A00'}>{isAlert ? 'ALERT' : 'NOTICE'}</Pill>
      <div style={{ fontSize: 28, color: '#1F3864', fontWeight: 700, marginTop: 6, lineHeight: 1.2 }}>{n.name}</div>
      <div style={{ fontSize: 13, color: '#595959', marginTop: 2 }}>{n.dateLabel}</div>
      <div style={{ marginTop: 8, fontSize: 14 }}><strong>Affected area:</strong> {n.area}</div>
      <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5 }}>{n.body}</div>

      <div style={{ marginTop: 14, padding: 10, background: '#F2F2F2', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <SketchyButton small onClick={() => dispatch({ type: 'TOGGLE_AFFECTS', id: n.id })}>{state.affectsMe[n.id] ? '✓ This affects me too' : 'This affects me too'}</SketchyButton>
        <div style={{ fontSize: 13, color: '#595959' }}>{affectedCount} neighbors affected</div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <SketchyButton small onClick={() => nav({ name: 'placeholder', kind: 'calendar' })} icon="cal">Add to my calendar</SketchyButton>
        <window.CC_UI.FollowButton id={n.id} type={isAlert ? 'alert' : 'notice'} name={n.name} archived={!!n.expired} />
      </div>

      <window.CC_UI.ItemComments
        title="Comments"
        seed={SEED_NOTICE_COMMENTS[n.id] || []}
        sortable={isAlert}
        readOnly={!!n.expired}
        banner={isAlert ? 'Comments are open until this alert is resolved or expires.' : `Comments are open until this notice expires${n.dateLabel ? ' (' + n.dateLabel + ')' : ''}.`}
        closedBanner={isAlert ? 'Comments are closed because this alert has ended. The discussion is preserved above for reference.' : 'Comments are closed because this notice has expired. The discussion is preserved above for reference.'}
        placeholder={isAlert ? 'Share what you\u0027re seeing on the ground.' : 'Ask a question or add context for your neighbors.'} />
    </div>);

}

// Seeded comment threads on resident tickets (Round 3 addendum reaffirmation).
const SEED_TICKET_COMMENTS = {
  // Boyce Road pothole (Jane's ticket, In Progress)
  'TKT-2026-0817': [
    { author: 'Collier Resident from Rennerdale', body: 'Hit this one on the way to work and it rattled my whole car. Glad it is finally getting worked on.', date: '6 days ago', up: 9 },
    { author: 'Carol from Presto', body: 'It is right on the school bus route too - the buses crawl around it every morning. Thank you for reporting.', date: '5 days ago', up: 6 },
    { author: 'Public Works - Jen Murphy', staff: true, body: 'Crews have this scheduled for the week of July 21. We will patch the worst of it first, then crack-seal the surrounding stretch. Thanks for your patience, everyone.', date: '4 days ago', up: 12 },
    { author: 'Collier Resident from Rennerdale', body: 'Appreciate the update, Jen. Will the patch hold through winter, or is this a stopgap until a full repave?', date: '3 days ago', up: 3 }
  ],
  // Streetlight on Chartiers Creek Road (Resolved)
  'TKT-2026-0834': [
    { author: 'Tom from Ewingsville', body: 'That bend is genuinely dangerous in the dark - I nearly missed the turn twice last week. Thank you for flagging it.', date: '2 weeks ago', up: 8 },
    { author: 'Collier Resident from Rennerdale', body: 'Same here. My teenager walks home from practice this way and a working light makes a real difference.', date: '12 days ago', up: 5 },
    { author: 'Public Works - Jen Murphy', staff: true, body: 'Replaced the failed photocell on July 2 and confirmed the bulb is working. If it goes out again, please report it - this is the second outage this year, so we may swap the whole fixture this fall.', date: '10 days ago', up: 11 },
    { author: 'Tom from Ewingsville', body: 'Confirmed it is on and bright as of last night. Thanks Jen and the crew.', date: '9 days ago', up: 4 }
  ]
};

const SEED_NOTICE_COMMENTS = {
  n1: [
    { author: 'Collier Resident from Ewingsville', body: 'Reminder for the cul-de-sac side of Webb - last year they came in the afternoon. Hope it sticks this time.', date: 'Jul 3' }
  ],
  // Brush Collection Week (notice)
  n2: [
    { author: 'Collier Resident from Nevillewood', body: 'Does this include grass clippings or only larger brush?', date: '6 days ago', up: 3 },
    { author: 'Public Works - Jen Murphy', staff: true, body: 'Brush only. Grass clippings should go in your regular trash or be composted at home. The county also has a free compost site if you have a lot of clippings.', date: '5 days ago', up: 7 },
    { author: 'Collier Resident from Ewingsville', body: 'Same question, glad someone asked. Thanks Jen for clarifying.', date: '4 days ago', up: 2 },
    { author: 'Collier Resident (anonymous)', body: 'Last year my street got missed entirely. Hoping for better this time.', date: '2 days ago', up: 5 }
  ],
  // Washington Pike Construction (alert)
  n3: [
    { author: 'Collier Resident from Fort Pitt', body: 'Anyone know if school buses are still using this route in August?', date: '1 day ago', up: 4 },
    { author: 'Carol from Presto', body: 'I called the school district. They said yes, with a 5-minute earlier departure time to allow for the slowdown.', date: '1 day ago', up: 11 },
    { author: 'Engineering - Mike Sullivan', staff: true, body: 'Thanks Carol for confirming. We coordinated with the district last month. The earlier departure will continue through end of September.', date: '12 hours ago', up: 9 },
    { author: 'Collier Resident from Kirwan Heights', body: 'Tried the Hilltop detour this morning, it was a nightmare. Webb Road might be a better alternative for now.', date: '8 hours ago', up: 6 },
    { author: 'Tom from Ewingsville', body: 'Webb is also busier than usual but you\u0027re right, it moves better. Especially before 7:30 or after 9.', date: '6 hours ago', up: 3 },
    { author: 'Collier Resident from Nevillewood', body: 'Thanks for the tips, everyone. This thread is more useful than any traffic app.', date: '4 hours ago', up: 14 }
  ],
  n4: [
    { author: 'Collier Resident from Rennerdale', body: 'How do delivery trucks get in? UPS won\u0027t leave packages if access is blocked.', date: 'Jul 6' },
    { author: 'Public Works - Jen Murphy', staff: true, body: 'Residents and deliveries can use the driveway side. Flaggers will direct. Trucks over 20ft will be routed via Chartiers Creek.', date: 'Jul 6' }
  ]
};

// Project Discussion threads (keyed by project id)
const PROJECT_COMMENTS = {
  pr1: [
    { author: 'Carol from Presto', body: 'I\u0027ve been waiting for this for years. The kids cross there every morning and I always worried. Glad to see it actually happening.', date: '5 days ago', up: 12 },
    { author: 'Collier Resident from Fort Pitt', body: 'Will the crossing guard be there during construction or only after?', date: '5 days ago', up: 2 },
    { author: 'Engineering - Mike Sullivan', staff: true, body: 'Crossing guard will be there starting August 25, when school resumes. During construction over the summer, we will have flaggers on site whenever crews are working in the crosswalk area itself.', date: '4 days ago', up: 8 },
    { author: 'Collier Resident from Fort Pitt', replyTo: 'Engineering - Mike Sullivan', body: 'Thanks Mike, that\u0027s exactly what I needed to know.', date: '4 days ago', up: 1 },
    { author: 'Collier Resident (anonymous)', body: 'What\u0027s the projected impact on traffic on Boyce during construction? That\u0027s the alternate route most people take.', date: '3 days ago', up: 4 },
    { author: 'Engineering - Mike Sullivan', staff: true, replyTo: 'Collier Resident (anonymous)', body: 'Good question. We estimate roughly 15 percent additional traffic on Boyce during peak hours from 4-6pm. The Boyce stormwater work happens on July 21-23, so we are spacing things out to avoid both projects being active in that corridor at the same time.', date: '3 days ago', up: 10 },
    { author: 'Tom from Ewingsville', body: 'Concerned about the timeline. Will this really be done by end of September? Past projects always run over.', date: '2 days ago', up: 5 },
    { author: 'Engineering - Mike Sullivan', staff: true, replyTo: 'Tom from Ewingsville', body: 'Honest answer: end of September is the target. Weather and material delivery can affect it. I will post updates here when any timeline changes happen, and the project\u0027s phase tracker will reflect the actual progress.', date: '1 day ago', up: 13 }
  ],
  pr3: [
    { author: 'Collier Resident from Presto', body: 'Really excited about the new playground equipment. Mine are 6 and 9 and the current playground is so outdated. Any idea what age range the new equipment will accommodate?', date: '8 days ago', up: 7 },
    { author: 'Parks & Rec - Rita Chen', staff: true, body: 'Great question. The design phase is finalizing equipment now, but the plan includes a toddler zone (ages 2-5) separated from a primary play zone (ages 5-12) with accessible features throughout. We will share renderings here once design selection is complete in August.', date: '7 days ago', up: 9 },
    { author: 'Carol from Presto', replyTo: 'Parks & Rec - Rita Chen', body: 'Thank you Rita, that is wonderful to hear. The accessibility piece is huge for our community.', date: '7 days ago', up: 5 },
    { author: 'Collier Resident from Fort Pitt', body: 'I am worried about the parking situation getting worse. The current lot already fills up on weekends. Will additional parking be added?', date: '5 days ago', up: 6 },
    { author: 'Parks & Rec - Rita Chen', staff: true, body: 'Yes, the project includes 24 additional parking spaces, including 4 accessible spaces near the new pavilion. We are also coordinating with Public Works on improved signage from the Hilltop and Boyce Road approaches.', date: '5 days ago', up: 8 },
    { author: 'Tom from Ewingsville', body: 'Will the walking trails connect to the existing Panhandle Trail system? That would be amazing for those of us who run.', date: '3 days ago', up: 4 },
    { author: 'Parks & Rec - Rita Chen', staff: true, replyTo: 'Tom from Ewingsville', body: 'Yes. A short connector trail from the east side of Hilltop Park to the existing Panhandle Trail is part of the approved scope. About 0.3 miles, accessible, paved.', date: '2 days ago', up: 11 }
  ],
  pr2: [
    { author: 'Collier Resident from Presto', body: 'Boyce floods every spring storm. I have had to drive through standing water at least 5 times this year alone. Please do not let this be another project that gets shelved.', date: '6 days ago', up: 15 },
    { author: 'Public Works - Jen Murphy', staff: true, body: 'Hi neighbor, I hear you. The engineering study is complete and the cost estimate is in. The board votes September 8 on funding, and we have a Pittsburgh Foundation grant lined up to offset costs. We are as committed to getting this done as you are.', date: '6 days ago', up: 12 },
    { author: 'Collier Resident from Presto', replyTo: 'Public Works - Jen Murphy', body: 'Thanks Jen. Appreciate the directness.', date: '5 days ago', up: 3 },
    { author: 'Collier Resident (anonymous)', body: 'Will work on Boyce affect the bus stop at Hilltop and Boyce? My kids catch the bus there.', date: '4 days ago', up: 4 },
    { author: 'Public Works - Jen Murphy', staff: true, replyTo: 'Collier Resident (anonymous)', body: 'Construction will not begin until Spring 2027 if approved. We will coordinate with the school district months in advance on any temporary bus stop relocations. We will post updates here as the timeline gets closer.', date: '3 days ago', up: 9 }
  ],
  pr6: [
    { author: 'Tom from Ewingsville', body: 'Is this the routine 5-year inspection or is there a specific concern that prompted it? Just want to understand the context.', date: '9 days ago', up: 5 },
    { author: 'Engineering - Mike Sullivan', staff: true, replyTo: 'Tom from Ewingsville', body: 'Routine 5-year inspection required by PennDOT for all bridges in the township. No specific concern. We will share findings here when the report comes back, expected late July.', date: '8 days ago', up: 8 },
    { author: 'Collier Resident (anonymous)', body: 'I always wondered who paid for these inspections. Is it township funds or a state grant?', date: '6 days ago', up: 3 },
    { author: 'Engineering - Mike Sullivan', staff: true, replyTo: 'Collier Resident (anonymous)', body: 'PennDOT covers the cost as part of the state bridge inspection program. The township only pays if findings require corrective action, in which case the work goes through the normal capital planning process.', date: '5 days ago', up: 6 },
    { author: 'Collier Resident from Hickman', body: 'If anything significant comes back, please let us know what it means for traffic. The Chartiers Creek crossing is part of my daily commute.', date: '4 days ago', up: 7 },
    { author: 'Engineering - Mike Sullivan', staff: true, replyTo: 'Collier Resident from Hickman', body: 'Will do. Even minor findings get communicated here. We try to give residents as much notice as possible if any closures or restrictions become necessary.', date: '4 days ago', up: 5 }
  ],
  pr5: [
    { author: 'Carol from Presto', body: 'Will the trail still be open during the improvement work? My family walks Webb Park 3 to 4 times a week and we would hate to lose access.', date: '5 days ago', up: 8 },
    { author: 'Parks & Rec - Rita Chen', staff: true, replyTo: 'Carol from Presto', body: 'Yes. The work is phased so that at least 80 percent of the trail is open at any given time. Specific closed sections will be marked with detour signs. We will also post the weekly closure schedule here as work progresses.', date: '5 days ago', up: 10 },
    { author: 'Tom from Ewingsville', body: 'I run the Webb Park trail every morning. Will the surface be replaced with asphalt or something more permeable?', date: '4 days ago', up: 6 },
    { author: 'Parks & Rec - Rita Chen', staff: true, replyTo: 'Tom from Ewingsville', body: 'Permeable surface. We are using compacted limestone screening, same as the recent Panhandle Trail extension. Better for runners\u0027 joints and better for stormwater runoff.', date: '3 days ago', up: 9 },
    { author: 'Collier Resident from Walkers Mill', body: 'Will the new accessible sections be marked clearly? My mother uses a walker and we would love to bring her to the park more often.', date: '2 days ago', up: 7 },
    { author: 'Parks & Rec - Rita Chen', staff: true, replyTo: 'Collier Resident from Walkers Mill', body: 'Yes. ADA accessible sections will be marked with signage at every trailhead and at each entry point. We are also adding 4 new benches along the accessible portions for rest stops.', date: '2 days ago', up: 8 }
  ],
  pr4: [
    { author: 'Collier Resident (anonymous)', body: 'Finally. The sidewalk on Settlers Ridge near the elementary school has been cracked and uneven for years. Big trip hazard for kids walking to school.', date: '7 days ago', up: 11 },
    { author: 'Public Works - Jen Murphy', staff: true, body: 'Agreed, and that section is in the first phase of the work. Will be addressed in the next 2 weeks, weather permitting.', date: '7 days ago', up: 8 },
    { author: 'Collier Resident from Fort Pitt', body: 'Will work happen during school hours or after? Concerned about kids and construction equipment being too close together.', date: '5 days ago', up: 5 },
    { author: 'Public Works - Jen Murphy', staff: true, replyTo: 'Collier Resident from Fort Pitt', body: 'Sections near the school will be worked on between 9am and 2pm only, when school is in session, to minimize student exposure. After-school sections will be done in the evening or on weekends.', date: '4 days ago', up: 9 },
    { author: 'Carol from Presto', body: 'Will the new sidewalk include curb cuts at the intersections? Important for residents with mobility devices and parents with strollers.', date: '3 days ago', up: 6 },
    { author: 'Public Works - Jen Murphy', staff: true, replyTo: 'Carol from Presto', body: 'Yes. ADA-compliant curb cuts at every intersection along the Settlers Ridge corridor. This is one of the reasons the project scope grew slightly over the initial estimate; we wanted to do this properly rather than just patch the visible damage.', date: '2 days ago', up: 10 }
  ]
};

window.WhatsHappening = WhatsHappening;
window.PinDetail = PinDetail;