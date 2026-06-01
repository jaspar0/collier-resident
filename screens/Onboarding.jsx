// Comprehensive first-time onboarding.
// Phase 1: Welcome + verification (method → contact+zip → code → neighborhood → display name)
// Phase 2: Quiz → archetype reveal → topic prefs → notification prefs → Engages opt-in
// Phase 3 (tour) and Phase 5 (celebration) live in Tour.jsx, triggered from the tour-intro here.
const { useState: useOnb, useRef: useOnbRef, useEffect: useOnbEffect } = React;

// ── Quiz definition ──────────────────────────────────────────────────────────
const Q5OPTS = {
  speak: 'I show up and speak up',
  quiet: 'I quietly stay informed',
  newish: 'I\u0027m new and learning',
  more: 'I want to do more',
  know: 'I just need to know what\u0027s going on'
};
const ONB_QUIZ = [
{ q: 'How do you usually find out what\u0027s happening in Collier?', opts: ['Facebook', 'From a neighbor', 'Township website', 'Mailer', 'I don\u0027t usually'] },
{ q: 'How often do you currently engage with township government?', opts: ['Never', 'A few times a year', 'Monthly', 'Weekly'] },
{ q: 'What matters most to you right now?', multi: true, opts: ['Roads and traffic', 'Parks and recreation', 'Schools and family', 'Taxes and budget', 'Safety and police', 'Trails and environment', 'Senior services', 'Other'] },
{ q: 'How do you like to be contacted?', opts: ['Email', 'Text', 'Phone call', 'Printed mail', 'Don\u0027t contact me'] },
{ q: 'How would you describe your involvement in your community?', opts: [Q5OPTS.speak, Q5OPTS.quiet, Q5OPTS.newish, Q5OPTS.more, Q5OPTS.know] }];


function computeArchetype(answers) {
  const q5 = answers[4];
  const topics = answers[2] || [];
  const has = (t) => topics.includes(t);
  const social = has('Parks and recreation') || has('Schools and family');
  const accountability = has('Safety and police') || has('Taxes and budget');
  if (q5 === Q5OPTS.speak) return 'Civic Champion';
  if (q5 === Q5OPTS.quiet || q5 === Q5OPTS.know) return 'Quiet Supporter';
  if (q5 === Q5OPTS.newish) return social && !accountability ? 'Event-Goer' : 'Newcomer';
  if (q5 === Q5OPTS.more) {
    if (accountability) return 'Watchdog';
    if (social) return 'Event-Goer';
    return 'Civic Champion';
  }
  return 'Newcomer';
}

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
  const [archetype, setArchetype] = useOnb('Newcomer');

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
    case 'quizintro':return <QuizIntro {...common} />;
    case 'quiz':return <QuizFlow answers={answers} setAnswers={setAnswers} onDone={(arc) => {setArchetype(arc);dispatch({ type: 'SET_ARCHETYPE', value: arc });go('computing');}} {...common} />;
    case 'computing':return <Interlude text="Figuring out your archetype..." onDone={() => go('reveal')} />;
    case 'reveal':return <ArchetypeReveal archetype={archetype} {...common} />;
    case 'topics':return <TopicPrefs archetype={archetype} answers={answers} {...common} />;
    case 'notif':return <NotifPrefs archetype={archetype} {...common} />;
    case 'engages':return <EngagesOptIn {...common} />;
    case 'tourintro':return <TourIntro archetype={archetype} {...common} />;
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

// ── Phase 2.1 Quiz intro ─────────────────────────────────────────────────────────
function QuizIntro({ go, retake, dispatch }) {
  const { SketchyButton } = window.CC_UI;
  return (
    <Frame back={retake ? null : () => go('displayname')}>
      <H1>Quick: what kind of resident are you?</H1>
      <Sub>5 questions, takes 2 minutes. Helps us send you things you will actually care about.</Sub>
      <div style={{ marginTop: 16, padding: 14, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 10, fontSize: 14, color: '#7A5A00', lineHeight: 1.5 }}>
        After this, we will personalize your tour, your feed, and your notification defaults.
      </div>
      <div style={{ marginTop: 22 }}>
        <SketchyButton primary onClick={() => go('quiz')} style={{ width: '100%', justifyContent: 'center' }}>Take the quiz</SketchyButton>
      </div>
      {!retake && <a href="#" onClick={(e) => {e.preventDefault();dispatch({ type: 'SET_ARCHETYPE', value: 'Newcomer' });go('engages');}} style={{ display: 'block', marginTop: 16, color: '#2E74B5', fontSize: 14, textAlign: 'center' }}>Skip for now (you will get the generic experience)</a>}
    </Frame>);

}

