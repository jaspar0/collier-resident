// Home screen - greeting, 3 JTBD cards, Response strip, For You, Engages widget
function Home() {
  const { state, dispatch, nav } = window.useStore();
  const { SketchyCard, SketchyButton, Icon, SectionH, ResponseCard, PhotoBox, Pill } = window.CC_UI;
  const D = window.CC_DATA;
  const tweaks = window.CC_TWEAKS || {};
  const responseProm = tweaks.responsePromince || 'huge'; // huge | compact | ticker
  const archetype = state.archetype;
  const opted = state.engagesOptedIn;

  const jtbds = [
    { icon: 'map', title: 'What\u0027s happening in Collier', sub: 'events, projects, neighbor concerns', go: () => nav({ name: 'happening' }) },
    { icon: 'decide', title: 'What the township is deciding', sub: 'active proposals + decision timelines', go: () => nav({ name: 'decide' }) },
    { icon: 'speak', title: 'How to engage', sub: 'submit a ticket, give feedback, take poll', go: () => nav({ name: 'speak' }) }
  ];

  // Personalize For You based on archetype (feed composition lives in data.js)
  const mapId = (id) => {
    if (id === 'poll') return { kind: 'poll' };
    if (id.startsWith('pr')) return { kind: 'project', pr: D.projects.find(p => p.id === id) };
    if (id.startsWith('p')) return { kind: 'proposal', p: D.proposals.find(p => p.id === id) };
    if (id.startsWith('n')) return { kind: 'notice', n: D.notices.find(n => n.id === id) };
    if (id.startsWith('e')) return { kind: 'event', e: D.events.find(e => e.id === id) };
    return null;
  };
  const forYou = (D.forYouFeeds[archetype] || D.forYouFeeds.Newcomer).map(mapId).filter(Boolean);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Greeting */}
      <div style={{ padding: '20px 18px 8px' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1F3864', lineHeight: 1.2 }}>Hi Jane.</div>
        <div style={{ fontSize: 14, color: '#595959', marginTop: 2 }}>{state.user.neighborhood} neighborhood · {archetype}</div>
      </div>

      {/* Removed-post banner */}
      <window.RemovedPostBanner />

      {/* JTBD cards */}
      <div style={{ padding: '12px 18px', display: 'grid', gap: 12 }}>
        {jtbds.map(j => (
          <SketchyCard key={j.title} onClick={j.go} style={{ background: '#DBE5F1', borderColor: '#1F3864', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: '#FFF', border: '1.8px solid #1F3864', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={j.icon} color="#1F3864" size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#1F3864', lineHeight: 1.2, marginBottom: 6 }}>{j.title}</div>
              <div style={{ fontSize: 12, color: '#1F3864', lineHeight: 1.2 }}>{j.sub}</div>
            </div>
            <Icon name="arrow" color="#1F3864" size={20} />
          </SketchyCard>
        ))}
      </div>

      {/* Response strip - variable prominence */}
      <div data-tour="response-strip" style={{ padding: '20px 18px 4px' }}>
        {responseProm === 'huge' && (
          <>
            <SectionH sub="from your township, in writing">📣 The township responded</SectionH>
            <div style={{ display: 'grid', gap: 10 }}>
              {D.responses.slice(0, 2).map(r => (
                <ResponseCard key={r.id} response={r} onClick={() => nav({ name: 'response', id: r.id })} />
              ))}
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); nav({ name: 'responses' }); }} style={{ display: 'inline-block', marginTop: 10, color: '#7A5A00', fontWeight: 600, fontSize: 14 }}>See all responses →</a>
          </>
        )}
        {responseProm === 'compact' && (
          <SketchyCard style={{ background: '#FFF4D6', borderColor: '#D4A017', borderLeft: '5px solid #D4A017', padding: 12 }} onClick={() => nav({ name: 'responses' })}>
            <div style={{ fontSize: 12, color: '#7A5A00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>📣 The township responded · {D.responses.length} this month</div>
            <div style={{ fontSize: 14, color: '#222', fontWeight: 600 }}>"{D.responses[0].excerpt}" - {D.responses[0].shortName}</div>
          </SketchyCard>
        )}
        {responseProm === 'ticker' && (
          <div onClick={() => nav({ name: 'responses' })} style={{ background: '#FFF4D6', borderTop: '1.5px solid #D4A017', borderBottom: '1.5px solid #D4A017', padding: '8px 12px', fontSize: 13, color: '#7A5A00', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700 }}>📣 Township responded:</span>
            <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{D.responses[0].theme} · {D.responses[0].shortName}</span>
            <span style={{ fontWeight: 600 }}>See all →</span>
          </div>
        )}
      </div>

      {/* For You feed */}
      <div style={{ padding: '0 18px' }}>
        <SectionH sub={`tuned to your archetype: ${archetype.toLowerCase()}`}>For you</SectionH>
        <div data-tour="foryou" style={{ display: 'grid', gap: 10 }}>
          {forYou.map((item, i) => <ForYouCard key={i} item={item} />)}
        </div>
      </div>

      {/* Speak Up engagement widget */}
      {opted && (
        <div style={{ padding: '20px 18px 0' }}>
          <SketchyCard onClick={() => nav({ name: 'speak' })} style={{ background: '#F8F5E8', borderColor: '#D4A017', padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF4D6', border: '1.8px solid #D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="trophy" color="#7A5A00" size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 24, color: '#1F3864', fontWeight: 700, lineHeight: 1.2 }}>How to engage</div>
              <div style={{ fontSize: 13, color: '#222' }}>{state.points} pts · Contributor tier · {Math.max(0, 500 - state.points)} pts to Champion</div>
            </div>
            <Icon name="arrow" color="#1F3864" />
          </SketchyCard>
        </div>
      )}

      <window.GuidelinesFooter />
    </div>
  );
}

function ForYouCard({ item }) {
  const { nav } = window.useStore();
  const { SketchyCard, Icon, Pill, PhotoBox } = window.CC_UI;
  const D = window.CC_DATA;

  if (item.kind === 'event' && item.e) {
    return (
      <SketchyCard accent="#2E74B5" onClick={() => nav({ name: 'happening', detail: { kind: 'event', id: item.e.id } })}>
        <div style={{ display: 'flex', gap: 12 }}>
          <PhotoBox src={EVENT_PHOTOS[item.e.id]} alt={item.e.name} height={64} style={{ width: 84, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Pill bg="#DBE5F1" fg="#1F3864">EVENT</Pill>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{item.e.name}</div>
            <div style={{ fontSize: 12, color: '#595959' }}>{prettyDate(item.e.date)} · {item.e.time} · {item.e.location}</div>
          </div>
        </div>
      </SketchyCard>
    );
  }
  if (item.kind === 'proposal' && item.p) {
    return (
      <SketchyCard accent="#7030A0" onClick={() => nav({ name: 'decide', id: item.p.id })}>
        <Pill bg="#EFE0F4" fg="#7030A0">PROPOSAL</Pill>
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{item.p.title}</div>
        <div style={{ fontSize: 12, color: '#595959' }}>{item.p.cost} · {item.p.affected} · {item.p.status} · Deadline {item.p.deadline}</div>
      </SketchyCard>
    );
  }
  if (item.kind === 'project' && item.pr) {
    return (
      <SketchyCard accent="#548235" onClick={() => nav({ name: 'happening', detail: { kind: 'project', id: item.pr.id } })}>
        <Pill bg="#E6F2DD" fg="#548235">PROJECT UPDATE</Pill>
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{item.pr.name}</div>
        <div style={{ fontSize: 12, color: '#595959' }}>{item.pr.status} · {item.pr.update}</div>
      </SketchyCard>
    );
  }
  if (item.kind === 'notice' && item.n) {
    const isAlert = item.n.kind === 'alert';
    return (
      <SketchyCard accent={isAlert ? '#C65911' : '#D4A017'} onClick={() => nav({ name: 'happening', detail: { kind: 'notice', id: item.n.id } })}>
        <Pill bg={isAlert ? '#FBE5D6' : '#FFF4D6'} fg={isAlert ? '#C65911' : '#7A5A00'}>{isAlert ? 'ALERT' : 'NOTICE'}</Pill>
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{item.n.name}</div>
        <div style={{ fontSize: 12, color: '#595959' }}>{item.n.dateLabel} · {item.n.area}</div>
      </SketchyCard>
    );
  }
  if (item.kind === 'poll') {
    return (
      <SketchyCard accent="#2E74B5" onClick={() => nav({ name: 'speak', screen: 'poll' })}>
        <Pill bg="#DBE5F1" fg="#1F3864">POLL · 2 MIN</Pill>
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>How was last week's Independence Day Parade?</div>
        <div style={{ fontSize: 12, color: '#595959' }}>Earn 10 pts · Answer now</div>
      </SketchyCard>
    );
  }
  return null;
}

const EVENT_PHOTOS = {
  e1: 'https://images.unsplash.com/photo-1572215054594-d28b9b9af6b3?w=400&q=70',  // parade
  e3: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=400&q=70',   // outdoor movie
  e5: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=400&q=70',
  e6: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=70',   // brass band
  e7: 'https://images.unsplash.com/photo-1577017040065-650ee4d43339?w=400&q=70',   // township meeting
  e2: 'https://images.unsplash.com/photo-1577017040065-650ee4d43339?w=400&q=70',
  e8: 'https://images.unsplash.com/photo-1488377947244-fad112c8f00b?w=400&q=70',   // senior lunch
  e9: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=70',   // library
  e10: 'https://images.unsplash.com/photo-1599694772344-49bb8d22d717?w=400&q=70',  // fire truck
  ce1: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=70',  // garden / plants
  ce2: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=70',  // lecture / books
  ce3: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&q=70'   // 5k run
};

function prettyDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

window.Home = Home;
window.ForYouCard = ForYouCard;
window.EVENT_PHOTOS = EVENT_PHOTOS;
window.prettyDate = prettyDate;
