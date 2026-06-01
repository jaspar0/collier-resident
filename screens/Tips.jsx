// Phase 4: contextual first-visit tips.
// A small, dismissible card that appears the first time a resident lands on each
// major screen after onboarding. Mounted at app root.
const { useState: useTip } = React;

function tipKeyForRoute(state) {
  const r = state.route;
  if (!r) return null;
  if (r.name === 'speak') {
    if (r.screen) return null; // submit / poll / rules - no tip
    const tab = r.tab || 'home';
    if (tab === 'home') return 'speak';
    if (tab === 'earn') return 'earn';
    if (tab === 'leaderboard') return 'leaderboard';
    return null;
  }
  if (r.name === 'happening' && !r.detail && state.happeningView === 'calendar') return 'calendar';
  if (r.name === 'decide' && r.id) return r.tab === 'discussion' ? 'discussion' : 'proposalDetail';
  if (r.name === 'me' && r.sub === 'items' && !r.reqId) return 'myItems';
  if (r.name === 'me' && r.sub === 'followed') return 'myFollowed';
  return null;
}

function ContextualTips() {
  const { state, dispatch } = window.useStore();
  const D = window.CC_DATA;
  const { Icon } = window.CC_UI;

  if (!state.onboardingCompleted || !state.tipsEnabled) return null;
  // Residents who completed the tour already saw this content; only show tips to
  // those who skipped it (or who explicitly asked to see tips again).
  if (state.tourCompleted && !state.tipsForced) return null;
  if ((state.tour && state.tour.active) || state.showCelebration || state.notifOpen) return null;

  const key = tipKeyForRoute(state);
  if (!key || state.contextualTipsSeen[key]) return null;
  const tip = D.contextualTips[key];
  if (!tip) return null;

  return (
    <div style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', width: 'min(300px, calc(100vw - 32px))', zIndex: 200, pointerEvents: 'none' }}>
      {/* arrow */}
      <div style={{ width: 0, height: 0, margin: '0 auto', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '9px solid #1F3864' }} />
      <div style={{ background: '#1F3864', color: '#FFF', borderRadius: 12, padding: '12px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.32)', pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: '-0.01em' }}>{tip.title}</div>
          <button onClick={() => dispatch({ type: 'DISMISS_TIP', key })} aria-label="Dismiss tip" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, color: '#CFE0F5' }}>
            <Icon name="close" size={16} color="#CFE0F5" />
          </button>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 4, color: '#EAF1FB' }}>{tip.body}</div>
        <button onClick={() => dispatch({ type: 'DISABLE_TIPS' })} style={{ background: 'none', border: 'none', padding: '8px 0 0', color: '#CFE0F5', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Don't show me tips again</button>
      </div>
    </div>
  );
}

window.ContextualTips = ContextualTips;
