// Comprehensive first-time onboarding.
// Phase 1: Welcome + verification (method → contact+zip → code → neighborhood → display name)
// Phase 2: Quiz → archetype reveal → topic prefs → notification prefs → Engages opt-in
// Phase 3 (tour) and Phase 5 (celebration) live in Tour.jsx, triggered from the tour-intro here.
const { useState: useOnb, useRef: useOnbRef, useEffect: useOnbEffect } = React;

// ── Avatar quiz definition (8 questions) ──────────────────────────────────────
// Scoring keys: LL Leading Lion, BB Busy Bee, SB Social Butterfly, MD Mystical Dragon, JGS Just Getting Started
const AVATAR_KEYMAP = { LL: 'Leading Lion', BB: 'Busy Bee', SB: 'Social Butterfly', MD: 'Mystical Dragon', JGS: 'Just Getting Started' };
const AVATAR_QUIZ = [
  { type: 'single', pct: 13, q: 'How often do you attend township events?', other: true, opts: [
    { label: 'Multiple times a month', s: { LL: 3, BB: 3, SB: 2 } },
    { label: 'Around once a month', s: { LL: 2, BB: 2, SB: 2 } },
    { label: 'Every few months', s: { SB: 2, MD: 1 } },
    { label: 'Once a year', s: { JGS: 2, MD: 1 } },
    { label: 'Very rarely or never', s: { JGS: 3 } }
  ] },
  { type: 'multi', pct: 25, q: 'What are your favorite Collier Township events to attend?', other: true, opts: [
    { label: 'Concerts in the Park', s: { SB: 2 } },
    { label: 'Spring Craft Show', s: { SB: 2, BB: 1 } },
    { label: 'Family Events', s: { SB: 2 } },
    { label: 'Senior Activities', s: { SB: 1, BB: 1 } },
    { label: 'Clean Up Day', s: { BB: 3 } },
    { label: 'Sports and Recreation', s: { BB: 2, SB: 1 } },
    { label: 'Kids Programs', s: { SB: 2, BB: 1 } },
    { label: 'Community Meetings', s: { LL: 3 } },
    { label: 'Holiday Events', s: { SB: 2 } },
    { label: 'I haven\u0027t gone to these events', s: { JGS: 3 }, exclusive: true }
  ] },
  { type: 'multi', pct: 38, q: 'How do you keep up with township news?', other: true, opts: [
    { label: 'Social media', s: { SB: 1, MD: 1 } },
    { label: 'Newsletters', s: { LL: 1, SB: 1 } },
    { label: 'Website', s: { LL: 1 } },
    { label: 'Signs and posters', s: { JGS: 1, SB: 1 } },
    { label: 'Word of mouth', s: { JGS: 1, MD: 1 } },
    { label: 'Town hall meetings', s: { LL: 3 } },
    { label: 'Manager\u0027s Coffee', s: { LL: 3 } },
    { label: 'I usually don\u0027t', s: { JGS: 3 }, exclusive: true }
  ] },
  { type: 'multi', pct: 50, q: 'What social platforms do you use to engage with Collier?', other: true, opts: [
    { label: 'Facebook', s: { SB: 2 } },
    { label: 'Instagram', s: { SB: 2 } },
    { label: 'Nextdoor', s: { SB: 1, BB: 1 } },
    { label: 'Reddit', s: { MD: 4 } },
    { label: 'Email', s: { LL: 1 } },
    { label: 'None', s: { JGS: 2 }, exclusive: true }
  ] },
  { type: 'single', pct: 63, q: 'How do you engage on Collier Township social media channels?', other: true, opts: [
    { label: 'Read only', s: { JGS: 1, SB: 1 } },
    { label: 'React or like', s: { SB: 2 } },
    { label: 'Comment', s: { SB: 2, MD: 1 } },
    { label: 'Post or share', s: { SB: 3, MD: 2 } },
    { label: 'Don\u0027t engage', s: { JGS: 2 } }
  ] },
  { type: 'multi', pct: 75, q: 'How do you make your voice heard?', other: true, opts: [
    { label: 'Attend meetings', s: { LL: 3 } },
    { label: 'Speak at meetings', s: { LL: 4 } },
    { label: 'Manager\u0027s Coffee', s: { LL: 3 } },
    { label: 'Email or call staff', s: { LL: 2, MD: 1 } },
    { label: 'Volunteer', s: { BB: 4 } },
    { label: 'Social media discussions', s: { SB: 2, MD: 2 } },
    { label: 'I usually don\u0027t participate', s: { JGS: 4 }, exclusive: true }
  ] },
  { type: 'dropdown', pct: 100, q: 'What neighborhood do you live in?', placeholder: 'Select your neighborhood...',
    opts: ['Beechmont', 'Ewingsville', 'Fort Pitt', 'Hickman', 'Kirwan Heights', 'Nevillewood', 'Presto', 'Rennerdale', 'Walkers Mill', 'Prefer not to say'] }
];

// Highest total wins; ties resolve by this priority order.
const AVATAR_TIE_ORDER = ['Leading Lion', 'Busy Bee', 'Mystical Dragon', 'Social Butterfly', 'Just Getting Started'];

function scoreQuiz(answers) {
  const totals = { 'Leading Lion': 0, 'Busy Bee': 0, 'Social Butterfly': 0, 'Mystical Dragon': 0, 'Just Getting Started': 0 };
  AVATAR_QUIZ.forEach((q, i) => {
    if (q.type === 'dropdown' || q.type === 'text') return;
    const a = answers[i];
    if (a == null) return;
    const selected = q.type === 'multi' ? (a || []) : [a];
    selected.forEach(label => {
      const opt = q.opts.find(o => o.label === label);
      if (opt && opt.s) Object.keys(opt.s).forEach(k => { totals[AVATAR_KEYMAP[k]] += opt.s[k]; });
    });
  });
  let best = 'Just Getting Started', bestScore = -1;
  AVATAR_TIE_ORDER.forEach(name => { if (totals[name] > bestScore) { best = name; bestScore = totals[name]; } });
  if (bestScore <= 0) return 'Just Getting Started';
  return best;
}

