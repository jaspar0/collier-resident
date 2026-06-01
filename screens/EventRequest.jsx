// Resident Event Request flow: qualification → form → confirmation
// Routes: { name: 'eventRequest', step: 'qualify' | 'form' | 'confirm', reqId }

function EventRequest() {
  const { state } = window.useStore();
  const step = state.route.step || 'qualify';
  if (step === 'form') return <EventRequestForm />;
  if (step === 'confirm') return <EventRequestConfirm />;
  return <EventQualify />;
}

function EventQualify() {
  const { nav, back } = window.useStore();
  const { SketchyButton, Icon } = window.CC_UI;
  const good = [
    'A monthly meeting of a local club, like the Nevillewood Garden Club',
    'A neighborhood block cleanup or beautification day',
    'A charity run or walk organized by a local group',
    'A history society lecture, library reading club, or similar public-interest gathering',
    'A scout group, religious group, or service organization\u0027s open-to-the-public event'
  ];
  const bad = [
    'A personal birthday party, even if it is at a public park',
    'A private wedding, reunion, or family gathering',
    'An invite-only event',
    'A business promotion or grand opening',
    'A political campaign fundraiser or partisan event'
  ];
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={() => nav({ name: 'happening' })} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back to map
        </button>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 8 }}>Request an event for the Collier map</div>
        <div style={{ fontSize: 14.5, color: '#222', lineHeight: 1.55, marginBottom: 18 }}>
          This is for community events open to other Collier residents. The township reviews each request to make sure it fits before publishing it on the map and calendar. Most requests are reviewed within five business days.
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: '#1F3864', marginBottom: 10 }}>Does your event qualify?</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ background: '#E2EFD9', border: '1.5px solid #548235', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#548235', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>✓ Good fits</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: '#222', lineHeight: 1.6 }}>
              {good.map((g, i) => <li key={i} style={{ marginBottom: 4 }}>{g}</li>)}
            </ul>
          </div>
          <div style={{ background: '#FBE5D6', border: '1.5px solid #C65911', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#C65911', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>✕ Not a fit</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: '#222', lineHeight: 1.6 }}>
              {bad.map((b, i) => <li key={i} style={{ marginBottom: 4 }}>{b}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.55, margin: '16px 0 20px' }}>
          If you are not sure whether your event qualifies, fill out the request anyway. Our reviewer will give you a clear yes or no, and explain why.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SketchyButton primary onClick={() => nav({ name: 'eventRequest', step: 'form' }, { replace: true })} style={{ width: '100%', justifyContent: 'center' }}>Start the request</SketchyButton>
          <SketchyButton onClick={() => nav({ name: 'happening' })} style={{ width: '100%', justifyContent: 'center' }}>Never mind, go back</SketchyButton>
        </div>
      </div>
    </div>
  );
}

