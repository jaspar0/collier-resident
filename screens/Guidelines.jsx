// Community Guidelines copy & behavior
// Component A (inline notice) + C (expandable tips) = <PostingGuidance/>
// Component B = <FirstPosterModal/> (rendered at app root via GuidanceHost)
// Component D = <CommunityGuidelines/> route + <GuidelinesOverlay/>
// Component E = <ExamplesTable/>
// Plus removed-post banner + detail.

// === Component E: examples table ===
function ExamplesTable() {
  const rows = [
    {
      topic: 'Events',
      bad: '"Nothing fun for kids around here."',
      good: '"Could we have more family-friendly programming on weekends? My kids would love something outdoors."',
      best: '"The Movies in the Park series has been great. Could we add a once-a-month daytime version for younger kids who can\u0027t stay up that late?"'
    },
    {
      topic: 'Proposal feedback',
      bad: '"This is a terrible idea."',
      good: '"I\u0027m worried this project will increase traffic on my street. Has there been a traffic study?"',
      best: '"I\u0027m worried about the traffic impact on Hilltop Road. The current speed limit is already ignored. Would a study be possible, and could speed enforcement be part of the project plan?"'
    }
  ];

  const cellBase = { padding: '8px 10px', fontSize: 12.5, lineHeight: 1.4, verticalAlign: 'top', border: '1px solid #E0E0E0' };

  return (
    <div>
      {/* Desktop / wide: real 4-col table */}
      <div style={{ display: 'grid', gap: 12 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ border: '1.5px solid #BFBFBF', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#1F3864', color: '#FFF', fontWeight: 700, fontSize: 13, padding: '6px 10px' }}>{r.topic}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
              <div style={{ ...cellBase, background: '#FBE5D6', borderTop: 'none' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#C65911', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Doesn't land</div>
                {r.bad}
              </div>
              <div style={{ ...cellBase, background: '#F2F2F2' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#595959', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Lands</div>
                {r.good}
              </div>
              <div style={{ ...cellBase, background: '#E2EFD9' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#548235', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Lands even better</div>
                {r.best}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === Components A + C combined: inline notice with expandable tips ===
function PostingGuidance() {
  const { guidance, setTipsExpanded, nav } = window.useStore();
  const expanded = guidance.tipsExpanded;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Component A: inline notice */}
      <div style={{ fontSize: 12.5, color: '#595959', lineHeight: 1.45, marginBottom: 6 }}>
        Heads up: your post will be visible to all Collier residents, and township staff will see it. Posts that aren't constructive may be removed.{' '}
        <button onClick={() => setTipsExpanded(true)} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Posting tips →</button>
      </div>

      {/* Component C: expandable panel */}
      <div style={{ border: '1.5px solid ' + (expanded ? '#BFBFBF' : '#E0E0E0'), borderRadius: 8, overflow: 'hidden' }}>
        <button onClick={() => setTipsExpanded(v => !v)} style={{
          width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
          background: '#F2F2F2', border: 'none', padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: 8, color: '#1F3864', fontWeight: 700, fontSize: 13
        }} aria-expanded={expanded}>
          <span style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 120ms', display: 'inline-block', fontSize: 11 }}>▶</span>
          Posting tips: how to be heard
        </button>

        {expanded && (
          <div style={{ background: '#FFF', padding: '12px 14px' }}>
            <div style={{ fontSize: 13, color: '#595959', marginBottom: 10, lineHeight: 1.45 }}>
              Your post will be public, and township staff will review it. Posts that don't move the conversation forward may be removed.
            </div>
            <div style={{ fontSize: 13, color: '#222', marginBottom: 10, lineHeight: 1.45 }}>The posts that actually shape decisions usually do three things:</div>
            {[
              ['1. Name the specific thing.', '"The crosswalk at Washington Pike and Settlers Ridge feels unsafe during school dropoff" lands better than "the roads are dangerous."'],
              ['2. Share why it matters.', 'A line about how it affects you, your family, or your block gives the township context it can\u0027t get from numbers alone.'],
              ['3. Point forward.', 'A question, a suggestion, or even just "what would it take to change this?" invites a real response. Pure venting closes the door.']
            ].map(([h, b], i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F3864' }}>{h}</div>
                <div style={{ fontSize: 13, color: '#222', lineHeight: 1.45 }}>{b}</div>
              </div>
            ))}
            <div style={{ fontSize: 13, color: '#222', fontStyle: 'italic', margin: '10px 0' }}>Disagreement is welcome. Personal attacks aren't.</div>
            <div style={{ marginTop: 12, marginBottom: 12 }}><ExamplesTable /></div>
            <button onClick={() => nav({ name: 'guidelines' })} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Read full guidelines →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// === Component B: first-time poster modal ===
function FirstPosterModal() {
  const { guidance, confirmFirstPost, cancelFirstPost, openGuidelinesOverlay } = window.useStore();
  if (!guidance.firstPoster) return null;

  return (
    <div onClick={cancelFirstPost} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 8, border: '2px solid #222', boxShadow: '0 12px 36px rgba(0,0,0,0.25)', padding: 22 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 6 }}>Before you post for the first time</div>
        <div style={{ fontSize: 14, color: '#222', marginBottom: 16, lineHeight: 1.5 }}>Welcome. A few things to know before your first post goes live.</div>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#1F3864', marginBottom: 6 }}>What happens to your post</div>
        <ul style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 13.5, color: '#222', lineHeight: 1.55 }}>
          <li>It's visible to all verified Collier residents</li>
          <li>The township is notified and will read it</li>
          <li>Posts that are abusive, off-topic, or only venting may be removed by township staff</li>
        </ul>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#1F3864', marginBottom: 6 }}>What makes a post land</div>
        <ul style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 13.5, color: '#222', lineHeight: 1.55 }}>
          <li>Be specific about what's happening or what you'd like to see</li>
          <li>Explain why it matters to you or your neighborhood</li>
          <li>Suggest a direction, ask a question, or offer to help</li>
          <li>Keep it about the issue, not the person</li>
        </ul>

        <div style={{ fontSize: 13.5, color: '#222', marginBottom: 16, lineHeight: 1.5 }}>We're building Collier together. Thanks for adding your voice.</div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#595959', marginBottom: 16, cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked readOnly /> Don't show this again
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={confirmFirstPost} style={{ width: '100%', padding: 12, background: '#1F3864', color: '#FFF', border: 'none', borderRadius: 6, fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', order: 2 }}>Got it, post</button>
          <button onClick={openGuidelinesOverlay} style={{ width: '100%', padding: 12, background: '#FFF', color: '#1F3864', border: '1.8px solid #1F3864', borderRadius: 6, fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', order: 1 }}>Read full guidelines</button>
        </div>
      </div>
    </div>
  );
}

// === Component D content (shared by route + overlay) ===
function GuidelinesContent() {
  const { nav } = window.useStore();
  const H = ({ children }) => <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864', margin: '20px 0 8px', letterSpacing: '-0.01em' }}>{children}</div>;
  const P = ({ children }) => <p style={{ fontSize: 14.5, color: '#222', lineHeight: 1.55, margin: '0 0 12px' }}>{children}</p>;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div data-tour="guidelines-page" style={{ fontSize: 26, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.015em', marginBottom: 4 }}>Posting on Collier Connect</div>

      <a href="#cc-examples" onClick={(e) => { e.preventDefault(); const el = document.getElementById('cc-examples'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} style={{ display: 'inline-block', color: '#2E74B5', fontWeight: 600, fontSize: 13, marginBottom: 8, textDecoration: 'underline' }}>Jump to examples ↓</a>

      <H>The short version</H>
      <P>Be specific. Be constructive. Be kind. The township is reading.</P>

      <H>What public means here</H>
      <P>Every comment, ticket, and feedback submission you make on this platform is visible to all verified Collier residents. Township staff and elected officials read what you post, and they may respond publicly with their name and role.</P>
      <P>Your display name appears as you set it in Profile &gt; Profile & preferences. The default is "Collier Resident from [your neighborhood]." You can change this to your first name plus last initial, or your full name, at any time.</P>

      <H>What the township does with what you post</H>
      <P>Resident input here feeds directly into how the township operates. Reports become tickets. Patterns across many residents become formal projects. Feedback on proposals goes to the Board of Commissioners before they vote. Polls and Bingo responses become public response themes published on the home screen.</P>
      <P>When you post, township staff is notified. They will read it. They may respond. And they may remove it if it falls outside the guidelines below.</P>

      <H>What gets removed</H>
      <P>Posts may be removed by township staff if they:</P>
      <ul style={{ margin: '0 0 12px', paddingLeft: 20, fontSize: 14.5, color: '#222', lineHeight: 1.6 }}>
        <li>Contain personal attacks, slurs, or threats against any individual</li>
        <li>Disclose private information about another resident</li>
        <li>Are commercial promotion or spam</li>
        <li>Are clearly off-topic for the thread or item they're posted on</li>
        <li>Are only venting, with no specific concern, question, or suggestion the township could act on</li>
      </ul>
      <P>If your post is removed, you'll receive a brief message explaining why. You can revise and re-post.</P>

      <H>What we encourage</H>
      <P>The posts that shape decisions tend to do three things:</P>
      <P><strong>Name the specific thing.</strong> Where, when, and what is happening matters. Be concrete.</P>
      <P><strong>Share why it matters.</strong> What's the impact on you, your neighborhood, your kids, your commute, your peace of mind? That context is what staff use to weigh tradeoffs.</P>
      <P><strong>Point forward.</strong> A question, a suggestion, or an offer to help opens the conversation. Pure complaints close it. Even "I don't know what the answer is, but here's what doesn't work" is constructive.</P>
      <P>Disagreement with the township, with neighbors, or with a proposal is welcome. Disagreement with a person is not.</P>

      <H>A note on tone</H>
      <P>You don't need to be polite or polished. You don't need to soften strong opinions. The township would rather hear you direct than not hear you at all. The bar is "would your neighbor read this and feel respected?", not "would the school principal approve?"</P>

      <H>You can always opt to email or call instead</H>
      <P>If you'd rather share something privately, email <button onClick={() => nav({ name: 'placeholder', kind: 'email', label: 'Email amymedway@colliertwp.net' })} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 14.5, cursor: 'pointer', textDecoration: 'underline' }}>amymedway@colliertwp.net</button> or call (412) 279-2525. Private input feeds into the same response process; it just doesn't appear on the public thread.</P>

      <div id="cc-examples" style={{ scrollMarginTop: 16 }}>
        <H>Examples</H>
        <ExamplesTable />
      </div>

      <div style={{ borderTop: '1.5px solid #E0E0E0', margin: '24px 0 12px' }} />
      <P>We're building Collier together. Thanks for doing your part.</P>
    </div>
  );
}

// Component D as a full route page
function CommunityGuidelines() {
  const { back, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back
        </button>
      </div>
      <div style={{ padding: 18 }}>
        <GuidelinesContent />
      </div>
    </div>
  );
}

// Component D as an overlay (keeps the underlying form/draft alive)
function GuidelinesOverlay() {
  const { guidance, closeGuidelinesOverlay } = window.useStore();
  const { Icon } = window.CC_UI;
  if (!guidance.overlay) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 95, background: '#FAFAF7', overflowY: 'auto' }}>
      <div style={{ position: 'sticky', top: 0, background: '#FFF', borderBottom: '1.5px solid #E0E0E0', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
        <button onClick={closeGuidelinesOverlay} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back to your post
        </button>
      </div>
      <div style={{ padding: 18 }}>
        <GuidelinesContent />
      </div>
    </div>
  );
}

// === Removed-post banner (Home) ===
function RemovedPostBanner() {
  const { state, dispatch, nav } = window.useStore();
  const { Icon } = window.CC_UI;
  const post = state.removedPosts && state.removedPosts[0];
  if (!post || state.removedBannerDismissed) return null;
  return (
    <div style={{ margin: '0 18px 4px', padding: '12px 14px', background: '#FBE5D6', border: '1.8px solid #C65911', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name="warn" size={20} color="#C65911" />
      <button onClick={() => nav({ name: 'removedPost', id: post.id })} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        <div style={{ fontSize: 14, color: '#7A3A0A' }}>A post you made on {post.date.replace(', 2026', '')} was removed. <span style={{ color: '#C65911', fontWeight: 700, textDecoration: 'underline' }}>See why →</span></div>
      </button>
      <button onClick={() => dispatch({ type: 'DISMISS_REMOVED_BANNER' })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} aria-label="Dismiss">
        <Icon name="close" size={16} color="#7A3A0A" />
      </button>
    </div>
  );
}

// === Removed-post detail ===
function RemovedPostDetail() {
  const { state, dispatch, nav, back } = window.useStore();
  const { Icon, SketchyButton } = window.CC_UI;
  const post = (state.removedPosts || []).find(p => p.id === state.route.id) || (state.removedPosts || [])[0];
  if (!post) return null;

  const revise = () => {
    // Pre-fill the proposal discussion draft and jump there
    dispatch({ type: 'SET_DRAFT', key: 'proposal:' + post.threadId, value: post.original });
    nav({ name: 'decide', id: post.threadId, tab: 'discussion' });
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back
        </button>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', marginBottom: 6 }}>Your post was removed</div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.5, marginBottom: 16 }}>
          Your comment on the <strong>{post.threadLabel}</strong> thread was removed on {post.date}.
        </div>

        <div style={{ padding: 12, background: '#FBE5D6', border: '1.5px solid #C65911', borderRadius: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#C65911', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Reason</div>
          <div style={{ fontSize: 14, color: '#222', fontWeight: 600, marginBottom: 4 }}>{post.reason}</div>
          {post.staffNote && <div style={{ fontSize: 13, color: '#7A3A0A', lineHeight: 1.45 }}>{post.staffNote}</div>}
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#595959', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Your original post</div>
          <div style={{ padding: 12, background: '#F2F2F2', borderLeft: '4px solid #BFBFBF', borderRadius: 4, fontSize: 14, fontStyle: 'italic', color: '#222' }}>"{post.original}"</div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: '#1F3864', marginBottom: 6 }}>You can revise and re-post</div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.5, marginBottom: 14 }}>
          Removed posts can be reworked and submitted again. The <button onClick={() => nav({ name: 'guidelines' })} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>Posting tips guide</button> has examples of feedback that lands.
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <SketchyButton primary onClick={revise} icon="chat">Revise and re-post</SketchyButton>
          <SketchyButton onClick={() => nav({ name: 'placeholder', kind: 'email', label: 'Discuss this removal with the Manager\u0027s Office' })}>I'd like to discuss this removal</SketchyButton>
        </div>
      </div>
    </div>
  );
}

// Small footer link to guidelines (used at bottom of scroll content)
function GuidelinesFooter() {
  const { nav } = window.useStore();
  return (
    <div style={{ padding: '20px 18px 28px', textAlign: 'center', borderTop: '1px solid #E0E0E0', marginTop: 20 }}>
      <button onClick={() => nav({ name: 'guidelines' })} style={{ background: 'none', border: 'none', color: '#595959', fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer', textDecoration: 'underline' }}>Community Guidelines</button>
      <span style={{ color: '#BFBFBF', margin: '0 8px' }}>·</span>
      <span style={{ fontSize: 12.5, color: '#BFBFBF' }}>Collier Connect · concept prototype</span>
    </div>
  );
}

window.PostingGuidance = PostingGuidance;
window.FirstPosterModal = FirstPosterModal;
window.CommunityGuidelines = CommunityGuidelines;
window.GuidelinesOverlay = GuidelinesOverlay;
window.RemovedPostBanner = RemovedPostBanner;
window.RemovedPostDetail = RemovedPostDetail;
window.GuidelinesFooter = GuidelinesFooter;
window.ExamplesTable = ExamplesTable;