// Retained for the (now-skipped) topic/notification steps if ever routed to.
const TOPIC_MAP = {
  'Roads and traffic': 'Road and Traffic', 'Parks and recreation': 'Parks and Recreation',
  'Schools and family': 'Family events', 'Trails and environment': 'Trails and environment',
  'Senior services': 'Senior services', 'Safety and police': 'Safety and Police',
  'Taxes and budget': 'Taxes and Budget'
};
const Q3_TO_CATEGORY = {
  'Roads and traffic': 'Traffic and Safety', 'Parks and recreation': 'Parks and Recreation',
  'Schools and family': 'Parks and Recreation', 'Safety and police': 'Public Safety',
  'Trails and environment': 'Infrastructure', 'Taxes and budget': 'Infrastructure'
};

// ── Shared bits ───────────────────────────────────────────────────────────────
function PhaseProgress({ pct }) {
  return (
    <div style={{ height: 5, background: '#E0E0E0', borderRadius: 3, marginBottom: 22, overflow: 'hidden', border: '1px solid #d8d8d8' }}>
      <div style={{ width: pct + '%', height: '100%', background: '#1F3864', transition: 'width 220ms ease' }} />
    </div>);

}

const onbInput = (err) => ({
  width: '100%', boxSizing: 'border-box', padding: 12, fontFamily: 'inherit', fontSize: 16,
  border: '1.8px solid ' + (err ? '#C00000' : '#222'), borderRadius: 8, background: '#FFF'
});

// ── Controller ──────────────────────────────────────────────────────────────
function Onboarding() {
  const { state, dispatch, nav } = window.useStore();
  const retake = state.onboardingCompleted; // entered from Profile "retake the quiz"

  // collected data
  const [screen, setScreen] = useOnb(retake ? 'quizintro' : 'welcome');
  const [method, setMethod] = useOnb('email');
  const [contact, setContact] = useOnb(window.CC_DATA.user.email);
  const [zip, setZip] = useOnb('15142');
  const [neighborhood, setNeighborhood] = useOnb(window.CC_DATA.user.neighborhood);
  const [namePref, setNamePref] = useOnb('resident');
  const [answers, setAnswers] = useOnb({});
  const [avatar, setAvatar] = useOnb('Just Getting Started');

  const go = (s) => setScreen(s);

  const common = { go, retake, state, dispatch, nav };

  switch (screen) {
    case 'welcome':return <Welcome {...common} />;
    case 'vmethod':return <VerifyMethod method={method} setMethod={setMethod} setContact={setContact} {...common} />;
    case 'vcontact':return <VerifyContact method={method} contact={contact} setContact={setContact} zip={zip} setZip={setZip} {...common} />;
    case 'vcode':return <VerifyCode method={method} contact={contact} {...common} />;
    case 'neighborhood':return <NeighborhoodPick neighborhood={neighborhood} setNeighborhood={setNeighborhood} {...common} />;
    case 'displayname':return <DisplayNamePick namePref={namePref} setNamePref={setNamePref} neighborhood={neighborhood} {...common} />;
    case 'loading1':return <Interlude text="Setting up your account..." onDone={() => go('quizintro')} />;
    case 'quizintro':return <AvatarQuizWelcome {...common} />;
    case 'quiz':return <AvatarQuizFlow answers={answers} setAnswers={setAnswers} neighborhood={neighborhood} onDone={(av, feedback) => {setAvatar(av);dispatch({ type: 'SET_AVATAR', value: av });if (feedback != null) dispatch({ type: 'SET_QUIZ_FEEDBACK', value: feedback });go('computing');}} {...common} />;
    case 'computing':return <Interlude text="Calculating your avatar..." onDone={() => go('reveal')} />;
    case 'reveal':return <AvatarReveal avatar={avatar} {...common} />;
    case 'topics':return <TopicPrefs archetype={state.archetype} answers={answers} {...common} />;
    case 'notif':return <NotifPrefs archetype={state.archetype} {...common} />;
    case 'engages':return <EngagesOptIn {...common} />;
    case 'tourintro':return <TourIntro avatar={avatar} {...common} />;
    default:return <Welcome {...common} />;
  }
}

// ── Phase 1.1 Welcome ─────────────────────────────────────────────────────────
function Welcome({ go }) {
  const { SketchyButton, Icon, Underline } = window.CC_UI;
  return (
    <Frame>
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '12px auto 18px', width: 88, height: 88, borderRadius: '50%', border: '2.5px solid #1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF4D6' }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#1F3864' }}>CT</div>
        </div>
        <div style={{ fontSize: 30, color: '#1F3864', fontWeight: 800, lineHeight: 1.15, marginBottom: 8, letterSpacing: '-0.015em' }}>Welcome to Collier Connect.</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><Underline width={200} /></div>
        <div style={{ fontSize: 18, color: '#595959', marginBottom: 26 }}>Your township in one place.</div>
      </div>
      {[
      { icon: 'map', text: 'See what\u0027s happening near you' },
      { icon: 'speak', text: 'Have a real say in township decisions' },
      { icon: 'doc', text: 'Hear back from your local government, in writing' }].
      map((b, i) =>
      <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left', padding: '12px 16px', border: '1.5px solid #222', borderRadius: '12px 14px 11px 13px', marginBottom: 12, background: '#FFF' }}>
          <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: '#DBE5F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={b.icon} color="#1F3864" />
          </div>
          <div style={{ fontSize: 16, color: '#222' }}>{b.text}</div>
        </div>
      )}
      <div style={{ marginTop: 22 }}>
        <SketchyButton primary onClick={() => go('vmethod')} style={{ width: '100%', justifyContent: 'center' }}>Get started</SketchyButton>
      </div>
      <a href="#" onClick={(e) => {e.preventDefault();go('vmethod');}} style={{ display: 'block', marginTop: 16, color: '#2E74B5', fontSize: 14, textAlign: 'center' }}>I already have an account → Sign in</a>
    </Frame>);

}

