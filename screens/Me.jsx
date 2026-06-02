// Me section: landing + Profile/Notifications/Issues/Followed/Activity

function MeSection() {
  const { state, nav } = window.useStore();
  const sub = state.route.sub;
  if (sub === 'profile') return <ProfilePrefs />;
  if (sub === 'notifications') return <NotificationsPrefs />;
  if (sub === 'issues' || sub === 'items') return <MyItems />;
  if (sub === 'followed') return <MyFollowed />;
  if (sub === 'activity') return <MyActivity />;
  if (sub === 'help') return <HelpContact />;
  if (sub === 'speakprefs') return <SpeakUpPrefs />;
  return <MeLanding />;
}

function MeLanding() {
  const { state, dispatch, nav } = window.useStore();
  const { SketchyCard, SketchyButton, Icon } = window.CC_UI;
  const D = window.CC_DATA;
  const avatarKey = state.avatar || (D.archetypeToAvatar && D.archetypeToAvatar[state.archetype]) || 'Just Getting Started';
  const av = D.avatars[avatarKey] || D.avatars['Just Getting Started'];
  const issueCount = D.tickets.filter(t => t.owner === 'Jane').length + state.submittedTickets.length;
  const requestCount = D.eventRequests.length + state.submittedEventRequests.length;
  const followedCount = Object.keys(state.followed).length;

  const sections = [
    { icon: 'me', label: 'Profile & preferences', go: () => nav({ name: 'me', sub: 'profile' }) },
    { icon: 'bell', label: 'Notifications', tour: 'notif-row', go: () => nav({ name: 'me', sub: 'notifications' }) },
    { icon: 'pin', label: 'My submitted items', tour: 'mysubmitted-row', sub: `${issueCount} tickets · ${requestCount} event requests`, go: () => nav({ name: 'me', sub: 'items' }) },
    { icon: 'star', label: 'My followed items', tour: 'followed-row', sub: `${followedCount} items`, go: () => nav({ name: 'me', sub: 'followed' }) },
    { icon: 'list', label: 'My activity log', go: () => nav({ name: 'me', sub: 'activity' }) }
  ];
  sections.push({ icon: 'help', label: 'Help and contact', tour: 'help-row', go: () => nav({ name: 'me', sub: 'help' }) });

  return (
    <div style={{ padding: '20px 18px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1F3864', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, border: '2.5px solid #222' }}>{state.user.initial}</div>
        <div>
          <div style={{ fontSize: 30, color: '#1F3864', fontWeight: 700, lineHeight: 1.2 }}>{state.user.name}</div>
          <div style={{ fontSize: 13, color: '#595959' }}>{state.user.neighborhood} · <span aria-hidden="true">{av.emoji}</span> {av.key}</div>
          <div style={{ fontSize: 12, color: '#595959' }}>Member since {state.user.memberSince}</div>
        </div>
      </div>

      {/* My Avatar */}
      <div style={{ marginBottom: 18, padding: 16, background: '#DBE5F1', border: '1.8px solid #1F3864', borderRadius: '14px 18px 14px 19px / 16px 14px 18px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 52, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">{av.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: '#1F3864', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800, opacity: 0.7 }}>My Avatar</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1F3864', lineHeight: 1.15 }}>{av.key}</div>
          </div>
          <SketchyButton small icon="refresh" onClick={() => nav({ name: 'onboarding', step: 2 })}>Retake</SketchyButton>
        </div>
        <div style={{ fontSize: 13.5, color: '#243a5e', lineHeight: 1.55, marginBottom: 14 }}>{av.desc}</div>
        <div style={{ fontSize: 11, color: '#1F3864', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 800, marginBottom: 10 }}>How you compare</div>
        {window.AvatarComparisonChart && <window.AvatarComparisonChart current={av.key} />}
      </div>

      {/* Badges showcase */}
      <BadgeShowcase />

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: state.engagesOptedIn ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: 8, marginBottom: 20 }}>
        <SketchyCard style={{ padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: '#1F3864', fontWeight: 700, lineHeight: 1.2 }}>{issueCount}</div>
          <div style={{ fontSize: 11, color: '#595959' }}>Tickets submitted</div>
        </SketchyCard>
        <SketchyCard style={{ padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: '#1F3864', fontWeight: 700, lineHeight: 1.2 }}>{followedCount}</div>
          <div style={{ fontSize: 11, color: '#595959' }}>Followed items</div>
        </SketchyCard>
        {state.engagesOptedIn && (
          <SketchyCard style={{ padding: 12, textAlign: 'center', background: '#FFF4D6', borderColor: '#D4A017' }}>
            <div style={{ fontSize: 32, color: '#7A5A00', fontWeight: 700, lineHeight: 1.2 }}>{state.points}</div>
            <div style={{ fontSize: 11, color: '#7A5A00' }}>Engages points</div>
          </SketchyCard>
        )}
      </div>

      {/* Section list */}
      <div style={{ display: 'grid', gap: 8 }}>
        {sections.map((s, i) => (
          <SketchyCard key={i} dataTour={s.tour} onClick={s.go} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#F2F2F2', border: '1.5px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} color="#1F3864" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{s.label}</div>
              {s.sub && <div style={{ fontSize: 12, color: '#595959' }}>{s.sub}</div>}
            </div>
            <Icon name="chev" color="#595959" size={18} />
          </SketchyCard>
        ))}
      </div>

      {/* Reset (dev convenience) */}
      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <button onClick={() => { if (confirm('Start over from the very beginning? This wipes everything and returns you to the first-run Welcome screen, before any onboarding.')) dispatch({ type: 'RESET' }); }}
          style={{ background: 'transparent', border: '1.5px dashed #BFBFBF', borderRadius: 6, padding: '8px 14px', fontSize: 12, color: '#595959', cursor: 'pointer', fontFamily: 'inherit' }}>
          ↺ Restart from the very beginning
        </button>
      </div>
    </div>
  );
}

