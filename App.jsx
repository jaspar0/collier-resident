// App shell: routing, header, bottom tab bar, responsive mobile/desktop layout

function App() {
  const { state, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  const tweaks = window.CC_TWEAKS || {};
  const layout = tweaks.layout || 'mobile';

  // Onboarding wrapper
  if (!state.onboarded && state.route.name === 'onboarding') {
    return (
      <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
        {tweaks.skipLink && <SkipToContent />}
        <window.Onboarding />
        <TweaksLink />
      </div>
    );
  }

  return (
    <>
      {layout === 'desktop' ? <DesktopShell /> : <MobileShell />}
      <window.FirstPosterModal />
      <window.GuidelinesOverlay />
      <window.ContextualTips />
      <window.OnboardingTour />
      <window.OnboardingCelebration />
    </>
  );
}

function NotificationsPanel({ scope }) {
  const { state, dispatch, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  const D = window.CC_DATA;
  const isMobile = scope === 'mobile';
  const opted = state.engagesOptedIn;
  const [cat, setCat] = React.useState('all');

  const CATS = [
    { key: 'all', label: 'All' },
    { key: 'township', label: 'Township updates' },
    { key: 'earn', label: 'New ways to earn points' },
    { key: 'following', label: 'Following' },
    { key: 'activity', label: 'My activity' }
  ];
  const CAT_ICON = { township: 'chat', earn: 'pluscircle', following: 'follow', activity: 'me' };

  const close = () => dispatch({ type: 'CLOSE_NOTIFICATIONS' });
  const openItem = (n) => {
    dispatch({ type: 'MARK_NOTIF_READ', id: n.id });
    close();
    const a = n.action;
    if (a.kind === 'poll') nav({ name: 'speak', screen: 'poll' });
    else if (a.kind === 'response') nav({ name: 'response', id: a.id });
    else if (a.kind === 'decide') nav({ name: 'decide', id: a.id });
    else if (a.kind === 'event') nav({ name: 'happening', detail: { kind: 'event', id: a.id } });
    else if (a.kind === 'ticket') nav({ name: 'happening', detail: { kind: 'ticket', id: a.id } });
    else if (a.kind === 'notice') nav({ name: 'happening', detail: { kind: 'notice', id: a.id } });
    else if (a.kind === 'project') nav({ name: 'happening', detail: { kind: 'project', id: a.id } });
    else if (a.kind === 'engages') nav({ name: 'speak', tab: a.tab });
  };

  const list = [...(state.extraNotifications || []), ...D.notifications].filter(n => cat === 'all' ? true : n.category === cat);

  // Mobile: absolute fill of phone interior (set in MobileShell with position: relative)
  // Desktop: fixed dropdown from top-right
  const backdropStyle = isMobile
    ? { position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column' }
    : { position: 'fixed', inset: 0, zIndex: 80, background: 'transparent', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', padding: '64px 32px 0' };

  const sheetStyle = isMobile
    ? { background: '#FFF', width: '100%', maxHeight: 'calc(100% - 60px)', overflowY: 'auto', borderBottom: '2px solid #222', borderRadius: '0 0 18px 18px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }
    : { background: '#FFF', width: 420, maxWidth: 420, maxHeight: '80vh', overflowY: 'auto', border: '2px solid #222', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' };

  return (
    <div onClick={close} style={backdropStyle}>
      <div onClick={e => e.stopPropagation()} style={sheetStyle}>
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: '#FFF', borderBottom: '1.5px solid #E0E0E0', padding: '14px 18px 10px', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em' }}>Notifications</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => dispatch({ type: 'MARK_ALL_NOTIFS_READ' })} style={{ background: 'none', border: 'none', color: '#2E74B5', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Mark all as read</button>
              <button onClick={close} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close">
                <Icon name="close" size={15} color="#222" />
              </button>
            </div>
          </div>
          {/* Category filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {CATS.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)} style={{
                fontFamily: 'inherit', fontSize: 12, fontWeight: 600, padding: '5px 11px', minHeight: 30,
                border: '1.5px solid #1F3864', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap',
                background: cat === c.key ? '#1F3864' : '#FFF', color: cat === c.key ? '#FFF' : '#1F3864'
              }}>{c.label}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ padding: '8px 0' }}>
          {list.length === 0 && <div style={{ padding: 28, textAlign: 'center', color: '#595959', fontSize: 13 }}>Nothing here right now.</div>}
          {list.map(n => {
            const stillUnread = n.unread && !state.notifShownIds[n.id];
            const body = (!opted && n.bodyNoPoints) ? n.bodyNoPoints : n.body;
            return (
              <button key={n.id} onClick={() => openItem(n)} style={{
                width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
                background: stillUnread ? '#F4F8FD' : '#FFF', border: 'none',
                borderBottom: '1px solid #F0F0F0',
                padding: '14px 18px',
                display: 'flex', gap: 12, alignItems: 'flex-start',
                position: 'relative'
              }}>
                {stillUnread && (
                  <span style={{ position: 'absolute', left: 6, top: 22, width: 8, height: 8, borderRadius: '50%', background: '#2E74B5' }} />
                )}
                <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: '#FFF', border: '2px solid ' + n.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={CAT_ICON[n.category] || 'bell'} color={n.accent} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#222', lineHeight: 1.3, marginBottom: 3 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: '#222', lineHeight: 1.4, marginBottom: 6 }}>{body}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#595959' }}>{n.time}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: n.accent, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Take me there <Icon name="arrow" color={n.accent} size={13} /></span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ padding: '12px 18px', borderTop: '1.5px solid #E0E0E0', textAlign: 'center', background: '#FAFAF7' }}>
          <button onClick={() => { close(); nav({ name: 'me', sub: 'notifications' }); }} style={{ background: 'transparent', border: 'none', color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            View notification settings →
          </button>
        </div>
      </div>
    </div>
  );
}

function SkipToContent() {
  return (
    <a href="#main" style={{
      position: 'absolute', top: -40, left: 8, padding: '8px 14px',
      background: '#1F3864', color: '#FFF', borderRadius: 4, fontSize: 14, fontWeight: 600, zIndex: 100,
      textDecoration: 'none'
    }} onFocus={e => e.target.style.top = '8px'} onBlur={e => e.target.style.top = '-40px'}>
      Skip to main content
    </a>
  );
}

function TweaksLink() {
  return null; // Tweaks panel manages its own visibility via host
}

// === Mobile shell (phone frame on wide screens, full-bleed on narrow) ===
function MobileShell() {
  const { state, nav } = window.useStore();
  const tweaks = window.CC_TWEAKS || {};
  const showFrame = window.innerWidth > 520;

  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAF7' }}>
      {tweaks.skipLink && <SkipToContent />}
      <MobileHeader />
      <div id="main" style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <RouteContent />
      </div>
      <BottomNav />
    </div>
  );

  if (!showFrame) return (
    <div style={{ height: '100vh', background: '#FAFAF7', position: 'relative', overflow: 'hidden' }}>
      {inner}
      {state.notifOpen && <NotificationsPanel scope="mobile" />}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'repeating-linear-gradient(45deg, #ECE7D6, #ECE7D6 12px, #E6E0CC 12px, #E6E0CC 14px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px' }}>
      <div style={{
        width: 400, height: 820, maxHeight: 'calc(100vh - 80px)',
        background: '#1A1A1A', borderRadius: 44, padding: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative'
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden',
          background: '#FAFAF7', position: 'relative',
          transform: 'translateZ(0)'
        }}>
          {/* Notch */}
          <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 110, height: 24, background: '#1A1A1A', borderRadius: 14, zIndex: 100 }} />
          {inner}
          {state.notifOpen && <NotificationsPanel scope="mobile" />}
        </div>
      </div>
    </div>
  );
}

function MobileHeader() {
  const { state, dispatch, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  const tweaks = window.CC_TWEAKS || {};
  const unread = [...(state.extraNotifications || []), ...(window.CC_DATA.notifications || [])].filter(n => n.unread && !state.notifShownIds[n.id]).length;
  return (
    <div style={{
      flexShrink: 0, padding: '32px 14px 10px',
      background: '#FAFAF7', borderBottom: '1.5px solid #E0E0E0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      filter: tweaks.highContrast ? 'contrast(1.4)' : 'none'
    }}>
      <button onClick={() => nav({ name: 'home' })} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minWidth: 0 }}>
        <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: '#1F3864', border: '1.5px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 12, fontWeight: 800, letterSpacing: '0.5px' }}>CT</div>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#1F3864', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>Collier Connect</span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button onClick={() => dispatch({ type: 'OPEN_NOTIFICATIONS' })} style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={`Notifications (${unread} unread)`}>
          <Icon name="bell" color="#1F3864" size={20} />
          {unread > 0 && <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9, background: '#C00000', color: '#FFF', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #FFF' }}>{unread}</span>}
        </button>
        <button onClick={() => nav({ name: 'me' })} data-tour="nav-me" aria-label="Profile" style={{ height: 36, padding: '0 12px', borderRadius: 6, background: '#FFF', color: '#1F3864', border: '1.6px solid #1F3864', display: 'inline-flex', alignItems: 'center', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Profile</button>
      </div>
    </div>
  );
}

function BottomNav() {
  const { state, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  const cur = state.route.name;

  const items = [
    { name: 'home', label: 'Home', icon: 'home' },
    { name: 'happening', label: 'Happening', icon: 'map' },
    { name: 'decide', label: 'Decide', icon: 'decide' },
    { name: 'speak', label: 'Engage', icon: 'speak' }
  ];

  return (
    <div data-tour="mainnav" style={{
      flexShrink: 0, display: 'flex',
      background: '#FFF', borderTop: '1.8px solid #222',
      paddingBottom: 6
    }}>
      {items.map(it => {
        const active = cur === it.name || (it.name === 'speak' && cur === 'engages');
        return (
          <button key={it.name} data-tour={'nav-' + it.name} onClick={() => nav({ name: it.name })} style={{
            flex: 1, padding: '8px 4px 4px', background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: active ? '#1F3864' : '#595959', fontFamily: 'inherit'
          }} aria-label={it.label} aria-current={active ? 'page' : undefined}>
            <div style={{ position: 'relative' }}>
              {active && <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 32, height: 3, background: '#1F3864', borderRadius: 2 }} />}
              <Icon name={it.icon} color={active ? '#1F3864' : '#595959'} size={22} strokeWidth={active ? 2.2 : 1.8} />
            </div>
            <div style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{it.label}</div>
          </button>
        );
      })}
    </div>
  );
}

// === Desktop shell ===
function DesktopShell() {
  const { state, dispatch, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  const tweaks = window.CC_TWEAKS || {};
  const cur = state.route.name;
  const unread = [...(state.extraNotifications || []), ...(window.CC_DATA.notifications || [])].filter(n => n.unread && !state.notifShownIds[n.id]).length;

  const navItems = [
    { name: 'home', label: 'Home' },
    { name: 'happening', label: 'What\u0027s happening' },
    { name: 'decide', label: 'What\u0027s being decided' },
    { name: 'speak', label: 'How to engage' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', filter: tweaks.highContrast ? 'contrast(1.4)' : 'none' }}>
      {tweaks.skipLink && <SkipToContent />}
      <header style={{ background: '#FFF', borderBottom: '1.8px solid #222', position: 'sticky', top: 0, zIndex: 10, padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => nav({ name: 'home' })} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1F3864', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 22, fontWeight: 700 }}>CT</div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#1F3864' }}>Collier Connect</span>
        </button>
        <nav data-tour="mainnav" style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navItems.map(it => {
            const active = cur === it.name || (it.name === 'speak' && cur === 'engages');
            return (
              <button key={it.name} data-tour={'nav-' + it.name} onClick={() => nav({ name: it.name })} style={{
                padding: '8px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 15, fontWeight: active ? 700 : 500, color: active ? '#1F3864' : '#595959',
                borderBottom: active ? '3px solid #1F3864' : '3px solid transparent', marginBottom: -2,
                whiteSpace: 'nowrap'
              }}>{it.label}</button>
            );
          })}
        </nav>
        <button onClick={() => dispatch({ type: 'OPEN_NOTIFICATIONS' })} style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={`Notifications (${unread} unread)`}>
          <Icon name="bell" color="#1F3864" size={20} />
          {unread > 0 && <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9, background: '#C00000', color: '#FFF', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #FFF' }}>{unread}</span>}
        </button>
        <button onClick={() => nav({ name: 'me' })} data-tour="nav-me" aria-label="Profile" style={{ minWidth: 80, height: 40, padding: '0 16px', borderRadius: 6, background: '#FFF', color: '#1F3864', border: '1.8px solid #1F3864', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          <Icon name="me" size={16} color="#1F3864" /> Profile
        </button>
      </header>
      <main id="main" style={{ maxWidth: 1180, margin: '0 auto', padding: '0' }}>
        <DesktopContentWrapper>
          <RouteContent />
        </DesktopContentWrapper>
      </main>
      {state.notifOpen && <NotificationsPanel scope="desktop" />}
    </div>
  );
}

function DesktopContentWrapper({ children }) {
  // For Home, lay out 3 JTBD across; otherwise pass through.
  const { state } = window.useStore();
  if (state.route.name === 'home') {
    return <DesktopHomeLayout />;
  }
  return <div style={{ padding: '0' }}>{children}</div>;
}

function DesktopHomeLayout() {
  const { state, nav } = window.useStore();
  const { SketchyCard, Icon, SectionH, ResponseCard } = window.CC_UI;
  const D = window.CC_DATA;
  const tweaks = window.CC_TWEAKS || {};
  const responseProm = tweaks.responsePromince || 'huge';

  const jtbds = [
    { icon: 'map', title: 'What\u0027s happening in Collier', sub: 'events, projects, neighbor concerns', go: () => nav({ name: 'happening' }) },
    { icon: 'decide', title: 'What the township is deciding', sub: 'active proposals + decision timelines', go: () => nav({ name: 'decide' }) },
    { icon: 'speak', title: 'How to engage', sub: 'submit a ticket, give feedback, take poll', go: () => nav({ name: 'speak' }) }
  ];

  const items = (D.forYouFeeds[state.archetype] || D.forYouFeeds.Newcomer).map(id => {
    if (id === 'poll') return { kind: 'poll' };
    if (id.startsWith('e')) return { kind: 'event', e: D.events.find(e => e.id === id) };
    if (id.startsWith('pr')) return { kind: 'project', pr: D.projects.find(p => p.id === id) };
    if (id.startsWith('p')) return { kind: 'proposal', p: D.proposals.find(p => p.id === id) };
    if (id.startsWith('n')) return { kind: 'notice', n: D.notices.find(n => n.id === id) };
    return null;
  }).filter(Boolean);

  return (
    <div style={{ padding: '32px 32px 80px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#1F3864', lineHeight: 1.2 }}>Hi Jane.</div>
        <div style={{ fontSize: 15, color: '#595959', marginTop: 4 }}>{state.user.neighborhood} neighborhood · {state.archetype}</div>
      </div>

      <div style={{ marginBottom: 20, marginLeft: -18, marginRight: -18 }}>
        <window.RemovedPostBanner />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {jtbds.map(j => (
          <SketchyCard key={j.title} onClick={j.go} style={{ background: '#DBE5F1', borderColor: '#1F3864', padding: 22 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF', border: '1.8px solid #1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon name={j.icon} color="#1F3864" size={30} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 28, color: '#1F3864', lineHeight: 1.2 }}>{j.title}</div>
            <div style={{ fontSize: 13, color: '#1F3864', marginTop: 4 }}>{j.sub}</div>
            <div style={{ marginTop: 14, color: '#1F3864', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>Open <Icon name="arrow" color="#1F3864" size={16} /></div>
          </SketchyCard>
        ))}
      </div>

      {/* Response strip wide */}
      {responseProm === 'huge' && (
        <div style={{ marginBottom: 28 }} data-tour="response-strip">
          <SectionH sub="from your township, in writing">📣 The township responded</SectionH>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {D.responses.slice(0, 3).map(r => <ResponseCard key={r.id} response={r} onClick={() => nav({ name: 'response', id: r.id })} />)}
          </div>
          <a href="#" onClick={e => { e.preventDefault(); nav({ name: 'responses' }); }} style={{ display: 'inline-block', marginTop: 10, color: '#7A5A00', fontWeight: 600 }}>See all responses →</a>
        </div>
      )}
      {responseProm === 'compact' && (
        <SketchyCard style={{ background: '#FFF4D6', borderColor: '#D4A017', borderLeft: '5px solid #D4A017', padding: 14, marginBottom: 28 }} onClick={() => nav({ name: 'responses' })}>
          <div style={{ fontSize: 12, color: '#7A5A00', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>📣 The township responded · {D.responses.length} this month</div>
          <div style={{ fontSize: 15, color: '#222', fontWeight: 600 }}>"{D.responses[0].excerpt}" - {D.responses[0].shortName}</div>
        </SketchyCard>
      )}
      {responseProm === 'ticker' && (
        <div onClick={() => nav({ name: 'responses' })} style={{ background: '#FFF4D6', borderTop: '1.5px solid #D4A017', borderBottom: '1.5px solid #D4A017', padding: '10px 16px', fontSize: 14, color: '#7A5A00', cursor: 'pointer', display: 'flex', gap: 10, marginBottom: 28 }}>
          <span style={{ fontWeight: 700 }}>📣 Township responded:</span><span style={{ flex: 1 }}>{D.responses[0].theme} · {D.responses[0].shortName}</span><span style={{ fontWeight: 600 }}>See all →</span>
        </div>
      )}

      <SectionH sub={`tuned to your archetype: ${state.archetype.toLowerCase()}`}>For you</SectionH>
      <div data-tour="foryou" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {items.map((item, i) => <window.ForYouCard key={i} item={item} />)}
      </div>

      {state.engagesOptedIn && (
        <div style={{ position: 'sticky', bottom: 16, marginTop: 24 }}>
          <SketchyCard onClick={() => nav({ name: 'speak' })} style={{ background: '#F8F5E8', borderColor: '#D4A017', padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF4D6', border: '1.8px solid #D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trophy" color="#7A5A00" size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, lineHeight: 1.2 }}>How to engage</div>
              <div style={{ fontSize: 13 }}>{state.points} pts · Contributor tier · {Math.max(0, 500 - state.points)} pts to Champion</div>
            </div>
            <Icon name="arrow" color="#1F3864" />
          </SketchyCard>
        </div>
      )}
      <window.GuidelinesFooter />
    </div>
  );
}

function RouteContent() {
  const { state } = window.useStore();
  switch (state.route.name) {
    case 'onboarding': return <window.Onboarding />;
    case 'home': return <window.Home />;
    case 'happening': return <window.WhatsHappening />;
    case 'decide': return <window.WhatsBeingDecided />;
    case 'speak': return <window.SpeakUp />;
    case 'me': return <window.MeSection />;
    case 'engages': return <window.SpeakUp />;
    case 'response': return <window.ResponseDetail />;
    case 'responses': return <window.Responses />;
    case 'guidelines': return <window.CommunityGuidelines />;
    case 'removedPost': return <window.RemovedPostDetail />;
    case 'eventRequest': return <window.EventRequest />;
    case 'placeholder': return <window.Placeholder />;
    default: return <window.Home />;
  }
}

window.AppRoot = App;
window.ForYouCard = window.ForYouCard || null; // safety
