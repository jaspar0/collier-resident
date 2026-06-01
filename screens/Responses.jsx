// Response Thread index + detail, and Placeholder pages

function Responses() {
  const { state, nav } = window.useStore();
  const { ResponseCard, Pill, Icon, Chip } = window.CC_UI;
  const D = window.CC_DATA;
  const [filter, setFilter] = React.useState('All');

  const deps = ['All', 'This month', ...new Set(D.responses.map(r => r.department))];
  const list = D.responses.filter(r => filter === 'All' ? true : filter === 'This month' ? r.date.includes('June') || r.date.includes('July') : r.department === filter);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={() => nav({ name: 'home' })} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back to home
        </button>
        <div style={{ fontSize: 32, color: '#1F3864', fontWeight: 700, marginTop: 8, lineHeight: 1.2 }}>📣 Township responses</div>
        <div style={{ fontSize: 14, color: '#595959', marginTop: 4 }}>Every named response from township staff to residents.</div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 14, paddingBottom: 4 }}>
          {deps.map(f => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
        </div>
      </div>

      <div style={{ padding: '14px 18px', display: 'grid', gap: 10 }}>
        {list.map(r => <ResponseCard key={r.id} response={r} onClick={() => nav({ name: 'response', id: r.id })} />)}
      </div>
    </div>
  );
}

function ResponseDetail() {
  const { state, dispatch, nav, back } = window.useStore();
  const { SketchyCard, SketchyButton, Icon, Pill, LikertScale, FeedbackValueReminder } = window.CC_UI;
  const D = window.CC_DATA;
  const id = state.route.id;
  const r = D.responses.find(x => x.id === id);
  const [helpful, setHelpful] = React.useState(0);
  if (!r) return null;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back
        </button>
      </div>

      <div style={{ padding: 18 }}>
        <Pill bg="#FFF4D6" fg="#7A5A00">TOWNSHIP RESPONSE</Pill>
        <div style={{ fontSize: 26, color: '#1F3864', fontWeight: 700, lineHeight: 1.2, marginTop: 6 }}>{r.theme}</div>

        <div data-tour="response-detail" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, padding: 12, background: '#FFF', border: '1.5px solid #222', borderRadius: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1F3864', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>{r.responder.split(' ').map(x => x[0]).join('')}</div>
          <div>
            <div style={{ fontWeight: 700 }}>{r.responder}</div>
            <div style={{ fontSize: 13, color: '#595959' }}>{r.role} · {r.date}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, marginBottom: 6 }}>What residents said</div>
          <div style={{ padding: 14, background: '#F2F2F2', borderLeft: '4px solid #595959', borderRadius: 6, fontSize: 15, lineHeight: 1.5, fontStyle: 'italic' }}>"{r.aggregatedInput}"</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, marginBottom: 6 }}>What the township did</div>
          <div style={{ padding: 14, background: '#FFF4D6', border: '1.8px solid #D4A017', borderRadius: 8, fontSize: 15, lineHeight: 1.55 }}>{r.full}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 22, color: '#1F3864', fontWeight: 700, marginBottom: 6 }}>Sources</div>
          <div style={{ fontSize: 12, color: '#595959', marginBottom: 8 }}>The resident input that fed into this response.</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {r.sources.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', gap: 10, padding: 10, background: '#FFF', border: '1.5px solid #BFBFBF', borderRadius: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1F3864', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: 13 }}>{s.label}</div>
                <Pill bg="#F2F2F2" fg="#595959">{s.kind}</Pill>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 22, padding: 14, background: '#FFF', border: '1.5px solid #222', borderRadius: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1F3864', marginBottom: 8 }}>Was this helpful?</div>
          <FeedbackValueReminder />
          <LikertScale value={helpful} onChange={setHelpful} labels={D.helpfulSet} ariaLabel="Was this response helpful?" />
          {helpful > 0 && <div style={{ marginTop: 10, fontSize: 13, color: '#222', lineHeight: 1.5, padding: '10px 12px', background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 8 }}>Thanks - your read goes into the township's monthly review and is shared with {r.responder}.</div>}
        </div>

        <div style={{ marginTop: 14 }}>
          <SketchyButton onClick={() => nav({ name: 'placeholder', kind: 'email', label: `Follow up with ${r.responder}` })} icon="chat">Follow up on this</SketchyButton>
        </div>
      </div>
    </div>
  );
}

