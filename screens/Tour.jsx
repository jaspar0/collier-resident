// Phase 3: personalized spotlight tour, and Phase 5: completion celebration.
// Mounted at app root. Two interleaved step types:
//   'feature' → dims the screen, highlights a feature, explains it; advances on "Got it".
//   'nav'     → highlights a navigation element (leaving it tappable through the dim) and
//               advances only when the resident TAPS it (the tap performs the real nav).
// Targets are real elements tagged data-tour="...". Misses fall back gracefully so the
// resident can never get trapped.
const { useState: useTour, useEffect: useTourEffect, useRef: useTourRef } = React;

function findTourTarget(key) {
  if (!key) return null;
  const els = document.querySelectorAll('[data-tour="' + key + '"]');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

function scrollableAncestor(el) {
  let p = el.parentElement;
  while (p) {
    const s = getComputedStyle(p);
    if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 4) return p;
    p = p.parentElement;
  }
  return null;
}

function bringIntoView(el) {
  const sc = scrollableAncestor(el);
  const er = el.getBoundingClientRect();
  if (sc) {
    const cr = sc.getBoundingClientRect();
    const delta = er.top - cr.top - 96;
    if (Math.abs(delta) > 8) sc.scrollTop += delta;
  } else {
    const delta = er.top - 110;
    if (Math.abs(delta) > 8) window.scrollTo(0, window.scrollY + delta);
  }
}

