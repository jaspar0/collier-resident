// Speak Up: the township engagement hub.
// Opens to a landing (Home) with sub-tabs: Home / Badges / Earn points / Leaderboard / Rewards.
// Also hosts the Report-an-issue and Active-poll flows.

function SpeakUp() {
  const { state } = window.useStore();
  const screen = state.route.screen;
  if (screen === 'submit') return <SubmitIssue />;
  if (screen === 'poll') return <ActivePoll />;
  if (screen === 'rules') return <RulesFeedback />;
  return <SpeakUpSection />;
}

// === Section shell: header + sub-tabs ===
function SpeakUpSection() {
  const { state, nav } = window.useStore();
  const opted = state.engagesOptedIn;
  const tab = state.route.tab || 'home';
  const goSub = (sub) => nav({ name: 'speak', tab: sub }, { replace: true });

  // Tabs adapt to opt-in: Leaderboard hidden when not opted in.
  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'badges', label: 'Badges' },
    { key: 'earn', label: 'Earn points' },
    ...(opted ? [{ key: 'leaderboard', label: 'Leaderboard' }] : []),
    { key: 'rewards', label: 'Rewards' }
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Slim section header */}
      <div style={{ padding: '20px 18px 8px', background: 'linear-gradient(to bottom, #F4F8FD, #FAFAF7)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontSize: 28, color: '#1F3864', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.01em' }}>How to engage</div>
          {opted && (
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '4px 12px', background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 999 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#7A5A00' }}>{state.points}</span>
              <span style={{ fontSize: 11, color: '#7A5A00', fontWeight: 600 }}>points</span>
            </div>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#595959', marginTop: 4 }}>Tell the township what you think - and see how it turns into action.</div>
      </div>

      {/* Sub-tabs */}
      <div style={{ position: 'sticky', top: 0, background: '#FAFAF7', zIndex: 4, padding: '6px 12px 0', borderBottom: '1.5px solid #E0E0E0' }}>
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => goSub(t.key)} style={{
              padding: '10px 12px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tab === t.key ? '#1F3864' : '#595959',
              borderBottom: tab === t.key ? '3px solid #1F3864' : '3px solid transparent',
              whiteSpace: 'nowrap'
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {tab === 'home' && <SpeakUpHome />}
        {tab === 'badges' && <window.Badges />}
        {tab === 'earn' && <window.EarnPoints />}
        {tab === 'leaderboard' && opted && <window.Leaderboard />}
        {tab === 'rewards' && <window.Rewards />}
      </div>
    </div>
  );
}

// === Speak Up Home (landing) ===
function SpeakUpHome() {
  const { state, nav } = window.useStore();
  const { SketchyCard, Icon, SpeakUpValueBlock } = window.CC_UI;
  const D = window.CC_DATA;
  const opted = state.engagesOptedIn;
  const tweaks = window.CC_TWEAKS || {};
  const twoCol = tweaks.layout === 'desktop';
  const toNext = Math.max(0, 500 - state.points);

  return (
    <div>
      {/* Greeting + progress strip */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 24, color: '#1F3864', fontWeight: 800, lineHeight: 1.2 }}>Hi {state.user.name.split(' ')[0]}.</div>
        {opted ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 26, color: '#7A5A00', fontWeight: 800, lineHeight: 1.1 }}>{state.points} points</span>
              <span style={{ fontSize: 13, color: '#595959' }}>Contributor tier · {toNext} points to Champion</span>
            </div>
            <div style={{ marginTop: 8, height: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (state.points / 500) * 100)}%`, height: '100%', background: 'linear-gradient(to right, #D4A017, #ED7D31)' }} />
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, color: '#595959', marginTop: 6 }}>Here is everything happening that you can weigh in on right now.</div>
        )}
      </div>

      {/* Contribution-to-neighborhood indicator (monthly 500-pt cap) */}
      {opted && (() => {
        const cap = 500;
        const contributed = Math.min(state.points, cap);
        const capped = state.points >= cap;
        return (
          <div style={{ padding: 12, background: '#FFF', border: '1.5px solid #D4A017', borderRadius: 10, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1F3864' }}>Your contribution to {state.user.neighborhood} this month</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#7A5A00' }}>{contributed} of {cap}{capped ? ' (capped)' : ''}</span>
            </div>
            <div style={{ height: 8, background: '#F2F2F2', border: '1px solid #E0E0E0', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ width: `${(contributed / cap) * 100}%`, height: '100%', background: 'linear-gradient(to right, #D4A017, #ED7D31)' }} />
            </div>
            <div style={{ fontSize: 12, color: '#595959', marginTop: 6, lineHeight: 1.45 }}>
              {capped
                ? 'Any additional points this month count toward your personal tier and rewards, but not the neighborhood leaderboard.'
                : `You can earn ${cap - contributed} more points that count toward the neighborhood leaderboard this month.`}
            </div>
          </div>
        );
      })()}

      {/* Value explanation block */}
      <SpeakUpValueBlock />

      {/* Active opportunities */}
      <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.01em' }}>Active opportunities</div>
      <div style={{ fontSize: 13, color: '#595959', marginBottom: 12 }}>Things you can do right now to be heard.</div>
      <div style={{ display: 'grid', gridTemplateColumns: twoCol ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 24 }}>
        {D.speakUpOpportunities.map(op => (
          <SketchyCard key={op.id} accent={op.accent} onClick={() => nav(op.route)} style={op.highlight ? { background: '#FFF8E6' } : null}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFF', border: '1.8px solid ' + op.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={op.icon} color={op.accent} size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1F3864', lineHeight: 1.2 }}>{op.title}</span>
                  {op.highlight && <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, color: '#7A5A00', background: '#FFE9AE', border: '1px solid #D4A017', borderRadius: 3, padding: '1px 5px' }}>NEW</span>}
                </div>
                <div style={{ fontSize: 12.5, color: '#595959', marginTop: 3, lineHeight: 1.4 }}>{op.desc}</div>
                {opted && (
                  <div style={{ fontSize: 12, color: '#7A5A00', fontWeight: 700, marginTop: 6 }}>
                    {op.pointsLabel ? op.pointsLabel : `+${op.points} pts${op.pointsSuffix ? ' ' + op.pointsSuffix : ''}`}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: op.accent }}>{op.cta} <Icon name="arrow" color={op.accent} size={15} /></span>
            </div>
          </SketchyCard>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{ fontSize: 20, color: '#1F3864', fontWeight: 800, marginBottom: 10, letterSpacing: '-0.01em' }}>Recent activity</div>
      <div style={{ marginBottom: 24, border: '1.5px solid #E0E0E0', borderRadius: 10, overflow: 'hidden' }}>
        {D.speakUpRecent.map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '11px 14px', background: '#FFF', borderTop: i ? '1px solid #F0F0F0' : 'none' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.3 }}>{a.text}</div>
              <div style={{ fontSize: 11.5, color: '#595959', marginTop: 1 }}>{a.date}{opted && a.points ? ` · +${a.points} pts` : (a.points === null ? ' · no points' : '')}</div>
            </div>
          </div>
        ))}
        <button onClick={() => nav({ name: 'me', sub: 'activity' })} style={{ width: '100%', padding: '10px 14px', background: '#FAFAF7', border: 'none', borderTop: '1px solid #F0F0F0', color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>See your full activity log →</button>
      </div>

      {/* Neighborhood standing */}
      {opted && (
        <SketchyCard style={{ background: '#FFF4D6', borderColor: '#D4A017' }} onClick={() => nav({ name: 'speak', tab: 'leaderboard' }, { replace: true })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Icon name="trophy" color="#7A5A00" size={20} />
            <span style={{ fontWeight: 800, color: '#7A5A00', fontSize: 15 }}>{state.user.neighborhood} - 8th place this month</span>
          </div>
          <div style={{ fontSize: 13, color: '#7A5A00', lineHeight: 1.45 }}>Per-household average of 8.6 points. Rankings are now based on points per household, not raw totals - so {state.user.neighborhood}, the township's largest neighborhood, sits near the bottom. Nevillewood leads at 17.5. The winning neighborhood gets a $500 budget for improvements.</div>
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: '#7A5A00', display: 'flex', alignItems: 'center', gap: 5 }}>See full leaderboard <Icon name="arrow" color="#7A5A00" size={15} /></div>
        </SketchyCard>
      )}
    </div>
  );
}

function SubmitIssue() {
  const { state, dispatch, nav, back, guardedSubmit } = window.useStore();
  const { SketchyButton, Field, Icon, Chip, FeedbackValueReminder } = window.CC_UI;
  const [cats, setCats] = React.useState([]);
  const [location, setLocation] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [photo, setPhoto] = React.useState(null);
  const [displayName, setDisplayName] = React.useState(state.displayName);
  const [submitted, setSubmitted] = React.useState(null);
  const [showHelp, setShowHelp] = React.useState(false);
  // Notification milestones - receipt + resolution on by default
  const [milestones, setMilestones] = React.useState({ received: true, approved: false, scheduled: false, resolved: true });
  const [channel, setChannel] = React.useState('text');

  const CATS = ['Pothole / road hazard', 'Lighting', 'Flooding', 'Trail or park', 'Traffic or pedestrian safety', 'Noise', 'Property or blight', 'Other'];
  const toggle = (c) => setCats(cats.includes(c) ? cats.filter(x => x !== c) : [...cats, c]);
  const toggleMs = (k) => setMilestones(m => ({ ...m, [k]: !m[k] }));
  const noNotif = channel === 'none';

  const channelLabel = { email: 'email', text: 'text message', both: 'email and text', none: 'no notifications' }[channel];

  const submit = () => guardedSubmit(() => {
    const type = cats[0] || 'Other';
    dispatch({ type: 'SUBMIT_TICKET', payload: { type, location, description, photo, displayName, notifMilestones: milestones, notifChannel: channel } });
    dispatch({ type: 'EARN_ACTIVITY', id: 'a_report', points: 20 });
    const num = String(900 + state.submittedTickets.length).padStart(4, '0');
    setSubmitted('TKT-2026-' + num);
  });

  const valid = cats.length > 0 && location.length > 3 && description.length > 10;

  if (submitted) {
    const milestoneSummary = noNotif ? 'nothing - you\u0027ll check the status yourself'
      : Object.entries({ received: 'receipt', approved: 'approval', scheduled: 'scheduling', resolved: 'resolution' })
          .filter(([k]) => milestones[k]).map(([, l]) => l).join(' and ') || 'no milestones';
    const steps = [
      'Within one business day, the township will confirm that your report was received. This is automatic.',
      'Within three business days, a staff member will review your report. They will either assign it to the right department to be worked on, or reach out to you with a question. Either way, you will hear back.',
      'Once the work is scheduled, you will see the ticket status change to "In progress" on the map and in your activity log.',
      'When the ticket is resolved, you will see a public response from the staff member who took care of it. Other residents will see this too, so it counts as part of the township\u0027s monthly record.'
    ];
    return (
      <div style={{ padding: '28px 18px 40px', maxWidth: 620, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#E2EFD9', border: '2.5px solid #548235', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <span style={{ fontSize: 40, color: '#548235' }}>✓</span>
          </div>
          <div style={{ fontSize: 26, color: '#1F3864', fontWeight: 800, letterSpacing: '-0.01em' }}>Got it. Your report is in.</div>
          <div style={{ fontSize: 14, color: '#595959', marginTop: 6 }}>Ticket ID: <strong style={{ color: '#222' }}>{submitted}</strong></div>
          <div style={{ fontSize: 13.5, color: '#222', marginTop: 10, marginBottom: 20, lineHeight: 1.5, padding: '10px 12px', background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 8, textAlign: 'left' }}>
            <div style={{ marginBottom: 8 }}>We have just sent an email receipt to <strong>{state.user.email}</strong> confirming your ticket and including a copy of what you submitted. Keep this for your records.</div>
            Thanks {state.user.name.split(' ')[0]}. Tickets are reviewed by the staff member handling them, and patterns across many reports get a public response on the home screen.{state.engagesOptedIn && <strong> +20 points</strong>}
          </div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: '#1F3864', marginBottom: 10 }}>Here is what happens next:</div>
        <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8 }}>
              <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#1F3864', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
              <div style={{ fontSize: 14, color: '#222', lineHeight: 1.5 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 14, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8, marginBottom: 18 }}>
          <div style={{ fontSize: 14, color: '#7A5A00', lineHeight: 1.5 }}>You signed up to hear about: <strong>{milestoneSummary}{!noNotif ? ', by ' + channelLabel : ''}</strong>.</div>
          <button onClick={() => nav({ name: 'me', sub: 'notifications' })} style={{ background: 'none', border: 'none', padding: '6px 0 0', color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Edit notification preferences →</button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <SketchyButton primary onClick={() => nav({ name: 'happening' })} icon="map" style={{ flex: 1, justifyContent: 'center' }}>Back to the map</SketchyButton>
          <SketchyButton onClick={() => nav({ name: 'happening', detail: { kind: 'ticket', id: submitted } })} icon="list" style={{ flex: 1, justifyContent: 'center' }}>View my ticket</SketchyButton>
        </div>
      </div>
    );
  }

  const cbStyle = (checked, disabled) => ({
    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', marginBottom: 6,
    background: '#FFF', border: '1.5px solid ' + (checked && !disabled ? '#1F3864' : '#BFBFBF'),
    borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 13.5, lineHeight: 1.4
  });

  return (
    <div style={{ padding: '14px 18px 40px', maxWidth: 620, margin: '0 auto' }}>
      <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 12 }}>
        <Icon name="back" size={16} /> Back
      </button>
      <div style={{ fontSize: 28, color: '#1F3864', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em' }}>Submit a ticket</div>

      {/* Component A: intro */}
      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 15, color: '#222', fontWeight: 600, lineHeight: 1.5, marginBottom: 8 }}>Tell us what's going on. The township reviews every ticket submitted here and gets back to you.</div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.55 }}>
          Most tickets are reviewed within three business days. You will see your ticket's status update as the township confirms it received, assigns it to the right department, and resolves it. You can choose below how you want to be kept in the loop. <button onClick={() => setShowHelp(true)} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>How does the township handle tickets? →</button>
        </div>
      </div>

      <FeedbackValueReminder />
      <div style={{ borderTop: '1.5px solid #E0E0E0', marginBottom: 18 }}></div>

      <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 8 }}>1. What's the ticket about?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {CATS.map(c => <Chip key={c} active={cats.includes(c)} onClick={() => toggle(c)}>{c}</Chip>)}
      </div>

      <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 8 }}>2. Where?</div>
      <div style={{ marginBottom: 18 }}>
        <Field label="Address or intersection" value={location} onChange={setLocation} placeholder="e.g., Boyce Road near the school" required />
        <SketchyButton small onClick={() => setLocation('Current location · Rennerdale near Quail Run Dr')} icon="pin">Use my location</SketchyButton>
      </div>

      <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 8 }}>3. Describe it</div>
      <Field label="What's going on?" multiline value={description} onChange={setDescription} placeholder="A few sentences. Photos help a lot." required />
      <window.PostingGuidance />
      <div style={{ marginBottom: 18 }}>
        <SketchyButton small onClick={() => { setPhoto('uploaded.jpg'); nav({ name: 'placeholder', kind: 'camera' }); }} icon="photo">{photo ? '✓ Photo attached' : 'Attach a photo'}</SketchyButton>
      </div>

      {/* Component B: notification opt-in */}
      <div style={{ background: '#F2F2F2', borderRadius: 10, padding: 14, marginBottom: 18 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#1F3864', marginBottom: 4 }}>How do you want to be updated?</div>
        <div style={{ fontSize: 13, color: '#595959', marginBottom: 12 }}>Choose when we should reach out about this ticket:</div>
        {[
          ['received', 'When the township confirms it received your report (within one business day)'],
          ['approved', 'When it has been reviewed and approved to be worked on (usually within three business days)'],
          ['scheduled', 'When the work is scheduled or starts'],
          ['resolved', 'When the ticket is resolved']
        ].map(([k, l]) => (
          <label key={k} style={cbStyle(milestones[k], noNotif)}>
            <input type="checkbox" checked={milestones[k] && !noNotif} disabled={noNotif} onChange={() => toggleMs(k)} style={{ width: 20, height: 20, marginTop: 1, flexShrink: 0 }} />
            <span>{l}</span>
          </label>
        ))}

        <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, margin: '12px 0 8px' }}>By what method?</div>
        {[
          ['email', `Email (${state.user.email})`],
          ['text', 'Text message to (412) 555-0188'],
          ['both', 'Both email and text'],
          ['none', 'No notifications, I will check the status myself']
        ].map(([k, l]) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', marginBottom: 6, background: '#FFF', border: '1.5px solid ' + (channel === k ? '#1F3864' : '#BFBFBF'), borderRadius: 6, cursor: 'pointer', fontSize: 13.5 }}>
            <input type="radio" name="notifChannel" checked={channel === k} onChange={() => setChannel(k)} style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>{l}</span>
          </label>
        ))}
        {noNotif && (
          <div style={{ fontSize: 12.5, color: '#595959', marginTop: 8, lineHeight: 1.5, fontStyle: 'italic' }}>Without notifications, you can still check your ticket's status anytime in Profile &gt; My Submitted Items.</div>
        )}
      </div>

      <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 8 }}>How should we list you?</div>
      <Field label="Display name (shown publicly on the map)" value={displayName} onChange={setDisplayName} placeholder={`Collier Resident from ${state.user.neighborhood}`} />

      <div style={{ marginTop: 14 }}>
        <SketchyButton primary disabled={!valid} onClick={submit} style={{ width: '100%', justifyContent: 'center' }}>Submit ticket</SketchyButton>
      </div>

      {showHelp && <IssueHelpPanel onClose={() => setShowHelp(false)} />}
    </div>
  );
}

// Component E: "How does the township handle issues?" help panel
function IssueHelpPanel({ onClose }) {
  const { SketchyButton } = window.CC_UI;
  const stages = [
    ['1. Confirmation (within one business day)', 'An automatic message confirms your report was received. No human review yet, just so you know it landed.'],
    ['2. Review (within three business days)', 'A staff member in the Manager\u0027s Office (usually Amy Medway) opens your report, reads it carefully, and either routes it to the right department to be worked on, or replies to you with a question if something is unclear.'],
    ['3. Approved to be worked on', 'Once a department takes the ticket, the specific staff member responsible is named in your status. They will let you know when the work is scheduled. Most tickets are scheduled within two weeks of approval, though weather, parts availability, or budget cycles can affect that.'],
    ['4. Work in progress', 'When crews start the work, the status updates. If anything comes up that affects the timeline, you will see an update here.'],
    ['5. Resolved', 'When the work is complete, you will see a public response from the staff member who took care of it. Other residents will see this too, so your report becomes part of the township\u0027s monthly record of what got done.']
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', lineHeight: 1.2 }}>How the township handles tickets</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', flexShrink: 0, fontSize: 16, color: '#222' }} aria-label="Close">✕</button>
        </div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.55, marginBottom: 16 }}>Every ticket you submit here goes through the same process. We follow the same steps for a pothole on Hilltop Road as we do for a downed branch in Webb Park.</div>
        <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
          {stages.map(([h, b], i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#DBE5F1', color: '#1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1F3864' }}>{h.replace(/^\d+\.\s*/, '')}</div>
                <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginTop: 2 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.55, marginBottom: 18 }}>Throughout the process, you can leave a comment on your ticket, and staff or other affected residents may add comments too. If many neighbors report the same issue, the township may bundle them into a single formal project, in which case your ticket will be linked to that project's page.</div>
        <SketchyButton primary onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Close</SketchyButton>
      </div>
    </div>
  );
}

function ActivePoll() {
  const { state, dispatch, nav, back, guardedSubmit } = window.useStore();
  const { SketchyButton, Field, Icon, LikertScale, FeedbackValueReminder } = window.CC_UI;
  const poll = window.CC_DATA.pollSeed;
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const submit = () => guardedSubmit(() => {
    dispatch({ type: 'EARN_ACTIVITY', id: 'a_poll', points: 10 });
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <div style={{ padding: '28px 24px 40px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#E2EFD9', border: '2.5px solid #548235', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <span style={{ fontSize: 40, color: '#548235' }}>✓</span>
        </div>
        <div style={{ fontSize: 26, color: '#1F3864', fontWeight: 800, letterSpacing: '-0.01em' }}>Thanks {state.user.name.split(' ')[0]}. Your response is in.</div>
        <div style={{ fontSize: 14, color: '#222', marginTop: 12, lineHeight: 1.55, padding: '12px 14px', background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 8, textAlign: 'left' }}>
          Amy Medway in the Manager's Office reviews poll results in the first week of each month, and patterns across many responses get a public response on the home screen.{state.engagesOptedIn && <strong> +10 points</strong>}
        </div>
        <div style={{ fontSize: 13, color: '#595959', margin: '16px 0 22px' }}>Next poll Monday, July 14.</div>
        <SketchyButton primary onClick={() => nav({ name: 'speak' })} style={{ justifyContent: 'center' }}>Back to How to engage</SketchyButton>
      </div>
    );
  }

  return (
    <div style={{ padding: '14px 18px 100px', maxWidth: 620, margin: '0 auto' }}>
      <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 12 }}>
        <Icon name="back" size={16} /> Back
      </button>
      <div style={{ fontSize: 28, color: '#1F3864', fontWeight: 800, lineHeight: 1.2, marginBottom: 4, letterSpacing: '-0.01em' }}>{poll.question}</div>
      <div style={{ fontSize: 14, color: '#595959', marginBottom: 16 }}>{poll.description}</div>

      <FeedbackValueReminder />

      <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 8 }}>How satisfied were you overall?</div>
      <div style={{ marginBottom: 22 }}>
        <LikertScale value={rating} onChange={setRating} labelSet={poll.labelSet || 'satisfaction'} ariaLabel="Parade satisfaction" />
      </div>

      <Field label="Tell us more" required multiline value={comment} onChange={setComment} placeholder="What worked, what didn't. 10+ characters." min={10} />

      <window.PostingGuidance />

      <SketchyButton primary disabled={rating === 0 || comment.length < 10} onClick={submit} style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>Submit poll</SketchyButton>
    </div>
  );
}

function RulesFeedback() {
  const { state, dispatch, nav, back, guardedSubmit } = window.useStore();
  const { SketchyButton, Field, Icon, LikertScale, FeedbackValueReminder } = window.CC_UI;
  const RULES = ['Leaderboard calculation', 'Individual point cap', 'Badge requirements', 'Reward tier thresholds', 'Notification timing', 'Other'];
  const FAIRNESS = ['Very unfair', 'Unfair', 'Neutral', 'Fair', 'Very fair'];
  const [rule, setRule] = React.useState(RULES[0]);
  const [text, setText] = React.useState('');
  const [fairness, setFairness] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);

  const submit = () => guardedSubmit(() => {
    dispatch({ type: 'EARN_ACTIVITY', id: 'a_rules', points: 15 });
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <div style={{ padding: '28px 18px 40px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#E2EFD9', border: '2.5px solid #548235', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <span style={{ fontSize: 40, color: '#548235' }}>✓</span>
        </div>
        <div style={{ fontSize: 24, color: '#1F3864', fontWeight: 800, letterSpacing: '-0.01em' }}>Thanks {state.user.name.split(' ')[0]}. Your feedback on platform rules is in.</div>
        <div style={{ fontSize: 14, color: '#222', marginTop: 12, lineHeight: 1.55, padding: '12px 14px', background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 8, textAlign: 'left' }}>
          The team reviews this category every six months. If your suggestion or concern fits a pattern we are seeing from other residents, you will see a response in the township response loop on the home screen, and the rule may change. Either way, you will see a personal acknowledgment within two weeks.{state.engagesOptedIn && <strong> +15 points</strong>}
        </div>
        <SketchyButton primary onClick={() => nav({ name: 'speak', tab: 'leaderboard' }, { replace: true })} style={{ justifyContent: 'center', marginTop: 18 }}>Back to the leaderboard</SketchyButton>
      </div>
    );
  }

  return (
    <div style={{ padding: '14px 18px 100px', maxWidth: 620, margin: '0 auto' }}>
      <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 12 }}>
        <Icon name="back" size={16} /> Back
      </button>
      <div style={{ fontSize: 28, color: '#1F3864', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em' }}>Feedback on platform rules</div>
      <div style={{ fontSize: 14, color: '#595959', marginTop: 6, marginBottom: 14, lineHeight: 1.5 }}>We review feedback on how the leaderboard, points, badges, and other rules work every six months - and update the rules when residents make a good case.</div>

      <FeedbackValueReminder />

      <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, marginBottom: 6 }}>Which rule is this about?</div>
      <select value={rule} onChange={e => setRule(e.target.value)} style={{ width: '100%', padding: 10, fontFamily: 'inherit', fontSize: 15, border: '1.5px solid #222', borderRadius: 6, background: '#FFF', marginBottom: 18 }}>
        {RULES.map(r => <option key={r}>{r}</option>)}
      </select>

      <Field label="Tell us what works, what does not, and what would be better" required multiline value={text} onChange={setText} placeholder="At least 50 characters." min={50} rows={5} />
      <window.PostingGuidance />

      <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, margin: '8px 0 8px' }}>Overall, how fair do the current platform rules feel to you?</div>
      <div style={{ marginBottom: 20 }}>
        <LikertScale value={fairness} onChange={setFairness} labels={FAIRNESS} ariaLabel="How fair do the rules feel?" />
      </div>

      <SketchyButton primary disabled={text.length < 50 || fairness === 0} onClick={submit} style={{ width: '100%', justifyContent: 'center' }}>Submit feedback{state.engagesOptedIn ? ' (+15 pts)' : ''}</SketchyButton>
    </div>
  );
}

window.SpeakUp = SpeakUp;
window.SpeakUpHome = SpeakUpHome;