// ── Phase 2.2-2.6 Quiz ─────────────────────────────────────────────────────────
function QuizFlow({ answers, setAnswers, onDone, go, retake }) {
  const { SketchyButton } = window.CC_UI;
  const [idx, setIdx] = useOnb(0);
  const q = ONB_QUIZ[idx];
  const select = (opt) => {
    if (q.multi) {
      const cur = answers[idx] || [];
      setAnswers({ ...answers, [idx]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] });
    } else setAnswers({ ...answers, [idx]: opt });
  };
  const answered = q.multi ? answers[idx] && answers[idx].length > 0 : !!answers[idx];
  const next = () => {if (idx < ONB_QUIZ.length - 1) setIdx(idx + 1);else onDone(computeArchetype(answers));};
  const prev = () => {if (idx > 0) setIdx(idx - 1);else go('quizintro');};

  return (
    <Frame back={prev}>
      <div style={{ fontSize: 13, color: '#595959', marginBottom: 8, fontWeight: 600 }}>{idx + 1} of {ONB_QUIZ.length}</div>
      <PhaseProgress pct={(idx + 1) / ONB_QUIZ.length * 100} />
      <H1>{q.q}</H1>
      {q.multi && <Sub>Check all that apply.</Sub>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
        {q.opts.map((opt) => {
          const sel = q.multi ? (answers[idx] || []).includes(opt) : answers[idx] === opt;
          return (
            <button key={opt} onClick={() => select(opt)} style={{ fontFamily: 'inherit', fontSize: 16, padding: '14px 16px', textAlign: 'left', background: sel ? '#DBE5F1' : '#FFF', color: '#222', border: sel ? '2px solid #1F3864' : '1.5px solid #222', borderRadius: '10px 13px 10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: q.multi ? 4 : '50%', border: '2px solid #1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? '#1F3864' : 'transparent', flexShrink: 0 }}>
                {sel && <span style={{ color: '#FFF', fontSize: 14 }}>✓</span>}
              </div>
              {opt}
            </button>);

        })}
      </div>
      <div style={{ marginTop: 22 }}>
        <SketchyButton primary disabled={!answered} onClick={next} style={{ width: '100%', justifyContent: 'center' }}>{idx === ONB_QUIZ.length - 1 ? 'See my archetype' : 'Next question'}</SketchyButton>
      </div>
    </Frame>);

}

// ── Phase 2.7 Reveal ─────────────────────────────────────────────────────────────
function ArchetypeReveal({ archetype, go, retake, nav, dispatch }) {
  const { SketchyButton, Icon } = window.CC_UI;
  const arc = window.CC_DATA.archetypes[archetype] || window.CC_DATA.archetypes.Newcomer;
  const finishRetake = () => {dispatch({ type: 'SET_ARCHETYPE', value: archetype });nav({ name: 'me', sub: 'profile' });};
  return (
    <Frame>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 26px', background: '#FFF4D6', border: '2px solid #D4A017', borderRadius: '14px 18px 14px 19px' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="badge" color="#FFF" size={30} /></div>
          <div style={{ fontSize: 12, color: '#7A5A00', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>You're a</div>
          <div style={{ fontSize: 30, color: '#1F3864', fontWeight: 800, lineHeight: 1.1 }}>{arc.name}</div>
        </div>
      </div>
      <div style={{ fontSize: 15, color: '#222', marginBottom: 18, lineHeight: 1.55 }}>{arc.desc}</div>
      <div style={{ padding: 14, background: '#DBE5F1', border: '1.8px solid #1F3864', borderRadius: 10, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1F3864', marginBottom: 8 }}>Based on your answers, here's what we recommend showing you:</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {arc.preview.map((p, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#1F3864' }}>
              <Icon name="check" color="#1F3864" size={15} strokeWidth={2.4} />{p}
            </div>
          )}
        </div>
      </div>
      {retake ?
      <SketchyButton primary onClick={finishRetake} style={{ width: '100%', justifyContent: 'center' }}>Save my archetype</SketchyButton> :

      <SketchyButton primary onClick={() => go('topics')} style={{ width: '100%', justifyContent: 'center' }}>That sounds right</SketchyButton>
      }
      <a href="#" onClick={(e) => {e.preventDefault();go('quiz');}} style={{ display: 'block', marginTop: 16, color: '#2E74B5', fontSize: 14, textAlign: 'center' }}>I want to take the quiz again</a>
    </Frame>);

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
function TourIntro({ archetype, dispatch }) {
  const { SketchyButton } = window.CC_UI;
  const arc = window.CC_DATA.archetypes[archetype] || window.CC_DATA.archetypes.Newcomer;
  return (
    <Frame>
      <H1>Want a quick tour?</H1>
      <Sub>About 5 to 7 minutes. We'll walk you through the platform step by step - including how to get to each section yourself - with a few stops picked just for you as a {arc.name}. You can skip anytime.</Sub>
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