function BackHeader({ title }) {
  const { back } = window.useStore();
  const { Icon } = window.CC_UI;
  return (
    <div style={{ padding: '14px 18px 0' }}>
      <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
        <Icon name="back" size={16} /> Back
      </button>
      <div style={{ fontSize: 32, color: '#1F3864', fontWeight: 700, marginTop: 8, lineHeight: 1.2 }}>{title}</div>
    </div>
  );
}

function ProfilePrefs() {
  const { state, dispatch, nav } = window.useStore();
  const { SketchyButton, Field } = window.CC_UI;
  const D = window.CC_DATA;
  // Infer existing pref from persisted display name so revisits land on the right radio
  const inferPref = () => {
    if (state.displayName === 'Jane Smith') return 'full';
    if (state.displayName === 'Jane S.') return 'first';
    return 'resident';
  };
  const [displayPref, setDisplayPref] = React.useState(inferPref());
  const [showNeighborhood, setShowNeighborhood] = React.useState(/from /i.test(state.displayName));
  const [neighborhood, setNeighborhood] = React.useState(state.user.neighborhood);
  const [topics, setTopics] = React.useState(state.topics);
  const [defaultView, setDefaultView] = React.useState(state.happeningView);
  const [email, setEmail] = React.useState(state.user.email);
  const [emailError, setEmailError] = React.useState('');
  const allTopics = ['Family events', 'Parks and Recreation', 'Road and Traffic', 'Trails and environment', 'Senior services', 'Safety and Police', 'Taxes and Budget'];

  const buildDisplayName = (pref, nb, showNb) => {
    if (pref === 'full') return showNb ? `Jane Smith from ${nb}` : 'Jane Smith';
    if (pref === 'first') return showNb ? `Jane S. from ${nb}` : 'Jane S.';
    // resident
    return showNb ? `Collier Resident from ${nb}` : 'Collier Resident';
  };

  const previewName = buildDisplayName(displayPref, neighborhood, showNeighborhood);

  const toggle = (t) => setTopics(topics.includes(t) ? topics.filter(x => x !== t) : [...topics, t]);
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const save = () => {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    dispatch({ type: 'SET_TOPICS', value: topics });
    dispatch({ type: 'SET_HAPPENING_VIEW', value: defaultView });
    dispatch({ type: 'SET_EMAIL', value: email });
    dispatch({ type: 'SET_DISPLAY_NAME', value: previewName });
    nav({ name: 'me' });
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <BackHeader title="Profile & preferences" />
      <div style={{ padding: '14px 18px' }}>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Email address</div>
        <div style={{ marginBottom: 4 }}>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
            placeholder="you@example.com"
            autoComplete="email"
            style={{
              width: '100%', boxSizing: 'border-box', padding: 10, fontFamily: 'inherit', fontSize: 15,
              border: '1.5px solid ' + (emailError ? '#C00000' : '#222'),
              borderRadius: 6, background: '#FFF'
            }}
            aria-invalid={!!emailError}
            aria-describedby="email-help"
          />
        </div>
        {emailError
          ? <div style={{ fontSize: 12, color: '#C00000', marginBottom: 14, fontWeight: 600 }}>{emailError}</div>
          : <div id="email-help" style={{ fontSize: 12, color: '#595959', marginBottom: 14 }}>Used for digest emails and responses to your feedback.</div>
        }

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Display name preference</div>
        <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
          {[['resident', 'Collier Resident'], ['first', 'Jane S.'], ['full', 'Jane Smith']].map(([k, label]) => (
            <label key={k} style={{ padding: 10, border: displayPref === k ? '2px solid #1F3864' : '1.5px solid #222', background: displayPref === k ? '#DBE5F1' : '#FFF', borderRadius: 6, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="radio" checked={displayPref === k} onChange={() => setDisplayPref(k)} />
              <span>{label}</span>
              {k === 'resident' && <span style={{ fontSize: 11, color: '#595959', marginLeft: 'auto' }}>(default - anonymous)</span>}
            </label>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: '#FFF', border: '1.5px solid #222', borderRadius: 6, marginBottom: 14, cursor: 'pointer' }}>
          <input type="checkbox" checked={showNeighborhood} onChange={e => setShowNeighborhood(e.target.checked)} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Also show my neighborhood</div>
            <div style={{ fontSize: 12, color: '#595959' }}>Adds "from {neighborhood}" to your display name.</div>
          </div>
        </label>

        {/* Live preview */}
        <div style={{ marginBottom: 18, padding: 12, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#7A5A00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Preview</div>
          <div style={{ fontSize: 12, color: '#595959', marginBottom: 8 }}>This is how your name will be displayed throughout the platform:</div>
          <div style={{ padding: 10, background: '#FFF', border: '1.5px solid #BFBFBF', borderRadius: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1F3864' }}>
              {previewName} <span style={{ color: '#595959', fontWeight: 400 }}>· just now</span>
            </div>
            <div style={{ fontSize: 13, marginTop: 4, color: '#222' }}>This is what a comment from you looks like to your neighbors.</div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Neighborhood</div>
        <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} style={{ width: '100%', padding: 10, fontFamily: 'inherit', fontSize: 15, border: '1.5px solid #222', borderRadius: 6, marginBottom: 18, background: '#FFF' }}>
          {D.neighborhoods.map(n => <option key={n}>{n}</option>)}
        </select>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Topic interests</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {allTopics.map(t => (
            <label key={t} style={{ fontSize: 13, padding: '8px 14px', border: '1.5px solid #222', borderRadius: 999, background: topics.includes(t) ? '#1F3864' : '#FFF', color: topics.includes(t) ? '#FFF' : '#222', cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
              <input type="checkbox" checked={topics.includes(t)} onChange={() => toggle(t)} style={{ display: 'none' }} />
              {topics.includes(t) ? '✓ ' : ''}{t}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: 18 }}>
          <SketchyButton onClick={() => nav({ name: 'onboarding', step: 2 })} icon="refresh">Retake the quiz</SketchyButton>
        </div>

        <div onClick={() => nav({ name: 'me', sub: 'speakprefs' })} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 6, marginBottom: 18, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFF4D6', border: '1.5px solid #D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <window.CC_UI.Icon name="trophy" color="#7A5A00" size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Manage your engagement preferences</div>
            <div style={{ fontSize: 12, color: '#595959' }}>Points, badges, leaderboard, and rewards. Currently {state.engagesOptedIn ? 'on' : 'off'}.</div>
          </div>
          <window.CC_UI.Icon name="chev" color="#595959" size={18} />
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Default "What's happening" view</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {['map', 'calendar', 'list'].map(v => (
            <button key={v} onClick={() => setDefaultView(v)} style={{ flex: 1, padding: 10, fontFamily: 'inherit', fontSize: 14, textTransform: 'capitalize', border: defaultView === v ? '2px solid #1F3864' : '1.5px solid #222', background: defaultView === v ? '#DBE5F1' : '#FFF', borderRadius: 6, cursor: 'pointer' }}>{v}</button>
          ))}
        </div>

        <SketchyButton primary onClick={save} style={{ width: '100%', justifyContent: 'center' }}>Save preferences</SketchyButton>
      </div>
    </div>
  );
}

function NotificationsPrefs() {
  const { SketchyButton } = window.CC_UI;
  const { state, nav } = window.useStore();
  const opted = state.engagesOptedIn;
  const TOPICS = ['Roads and Traffic', 'Parks and Recreation', 'Family events', 'Active proposals', 'Trails and environment', 'Senior services'];
  const [prefs, setPrefs] = React.useState(Object.fromEntries(TOPICS.map(t => [t, { channel: 'Email', freq: 'Weekly digest' }])));
  const set = (t, key, val) => setPrefs({ ...prefs, [t]: { ...prefs[t], [key]: val } });
  const ACTIVITY_CHANNELS = ['Real-time push', 'Real-time SMS', 'Real-time email', 'Daily digest email', 'Weekly digest email', 'Off'];
  const [earnChannel, setEarnChannel] = React.useState('Weekly digest email');
  const [badgeChannel, setBadgeChannel] = React.useState('Real-time push');
  const ALERT_CH_TO_LABEL = { 'Real-time SMS': 'text message', 'Real-time push': 'push notification', 'Real-time email': 'email', 'Daily digest email': 'daily digest email', 'Weekly digest email': 'weekly digest email', 'Off': 'nothing (off)' };
  const ALERT_LABEL_TO_CH = { 'text message': 'Real-time SMS', 'push notification': 'Real-time push', 'email': 'Real-time email', 'daily digest email': 'Daily digest email', 'weekly digest email': 'Weekly digest email', 'nothing (off)': 'Off' };
  const alertChannelSel = ALERT_LABEL_TO_CH[state.alertChannel] || 'Real-time SMS';
  const [followedAlertCh, setFollowedAlertCh] = React.useState(alertChannelSel);

  return (
    <div style={{ paddingBottom: 100 }} data-tour="notif-page">
      <BackHeader title="Notifications" />
      <div style={{ padding: '14px 18px' }}>
        <div style={{ padding: 10, background: '#FBE5D6', border: '1.5px solid #C65911', borderRadius: 6, fontSize: 13, color: '#C65911', marginBottom: 14 }}>
          ⚠️ Emergency alerts are always on (cannot be disabled).
        </div>
        <div style={{ padding: 10, background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 6, fontSize: 12.5, color: '#1F3864', lineHeight: 1.45, marginBottom: 14 }}>
          These settings control what you hear about in general. For specific things you want updates on, use the <strong>Follow</strong> button on those items.
        </div>

        {/* Alert preferences - top of the screen because alerts are the most urgent */}
        <div style={{ fontSize: 13, fontWeight: 800, color: '#C65911', textTransform: 'uppercase', letterSpacing: 0.4, margin: '4px 0 10px' }}>Alert preferences</div>
        <div style={{ padding: 12, background: '#FFF', border: '1.5px solid #C65911', borderRadius: 6, marginBottom: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Alert notification channel</div>
          <select value={alertChannelSel} onChange={e => dispatch({ type: 'SET_ALERT_CHANNEL', value: ALERT_CH_TO_LABEL[e.target.value] })} style={{ width: '100%', padding: 9, fontFamily: 'inherit', fontSize: 14, border: '1.5px solid #BFBFBF', borderRadius: 4, background: '#FFF' }}>
            {ACTIVITY_CHANNELS.map(o => <option key={o}>{o}</option>)}
          </select>
          <div style={{ fontSize: 12, color: '#595959', marginTop: 8, lineHeight: 1.45 }}>Alerts are time-sensitive (road closures, weather warnings, emergencies). By default, alerts go through faster channels like text messages so you hear about them in time to act.</div>
        </div>
        <div style={{ padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 6, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Followed alert notifications</div>
          <select value={followedAlertCh} onChange={e => setFollowedAlertCh(e.target.value)} style={{ width: '100%', padding: 9, fontFamily: 'inherit', fontSize: 14, border: '1.5px solid #BFBFBF', borderRadius: 4, background: '#FFF' }}>
            {ACTIVITY_CHANNELS.map(o => <option key={o}>{o}</option>)}
          </select>
          <div style={{ fontSize: 12, color: '#595959', marginTop: 8, lineHeight: 1.45 }}>How you hear about specific alerts you follow. Most residents leave this on the default.</div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: '#1F3864', textTransform: 'uppercase', letterSpacing: 0.4, margin: '4px 0 10px' }}>Per-topic settings</div>
        {TOPICS.map(t => (
          <div key={t} style={{ padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 6, marginBottom: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{t}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={prefs[t].channel} onChange={e => set(t, 'channel', e.target.value)} style={selStyle}>
                {['Email', 'SMS', 'Push', 'None'].map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={prefs[t].freq} onChange={e => set(t, 'freq', e.target.value)} style={selStyle}>
                {['Real-time', 'Daily', 'Weekly digest', 'Off'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        ))}

        {/* Platform activity notifications */}
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1F3864', textTransform: 'uppercase', letterSpacing: 0.4, margin: '22px 0 10px' }}>Platform activity notifications</div>

        <div style={{ padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 6, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EAF1F9', border: '1.5px solid #1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <window.CC_UI.Icon name="pluscircle" color="#1F3864" size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5 }}>New ways to earn points</div>
              <div style={{ fontSize: 12.5, color: '#595959', lineHeight: 1.4, marginTop: 2 }}>Get notified when new polls, proposals, community events, or other activities become available to engage with.</div>
            </div>
          </div>
          <select value={earnChannel} onChange={e => setEarnChannel(e.target.value)} style={{ width: '100%', padding: 9, fontFamily: 'inherit', fontSize: 14, border: '1.5px solid #BFBFBF', borderRadius: 4, background: '#FFF' }}>
            {ACTIVITY_CHANNELS.map(o => <option key={o}>{o}</option>)}
          </select>
          {!opted && <div style={{ fontSize: 12, color: '#595959', marginTop: 8, lineHeight: 1.4, fontStyle: 'italic' }}>You will still see these notifications even without joining Engages, but point values will not be shown.</div>}
        </div>

        {opted && (
          <div style={{ padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 6, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFF4D6', border: '1.5px solid #D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <window.CC_UI.Icon name="badge" color="#7A5A00" size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>Badge earned and tier promotion</div>
                <div style={{ fontSize: 12.5, color: '#595959', lineHeight: 1.4, marginTop: 2 }}>Get notified when you earn a badge or move up to a new tier.</div>
              </div>
            </div>
            <select value={badgeChannel} onChange={e => setBadgeChannel(e.target.value)} style={{ width: '100%', padding: 9, fontFamily: 'inherit', fontSize: 14, border: '1.5px solid #BFBFBF', borderRadius: 4, background: '#FFF' }}>
              {ACTIVITY_CHANNELS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        )}

        <SketchyButton primary onClick={() => nav({ name: 'me' })} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>Save</SketchyButton>
      </div>
    </div>
  );
}
const selStyle = { flex: 1, padding: 8, fontFamily: 'inherit', fontSize: 14, border: '1.5px solid #BFBFBF', borderRadius: 4, background: '#FFF' };

function MyItems() {
  const { state, nav } = window.useStore();
  const { Pill, Icon } = window.CC_UI;
  const D = window.CC_DATA;
  const [filter, setFilter] = React.useState('All');

  const reqDetail = state.route.reqId;
  if (reqDetail) return <EventRequestDetail reqId={reqDetail} />;

  const issues = [...state.submittedTickets, ...D.tickets.filter(t => t.owner === 'Jane')].map(t => ({ kind: 'issue', t, sortDate: t.date }));
  const requests = [...state.submittedEventRequests, ...D.eventRequests].map(r => ({ kind: 'request', r, sortDate: r.submitted }));
  let all = [...requests, ...issues];
  if (filter === 'Tickets') all = issues;
  if (filter === 'Event requests') all = requests;

  const reqBadge = (status) => {
    const map = {
      'Submitted': ['#595959', '#F2F2F2'],
      'Under Review': ['#2E74B5', '#DBE5F1'],
      'Needs more info': ['#7A5A00', '#FFF4D6'],
      'Approved': ['#548235', '#E6F2DD'],
      'Declined': ['#C00000', '#FBE0E0']
    };
    return map[status] || ['#595959', '#F2F2F2'];
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <BackHeader title="My submitted items" />
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {['All', 'Tickets', 'Event requests'].map(fl => (
            <button key={fl} onClick={() => setFilter(fl)} style={{
              flex: 1, padding: '8px 6px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: filter === fl ? '#1F3864' : '#FFF', color: filter === fl ? '#FFF' : '#1F3864',
              border: '1.5px solid #1F3864', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap'
            }}>{fl}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {all.map((item, i) => {
            if (item.kind === 'issue') {
              const t = item.t;
              const c = t.status === 'Resolved' ? '#548235' : t.status === 'Escalated' ? '#7030A0' : t.status === 'Declined' ? '#C00000' : '#7030A0';
              const bg = t.status === 'Resolved' ? '#E6F2DD' : t.status === 'Declined' ? '#FBE0E0' : '#EFE0F4';
              return (
                <div key={'i' + i} data-tour="item-ticket" onClick={() => nav({ name: 'happening', detail: { kind: 'ticket', id: t.id } })}
                  style={{ padding: 12, background: '#FFF', border: '1.5px solid #222', borderLeft: `5px solid ${c}`, borderRadius: 8, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                    <Pill bg={bg} fg={c}>TICKET · {t.status.toUpperCase()}</Pill>
                    <div style={{ fontSize: 11, color: '#595959' }}>{t.id}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{t.location}</div>
                  <div style={{ fontSize: 12, color: '#595959' }}>{t.type} · Submitted {t.date}</div>
                  <div style={{ fontSize: 13, color: '#222', marginTop: 6, lineHeight: 1.4 }}>{t.description}</div>
                  {t.response && <div style={{ fontSize: 12, color: '#7A5A00', marginTop: 6, fontStyle: 'italic' }}>✉️ Response from {t.response.staff}</div>}
                </div>
              );
            }
            const r = item.r;
            const [fg, bg] = reqBadge(r.status);
            return (
              <div key={'r' + i} onClick={() => nav({ name: 'me', sub: 'items', reqId: r.id })}
                style={{ padding: 12, background: '#FFF', border: '1.5px solid #222', borderLeft: '5px solid #2E74B5', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#2E74B5' }}><Icon name="cal" size={13} color="#2E74B5" /> EVENT REQUEST</span>
                  <Pill bg={bg} fg={fg}>{r.status}</Pill>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#595959' }}>{r.eventDate} · Submitted {r.submitted}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}><Icon name="chev" size={16} color="#595959" /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EventRequestDetail({ reqId }) {
  const { state, dispatch, nav, back } = window.useStore();
  const { Pill, Icon, SketchyButton } = window.CC_UI;
  const D = window.CC_DATA;
  const r = [...state.submittedEventRequests, ...D.eventRequests].find(x => x.id === reqId);
  if (!r) return null;
  // A pending "Needs more info" becomes "Under Review" once replied
  const replied = state.eventRequestReplies[r.id];
  const status = (r.status === 'Needs more info' && replied) ? 'Under Review' : r.status;

  const statusColors = {
    'Submitted': ['#595959', '#F2F2F2'],
    'Under Review': ['#2E74B5', '#DBE5F1'],
    'Needs more info': ['#7A5A00', '#FFF4D6'],
    'Approved': ['#548235', '#E6F2DD'],
    'Declined': ['#C00000', '#FBE0E0']
  };
  const [fg, bg] = statusColors[status] || ['#595959', '#F2F2F2'];

  // Timeline nodes
  const nodes = ['Submitted', 'Under Review', 'Decision', status === 'Approved' ? 'Live' : null].filter(Boolean);
  let activeIdx = 0;
  if (status === 'Submitted') activeIdx = 0;
  else if (status === 'Under Review' || status === 'Needs more info') activeIdx = 1;
  else if (status === 'Approved' || status === 'Declined') activeIdx = 2;
  if (status === 'Approved') activeIdx = 3;

  const Row = ({ label, value }) => value ? (
    <div style={{ padding: '8px 0', borderTop: '1px dashed #E0E0E0' }}>
      <div style={{ fontSize: 11, color: '#595959', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 14, color: '#222', marginTop: 2, lineHeight: 1.4 }}>{value}</div>
    </div>
  ) : null;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back to my items
        </button>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{r.name}</div>
        </div>
        <div style={{ marginBottom: 14 }}><Pill bg={bg} fg={fg}>{status}</Pill> <span style={{ fontSize: 12, color: '#595959' }}>· {r.id}</span></div>

        {/* Timeline */}
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8, marginBottom: 14 }}>
          {nodes.map((n, i) => (
            <React.Fragment key={n}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 0, minWidth: 60 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: i < activeIdx ? '#1F3864' : i === activeIdx ? '#FFF4D6' : '#FFF', border: '2px solid ' + (i <= activeIdx ? '#1F3864' : '#BFBFBF'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: i < activeIdx ? '#FFF' : '#1F3864', fontWeight: 700 }}>{i < activeIdx ? '✓' : i + 1}</div>
                <div style={{ fontSize: 9.5, marginTop: 4, textAlign: 'center', color: i === activeIdx ? '#1F3864' : '#595959', fontWeight: i === activeIdx ? 700 : 400 }}>{n}</div>
              </div>
              {i < nodes.length - 1 && <div style={{ flex: 1, height: 2, background: i < activeIdx ? '#1F3864' : '#BFBFBF', margin: '11px 2px 0' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Reviewer message for Needs more info / Declined */}
        {(status === 'Needs more info' || status === 'Declined') && (
          <div style={{ padding: 14, background: '#FFF4D6', border: '1.8px solid #D4A017', borderRadius: 8, marginBottom: 14 }}>
            <div style={{ display: 'inline-block', fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, color: '#7A5A00', background: '#FFE9AE', border: '1px solid #D4A017', borderRadius: 3, padding: '1px 6px', marginBottom: 6 }}>TOWNSHIP STAFF</div>
            <div style={{ fontSize: 14, color: '#222', lineHeight: 1.5 }}>{r.reviewerNote}</div>
            <div style={{ fontSize: 12, color: '#7A5A00', marginTop: 6, fontWeight: 600 }}>- {r.reviewer}</div>
            {status === 'Needs more info' && (
              <div style={{ marginTop: 12 }}>
                <SketchyButton primary small icon="chat" onClick={() => { dispatch({ type: 'REPLY_EVENT_REQUEST', id: r.id }); nav({ name: 'placeholder', kind: 'email', label: 'Reply to ' + r.reviewer, returnTo: { name: 'me', sub: 'items', reqId: r.id } }); }}>Reply to reviewer</SketchyButton>
              </div>
            )}
            {status === 'Declined' && (
              <div style={{ marginTop: 12 }}>
                <SketchyButton primary small icon="refresh" onClick={() => nav({ name: 'eventRequest', step: 'form' })}>Revise and resubmit</SketchyButton>
              </div>
            )}
          </div>
        )}

        {status === 'Under Review' && replied && (
          <div style={{ padding: 12, background: '#DBE5F1', border: '1.5px solid #1F3864', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#1F3864' }}>
            ✓ Your reply was sent to {r.reviewer}. They'll follow up by email. Status moved back to Under Review.
          </div>
        )}

        {/* Read-only summary */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#595959', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>Your request</div>
        <Row label="Event date" value={r.eventDate + (r.eventTime ? ' · ' + r.eventTime : '')} />
        <Row label="Location" value={r.locationName} />
        <Row label="Description" value={r.descr} />
        <Row label="Organizer" value={r.organizerGroup ? `${r.organizerName} (on behalf of ${r.organizerGroup})` : r.organizerName} />
        <Row label="Expected attendance" value={r.attendance} />
        <Row label="Open to" value={r.openToPublic} />
        <Row label="Indoor / outdoor" value={r.indoorOutdoor + (r.rainPlan ? ' · ' + r.rainPlan : '')} />
        <Row label="Venue permission" value={r.permission} />
        <Row label="Contact" value={`${r.organizerEmail} · ${r.organizerPhone}`} />
        <Row label="Notes for reviewer" value={r.notes} />
      </div>
    </div>
  );
}

function MyFollowed() {
  const { state, dispatch, nav } = window.useStore();
  const { Icon, Pill, SketchyButton, FollowPrefsModal } = window.CC_UI;
  const D = window.CC_DATA;
  const followedIds = Object.keys(state.followed);
  const [editMode, setEditMode] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  const [prefs, setPrefs] = React.useState(null); // { type }

  const resolve = (id) => {
    const proj = D.projects.find(p => p.id === id);
    if (proj) return { type: 'project', icon: 'map', name: proj.name, badge: 'PROJECT', c: '#548235', curr: proj.status, go: () => nav({ name: 'happening', detail: { kind: 'project', id } }) };
    const prop = D.proposals.find(p => p.id === id);
    if (prop) return { type: 'proposal', icon: 'decide', name: prop.title, badge: 'PROPOSAL', c: '#7030A0', curr: `${prop.status} · Deadline ${prop.deadline}`, go: () => nav({ name: 'decide', id }) };
    const e = D.events.find(e => e.id === id) || D.communityEvents.find(e => e.id === id);
    if (e) return { type: 'event', icon: 'cal', name: e.name, badge: 'EVENT', c: '#2E74B5', curr: (window.prettyDate ? window.prettyDate(e.date) : e.date) + ' · ' + e.time, go: () => nav({ name: 'happening', detail: { kind: 'event', id } }) };
    const t = D.tickets.find(t => t.id === id) || D.otherTickets.find(t => t.id === id);
    if (t) return { type: 'ticket', icon: 'speak', name: t.location, badge: 'TICKET', c: '#7030A0', curr: t.status, go: () => nav({ name: 'happening', detail: { kind: 'ticket', id } }) };
    const n = D.notices.find(n => n.id === id);
    if (n) {
      const isAlert = n.kind === 'alert';
      return { type: isAlert ? 'alert' : 'notice', icon: isAlert ? 'warn' : 'bell', name: n.name, badge: isAlert ? 'ALERT' : 'NOTICE', c: isAlert ? '#C65911' : '#D4A017', curr: n.dateLabel, archived: !!n.expired, go: () => nav({ name: 'happening', detail: { kind: 'notice', id } }) };
    }
    return null;
  };

  // Group by type in a fixed order
  const GROUPS = [['event', 'Events'], ['project', 'Projects'], ['ticket', 'Tickets'], ['proposal', 'Proposals'], ['notice', 'Notices'], ['alert', 'Alerts']];
  const all = followedIds.map(id => ({ id, r: resolve(id) })).filter(x => x.r);
  const resolved = all.filter(x => !x.r.archived);
  const archivedItems = all.filter(x => x.r.archived);
  const [showArchived, setShowArchived] = React.useState(false);

  const toggleSel = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const selectedIds = Object.keys(selected).filter(k => selected[k]);
  const unfollowSelected = () => {
    selectedIds.forEach(id => dispatch({ type: 'TOGGLE_FOLLOW', id }));
    setSelected({});
    setEditMode(false);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <BackHeader title="My followed items" />
      <div data-tour="followed-list" style={{ padding: '14px 18px' }}>
        {all.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#595959' }}>You're not following anything yet. Tap "Follow" on any event, project, ticket, proposal, notice, or alert.</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#595959' }}>{resolved.length} followed · you'll be notified of changes</div>
              <button onClick={() => { setEditMode(!editMode); setSelected({}); }} style={{ background: 'none', border: 'none', color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{editMode ? 'Done' : 'Edit'}</button>
            </div>

            {GROUPS.map(([key, label]) => {
              const rows = resolved.filter(x => x.r.type === key);
              if (!rows.length) return null;
              return (
                <div key={key} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1F3864', marginBottom: 8 }}>{label}</div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {rows.map(({ id, r }) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#FFF', border: '1.5px solid #222', borderLeft: `5px solid ${r.c}`, borderRadius: 8 }}>
                        {editMode && (
                          <input type="checkbox" checked={!!selected[id]} onChange={() => toggleSel(id)} style={{ width: 20, height: 20, flexShrink: 0 }} />
                        )}
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F2F2F2', border: '1.5px solid ' + r.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name={r.icon} color={r.c} size={17} />
                        </div>
                        <button onClick={editMode ? () => toggleSel(id) : r.go} style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
                          <div style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.25 }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: '#595959', marginTop: 1 }}>{r.curr}</div>
                        </button>
                        {!editMode && (
                          <button onClick={() => setPrefs({ type: r.type })} aria-label="Notification preferences" title="Notification preferences for this item" style={{ width: 32, height: 32, borderRadius: 6, border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon name="settings" size={16} color="#595959" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {(() => {
              const fc = Object.keys(state.followedCategories || {}).filter(k => state.followedCategories[k]);
              const fn = Object.keys(state.followedNeighborhoods || {}).filter(k => state.followedNeighborhoods[k]);
              const catCount = (c) => D.proposals.filter(p => p.category === c).length;
              const nbCount = (n) => D.proposals.filter(p => p.neighborhoods.some(x => x === n || x === 'All neighborhoods')).length;
              const Row = ({ label, count, onPrefs, onRemove, icon }) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#FFF', border: '1.5px solid #222', borderLeft: '5px solid #7030A0', borderRadius: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F2F2F2', border: '1.5px solid #7030A0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={icon} color="#7030A0" size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#595959' }}>{count} active proposal{count === 1 ? '' : 's'}</div>
                  </div>
                  {!editMode && <button onClick={onPrefs} aria-label="Notification preferences" style={{ width: 32, height: 32, borderRadius: 6, border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="settings" size={16} color="#595959" /></button>}
                </div>
              );
              return (
                <>
                  {fc.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#1F3864', marginBottom: 8 }}>Categories</div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {fc.map(c => <Row key={c} label={c} count={catCount(c)} icon="decide" onPrefs={() => setPrefs({ type: 'proposal' })} />)}
                      </div>
                    </div>
                  )}
                  {fn.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#1F3864', marginBottom: 8 }}>Neighborhoods</div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {fn.map(n => <Row key={n} label={n} count={nbCount(n)} icon="pin" onPrefs={() => setPrefs({ type: 'proposal' })} />)}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {archivedItems.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <button onClick={() => setShowArchived(!showArchived)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, color: '#595959', marginBottom: 8 }}>
                  <Icon name={showArchived ? 'chevDown' : 'chev'} size={16} color="#595959" /> Archived ({archivedItems.length})
                </button>
                {showArchived && (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {archivedItems.map(({ id, r }) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#F7F7F4', border: '1.5px solid #BFBFBF', borderLeft: `5px solid ${r.c}`, borderRadius: 8, opacity: 0.9 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#ECECEC', border: '1.5px solid #BFBFBF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name={r.icon} color="#8A8A8A" size={17} />
                        </div>
                        <button onClick={r.go} style={{ flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.25, color: '#444' }}>{r.name}</span>
                            <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.4, color: '#595959', background: '#E0E0E0', borderRadius: 3, padding: '1px 5px' }}>ARCHIVED</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#595959', marginTop: 1 }}>{r.curr}</div>
                        </button>
                        <button onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', id })} style={{ background: 'none', border: 'none', padding: 0, color: '#C00000', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}>Unfollow</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {editMode && (
              <div style={{ position: 'sticky', bottom: 0, paddingTop: 8 }}>
                <SketchyButton danger disabled={selectedIds.length === 0} onClick={unfollowSelected} style={{ width: '100%', justifyContent: 'center' }}>
                  Unfollow {selectedIds.length || ''} selected
                </SketchyButton>
              </div>
            )}
          </>
        )}
      </div>
      {prefs && <FollowPrefsModal type={prefs.type} onClose={() => setPrefs(null)} />}
    </div>
  );
}

function MyActivity() {
  const D = window.CC_DATA;
  return (
    <div style={{ paddingBottom: 100 }}>
      <BackHeader title="My activity log" />
      <div style={{ padding: '14px 18px' }}>
        <div style={{ position: 'relative', paddingLeft: 18 }}>
          <div style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 2, background: '#BFBFBF' }} />
          {D.activityLog.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14, position: 'relative' }}>
              <div style={{ position: 'absolute', left: -18, top: 4, width: 12, height: 12, borderRadius: '50%', background: '#1F3864', border: '2px solid #FAFAF7' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#595959', fontWeight: 600 }}>{a.date}</div>
                <div style={{ fontSize: 14 }}>{a.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HelpContact() {
  const { nav, dispatch } = window.useStore();
  const { SketchyButton, Icon } = window.CC_UI;
  const [tipsMsg, setTipsMsg] = React.useState(false);
  return (
    <div style={{ paddingBottom: 100 }}>
      <BackHeader title="Help & contact" />
      <div style={{ padding: '14px 18px' }}>
        <div style={{ padding: 14, background: '#FFF', border: '1.5px solid #222', borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700 }}>Call the township</div>
          <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>Speak with a real person. Monday-Friday, 8am-4pm.</div>
          <SketchyButton primary onClick={() => nav({ name: 'placeholder', kind: 'phone' })} icon="phone">(412) 279-2525</SketchyButton>
        </div>
        <div style={{ padding: 14, background: '#FFF', border: '1.5px solid #222', borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700 }}>Email the manager</div>
          <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>george.macino@colliertownship.net · 3 business day reply</div>
          <SketchyButton onClick={() => nav({ name: 'placeholder', kind: 'email' })} icon="chat">Compose email</SketchyButton>
        </div>
        <div style={{ padding: 14, background: '#FFF', border: '1.5px solid #222', borderRadius: 8 }}>
          <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700 }}>Visit the website</div>
          <SketchyButton onClick={() => nav({ name: 'placeholder', kind: 'website' })}>colliertownship.net</SketchyButton>
        </div>
        <div style={{ padding: 14, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8, marginTop: 12 }}>
          <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700 }}>Getting started</div>
          <div style={{ fontSize: 14, color: '#7A5A00', marginBottom: 10 }}>New here, or want a refresher? Replay the whole setup, just the spotlight tour, or bring back the first-visit tips.</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <SketchyButton primary icon="refresh" onClick={() => { dispatch({ type: 'RESTART_TOUR' }); }}>Restart the spotlight tour</SketchyButton>
            <SketchyButton icon="help" onClick={() => { dispatch({ type: 'RESET_TIPS' }); setTipsMsg(true); }}>Show me tips again</SketchyButton>
            <SketchyButton icon="me" onClick={() => { if (confirm('Restart the whole setup from the beginning? Your account data stays; you\u0027ll re-do the welcome flow, quiz, and tour.')) dispatch({ type: 'RESTART_ONBOARDING' }); }}>Restart whole setup</SketchyButton>
          </div>
          {tipsMsg && <div style={{ fontSize: 12.5, color: '#548235', fontWeight: 600, marginTop: 8 }}>✓ First-visit tips re-enabled. They'll appear as you explore each screen.</div>}
          <div style={{ borderTop: '1px dashed #D4A017', margin: '14px 0 12px' }}></div>
          <div style={{ fontSize: 13.5, color: '#7A5A00', marginBottom: 10, lineHeight: 1.5 }}>Want a completely clean slate? Start the prototype over from the very beginning - the first-run Welcome screen, before any onboarding - wiping all submitted tickets, follows, and points.</div>
          <SketchyButton danger icon="refresh" onClick={() => { if (confirm('Start over from the very beginning?\n\nThis wipes everything - onboarding, submitted tickets, follows, and points - and returns you to the first-run Welcome screen, as if you just opened the app for the first time.')) dispatch({ type: 'RESET' }); }}>Start over from the beginning</SketchyButton>
        </div>
      </div>
    </div>
  );
}

function SpeakUpPrefs() {
  const { state, dispatch, nav } = window.useStore();
  const { SketchyButton, Icon } = window.CC_UI;
  const opted = state.engagesOptedIn;
  // Local display-feature toggles (cosmetic for the prototype)
  const [showPoints, setShowPoints] = React.useState(true);
  const [showOnLeaderboard, setShowOnLeaderboard] = React.useState(false);

  const Toggle = ({ checked, onChange, label, sub, disabled }) => (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, background: '#FFF', border: '1.5px solid ' + (disabled ? '#E0E0E0' : '#222'), borderRadius: 8, marginBottom: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1, flexShrink: 0 }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: '#595959', marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </label>
  );

  return (
    <div style={{ paddingBottom: 100 }}>
      <BackHeader title="Manage your engagement preferences" />
      <div style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 14, color: '#595959', lineHeight: 1.55, marginBottom: 16 }}>
          How to engage is always available to everyone. These settings control the optional <strong>Engages</strong> features - points, tiers, badges, the leaderboard, and rewards. Turning them off does not remove the How to engage tab or any way to give feedback.
        </div>

        <Toggle
          checked={opted}
          onChange={v => dispatch({ type: 'SET_ENGAGES', value: v })}
          label="Engages - points, badges, and rewards"
          sub="Earn points and rewards as you engage, and see your tier and badges. Turn off any time." />

        <div style={{ marginTop: 6, marginBottom: 6, fontSize: 13, fontWeight: 700, color: '#595959', textTransform: 'uppercase', letterSpacing: 0.3 }}>Display</div>
        <Toggle
          checked={opted && showPoints}
          disabled={!opted}
          onChange={setShowPoints}
          label="Show point values throughout the app"
          sub="Display the points each action is worth on opportunity and activity cards." />
        <Toggle
          checked={opted && showOnLeaderboard}
          disabled={!opted}
          onChange={setShowOnLeaderboard}
          label="Show my name on the individual leaderboard"
          sub="By default you appear anonymously. Turn on to show your display name to neighbors." />

        <div style={{ marginTop: 14, padding: 12, background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 8, fontSize: 13, color: '#1F3864', lineHeight: 1.5 }}>
          {opted
            ? 'Engages is on. You currently have ' + state.points + ' points at the Contributor tier.'
            : 'Engages is off. You can still submit tickets, answer polls, give feedback on proposals, and earn badges - you just won\u0027t see points, tiers, the leaderboard, or rewards.'}
        </div>

        <SketchyButton primary onClick={() => nav({ name: 'speak' })} style={{ width: '100%', justifyContent: 'center', marginTop: 18 }}>Done</SketchyButton>
      </div>
    </div>
  );
}

function BadgeShowcase() {
  const { state, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  const D = window.CC_DATA;
  const tweaks = window.CC_TWEAKS || {};
  const size = tweaks.layout === 'desktop' ? 80 : 64;
  const earned = D.badges.filter(b => b.earned);
  const [open, setOpen] = React.useState(null);

  return (
    <div style={{ background: '#EAF1F9', border: '1.5px solid #C9DBF0', borderRadius: 14, padding: 14, marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: earned.length ? 12 : 4 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em' }}>
          Your badges {earned.length > 0 && <span style={{ fontWeight: 600, color: '#595959' }}>({earned.length} of {D.badges.length})</span>}
        </div>
        {earned.length > 0 && (
          <button onClick={() => nav({ name: 'speak', tab: 'badges' })} style={{ background: 'none', border: 'none', color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>See all <Icon name="arrow" color="#2E74B5" size={14} /></button>
        )}
      </div>

      {earned.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '14px 8px 6px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCE6F2', border: '1.8px solid #BFD0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Icon name="badge" color="#9DB4D2" size={32} />
          </div>
          <div style={{ fontSize: 13.5, color: '#1F3864', lineHeight: 1.5, marginBottom: 12, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>You have not earned any badges yet. Engage on the platform to earn your first.</div>
          <button onClick={() => nav({ name: 'speak', tab: 'earn' })} style={{ padding: '10px 18px', background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Browse ways to earn points</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {earned.map(b => (
            <button key={b.id} onClick={() => setOpen(b)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: size, position: 'relative' }}>
              {b.recent && <span style={{ position: 'absolute', top: -4, right: -6, fontSize: 8.5, fontWeight: 800, letterSpacing: 0.5, color: '#7A5A00', background: '#FFE9AE', border: '1px solid #D4A017', borderRadius: 3, padding: '1px 4px', zIndex: 1 }}>NEW</span>}
              <div style={{ width: size, height: size, borderRadius: '50%', background: '#D4A017', border: '2px solid #B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="badge" color="#FFF" size={size * 0.42} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1F3864', textAlign: 'center', lineHeight: 1.15 }}>{b.name}</div>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div onClick={() => setOpen(null)} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 420, padding: 24, borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', textAlign: 'center' }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#D4A017', border: '2.5px solid #B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon name="badge" color="#FFF" size={40} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1F3864', lineHeight: 1.2 }}>{open.name}</div>
            <div style={{ fontSize: 14, color: '#222', marginTop: 6, lineHeight: 1.45 }}>{open.desc}</div>
            {open.earnedDate && <div style={{ fontSize: 12.5, color: '#7A5A00', fontWeight: 600, marginTop: 8 }}>Earned {open.earnedDate}</div>}
            <button onClick={() => { setOpen(null); nav({ name: 'speak', tab: 'badges' }); }} style={{ width: '100%', padding: 12, background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 18 }}>View all badges</button>
          </div>
        </div>
      )}
    </div>
  );
}

window.MeSection = MeSection;