function Placeholder() {
  const { state, back, nav } = window.useStore();
  const { SketchyButton, Icon } = window.CC_UI;
  const kind = state.route.kind || 'website';
  const label = state.route.label;

  const PLACEHOLDERS = {
    calendar: { icon: 'cal', headline: 'Your phone\u0027s calendar', body: 'In the real app, this event would be added to Google Calendar, Apple Calendar, or Outlook.' },
    ical: { icon: 'cal', headline: 'Calendar subscription', body: 'In the real app, one tap subscribes you to the township calendar feed in your default calendar app.' },
    email: { icon: 'chat', headline: 'Your email app', body: label ? `In the real app, this opens a new message: "${label}".` : 'In the real app, this opens a new email message.' },
    phone: { icon: 'phone', headline: 'Your phone dialer', body: 'In the real app, you\u0027d be calling (412) 279-2525 - Collier Township main line.' },
    pdf: { icon: 'doc', headline: 'Document viewer', body: label ? `In the real app, you\u0027d see "${label}" here.` : 'In the real app, you\u0027d see the document here.' },
    website: { icon: 'doc', headline: 'colliertownship.net', body: 'In the real app, this opens the full township website (https://colliertownship.net/) in your browser.' },
    maps: { icon: 'map', headline: 'Your maps app', body: 'In the real app, you\u0027d get walking or driving directions here.' },
    camera: { icon: 'photo', headline: 'Camera or photo library', body: 'In the real app, this opens your phone\u0027s camera or photo library so you can attach a photo.' },
    eventphoto: { icon: 'photo', headline: 'your phone\u0027s camera or photo library', body: 'In the real app you would pick or take a photo of your venue, group, or event flyer here. When you press Back, we\u0027ll simulate that a photo was attached.' },
    organizer: { icon: 'chat', headline: 'your email app', body: 'In the real app you would be composing an email to the event organizer.' },
    print: { icon: 'doc', headline: 'Print dialog', body: 'In the real app, this opens your browser or system print dialog.' },
    auth: { icon: 'me', headline: 'Verification process', body: 'In the real app, you\u0027d receive a code by mail and enter it here.' }
  };
  const p = PLACEHOLDERS[kind] || PLACEHOLDERS.website;
  const returnTo = state.route.returnTo;
  const goBack = () => { if (returnTo) nav(returnTo, { replace: true }); else back(); };

  return (
    <div style={{ minHeight: '100%', background: 'repeating-linear-gradient(45deg, #F5F1E8, #F5F1E8 12px, #EFE9D8 12px, #EFE9D8 14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 380, width: '100%', padding: 24, background: '#FFF', border: '2.5px dashed #1F3864', borderRadius: 14, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DBE5F1', border: '2px solid #1F3864', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={p.icon} color="#1F3864" size={32} />
        </div>
        <div style={{ fontSize: 30, color: '#1F3864', fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>This is a placeholder</div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.5, marginBottom: 18 }}>
          For the sake of this prototype, this page stands in for <strong>{p.headline}</strong>. {p.body} Press Back to return where you left off.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SketchyButton primary onClick={goBack} style={{ flex: 1, justifyContent: 'center' }} icon="back">Back</SketchyButton>
          <SketchyButton onClick={() => nav({ name: 'home' })} style={{ flex: 1, justifyContent: 'center' }}>Home</SketchyButton>
        </div>
      </div>
    </div>
  );
}

window.Responses = Responses;
window.ResponseDetail = ResponseDetail;
window.Placeholder = Placeholder;