// ── Phase 1.2 Verify method ────────────────────────────────────────────────────
function VerifyMethod({ method, setMethod, setContact, go }) {
  const { Icon } = window.CC_UI;
  const D = window.CC_DATA;
  const pick = (m) => {setMethod(m);setContact(m === 'email' ? D.user.email : '(412) 555-0188');go('vcontact');};
  const Card = ({ m, icon, label, caption }) =>
  <button onClick={() => pick(m)} style={{ flex: 1, minWidth: 0, fontFamily: 'inherit', cursor: 'pointer', background: '#FFF', border: '1.8px solid #1F3864', borderRadius: 12, padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#DBE5F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} color="#1F3864" size={26} /></div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1F3864' }}>{label}</div>
      <div style={{ fontSize: 12, color: '#595959', lineHeight: 1.35 }}>{caption}</div>
    </button>;

  return (
    <Frame back={() => go('welcome')}>
      <PhaseProgress pct={16} />
      <H1>How would you like to verify your account?</H1>
      <Sub>We send a one-time code to confirm you are a real person. Either email or phone works.</Sub>
      <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
        <Card m="email" icon="chat" label="Use my email" caption="Easier to access, slower to receive." />
        <Card m="phone" icon="phone" label="Use my phone" caption="Faster, requires a phone you can text from." />
      </div>
      <div style={{ marginTop: 18, fontSize: 12.5, color: '#595959', lineHeight: 1.5 }}>We never share your email or phone with anyone. Your privacy is detailed in the <button onClick={() => {}} style={linkBtn}>Privacy Promise</button>.</div>
    </Frame>);

}

// ── Phase 1.3 Contact + zip ─────────────────────────────────────────────────────
function VerifyContact({ method, contact, setContact, zip, setZip, go }) {
  const { SketchyButton } = window.CC_UI;
  const D = window.CC_DATA;
  const [why, setWhy] = useOnb(false);
  const zipValid = /^\d{5}$/.test(zip);
  const zipInTownship = D.validZips.includes(zip);
  const contactOk = method === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) : contact.replace(/\D/g, '').length >= 10;
  return (
    <Frame back={() => go('vmethod')}>
      <PhaseProgress pct={28} />
      <H1>{method === 'email' ? 'What\u0027s your email?' : 'What\u0027s your phone number?'}</H1>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#595959', margin: '14px 0 6px' }}>{method === 'email' ? 'Your email address' : 'Your phone number'}</div>
      <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={method === 'email' ? 'you@example.com' : '(412) 555-0000'} style={onbInput(false)} />
      {method === 'phone' && <div style={{ fontSize: 12, color: '#595959', marginTop: 6 }}>Standard text rates apply.</div>}

      <div style={{ fontSize: 14, fontWeight: 600, color: '#595959', margin: '18px 0 6px' }}>Your zip code</div>
      <input value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="15142" inputMode="numeric" style={onbInput(zipValid && !zipInTownship)} />
      <button onClick={() => setWhy(!why)} style={{ ...linkBtn, marginTop: 8 }}>Why we ask</button>
      {why && <div style={{ marginTop: 8, padding: 12, background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 8, fontSize: 13, color: '#1F3864', lineHeight: 1.5 }}>Your zip confirms you are in or near Collier Township. We use it to show you neighborhood-specific content, and to make sure the platform serves real residents. We never use it to identify you in posts.</div>}
      {zipValid && !zipInTownship &&
      <div style={{ marginTop: 10, padding: 12, background: '#FBE5D6', border: '1.5px solid #C65911', borderRadius: 8, fontSize: 13, color: '#7A3A0A', lineHeight: 1.5 }}>
          We could not find that zip code in Collier Township. If you live nearby and want to sign up, you can use your zip code to browse but you will not be able to comment or submit tickets.
        </div>
      }

      <div style={{ marginTop: 22 }}>
        <SketchyButton primary disabled={!contactOk || !zipValid} onClick={() => go('vcode')} style={{ width: '100%', justifyContent: 'center' }}>Send my verification code</SketchyButton>
      </div>
    </Frame>);

}

// ── Phase 1.4 Code ──────────────────────────────────────────────────────────────
function VerifyCode({ method, contact, go }) {
  const { SketchyButton } = window.CC_UI;
  const [digits, setDigits] = useOnb(['', '', '', '', '', '']);
  const [err, setErr] = useOnb('');
  const [secs, setSecs] = useOnb(30);
  const refs = useOnbRef([]);
  useOnbEffect(() => {if (secs <= 0) return;const t = setTimeout(() => setSecs(secs - 1), 1000);return () => clearTimeout(t);}, [secs]);

  const masked = method === 'email' ?
  (contact[0] || 'j') + '****@' + (contact.split('@')[1] || 'example.com') :
  '***-***-' + (contact.replace(/\D/g, '').slice(-4) || '0188');

  const setD = (i, v) => {
    v = v.replace(/\D/g, '').slice(0, 1);
    const next = digits.map((d, j) => j === i ? v : d);
    setDigits(next);setErr('');
    if (v && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {if (e.key === 'Backspace' && !digits[i] && refs.current[i - 1]) refs.current[i - 1].focus();};
  const code = digits.join('');
  const verify = () => {
    if (code.length === 6) go('neighborhood');else
    setErr('Enter all 6 digits. Use 123456 for the prototype.');
  };
  return (
    <Frame back={() => go('vcontact')}>
      <PhaseProgress pct={40} />
      <H1>Enter the 6-digit code we sent.</H1>
      <Sub>We sent a code to {masked}.</Sub>
      <div style={{ display: 'flex', gap: 8, margin: '20px 0 6px', justifyContent: 'space-between' }}>
        {digits.map((d, i) =>
        <input key={i} ref={(el) => refs.current[i] = el} value={d} onChange={(e) => setD(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} inputMode="numeric" maxLength={1}
        style={{ width: 46, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 700, fontFamily: 'inherit', border: '1.8px solid ' + (err ? '#C00000' : '#222'), borderRadius: 8, background: '#FFF', color: '#1F3864' }} />
        )}
      </div>
      {err && <div style={{ fontSize: 13, color: '#C00000', fontWeight: 600, marginBottom: 6 }}>{err}</div>}
      <div style={{ fontSize: 13, color: '#595959', marginTop: 8 }}>
        Didn't get it? {secs > 0 ? <span style={{ color: '#BFBFBF' }}>Resend code (available in {secs}s)</span> : <button onClick={() => setSecs(30)} style={linkBtn}>Resend code</button>}
      </div>
      <div style={{ marginTop: 12, padding: 10, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8, fontSize: 12.5, color: '#7A5A00' }}>Prototype hint: any 6 digits work. Try <strong>123456</strong>.</div>
      <div style={{ marginTop: 18 }}>
        <SketchyButton primary disabled={code.length !== 6} onClick={verify} style={{ width: '100%', justifyContent: 'center' }}>Verify</SketchyButton>
      </div>
    </Frame>);

}

// ── Phase 1.5 Neighborhood ──────────────────────────────────────────────────────
function NeighborhoodPick({ neighborhood, setNeighborhood, go }) {
  const { SketchyButton } = window.CC_UI;
  const D = window.CC_DATA;
  const [why, setWhy] = useOnb(false);
  const [map, setMap] = useOnb(false);
  return (
    <Frame back={() => go('vcode')}>
      <PhaseProgress pct={52} />
      <H1>Which neighborhood do you live in?</H1>
      <select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} style={{ ...onbInput(false), marginTop: 16, cursor: 'pointer' }}>
        <option value="">Pick your neighborhood</option>
        {[...D.neighborhoods].sort().map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <button onClick={() => setMap(true)} style={{ ...linkBtn, marginTop: 10 }}>Not sure which neighborhood?</button>

      <button onClick={() => setWhy(!why)} style={{ width: '100%', textAlign: 'left', background: '#F2F2F2', border: 'none', borderRadius: 8, padding: '10px 12px', marginTop: 18, cursor: 'pointer', fontFamily: 'inherit', color: '#1F3864', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ transform: why ? 'rotate(90deg)' : 'none', transition: 'transform 120ms', fontSize: 11 }}>▶</span> Why we ask
      </button>
      {why &&
      <div style={{ padding: '12px 14px', background: '#FFF', border: '1px solid #E0E0E0', borderTop: 'none', borderRadius: '0 0 8px 8px', fontSize: 13.5, color: '#222', lineHeight: 1.55 }}>
          Your neighborhood determines:
          <ul style={{ margin: '8px 0', paddingLeft: 18 }}>
            <li>What you see in your For You feed</li>
            <li>Which proposals affect you directly</li>
            <li>How the leaderboard works (we average per household per neighborhood, so smaller neighborhoods can win)</li>
            <li>Default notifications about issues nearby</li>
          </ul>
          Your neighborhood is never connected to your specific posts. You control how you appear in comments in the next step.
        </div>
      }

      <div style={{ marginTop: 22 }}>
        <SketchyButton primary disabled={!neighborhood} onClick={() => go('displayname')} style={{ width: '100%', justifyContent: 'center' }}>Continue</SketchyButton>
      </div>
      {map && <NeighborhoodMapModal onPick={(n) => {setNeighborhood(n);setMap(false);}} onClose={() => setMap(false)} />}
    </Frame>);

}

function NeighborhoodMapModal({ onPick, onClose }) {
  const spots = [
  { n: 'Nevillewood', x: 22, y: 26 }, { n: 'Settlers Point', x: 62, y: 22 }, { n: 'Hickman', x: 80, y: 30 },
  { n: 'Presto', x: 50, y: 50 }, { n: 'Rennerdale', x: 80, y: 58 }, { n: 'Fort Pitt', x: 18, y: 56 },
  { n: 'Walkers Mill', x: 38, y: 74 }, { n: 'Ewingsville', x: 60, y: 78 }, { n: 'Kirwan Heights', x: 84, y: 82 },
  { n: 'Beechmont', x: 30, y: 40 }];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#FFF', maxWidth: 460, width: '100%', border: '2px solid #222', borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864' }}>Tap your approximate location</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', fontSize: 15, color: '#222' }} aria-label="Close">✕</button>
        </div>
        <div style={{ fontSize: 12.5, color: '#595959', marginBottom: 10 }}>Collier Township neighborhoods. Tap a marker to select it.</div>
        <div style={{ position: 'relative', width: '100%', height: 300, background: '#F5F1E8', border: '1.8px solid #222', borderRadius: 10, overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <path d="M 5 20 Q 20 10 35 18 T 65 22 Q 80 18 95 25 L 95 65 Q 80 75 60 70 T 25 72 Q 10 75 5 65 Z" fill="#E8E0C8" stroke="#B8AC80" strokeWidth="0.3" />
            <path d="M 0 45 Q 30 40 50 48 T 100 50" stroke="#A4B8D4" strokeWidth="1" fill="none" />
          </svg>
          {spots.map((s) =>
          <button key={s.n} onClick={() => onPick(s.n)} title={s.n} style={{ position: 'absolute', left: s.x + '%', top: s.y + '%', transform: 'translate(-50%,-50%)', background: '#FFF', border: '1.5px solid #1F3864', borderRadius: 999, padding: '3px 8px', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, color: '#1F3864', cursor: 'pointer', whiteSpace: 'nowrap' }}>{s.n}</button>
          )}
        </div>
      </div>
    </div>);

}

// ── Phase 1.6 Display name ───────────────────────────────────────────────────────
function DisplayNamePick({ namePref, setNamePref, neighborhood, go, dispatch }) {
  const { SketchyButton } = window.CC_UI;
  const build = (pref) => {
    if (pref === 'full') return 'Jane Smith';
    if (pref === 'first') return 'Jane S.';
    return 'Collier Resident from ' + neighborhood;
  };
  const opts = [
  { k: 'resident', label: 'Anonymous', sample: 'Collier Resident from ' + neighborhood, note: '(recommended)' },
  { k: 'first', label: 'First name + last initial', sample: 'Jane S.' },
  { k: 'full', label: 'Full name', sample: 'Jane Smith' }];

  const cont = () => {
    dispatch({ type: 'SET_DISPLAY_PREF', value: namePref });
    dispatch({ type: 'SET_DISPLAY_NAME', value: build(namePref) });
    go('loading1');
  };
  return (
    <Frame back={() => go('neighborhood')}>
      <PhaseProgress pct={64} />
      <H1>How should other residents see you in comments?</H1>
      <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        {opts.map((o) =>
        <label key={o.k} style={{ padding: 14, border: namePref === o.k ? '2px solid #1F3864' : '1.5px solid #222', background: namePref === o.k ? '#DBE5F1' : '#FFF', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="radio" checked={namePref === o.k} onChange={() => setNamePref(o.k)} style={{ width: 18, height: 18 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1F3864' }}>{o.label} {o.note && <span style={{ fontSize: 11, color: '#595959', fontWeight: 500 }}>{o.note}</span>}</div>
              <div style={{ fontSize: 13, color: '#595959', marginTop: 2 }}>Shows as: <strong style={{ color: '#222' }}>{o.sample}</strong></div>
            </div>
          </label>
        )}
      </div>
      <div style={{ marginTop: 12, fontSize: 12.5, color: '#595959', lineHeight: 1.5 }}>You can change this anytime in Profile &gt; Profile & preferences. Most residents start with Anonymous and adjust later if they want.</div>
      <div style={{ marginTop: 20 }}>
        <SketchyButton primary onClick={cont} style={{ width: '100%', justifyContent: 'center' }}>Continue</SketchyButton>
      </div>
    </Frame>);

}

// ── Interlude (loading) ──────────────────────────────────────────────────────────
function Interlude({ text, onDone }) {
  useOnbEffect(() => {const t = setTimeout(onDone, 1400);return () => clearTimeout(t);}, []);
  return (
    <Frame>
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div className="onb-spin" style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid #DBE5F1', borderTopColor: '#1F3864', margin: '0 auto 20px' }} />
        <div style={{ fontSize: 18, color: '#1F3864', fontWeight: 700 }}>{text}</div>
      </div>
    </Frame>);

}

// ── Phase 2.1 Avatar quiz welcome ─────────────────────────────────────────────────
function AvatarQuizWelcome({ go, retake, nav }) {
  const { SketchyButton } = window.CC_UI;
  const bullets = [
    { glyph: <polygon points="14,3 25,22 3,22" />, text: 'Discover your unique resident personality' },
    { glyph: <circle cx="14" cy="13" r="10" />, text: 'Get events tailored to your interests' },
    { glyph: <rect x="5" y="5" width="18" height="18" rx="3" transform="rotate(45 14 14)" />, text: 'Connect with your community' }
  ];
  return (
    <Frame back={retake ? () => nav({ name: 'me', sub: 'profile' }) : () => go('displayname')}>
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 14 }} aria-hidden="true">{'\uD83E\uDD81\uD83D\uDC1D\uD83E\uDD8B'}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#1F3864', lineHeight: 1.18, letterSpacing: '-0.015em', textWrap: 'balance' }}>What Kind of Collier Resident Are You?</div>
        <div style={{ fontSize: 16, color: '#595959', marginTop: 12, lineHeight: 1.5, textWrap: 'pretty' }}>Take this 2-minute quiz to discover your Collier avatar and get personalized community updates.</div>
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 26 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left', padding: '12px 16px', border: '1.5px solid #222', borderRadius: '12px 14px 11px 13px', background: '#FFF' }}>
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: '#DBE5F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="#1F3864" strokeWidth="2" strokeLinejoin="round">{b.glyph}</svg>
            </div>
            <div style={{ fontSize: 15.5, color: '#222', fontWeight: 500 }}>{b.text}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26 }}>
        <SketchyButton primary onClick={() => go('quiz')} style={{ width: '100%', justifyContent: 'center' }}>Start Quiz</SketchyButton>
      </div>
      <a href="#" onClick={(e) => { e.preventDefault(); if (retake) { nav({ name: 'me', sub: 'profile' }); } else { go('engages'); } }} style={{ display: 'block', marginTop: 16, color: '#2E74B5', fontSize: 14, textAlign: 'center' }}>Skip for now</a>
    </Frame>);

}

// ── Phase 2.2 Avatar quiz (8 questions) ───────────────────────────────────────
function AvatarQuizFlow({ answers, setAnswers, neighborhood, onDone, go }) {
  const { SketchyButton } = window.CC_UI;
  const [idx, setIdx] = useOnb(0);
  const [otherText, setOtherText] = useOnb({});   // qIndex -> text
  const q = AVATAR_QUIZ[idx];
  const OTHER = 'Other';

  // Seed neighborhood dropdown from the earlier account step on first view.
  useOnbEffect(() => {
    if (q.type === 'dropdown' && answers[idx] == null && neighborhood) {
      setAnswers(a => ({ ...a, [idx]: neighborhood }));
    }
  }, [idx]);

  const selectSingle = (label) => setAnswers({ ...answers, [idx]: label });
  const selectMulti = (opt) => {
    const cur = answers[idx] || [];
    const isExcl = (q.opts.find(o => o.label === opt) || {}).exclusive;
    let next;
    if (cur.includes(opt)) next = cur.filter(x => x !== opt);
    else if (isExcl) next = [opt];                                   // exclusive clears the rest
    else next = [...cur.filter(x => !((q.opts.find(o => o.label === x) || {}).exclusive)), opt]; // selecting any clears an exclusive
    setAnswers({ ...answers, [idx]: next });
  };

  const isSel = (label) => q.type === 'multi' ? (answers[idx] || []).includes(label) : answers[idx] === label;

  // Next-enabled rule: single + dropdown require a choice; multi + text always allowed.
  const answered = (() => {
    if (q.type === 'single') return !!answers[idx];
    if (q.type === 'dropdown') return !!answers[idx] && answers[idx] !== '';
    return true; // multi, text
  })();

  const last = idx === AVATAR_QUIZ.length - 1;
  const next = () => {
    if (!last) { setIdx(idx + 1); return; }
    onDone(scoreQuiz(answers));
  };
  const prev = () => { if (idx > 0) setIdx(idx - 1); else go('quizintro'); };

  const otherSelected = isSel(OTHER);

  return (
    <Frame back={idx > 0 ? prev : () => go('quizintro')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: '#595959', fontWeight: 700 }}>Question {idx + 1} of {AVATAR_QUIZ.length}</div>
        <div style={{ fontSize: 13, color: '#1F3864', fontWeight: 700 }}>{q.pct}%</div>
      </div>
      <PhaseProgress pct={q.pct} />
      <H1>{q.q}</H1>
      {q.type === 'multi' && <Sub>Select all that apply.</Sub>}

      {/* Dropdown question */}
      {q.type === 'dropdown' && (
        <select value={answers[idx] || ''} onChange={(e) => selectSingle(e.target.value)} style={{ ...onbInput(false), marginTop: 18, cursor: 'pointer' }}>
          <option value="">{q.placeholder}</option>
          {q.opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {/* Open text question */}
      {q.type === 'text' && (
        <div style={{ marginTop: 16 }}>
          <textarea value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value.slice(0, 500) })} rows={5} placeholder={q.placeholder}
            style={{ width: '100%', boxSizing: 'border-box', padding: 12, fontFamily: 'inherit', fontSize: 16, border: '1.8px solid #222', borderRadius: 8, background: '#FFF', resize: 'vertical', minHeight: 110 }} />
          {q.note && <div style={{ fontSize: 12.5, color: '#595959', marginTop: 6, fontStyle: 'italic' }}>{q.note}</div>}
        </div>
      )}

      {/* Choice questions */}
      {(q.type === 'single' || q.type === 'multi') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {q.opts.map(o => {
            const sel = isSel(o.label);
            const pick = () => q.type === 'multi' ? selectMulti(o.label) : selectSingle(o.label);
            return (
              <button key={o.label} onClick={pick} style={{ fontFamily: 'inherit', fontSize: 16, padding: '14px 16px', textAlign: 'left', background: sel ? '#DBE5F1' : '#FFF', color: '#222', border: sel ? '2px solid #1F3864' : '1.5px solid #222', borderRadius: '10px 13px 10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 22, height: 22, borderRadius: q.type === 'multi' ? 4 : '50%', border: '2px solid #1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? '#1F3864' : 'transparent', flexShrink: 0 }}>
                  {sel && <span style={{ color: '#FFF', fontSize: 14 }}>✓</span>}
                </span>
                {o.label}
              </button>
            );
          })}
          {/* Other with text input */}
          {q.other && (
            <button onClick={() => q.type === 'multi' ? selectMulti(OTHER) : selectSingle(OTHER)} style={{ fontFamily: 'inherit', fontSize: 16, padding: '14px 16px', textAlign: 'left', background: otherSelected ? '#DBE5F1' : '#FFF', color: '#222', border: otherSelected ? '2px solid #1F3864' : '1.5px solid #222', borderRadius: '10px 13px 10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: q.type === 'multi' ? 4 : '50%', border: '2px solid #1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center', background: otherSelected ? '#1F3864' : 'transparent', flexShrink: 0 }}>
                {otherSelected && <span style={{ color: '#FFF', fontSize: 14 }}>✓</span>}
              </span>
              Other
            </button>
          )}
          {q.other && otherSelected && (
            <input autoFocus value={otherText[idx] || ''} onChange={(e) => setOtherText({ ...otherText, [idx]: e.target.value })} placeholder="Tell us more (optional)"
              style={{ ...onbInput(false), marginTop: -2 }} />
          )}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <SketchyButton primary disabled={!answered} onClick={next} style={{ width: '100%', justifyContent: 'center' }}>{last ? 'See My Results' : 'Next'}</SketchyButton>
      </div>
    </Frame>);

}

// ── Shared: avatar comparison bar chart (reused on the Me section) ──────────────
function AvatarComparisonChart({ current }) {
  const D = window.CC_DATA;
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {D.avatarComparisonOrder.map(name => {
        const av = D.avatars[name];
        const mine = name === current;
        return (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 22, width: 26, textAlign: 'center', flexShrink: 0 }} aria-hidden="true">{av.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13.5, color: '#222', fontWeight: mine ? 700 : 500 }}>{av.key}</span>
                {mine && <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.4, color: '#FFF', background: '#1F3864', borderRadius: 4, padding: '1px 6px' }}>YOU</span>}
                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#595959', fontWeight: 700 }}>{av.percent}%</span>
              </div>
              <div style={{ height: 12, background: '#ECEFF3', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: av.percent + '%', height: '100%', background: mine ? '#1F3864' : '#AEBED4', borderRadius: 999, transition: 'width 500ms ease' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>);
}
window.AvatarComparisonChart = AvatarComparisonChart;

// ── Phase 2.7 Avatar reveal (comprehensive) ────────────────────────────────────
function AvatarReveal({ avatar, go, retake, nav, dispatch, state }) {
  const { SketchyButton, Icon } = window.CC_UI;
  const D = window.CC_DATA;
  const av = D.avatars[avatar] || D.avatars['Just Getting Started'];
  const plural = { 'Leading Lion': 'Leading Lions', 'Busy Bee': 'Busy Bees', 'Social Butterfly': 'Social Butterflies', 'Mystical Dragon': 'Mystical Dragons', 'Just Getting Started': 'just getting started' }[av.key];

  // Reorder seeded events so the most relevant to this avatar appears first.
  const rank = (cat) => { const i = (av.eventCats || []).indexOf(cat); return i === -1 ? 99 : i; };
  const events = [...D.quizEvents].sort((a, b) => rank(a.category) - rank(b.category));

  const Section = ({ children }) => <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', margin: '26px 0 12px' }}>{children}</div>;

  return (
    <Frame>
      {/* Reveal hero */}
      <div style={{ textAlign: 'center', padding: '20px 18px 22px', background: '#DBE5F1', border: '2px solid #1F3864', borderRadius: '18px 22px 18px 23px / 20px 18px 22px 18px' }}>
        <div style={{ fontSize: 88, lineHeight: 1, marginBottom: 8 }} aria-hidden="true">{av.emoji}</div>
        <div style={{ fontSize: 12, color: '#1F3864', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 800, opacity: 0.7 }}>You're a</div>
        <div style={{ fontSize: 30, color: '#1F3864', fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>{av.key}</div>
      </div>

      <div style={{ fontSize: 15.5, color: '#222', margin: '18px 0 10px', lineHeight: 1.6, textWrap: 'pretty' }}>{av.desc}</div>
      <div style={{ fontSize: 13.5, color: '#7A5A00', background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8, padding: '8px 12px', fontWeight: 600 }}>
        {av.percent}% of residents are also {plural}.
      </div>

      <div style={{ marginTop: 26 }}>
        {retake ? (
          <SketchyButton primary onClick={() => nav({ name: 'me', sub: 'profile' })} style={{ width: '100%', justifyContent: 'center' }}>Save my avatar</SketchyButton>
        ) : (
          <SketchyButton primary onClick={() => go('engages')} style={{ width: '100%', justifyContent: 'center' }}>Continue to Collier Connect</SketchyButton>
        )}
      </div>
    </Frame>);

}

function QuizEventCard({ e }) {
  const D = window.CC_DATA;
  const color = D.quizEventCatColors[e.category] || '#1F3864';
  return (
    <div style={{ padding: 12, background: '#FFF', border: '1.5px solid #222', borderLeft: `5px solid ${color}`, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: color, textTransform: 'uppercase', background: color + '18', borderRadius: 4, padding: '2px 7px' }}>{e.category}</span>
        <span style={{ fontSize: 12, color: '#595959', fontWeight: 600 }}>{e.date}</span>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1F3864', lineHeight: 1.2 }}>{e.name}</div>
      <div style={{ fontSize: 12.5, color: '#595959', margin: '2px 0 5px' }}>{e.time} · {e.location}</div>
      <div style={{ fontSize: 13, color: '#222', lineHeight: 1.45 }}>{e.description}</div>
    </div>
  );
}

function AddMeetingsLink() {
  const [added, setAdded] = useOnb(false);
  return added ? (
    <div style={{ marginTop: 10, fontSize: 13.5, color: '#548235', fontWeight: 600 }}>✓ Added recurring meetings to your followed items.</div>
  ) : (
    <a href="#" onClick={(e) => { e.preventDefault(); setAdded(true); }} style={{ display: 'inline-block', marginTop: 10, color: '#2E74B5', fontSize: 14, fontWeight: 600 }}>Add to my calendar →</a>
  );
}

function StayConnectedPanel() {
  const { state, dispatch } = window.useStore();
  const on = state.stayConnected;
  return (
    <div style={{ marginTop: 26, padding: 16, background: '#FFF4D6', border: '1.8px solid #D4A017', borderRadius: 12 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864' }}>Stay Connected</div>
      <div style={{ fontSize: 13.5, color: '#7A5A00', marginTop: 4, lineHeight: 1.5 }}>Get updates about Collier Township events and news that matter to you.</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, cursor: 'pointer' }}>
        <span onClick={() => dispatch({ type: 'SET_STAY_CONNECTED', value: !on })} style={{ width: 48, height: 28, borderRadius: 999, background: on ? '#1F3864' : '#BFBFBF', position: 'relative', transition: 'background 140ms', flexShrink: 0 }}>
          <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: '50%', background: '#FFF', transition: 'left 140ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
        </span>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#222' }}>Send me updates based on my quiz results</span>
      </label>
      <div style={{ fontSize: 12, color: '#7A5A00', marginTop: 10, fontStyle: 'italic' }}>You can change this any time in the Me section.</div>
    </div>
  );
}

// ── Phase 2.8 Topics ─────────────────────────────────────────────────────────────
function TopicPrefs({ archetype, answers, go, dispatch }) {
  const { SketchyButton } = window.CC_UI;
  const arc = window.CC_DATA.archetypes[archetype] || window.CC_DATA.archetypes.Newcomer;
  const CATS = ['Parks and Recreation', 'Traffic and Safety', 'Zoning and Planning', 'Infrastructure', 'Public Safety'];
  const seed = new Set(arc.categories || []);
  (answers[2] || []).forEach((t) => {if (Q3_TO_CATEGORY[t]) seed.add(Q3_TO_CATEGORY[t]);});
  const [on, setOn] = useOnb(Object.fromEntries(CATS.map((c) => [c, seed.has(c)])));
  const cont = () => {
    // map digest topics from quiz + archetype defaults
    const t = new Set(arc.topics || []);
    (answers[2] || []).forEach((x) => {if (TOPIC_MAP[x]) t.add(TOPIC_MAP[x]);});
    dispatch({ type: 'SET_TOPICS', value: [...t] });
    go('notif');
  };
  return (
    <Frame>
      <PhaseProgress pct={78} />
      <H1>What topics do you want updates about?</H1>
      <Sub>Pre-checked based on your quiz answers. You can change these anytime.</Sub>
      <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        {CATS.map((c) =>
        <label key={c} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 14, border: on[c] ? '2px solid #1F3864' : '1.5px solid #222', background: on[c] ? '#DBE5F1' : '#FFF', borderRadius: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1F3864' }}>{c}</span>
            <span style={{ width: 44, height: 26, borderRadius: 999, background: on[c] ? '#1F3864' : '#BFBFBF', position: 'relative', transition: 'background 120ms', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 3, left: on[c] ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#FFF', transition: 'left 120ms' }} />
            </span>
            <input type="checkbox" checked={on[c]} onChange={() => setOn({ ...on, [c]: !on[c] })} style={{ display: 'none' }} />
          </label>
        )}
      </div>
      <div style={{ marginTop: 22 }}>
        <SketchyButton primary onClick={cont} style={{ width: '100%', justifyContent: 'center' }}>Continue</SketchyButton>
      </div>
    </Frame>);

}

// ── Phase 2.9 Notifications ────────────────────────────────────────────────────────
function NotifPrefs({ archetype, go }) {
  const { SketchyButton } = window.CC_UI;
  const arc = window.CC_DATA.archetypes[archetype] || window.CC_DATA.archetypes.Newcomer;
  const [channel, setChannel] = useOnb(arc.notifChannel || 'Email');
  const [freq, setFreq] = useOnb(arc.notifFreq || 'Weekly digest');
  const Seg = ({ value, set, options }) =>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {options.map((o) =>
    <button key={o} onClick={() => set(o)} style={{ padding: '10px 8px', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, border: value === o ? '2px solid #1F3864' : '1.5px solid #222', background: value === o ? '#DBE5F1' : '#FFF', color: '#1F3864', borderRadius: 8, cursor: 'pointer' }}>{o}</button>
    )}
    </div>;

  return (
    <Frame>
      <PhaseProgress pct={88} />
      <H1>How do you want to hear from us?</H1>
      <Sub>These are sensible defaults for someone like you. You can change them anytime.</Sub>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1F3864', margin: '18px 0 8px' }}>Channel</div>
      <Seg value={channel} set={setChannel} options={['Email', 'SMS', 'Push notifications', 'No notifications']} />
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1F3864', margin: '18px 0 8px' }}>Frequency</div>
      <Seg value={freq} set={setFreq} options={['Real-time', 'Daily digest', 'Weekly digest', 'Off']} />
      <div style={{ marginTop: 16, fontSize: 12.5, color: '#595959', lineHeight: 1.5 }}>Alerts (urgent things like road closures) always go through faster channels regardless of your setting here. You can change alert settings separately in Profile &gt; Notifications.</div>
      <div style={{ marginTop: 20 }}>
        <SketchyButton primary onClick={() => go('engages')} style={{ width: '100%', justifyContent: 'center' }}>Continue</SketchyButton>
      </div>
    </Frame>);

}

// ── Phase 2.10 Engages opt-in ───────────────────────────────────────────────────────
function EngagesOptIn({ go, dispatch }) {
  const { SketchyButton } = window.CC_UI;
  const choose = (val) => {dispatch({ type: 'SET_ENGAGES', value: val });go('tourintro');};
  return (
    <Frame>
      <PhaseProgress pct={96} />
      <H1>One last thing. Want to earn points and rewards as you engage?</H1>
      <Sub>Engages is our optional gamification module.</Sub>
      <ul style={{ margin: '16px 0', paddingLeft: 18, fontSize: 14, color: '#222', lineHeight: 1.6 }}>
        <li>Earn points for things like attending events, submitting tickets, and answering polls.</li>
        <li>Redeem points for rewards at local businesses (Grist House, Collier Town Square Café, and more).</li>
        <li>Can be turned on or off any time. Even without Engages, you can still participate in the activities, you just won't be able to earn points, badges, and rewards.</li>
      </ul>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <SketchyButton primary onClick={() => choose(true)} style={{ width: '100%', justifyContent: 'center' }}>Yes, opt me in</SketchyButton>
        <SketchyButton onClick={() => choose(false)} style={{ width: '100%', justifyContent: 'center' }}>Not for me</SketchyButton>
        <a href="#" onClick={(e) => {e.preventDefault();choose(false);}} style={{ color: '#2E74B5', fontSize: 14, textAlign: 'center' }}>Decide later</a>
      </div>
    </Frame>);

}

// ── Phase 3 intro (start tour or skip to celebration) ───────────────────────────────
function TourIntro({ avatar, dispatch, state }) {
  const { SketchyButton } = window.CC_UI;
  const D = window.CC_DATA;
  const av = D.avatars[avatar] || D.avatars['Just Getting Started'];
  const archetype = state.archetype; // mapped personalization archetype drives the tour content
  return (
    <Frame>
      <H1>Want a quick tour?</H1>
      <Sub>About 5 to 7 minutes. We'll walk you through the platform step by step - including how to get to each section yourself - with a few stops picked just for you as a {av.key}. You can skip anytime.</Sub>
      <div style={{ marginTop: 16, padding: 14, background: '#DBE5F1', border: '1.8px solid #1F3864', borderRadius: 10, fontSize: 14, color: '#1F3864', lineHeight: 1.5 }}>You'll learn how the response loop works, how to submit a ticket, how to manage your notifications, and how to reach the features that matter most to you - by tapping along as we go.

      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SketchyButton primary onClick={() => dispatch({ type: 'START_TOUR', archetype })} style={{ width: '100%', justifyContent: 'center' }}>Yes, show me around</SketchyButton>
        <a href="#" onClick={(e) => {e.preventDefault();dispatch({ type: 'SKIP_TOUR', archetype });}} style={{ color: '#2E74B5', fontSize: 14, textAlign: 'center' }}>I will explore on my own</a>
      </div>
    </Frame>);

}

// ── Layout helpers ────────────────────────────────────────────────────────────────
function Frame({ children, back }) {
  const { Icon } = window.CC_UI;
  return (
    <div style={{ minHeight: '100%', background: '#FAFAF7', padding: '28px 20px 60px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        {back &&
        <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 14 }}>
            <Icon name="back" size={16} /> Back
          </button>
        }
        {children}
      </div>
    </div>);

}
const H1 = ({ children }) => <div style={{ fontSize: 27, fontWeight: 800, color: '#1F3864', lineHeight: 1.2, letterSpacing: '-0.015em' }}>{children}</div>;
const Sub = ({ children }) => <div style={{ fontSize: 15, color: '#595959', marginTop: 8, lineHeight: 1.5 }}>{children}</div>;
const linkBtn = { background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' };

window.Onboarding = Onboarding;