function EventRequestForm() {
  const { state, dispatch, nav, back } = window.useStore();
  const { SketchyButton, Field, Icon, Chip } = window.CC_UI;
  const u = state.user;

  const [f, setF] = React.useState({
    name: '', date: '', startTime: '', endTime: '', repeats: false, repeatFreq: 'Weekly', repeatEnd: '',
    locationName: '', pinned: false,
    descr: '',
    organizerType: '', organizerGroup: '', organizerBusiness: '',
    attendance: '', openToPublic: '', openGroup: '',
    indoorOutdoor: '', rainPlan: '',
    permission: '',
    organizerName: u.name, organizerEmail: u.email, organizerPhone: '(412) 555-0188',
    notes: '', photo: null
  });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const [errors, setErrors] = React.useState({});
  const [toast, setToast] = React.useState('');

  // Returning from the photo placeholder → simulate attached photo
  React.useEffect(() => {
    if (state.route.photoAttached && !f.photo) set('photo', 'venue_photo.jpg');
  }, [state.route.photoAttached]);

  const required = ['name', 'date', 'startTime', 'endTime', 'locationName', 'descr', 'organizerType', 'attendance', 'openToPublic', 'indoorOutdoor', 'permission', 'organizerName', 'organizerEmail', 'organizerPhone'];

  const validate = () => {
    const e = {};
    required.forEach(k => { if (!f[k]) e[k] = 'This field is required to submit a request.'; });
    if (f.descr && f.descr.length < 50) e.descr = 'Tell us a bit more about what residents can expect. The current description is too short for reviewers to make a decision.';
    if (f.organizerType === 'group' && !f.organizerGroup) e.organizerGroup = 'This field is required to submit a request.';
    if (f.organizerType === 'business' && !f.organizerBusiness) e.organizerBusiness = 'This field is required to submit a request.';
    if (f.openToPublic === 'group' && !f.openGroup) e.openGroup = 'This field is required to submit a request.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) {
      const first = document.querySelector('[data-err="true"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    dispatch({ type: 'SUBMIT_EVENT_REQUEST', payload: {
      name: f.name,
      eventDate: f.date, eventTime: (f.startTime || '') + (f.endTime ? ' - ' + f.endTime : ''),
      locationName: f.locationName,
      descr: f.descr,
      organizerType: f.organizerType,
      organizerGroup: f.organizerType === 'group' ? f.organizerGroup : (f.organizerType === 'business' ? f.organizerBusiness : ''),
      attendance: f.attendance,
      openToPublic: f.openToPublic === 'group' ? ('Open to a specific group: ' + f.openGroup) : 'Yes, anyone in Collier can come',
      indoorOutdoor: f.indoorOutdoor, rainPlan: f.rainPlan,
      permission: f.permission,
      organizerName: f.organizerName, organizerEmail: f.organizerEmail, organizerPhone: f.organizerPhone,
      notes: f.notes,
      reviewer: 'Amy Medway, Manager\u0027s Office'
    }});
    const num = String(150 + state.submittedEventRequests.length).padStart(4, '0');
    nav({ name: 'eventRequest', step: 'confirm', reqId: 'REQ-2026-' + num }, { replace: true });
  };

  // Helper for error styling
  const ErrText = ({ k }) => errors[k] ? <div data-err="true" style={{ fontSize: 12, color: '#C00000', fontWeight: 600, marginTop: -8, marginBottom: 12 }}>{errors[k]}</div> : null;
  const reqStar = <span style={{ color: '#C00000', fontWeight: 700 }}> * Required</span>;
  const Lbl = ({ children, sub }) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#222' }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: '#595959', marginTop: 1 }}>{sub}</div>}
    </div>
  );
  const inputStyle = (k) => ({ width: '100%', boxSizing: 'border-box', padding: 10, fontFamily: 'inherit', fontSize: 15, border: '1.5px solid ' + (errors[k] ? '#C00000' : '#222'), borderRadius: 6, background: '#FFF', marginBottom: errors[k] ? 4 : 14 });
  const radioRow = (k, opts) => (
    <div style={{ display: 'grid', gap: 6, marginBottom: errors[k] ? 4 : 14 }}>
      {opts.map(o => (
        <label key={o.v} style={{ padding: 10, border: f[k] === o.v ? '2px solid #1F3864' : '1.5px solid ' + (errors[k] ? '#C00000' : '#222'), background: f[k] === o.v ? '#DBE5F1' : '#FFF', borderRadius: 6, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="radio" checked={f[k] === o.v} onChange={() => set(k, o.v)} />{o.l}
        </label>
      ))}
    </div>
  );

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: '14px 18px 0' }}>
        <button onClick={back} style={{ background: 'transparent', border: 'none', color: '#1F3864', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <Icon name="back" size={16} /> Back
        </button>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1F3864', marginTop: 8, letterSpacing: '-0.01em' }}>Request an event</div>
        <div style={{ fontSize: 13, color: '#595959', marginTop: 2 }}>Reviewed within five business days.</div>
      </div>

      <div style={{ padding: 18 }}>
        {/* 1. Name */}
        <Lbl>Event name{reqStar}</Lbl>
        <input value={f.name} onChange={e => set('name', e.target.value.slice(0, 80))} placeholder="Example: Nevillewood Garden Club Spring Plant Swap" style={inputStyle('name')} />
        <ErrText k="name" />

        {/* 2. Date & time */}
        <Lbl>When is it?{reqStar}</Lbl>
        <input type="date" value={f.date} onChange={e => set('date', e.target.value)} min="2026-05-28" style={inputStyle('date')} />
        <ErrText k="date" />
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#595959', marginBottom: 4 }}>Start</div>
            <input type="time" step="900" value={f.startTime} onChange={e => set('startTime', e.target.value)} style={inputStyle('startTime')} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#595959', marginBottom: 4 }}>End</div>
            <input type="time" step="900" value={f.endTime} onChange={e => set('endTime', e.target.value)} style={inputStyle('endTime')} />
          </div>
        </div>
        {(errors.startTime || errors.endTime) && <div data-err="true" style={{ fontSize: 12, color: '#C00000', fontWeight: 600, marginTop: -8, marginBottom: 12 }}>Start and end time are required.</div>}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, marginBottom: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={f.repeats} onChange={e => set('repeats', e.target.checked)} /> This event repeats
        </label>
        {f.repeats && (
          <div style={{ padding: 12, background: '#F2F2F2', borderRadius: 6, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#595959', marginBottom: 4 }}>How often?</div>
            <select value={f.repeatFreq} onChange={e => set('repeatFreq', e.target.value)} style={{ width: '100%', padding: 8, fontFamily: 'inherit', fontSize: 14, border: '1.5px solid #BFBFBF', borderRadius: 4, background: '#FFF', marginBottom: 10 }}>
              {['Weekly', 'Biweekly', 'Monthly', 'Every other month'].map(o => <option key={o}>{o}</option>)}
            </select>
            <div style={{ fontSize: 12, color: '#595959', marginBottom: 4 }}>Repeat until</div>
            <input type="date" value={f.repeatEnd} onChange={e => set('repeatEnd', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: 8, fontFamily: 'inherit', fontSize: 14, border: '1.5px solid #BFBFBF', borderRadius: 4, background: '#FFF' }} />
          </div>
        )}

        {/* 3. Location */}
        <Lbl>Location name{reqStar}</Lbl>
        <input value={f.locationName} onChange={e => set('locationName', e.target.value)} placeholder="Example: Webb Park Pavilion 1 or Collier Library Community Room" style={inputStyle('locationName')} />
        <ErrText k="locationName" />
        <button onClick={() => set('pinned', true)} style={{ width: '100%', padding: 10, marginBottom: 14, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, border: '1.5px dashed #1F3864', borderRadius: 6, background: f.pinned ? '#DBE5F1' : '#FFF', color: '#1F3864', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="pin" size={16} color="#1F3864" /> {f.pinned ? '✓ Pin dropped on the map' : 'Pick a spot on the map'}
        </button>

        {/* 4. Description */}
        <Lbl sub="What will happen, who it is for, what to bring or expect. About 100 to 300 words is ideal.">Tell residents what this is about{reqStar}</Lbl>
        <window.PostingGuidance />
        <textarea value={f.descr} onChange={e => set('descr', e.target.value)} rows={5} placeholder="Describe the event..." style={{ ...inputStyle('descr'), minHeight: 100, resize: 'vertical' }} />
        <ErrText k="descr" />

        {/* 5. Photo */}
        <Lbl sub="A photo of the venue, the group, last year\u0027s event, or a flyer. This helps residents recognize what they are signing up for.">Add a photo</Lbl>
        {f.photo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1.5px solid #222', borderRadius: 6, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, background: '#DBE5F1', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="photo" size={22} color="#1F3864" /></div>
            <div style={{ flex: 1, fontSize: 13, color: '#222' }}>{f.photo}</div>
            <button onClick={() => set('photo', null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} aria-label="Remove photo"><Icon name="close" size={16} color="#595959" /></button>
          </div>
        ) : (
          <button onClick={() => nav({ name: 'placeholder', kind: 'eventphoto', returnTo: { name: 'eventRequest', step: 'form', photoAttached: true } })}
            style={{ width: '100%', padding: 18, marginBottom: 14, fontFamily: 'inherit', fontSize: 14, border: '1.5px dashed #BFBFBF', borderRadius: 8, background: '#F2F2F2', color: '#595959', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Icon name="photo" size={26} color="#595959" /> Tap to add a photo
          </button>
        )}

        {/* 6. Organizer */}
        <Lbl>Who is organizing this?{reqStar}</Lbl>
        {radioRow('organizerType', [
          { v: 'individual', l: 'I am organizing this as an individual' },
          { v: 'group', l: 'I am organizing this on behalf of a group or organization' },
          { v: 'business', l: 'I am organizing this on behalf of a business' }
        ])}
        <ErrText k="organizerType" />
        {f.organizerType === 'group' && (
          <>
            <Lbl>Name of the group or organization{reqStar}</Lbl>
            <input value={f.organizerGroup} onChange={e => set('organizerGroup', e.target.value)} placeholder="Example: Nevillewood Garden Club" style={inputStyle('organizerGroup')} />
            <ErrText k="organizerGroup" />
          </>
        )}
        {f.organizerType === 'business' && (
          <>
            <Lbl>Name of the business{reqStar}</Lbl>
            <input value={f.organizerBusiness} onChange={e => set('organizerBusiness', e.target.value)} placeholder="Example: Grist House Coffee Roasters" style={inputStyle('organizerBusiness')} />
            <ErrText k="organizerBusiness" />
            <div style={{ padding: 12, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8, fontSize: 13, color: '#7A5A00', lineHeight: 1.5, marginBottom: 14 }}>
              Heads up: events from businesses are reviewed more closely. The township generally does not publish events that exist primarily for commercial promotion. If your event has community value beyond marketing, please describe that clearly in the description above.
            </div>
          </>
        )}

        {/* 7. Attendance */}
        <Lbl sub="An honest estimate is fine. This helps the township and venue plan.">About how many people do you expect?{reqStar}</Lbl>
        <select value={f.attendance} onChange={e => set('attendance', e.target.value)} style={inputStyle('attendance')}>
          <option value="">Select an estimate...</option>
          {['Under 25 people', '25 to 100', '100 to 250', '250 to 500', 'Over 500'].map(o => <option key={o}>{o}</option>)}
        </select>
        <ErrText k="attendance" />

        {/* 8. Open to public */}
        <Lbl>Is this open to the public?{reqStar}</Lbl>
        {radioRow('openToPublic', [
          { v: 'public', l: 'Yes, anyone in Collier can come' },
          { v: 'group', l: 'Open to a specific group' }
        ])}
        <ErrText k="openToPublic" />
        {f.openToPublic === 'group' && (
          <>
            <input value={f.openGroup} onChange={e => set('openGroup', e.target.value)} placeholder="Which group? e.g. Parents of children at Collier Elementary" style={inputStyle('openGroup')} />
            <ErrText k="openGroup" />
          </>
        )}
        <div style={{ fontSize: 12, color: '#595959', marginTop: -8, marginBottom: 14, lineHeight: 1.5 }}>Events that are not open to the public generally do not qualify for the map. Use the description field to explain why this event still belongs on the community calendar.</div>

        {/* 9. Indoor/outdoor */}
        <Lbl>Indoor or outdoor?{reqStar}</Lbl>
        {radioRow('indoorOutdoor', [{ v: 'Indoor', l: 'Indoor' }, { v: 'Outdoor', l: 'Outdoor' }])}
        <ErrText k="indoorOutdoor" />
        {f.indoorOutdoor === 'Outdoor' && (
          <>
            <Lbl sub="Optional">Rain plan or rain date</Lbl>
            <input value={f.rainPlan} onChange={e => set('rainPlan', e.target.value)} placeholder="Example: Rain date the following Saturday" style={{ ...inputStyle('rainPlan'), border: '1.5px solid #222' }} />
          </>
        )}

        {/* 10. Permission */}
        <Lbl>Have you confirmed permission to use the location?{reqStar}</Lbl>
        {radioRow('permission', [
          { v: 'Yes, in writing', l: 'Yes, I have permission and a confirmation in writing' },
          { v: 'Yes, verbally', l: 'Yes, I have permission verbally' },
          { v: 'Not yet', l: 'Not yet, I am still arranging it' }
        ])}
        <ErrText k="permission" />
        <div style={{ fontSize: 12, color: '#595959', marginTop: -8, marginBottom: 14, lineHeight: 1.5 }}>The township will not publish an event without confirmed permission for the venue. If you are still arranging, submit the request anyway and let us know in the description; we may be able to help.</div>

        {/* 11. Contact */}
        <Lbl>Your contact information{reqStar}</Lbl>
        <input value={f.organizerName} onChange={e => set('organizerName', e.target.value)} placeholder="Your full name" style={inputStyle('organizerName')} />
        <ErrText k="organizerName" />
        <input value={f.organizerEmail} onChange={e => set('organizerEmail', e.target.value)} placeholder="Email" style={inputStyle('organizerEmail')} />
        <ErrText k="organizerEmail" />
        <input value={f.organizerPhone} onChange={e => set('organizerPhone', e.target.value)} placeholder="Phone number" style={inputStyle('organizerPhone')} />
        <ErrText k="organizerPhone" />
        <div style={{ fontSize: 12, color: '#595959', marginTop: -8, marginBottom: 14, lineHeight: 1.5 }}>Unlike comments and feedback, event organizers are named publicly on the event listing. Residents need to know who to contact with questions.</div>

        {/* 12. Notes */}
        <Lbl sub="Optional">Anything else the reviewer should know?</Lbl>
        <textarea value={f.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Example: This is our third year. Public Works helped with permits last year." style={{ width: '100%', boxSizing: 'border-box', padding: 10, fontFamily: 'inherit', fontSize: 15, border: '1.5px solid #222', borderRadius: 6, background: '#FFF', minHeight: 70, resize: 'vertical', marginBottom: 18 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SketchyButton primary onClick={submit} style={{ width: '100%', justifyContent: 'center' }}>Submit request</SketchyButton>
          <SketchyButton onClick={() => { setToast('Draft saved'); setTimeout(() => nav({ name: 'happening' }), 700); }} style={{ width: '100%', justifyContent: 'center' }}>Save as draft</SketchyButton>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: '#1F3864', color: '#FFF', padding: '10px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, zIndex: 60, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>✓ {toast}</div>
      )}
    </div>
  );
}

function EventRequestConfirm() {
  const { state, nav } = window.useStore();
  const { SketchyButton } = window.CC_UI;
  const reqId = state.route.reqId || 'REQ-2026-0142';
  return (
    <div style={{ padding: '40px 22px', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E2EFD9', border: '2.5px solid #548235', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <span style={{ fontSize: 44, color: '#548235' }}>✓</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', marginBottom: 10 }}>Your event request is in review.</div>
      <div style={{ fontSize: 14.5, color: '#222', lineHeight: 1.55, marginBottom: 16, textAlign: 'left' }}>
        Thanks Jane. Our reviewer will look at this within five business days. You will hear back by email at <strong>{state.user.email}</strong> with one of three responses: approved (your event goes on the map and calendar), needs more information (we will tell you what), or declined (we will tell you why).
      </div>
      {state.engagesOptedIn && (
        <div style={{ padding: 10, background: '#FFF4D6', border: '1.5px solid #D4A017', borderRadius: 8, fontSize: 13, color: '#7A5A00', marginBottom: 14, fontWeight: 600 }}>🎯 +25 Engages points for organizing community engagement</div>
      )}
      <div style={{ padding: 12, background: '#F2F2F2', borderRadius: 8, fontSize: 13, color: '#222', marginBottom: 20, textAlign: 'left' }}>
        Request ID: <strong>{reqId}</strong>. You can check the status anytime in Profile, under My Submitted Items.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SketchyButton primary onClick={() => nav({ name: 'happening' })} style={{ width: '100%', justifyContent: 'center' }}>Back to the map</SketchyButton>
        <SketchyButton onClick={() => nav({ name: 'me', sub: 'items' })} style={{ width: '100%', justifyContent: 'center' }}>View my request status</SketchyButton>
      </div>
    </div>
  );
}

window.EventRequest = EventRequest;