function OnboardingTour() {
  const { state, dispatch } = window.useStore();
  const D = window.CC_DATA;
  const [rect, setRect] = useTour(null);
  const [tipOn, setTipOn] = useTour(false);
  const timers = useTourRef([]);

  const active = state.tour && state.tour.active;
  const step = state.tour ? state.tour.step : 0;
  const arc = state.archetypeAssigned || state.archetype || 'Newcomer';
  const steps = active ? [...D.tourUniversal, ...(D.tourByArchetype[arc] || D.tourByArchetype.Newcomer)] : [];
  const cur = steps[step];
  const total = steps.length;
  const isNav = cur && cur.type === 'nav';

  // Sequenced step transition so the tooltip never appears to flash between positions:
  //   (1) fade the OLD tooltip out in place (150ms), (2) with no tooltip visible, move/locate
  //   the spotlight to the new element (~300ms), (3) fade the NEW tooltip in (200ms).
  // Exactly one tooltip is ever visible; the dark overlay stays continuous throughout.
  useTourEffect(() => {
    if (!active || !cur) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    let cancelled = false;
    let advanced = false;
    const push = (t) => timers.current.push(t);

    // Step 1: hide the old tooltip. Keep the old rect so the old highlight stays put while it fades.
    setTipOn(false);

    // Step 2 (after the fade-out): locate the new target and move the spotlight to it.
    const startMove = () => {
      const tryLocate = (attempt) => {
        if (cancelled) return;
        const el = findTourTarget(cur.target);
        if (el) {
          bringIntoView(el);
          push(setTimeout(() => {
            if (cancelled) return;
            const e2 = findTourTarget(cur.target);
            setRect(e2 ? e2.getBoundingClientRect() : null);
            // Step 3: once the spotlight has settled, fade the new tooltip in.
            push(setTimeout(() => {if (!cancelled) setTipOn(true);}, 320));
          }, 40));
        } else if (attempt < 8) {
          push(setTimeout(() => tryLocate(attempt + 1), 120));
        } else {
          setRect(null);
          push(setTimeout(() => {if (!cancelled) setTipOn(true);}, 250));
        }
      };
      tryLocate(0);
    };
    push(setTimeout(startMove, 160));

    // nav steps advance when the resident taps the highlighted element
    const onDocClick = (e) => {
      if (advanced || cur.type !== 'nav') return;
      const tEl = findTourTarget(cur.target);
      if (tEl && (tEl === e.target || tEl.contains(e.target))) {
        advanced = true;
        setTimeout(() => dispatch({ type: 'TOUR_NEXT' }), 90);
      }
    };
    if (cur.type === 'nav') document.addEventListener('click', onDocClick, true);

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      document.removeEventListener('click', onDocClick, true);
    };
  }, [active, step]);

  // Keep the cutout aligned on resize/scroll.
  useTourEffect(() => {
    if (!active || !cur) return;
    const reflow = () => {const el = findTourTarget(cur.target);setRect(el ? el.getBoundingClientRect() : null);};
    window.addEventListener('resize', reflow);
    window.addEventListener('scroll', reflow, true);
    return () => {window.removeEventListener('resize', reflow);window.removeEventListener('scroll', reflow, true);};
  }, [active, step]);

  if (!active || !cur) return null;

  const isLast = step >= total - 1;
  const advanceFeature = () => isLast ? dispatch({ type: 'END_TOUR' }) : dispatch({ type: 'TOUR_NEXT' });
  const skip = () => dispatch({ type: 'END_TOUR', skipped: true });

  // ── geometry ──
  const vw = window.innerWidth,vh = window.innerHeight;
  const tipW = Math.min(320, vw - 32);
  const tipH = 260;
  const hl = rect ? { top: rect.top, height: Math.min(rect.height, 200) } : null;
  let tipStyle;
  if (rect) {
    const anchorTop = hl.top,anchorBottom = hl.top + hl.height;
    let top;
    if (anchorBottom + 12 + tipH < vh) top = anchorBottom + 12;else
    if (anchorTop - 12 - tipH > 0) top = anchorTop - 12 - tipH;else
    top = vh - tipH - 16;
    top = Math.max(12, Math.min(top, vh - tipH - 12));
    let left = rect.left + rect.width / 2 - tipW / 2;
    left = Math.max(12, Math.min(left, vw - tipW - 12));
    tipStyle = { position: 'fixed', top, left, width: tipW, zIndex: 9002 };
  } else {
    tipStyle = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: tipW, zIndex: 9002 };
  }

  const DIM = 'rgba(15,23,42,0.66)';
  const CUT_TR = 'left 300ms ease-in-out, top 300ms ease-in-out, width 300ms ease-in-out, height 300ms ease-in-out';
  const shade = (s) => <div style={{ position: 'fixed', background: DIM, zIndex: 9000, transition: CUT_TR, ...s }} />;

  // ── overlay: dim + highlight ──
  let overlay;
  if (!rect) {
    overlay = <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: DIM }} />;
  } else if (isNav) {
    // 4 shades leave the target itself tappable through the "hole"
    overlay =
    <>
        {shade({ top: 0, left: 0, width: '100%', height: Math.max(0, rect.top - 6) })}
        {shade({ top: rect.bottom + 6, left: 0, width: '100%', bottom: 0 })}
        {shade({ top: Math.max(0, rect.top - 6), left: 0, width: Math.max(0, rect.left - 6), height: rect.height + 12 })}
        {shade({ top: Math.max(0, rect.top - 6), left: rect.right + 6, right: 0, height: rect.height + 12 })}
        <div style={{ position: 'fixed', left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12, borderRadius: 12, zIndex: 9001, pointerEvents: 'none', transition: CUT_TR, boxShadow: '0 0 0 3px #FFF, 0 0 0 6px #1F3864' }} />
        <div className="tour-pulse" style={{ position: 'fixed', left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12, borderRadius: 12, zIndex: 9001, pointerEvents: 'none', transition: CUT_TR }} />
      </>;

  } else {
    // feature: full blocker (nothing interactive) + amber highlight ring (dim via spread shadow)
    overlay =
    <>
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000 }} />
        <div style={{ position: 'fixed', left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12, borderRadius: 12, zIndex: 9001, pointerEvents: 'none', transition: CUT_TR, boxShadow: '0 0 0 3px #FFF, 0 0 0 6px #D4A017, 0 0 0 9999px ' + DIM }} />
      </>;

  }

  const tipBg = isNav ? '#EEF3FB' : '#FFF';
  const navStuck = isNav && !rect; // can't find the nav target → offer a manual Continue

  return (
    <>
      {overlay}
      <div style={{ ...tipStyle, opacity: tipOn ? 1 : 0, transition: 'opacity ' + (tipOn ? '200ms' : '150ms') + ' ease', pointerEvents: tipOn ? 'auto' : 'none' }}>
        <div style={{ background: tipBg, border: '2px solid #1F3864', borderRadius: 14, boxShadow: '0 12px 36px rgba(0,0,0,0.35)', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: '#7A5A00', letterSpacing: 0.5, textTransform: 'uppercase' }}>Step {step + 1} of {total}</span>
            {isNav && <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, color: '#1F3864', background: '#D6E2F3', border: '1px solid #1F3864', borderRadius: 3, padding: '1px 6px', textTransform: 'uppercase' }}>Your turn</span>}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 6 }}>{cur.title}</div>
          <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginBottom: 14 }}>{cur.body}</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {steps.map((_, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? '#1F3864' : '#CBD5E4' }} />)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <button onClick={skip} style={{ background: 'none', border: 'none', padding: 0, color: '#595959', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Skip tour</button>
            {!isNav &&
            <button onClick={advanceFeature} style={{ background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{isLast ? 'I\u0027m ready' : 'Got it'}</button>
            }
            {isNav && !navStuck &&
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1F3864', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="tour-pulse" style={{ width: 9, height: 9, borderRadius: '50%', background: '#1F3864', display: 'inline-block' }} /> Tap the highlighted spot
              </span>
            }
            {navStuck &&
            <button onClick={() => dispatch({ type: 'TOUR_NEXT' })} style={{ background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Continue</button>
            }
          </div>
        </div>
      </div>
    </>);

}

// ── Phase 5: completion celebration ──────────────────────────────────────────────
function OnboardingCelebration() {
  const { state, dispatch } = window.useStore();
  const { SketchyButton, Icon } = window.CC_UI;
  if (!state.showCelebration) return null;
  const arc = window.CC_DATA.archetypes[state.archetypeAssigned] || window.CC_DATA.archetypes[state.archetype] || window.CC_DATA.archetypes.Newcomer;
  const first = state.user.name.split(' ')[0];
  const opted = state.engagesOptedIn;

  const freqLabel = (arc.notifFreq || 'Weekly digest').toLowerCase();
  const recap = [
  freqLabel.includes('digest') ? freqLabel + ' email' : (arc.notifChannel || 'Email').toLowerCase() + ' updates',
  'topic alerts for ' + (arc.categories && arc.categories[0] || 'Parks and Recreation'),
  'notifications about proposals affecting ' + state.user.neighborhood];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9500, background: 'rgba(15,23,42,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, overflowY: 'auto' }}>
      <div style={{ background: '#FAFAF7', maxWidth: 460, width: '100%', border: '2px solid #222', borderRadius: 18, padding: 26, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, left: 0, right: 0, height: 120, pointerEvents: 'none' }}>
          {['#D4A017', '#2E74B5', '#548235', '#7030A0', '#C65911'].map((c, i) =>
          <span key={i} className="onb-pop" style={{ position: 'absolute', left: 12 + i * 19 + '%', top: 40, width: 10, height: 10, borderRadius: 2, background: c, animationDelay: i * 90 + 'ms' }} />
          )}
        </div>
        <div className="onb-pop-big" style={{ width: 88, height: 88, borderRadius: '50%', background: '#E2EFD9', border: '3px solid #548235', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '14px auto 16px' }}>
          <Icon name="check" color="#548235" size={48} strokeWidth={3} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.015em', lineHeight: 1.15 }}>You're all set, {first}.</div>
        <div style={{ fontSize: 16, color: '#595959', marginTop: 6, marginBottom: 18 }}>Welcome to Collier Connect.</div>

        {opted &&
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#FFF4D6', border: '1.8px solid #D4A017', borderRadius: 12, marginBottom: 16, textAlign: 'left' }}>
            <div className="onb-pop-big" style={{ width: 48, height: 48, borderRadius: '50%', background: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="badge" color="#FFF" size={26} />
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#7A5A00', textTransform: 'uppercase', letterSpacing: 0.5 }}>First earned badge</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#1F3864' }}>First Step</div>
            </div>
          </div>
        }

        <div style={{ padding: 14, background: '#FFF', border: '1.5px solid #222', borderRadius: 10, textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: '#222', lineHeight: 1.55 }}>Your personalized For You feed is ready on Home. We've set you up with <strong>{recap[0]}</strong>, <strong>{recap[1]}</strong>, and <strong>{recap[2]}</strong>.</div>
        </div>

        <SketchyButton primary onClick={() => dispatch({ type: 'FINISH_CELEBRATION' })} style={{ width: '100%', justifyContent: 'center' }} icon="arrow">Take me to my Home</SketchyButton>
      </div>
    </div>);

}

window.OnboardingTour = OnboardingTour;
window.OnboardingCelebration = OnboardingCelebration;