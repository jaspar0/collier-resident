// Shared wireframe components for Collier Connect.
// Hand-drawn vibe: Kalam/Caveat fonts, slightly wobbly borders, sketchy fills.

const { useState, useRef, useEffect } = React;

// === Icons (line-drawn SVG, hand-drawn feel) ===
const Icon = ({ name, size = 22, color = 'currentColor', strokeWidth = 1.8 }) => {
  const paths = {
    home: <g><path d="M3 11 L12 3 L21 11" /><path d="M5 10 V20 H19 V10" /><path d="M10 20 V14 H14 V20" /></g>,
    map: <g><path d="M3 6 L9 4 L15 6 L21 4 V18 L15 20 L9 18 L3 20 Z" /><path d="M9 4 V18" /><path d="M15 6 V20" /></g>,
    decide: <g><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 8 H16" /><path d="M8 12 H16" /><path d="M8 16 H13" /></g>,
    speak: <g><path d="M4 5 H20 V15 H13 L8 19 V15 H4 Z" /><circle cx="9" cy="10" r="0.8" fill={color} /><circle cx="12" cy="10" r="0.8" fill={color} /><circle cx="15" cy="10" r="0.8" fill={color} /></g>,
    me: <g><circle cx="12" cy="8" r="4" /><path d="M4 21 C4 16 8 13 12 13 C16 13 20 16 20 21" /></g>,
    bell: <g><path d="M6 16 V11 C6 7.5 8.5 5 12 5 C15.5 5 18 7.5 18 11 V16" /><path d="M4 16 H20" /><path d="M10 19 C10 20.1 10.9 21 12 21 C13.1 21 14 20.1 14 19" /></g>,
    pin: <g><path d="M12 21 C12 21 19 13 19 9 A7 7 0 1 0 5 9 C5 13 12 21 12 21 Z" /><circle cx="12" cy="9" r="2.5" /></g>,
    arrow: <g><path d="M5 12 H19" /><path d="M14 6 L20 12 L14 18" /></g>,
    back: <g><path d="M19 12 H5" /><path d="M10 6 L4 12 L10 18" /></g>,
    plus: <g><path d="M12 5 V19" /><path d="M5 12 H19" /></g>,
    check: <g><path d="M4 12 L10 18 L20 6" /></g>,
    close: <g><path d="M6 6 L18 18" /><path d="M18 6 L6 18" /></g>,
    star: <g><path d="M12 3 L14.5 9 L21 9.5 L16 14 L17.5 21 L12 17.5 L6.5 21 L8 14 L3 9.5 L9.5 9 Z" /></g>,
    warn: <g><path d="M12 3 L22 20 H2 Z" /><path d="M12 10 V14" /><circle cx="12" cy="17" r="0.6" fill={color} /></g>,
    cal: <g><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 9 H21" /><path d="M8 3 V7" /><path d="M16 3 V7" /></g>,
    list: <g><path d="M4 6 H20" /><path d="M4 12 H20" /><path d="M4 18 H20" /><circle cx="2" cy="6" r="0.6" fill={color} /><circle cx="2" cy="12" r="0.6" fill={color} /><circle cx="2" cy="18" r="0.6" fill={color} /></g>,
    doc: <g><path d="M6 3 H14 L18 7 V21 H6 Z" /><path d="M14 3 V7 H18" /><path d="M9 12 H15" /><path d="M9 15 H15" /><path d="M9 18 H13" /></g>,
    chat: <g><path d="M4 5 H20 V16 H12 L8 20 V16 H4 Z" /></g>,
    chart: <g><path d="M4 20 V4" /><path d="M4 20 H20" /><rect x="7" y="14" width="3" height="6" /><rect x="11" y="10" width="3" height="10" /><rect x="15" y="6" width="3" height="14" /></g>,
    quiz: <g><path d="M4 5 H20 V17 H13 L8 21 V17 H4 Z" /><path d="M9 9 C9 8 10 7 11 7 C13 7 13 9 12 10 V11" /><circle cx="12" cy="13.5" r="0.6" fill={color} /></g>,
    settings: <g><circle cx="12" cy="12" r="3" /><path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M5 5 L7 7 M17 17 L19 19 M5 19 L7 17 M17 7 L19 5" /></g>,
    phone: <g><path d="M5 4 H9 L11 9 L8 11 C9 14 10 15 13 16 L15 13 L20 15 V19 C20 19.5 19.5 20 19 20 C11 20 4 13 4 5 C4 4.5 4.5 4 5 4 Z" /></g>,
    follow: <g><path d="M12 21 L4 13 C2 10 4 5 8 5 C10 5 11 6 12 8 C13 6 14 5 16 5 C20 5 22 10 20 13 Z" /></g>,
    badge: <g><circle cx="12" cy="9" r="5" /><path d="M9 13 L7 21 L12 18 L17 21 L15 13" /></g>,
    photo: <g><rect x="3" y="5" width="18" height="14" rx="1" /><circle cx="8" cy="10" r="1.5" /><path d="M3 17 L9 11 L14 16 L17 13 L21 17" /></g>,
    help: <g><circle cx="12" cy="12" r="9" /><path d="M9 9 C9 7.5 10.3 6.5 12 6.5 C14 6.5 14.5 8.5 13 10 C12 11 12 12 12 13" /><circle cx="12" cy="16.5" r="0.6" fill={color} /></g>,
    chev: <g><path d="M9 5 L16 12 L9 19" /></g>,
    chevDown: <g><path d="M5 9 L12 16 L19 9" /></g>,
    search: <g><circle cx="11" cy="11" r="6" /><path d="M16 16 L21 21" /></g>,
    trophy: <g><path d="M7 4 H17 V8 C17 11 15 13 12 13 C9 13 7 11 7 8 Z" /><path d="M7 6 H4 V8 C4 9 5 10 7 10" /><path d="M17 6 H20 V8 C20 9 19 10 17 10" /><path d="M10 13 V17 H14 V13" /><path d="M8 20 H16" /></g>,
    gift: <g><rect x="3" y="9" width="18" height="11" /><path d="M3 9 H21" /><path d="M12 9 V20" /><path d="M8 9 C8 5 12 5 12 9" /><path d="M16 9 C16 5 12 5 12 9" /></g>,
    refresh: <g><path d="M4 12 C4 7 8 4 12 4 C15 4 17.5 5.5 19 8" /><path d="M19 4 V8 H15" /><path d="M20 12 C20 17 16 20 12 20 C9 20 6.5 18.5 5 16" /><path d="M5 20 V16 H9" /></g>,
    pluscircle: <g><circle cx="12" cy="12" r="9" /><path d="M12 8 V16" /><path d="M8 12 H16" /></g>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {paths[name] || <circle cx="12" cy="12" r="9" />}
    </svg>
  );
};

// === Sketchy frame & button (rough border-radius variation) ===
const SketchyCard = ({ children, accent, style, onClick, className, dashed, dataTour }) => (
  <div onClick={onClick} className={className} data-tour={dataTour}
    style={{
      background: '#FFFFFF',
      border: dashed ? '1.5px dashed #222' : '1.8px solid #222',
      borderRadius: '14px 18px 14px 19px / 16px 14px 18px 14px',
      padding: 14,
      position: 'relative',
      borderLeft: accent ? `5px solid ${accent}` : (dashed ? '1.5px dashed #222' : '1.8px solid #222'),
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 80ms ease',
      ...style
    }}
    onMouseDown={e => { if (onClick) e.currentTarget.style.transform = 'translateY(1px)'; }}
    onMouseUp={e => { if (onClick) e.currentTarget.style.transform = ''; }}
    onMouseLeave={e => { if (onClick) e.currentTarget.style.transform = ''; }}>
    {children}
  </div>
);

const SketchyButton = ({ children, onClick, primary, danger, disabled, small, style, type = 'button', icon }) => {
  const base = {
    fontFamily: 'inherit',
    fontSize: small ? 14 : 16,
    padding: small ? '6px 12px' : '10px 18px',
    minHeight: small ? 32 : 44,
    border: '1.8px solid #1F3864',
    background: '#FFFFFF',
    color: '#1F3864',
    borderRadius: '10px 14px 11px 13px / 12px 11px 13px 11px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 600,
    transition: 'all 80ms',
    ...style
  };
  if (primary) Object.assign(base, { background: '#1F3864', color: '#FFFFFF' });
  if (danger) Object.assign(base, { background: '#C00000', color: '#FFFFFF', borderColor: '#C00000' });
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={base}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(1px)'; }}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onMouseLeave={e => e.currentTarget.style.transform = ''}>
      {icon && <Icon name={icon} size={small ? 16 : 18} />}
      {children}
    </button>
  );
};

const Chip = ({ children, active, onClick, color }) => (
  <button onClick={onClick}
    style={{
      fontFamily: 'inherit',
      fontSize: 14,
      padding: '6px 14px',
      minHeight: 32,
      border: '1.6px solid #222',
      background: active ? (color || '#1F3864') : '#FFFFFF',
      color: active ? '#FFFFFF' : '#222',
      borderRadius: '999px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontWeight: 500
    }}>
    {children}
  </button>
);

const Pill = ({ children, bg, fg }) => (
  <span style={{
    background: bg || '#F2F2F2', color: fg || '#222',
    padding: '2px 10px', borderRadius: 999, fontSize: 12,
    border: '1.4px solid ' + (fg || '#222'),
    fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap'
  }}>{children}</span>
);

// Solid underline accent (kept the wavy original; now a clean Inter-friendly bar)
const Underline = ({ width = 120 }) => (
  <div style={{ width, height: 3, background: '#1F3864', marginTop: 6, borderRadius: 2 }} />
);

// Section heading
const SectionH = ({ children, sub, style }) => (
  <div style={{ marginTop: 20, marginBottom: 12, ...style }}>
    <div style={{ fontWeight: 800, fontSize: 22, color: '#1F3864', lineHeight: 1.2, letterSpacing: '-0.015em' }}>{children}</div>
    {sub && <div style={{ fontSize: 13, color: '#595959', marginTop: 4 }}>{sub}</div>}
    <Underline width={36} />
  </div>
);

// Wireframe placeholder image - gray hatched box with optional label and (optionally) a real photo url
const PhotoBox = ({ src, alt, label, height = 120, style, rounded }) => (
  <div style={{
    width: '100%', height, position: 'relative', overflow: 'hidden',
    border: '1.5px solid #222',
    borderRadius: rounded ? 8 : '8px 10px 8px 11px / 9px 8px 10px 8px',
    background: '#E8E8E8', ...style
  }}>
    {src ? (
      <img src={src} alt={alt || label} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.85) contrast(0.95)' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
    ) : (
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#BFBFBF" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hatch)" />
      </svg>
    )}
    {label && (
      <div style={{
        position: 'absolute', bottom: 6, left: 6, right: 6,
        fontSize: 16,
        color: '#FFF', textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        textAlign: 'center'
      }}>{label}</div>
    )}
  </div>
);

// Form field
const Field = ({ label, required, value, onChange, type = 'text', placeholder, multiline, rows = 3, min }) => (
  <label style={{ display: 'block', marginBottom: 14 }}>
    <div style={{ fontSize: 13, color: '#595959', marginBottom: 4, fontWeight: 600 }}>
      {label}{required && <span style={{ color: '#C00000', fontWeight: 700 }}> * Required</span>}
    </div>
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} minLength={min}
        style={{
          width: '100%', boxSizing: 'border-box', padding: 10, fontFamily: 'inherit', fontSize: 15,
          border: 'none', borderBottom: '1.8px solid #222', background: 'transparent', resize: 'vertical', minHeight: 60
        }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box', padding: 10, fontFamily: 'inherit', fontSize: 16,
          border: 'none', borderBottom: '1.8px solid #222', background: 'transparent'
        }} />
    )}
  </label>
);

// Status color helper
const STATUS_COLORS = {
  event: '#2E74B5',
  project: '#548235',
  ticketSubmitted: '#7030A0',
  ticketUnderReview: '#7030A0',
  ticketResolved: '#548235',
  ticketEscalated: '#7030A0',
  alert: '#C65911',
  notice: '#D4A017',
  proposal: '#7030A0',
  active: '#C00000'
};

function statusColorFor(kind, status) {
  if (kind === 'event') return STATUS_COLORS.event;
  if (kind === 'project') return STATUS_COLORS.project;
  if (kind === 'notice') return STATUS_COLORS.notice;
  if (kind === 'alert') return STATUS_COLORS.alert;
  if (kind === 'ticket') {
    if (status === 'Resolved') return STATUS_COLORS.ticketResolved;
    if (status === 'Escalated') return STATUS_COLORS.ticketEscalated;
    return STATUS_COLORS.ticketSubmitted;
  }
  if (kind === 'proposal') return STATUS_COLORS.proposal;
  return '#222';
}

// Amber response card
const ResponseCard = ({ response, onClick, compact }) => (
  <div onClick={onClick}
    style={{
      background: '#FFF4D6',
      border: '1.8px solid #D4A017',
      borderRadius: '14px 18px 14px 19px / 16px 14px 18px 14px',
      padding: compact ? 12 : 16,
      cursor: onClick ? 'pointer' : 'default',
      color: '#7A5A00'
    }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12, fontWeight: 700, color: '#7A5A00', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      <Icon name="chat" size={14} color="#7A5A00" /> The township responded
    </div>
    <div style={{ fontWeight: 700, color: '#222', fontSize: compact ? 15 : 17, lineHeight: 1.2, marginBottom: 4 }}>{response.theme}</div>
    <div style={{ color: '#222', fontSize: 14, marginBottom: 8 }}>"{response.excerpt}"</div>
    <div style={{ fontSize: 12, color: '#7A5A00', display: 'flex', justifyContent: 'space-between' }}>
      <span>- {response.shortName}</span><span>{response.date}</span>
    </div>
  </div>
);

// === 5-point (and 3-point) Likert scale - platform-wide rating standard ===
// Replaces all emoji / star / smiley rating inputs. Text labels always visible.
const LikertScale = ({ value, onChange, labelSet, labels, ariaLabel }) => {
  const sets = (window.CC_DATA && window.CC_DATA.likertSets) || {};
  const lbls = labels || sets[labelSet] || sets.satisfaction;
  const n = lbls.length;
  return (
    <div>
      <div role="radiogroup" aria-label={ariaLabel || 'Rating'}
        style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 6 }}>
        {lbls.map((label, i) => {
          const num = i + 1;
          const selected = value === num;
          return (
            <button key={num} type="button" role="radio" aria-checked={selected}
              onClick={() => onChange(num)}
              style={{
                fontFamily: 'inherit', cursor: 'pointer',
                minHeight: 56, padding: '8px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                border: selected ? '2.5px solid #1F3864' : '1.8px solid #1F3864',
                background: selected ? '#1F3864' : '#FFFFFF',
                color: selected ? '#FFFFFF' : '#1F3864',
                borderRadius: 8, lineHeight: 1.15, transition: 'all 80ms'
              }}>
              <span style={{ fontSize: 18, fontWeight: 800 }}>{num}</span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', textWrap: 'balance' }}>{label}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" style={{ fontSize: 13, color: '#595959', marginTop: 8, minHeight: 18 }}>
        {value ? <span>You selected: <strong style={{ color: '#222' }}>{value}, {lbls[value - 1]}</strong></span> : <span style={{ fontStyle: 'italic' }}>Tap a rating above.</span>}
      </div>
    </div>
  );
};

// === Help panel: "How your feedback becomes change" (slide-up modal) ===
const ValueHelpModal = ({ onClose }) => {
  const V = (window.CC_DATA && window.CC_DATA.valueCopy) || {};
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1F3864', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{V.helpTitle}</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', flexShrink: 0, fontSize: 16, color: '#222' }} aria-label="Close">✕</button>
        </div>
        <div style={{ fontSize: 14, color: '#222', lineHeight: 1.55, marginBottom: 16 }}>{V.helpIntro}</div>
        <div style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
          {(V.helpSteps || []).map(([h, b], i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#FFF4D6', border: '1.5px solid #D4A017', color: '#7A5A00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: '#1F3864', lineHeight: 1.3 }}>{h}</div>
                <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.5, marginTop: 3 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.55, marginBottom: 18, padding: 12, background: '#F2F2F2', borderRadius: 8 }}>{V.helpFooter}</div>
        <SketchyButton primary onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Close</SketchyButton>
      </div>
    </div>
  );
};

// Inline single-line value reminder above every feedback form. Self-contained (owns the help modal).
const FeedbackValueReminder = ({ style }) => {
  const [open, setOpen] = useState(false);
  const V = (window.CC_DATA && window.CC_DATA.valueCopy) || {};
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 4, padding: '8px 10px', background: '#F4F8FD', border: '1px solid #C9DBF0', borderRadius: 6, fontSize: 12.5, color: '#1F3864', lineHeight: 1.45, marginBottom: 12, ...style }}>
      <span>{V.reminder}</span>
      <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>{V.reminderLink} →</button>
      {open && <ValueHelpModal onClose={() => setOpen(false)} />}
    </div>
  );
};

// Speak Up Home value block: gray rounded panel + "How this works in detail" link. Self-contained.
const SpeakUpValueBlock = () => {
  const [open, setOpen] = useState(false);
  const V = (window.CC_DATA && window.CC_DATA.valueCopy) || {};
  return (
    <div style={{ padding: 14, background: '#F2F2F2', borderRadius: 12, marginBottom: 20 }}>
      <div style={{ fontSize: 13.5, color: '#333', lineHeight: 1.55 }}>
        {V.block}{' '}
        <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>{V.blockLink} →</button>
      </div>
      {open && <ValueHelpModal onClose={() => setOpen(false)} />}
    </div>
  );
};

// === Unified Follow button + per-item notification preferences ===
const FOLLOW_TRIGGERS = {
  event: ['24 hours before it starts', 'If it is cancelled or rescheduled', 'If the location changes'],
  project: ['When the project advances a phase', 'When staff post a public update'],
  ticket: ['When the stage changes', 'When staff respond', 'When it resolves or is declined'],
  proposal: ['When it advances a stage', 'When the feedback deadline is 48 hours away', 'When staff post in the discussion'],
  notice: ['When the notice is updated', 'When staff comment on it', 'When it is about to expire', 'When it has expired'],
  alert: ['When the alert is updated', 'When staff comment on it', 'When it is resolved or ends', 'Updates to a linked township project']
};

function FollowPrefsModal({ type, onClose }) {
  const { state, nav } = window.useStore();
  const triggers = FOLLOW_TRIGGERS[type] || [];
  const [on, setOn] = useState(triggers.map(() => true));
  const [channel, setChannel] = useState(type === 'alert' ? 'SMS' : 'Push');
  const [useAlertChannel, setUseAlertChannel] = useState(true);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto', borderRadius: '18px 18px 0 0', border: '2px solid #222', borderBottom: 'none', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864' }}>Notify me about this</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', flexShrink: 0, fontSize: 15, color: '#222' }} aria-label="Close">✕</button>
        </div>
        <div style={{ fontSize: 12.5, color: '#595959', marginBottom: 14 }}>These are notifications for this specific item. To change your general notification settings, go to <button onMouseDown={(e) => { e.preventDefault(); onClose(); nav({ name: 'me', sub: 'notifications' }); }} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Profile &gt; Notifications</button>.</div>
        {triggers.map((t, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 6, background: '#FFF', border: '1.5px solid ' + (on[i] ? '#1F3864' : '#BFBFBF'), borderRadius: 6, cursor: 'pointer', fontSize: 13.5 }}>
            <input type="checkbox" checked={on[i]} onChange={() => setOn(on.map((v, j) => j === i ? !v : v))} style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>{t}</span>
          </label>
        ))}
        <div style={{ fontSize: 13, color: '#595959', fontWeight: 600, margin: '12px 0 8px' }}>How should we reach you?</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {['Push', 'SMS', 'Email', 'Off'].map(ch => (
            <button key={ch} onClick={() => setChannel(ch)} disabled={type === 'alert' && useAlertChannel} style={{ flex: '1 1 0', minWidth: 64, padding: '8px 6px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: (type === 'alert' && useAlertChannel) ? 'not-allowed' : 'pointer', opacity: (type === 'alert' && useAlertChannel) ? 0.5 : 1, border: '1.5px solid #1F3864', background: channel === ch ? '#1F3864' : '#FFF', color: channel === ch ? '#FFF' : '#1F3864' }}>{ch}</button>
          ))}
        </div>
        {type === 'alert' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 14, background: '#FFF', border: '1.5px solid ' + (useAlertChannel ? '#1F3864' : '#BFBFBF'), borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={useAlertChannel} onChange={() => setUseAlertChannel(!useAlertChannel)} style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>Use my Alert channel preference for this item ({state.alertChannel || 'text message'})</span>
          </label>
        )}
        <SketchyButton primary onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Done</SketchyButton>
      </div>
    </div>
  );
}

// Two-state follow control. Outlined "+ Follow" when not following; filled "✓ Following" when following.
// Hover (desktop) or tap-again (mobile) reveals "Unfollow" in red. A gear opens per-item prefs.
// An info icon opens a plain-language popover; a channel-aware tooltip shows on hover/long-press;
// the first follow ever shows an explanatory toast.
const FollowButton = ({ id, type, name = 'this item', style, showGear = true, showInfo = true, archived = false }) => {
  const { state, dispatch, nav } = window.useStore();
  const following = !!state.followed[id];
  const [hover, setHover] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [tip, setTip] = useState(false);
  const [info, setInfo] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const lp = useRef(null);

  const channel = type === 'alert' ? (state.alertChannel || 'text message') : (state.followChannel || 'text message');

  const doFollow = () => {
    dispatch({ type: 'TOGGLE_FOLLOW', id });
    const firstTime = !state.firstFollowSeen;
    if (firstTime) dispatch({ type: 'SET_FIRST_FOLLOW' });
    setToast({ first: firstTime });
    setTimeout(() => setToast(null), firstTime ? 5000 : 2500);
  };

  const toggle = () => {
    if (!following) { doFollow(); return; }
    if (hover || confirm) {
      dispatch({ type: 'TOGGLE_FOLLOW', id });
      setConfirm(false);
      if (timer.current) clearTimeout(timer.current);
    } else {
      setConfirm(true);
      timer.current = setTimeout(() => setConfirm(false), 2500);
    }
  };

  // Archived (expired notice/alert): no live follow; just an Unfollow affordance.
  if (archived) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#595959' }}>
          <Icon name="check" size={14} color="#595959" /> Followed · Archived
        </span>
        {following && <button onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', id })} style={{ background: 'none', border: 'none', padding: 0, color: '#C00000', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Unfollow</button>}
      </span>
    );
  }

  const showUnfollow = following && (hover || confirm);
  const label = !following ? 'Follow' : showUnfollow ? 'Unfollow' : 'Following';
  const icon = !following ? 'plus' : showUnfollow ? 'close' : 'check';
  const base = {
    fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '6px 14px', minHeight: 32,
    borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
    transition: 'all 80ms', whiteSpace: 'nowrap'
  };
  if (showUnfollow) Object.assign(base, { background: '#FFF', color: '#C00000', border: '1.5px solid #C00000' });
  else if (following) Object.assign(base, { background: '#1F3864', color: '#FFF', border: '1.5px solid #1F3864' });
  else Object.assign(base, { background: '#FFF', color: '#1F3864', border: '1.5px solid #1F3864' });

  const startLongPress = () => { lp.current = setTimeout(() => setTip(true), 400); };
  const endLongPress = () => { if (lp.current) clearTimeout(lp.current); };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, position: 'relative', ...style }}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <button
          onClick={toggle}
          onMouseEnter={() => { setHover(true); if (!following) setTip(true); }}
          onMouseLeave={() => { setHover(false); setConfirm(false); setTip(false); }}
          onTouchStart={startLongPress}
          onTouchEnd={endLongPress}
          style={base}
          aria-pressed={following}>
          <Icon name={icon} size={15} color={showUnfollow ? '#C00000' : (following ? '#FFF' : '#1F3864')} strokeWidth={2.2} />
          {label}
        </button>
        {tip && !following && (
          <span style={{ position: 'absolute', top: '110%', left: 0, zIndex: 70, background: '#1F3864', color: '#FFF', borderRadius: 8, padding: '8px 10px', width: 210, fontSize: 12, lineHeight: 1.4, boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}>
            Get notified by {channel} when this changes.
            <button onMouseDown={(e) => { e.preventDefault(); setTip(false); nav({ name: 'me', sub: 'notifications' }); }} style={{ display: 'block', marginTop: 4, background: 'none', border: 'none', padding: 0, color: '#BcD4F0', color: '#CFE0F5', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Change this →</button>
          </span>
        )}
      </span>

      {following && showGear && (
        <button onClick={() => setPrefs(true)} title="Notification preferences for this item" aria-label="Notification preferences"
          style={{ width: 32, height: 32, borderRadius: 6, border: '1.5px solid #BFBFBF', background: '#FFF', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="settings" size={16} color="#595959" />
        </button>
      )}

      {showInfo && (
        <button onClick={() => setInfo(true)}
          style={{ background: 'none', border: 'none', padding: 0, color: '#1F3864', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0 }}>
          What does following do?
        </button>
      )}

      {prefs && <FollowPrefsModal type={type} onClose={() => setPrefs(false)} />}
      {info && <FollowInfoPopover channel={channel} onClose={() => setInfo(false)} onChange={() => { setInfo(false); nav({ name: 'me', sub: 'notifications' }); }} />}
      {toast && <FollowToast first={toast.first} name={name} channel={channel} onClose={() => setToast(null)} />}
    </span>
  );
};

// Plain-language "What does Follow do?" popover (anchored modal).
const FollowInfoPopover = ({ channel, onClose, onChange }) => (
  <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 96, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: '#FFF', maxWidth: 380, width: '100%', border: '2px solid #222', borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#1F3864', marginBottom: 8 }}>What does Follow do?</div>
      <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.55, marginBottom: 10 }}>When you follow this, the township will send you a notification when something important changes. For example, if this is an event and the time changes, or a project and the work begins, you will hear about it.</div>
      <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.55, marginBottom: 10 }}>You currently receive notifications by <strong>{channel}</strong>. You can change this to email, push notification, daily digest email, weekly digest email, or off, anytime in Profile, under Notifications.</div>
      <div style={{ fontSize: 13.5, color: '#222', lineHeight: 1.55, marginBottom: 16 }}>You can also customize what kinds of changes notify you for this specific item by tapping the gear icon next to the Following button after you follow it.</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <SketchyButton onClick={onChange} style={{ flex: 1, justifyContent: 'center' }}>Notification settings</SketchyButton>
        <SketchyButton primary onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Got it</SketchyButton>
      </div>
    </div>
  </div>
);

// First-follow (and subsequent brief) confirmation toast.
const FollowToast = ({ first, name, channel, onClose }) => (
  <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 120, maxWidth: 380, width: 'calc(100% - 32px)', background: '#1F3864', color: '#FFF', borderRadius: 12, padding: '12px 14px', boxShadow: '0 8px 28px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <Icon name="check" size={18} color="#9FE0B5" strokeWidth={2.4} />
    <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45 }}>
      {first
        ? <>You're now following <strong>{name}</strong>. We'll send you a notification by <strong>{channel}</strong> when there are updates. Change this in Profile &gt; Notifications.</>
        : <>You're now following <strong>{name}</strong>.</>}
    </div>
    <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: 0, flexShrink: 0 }}><Icon name="close" size={16} color="#FFF" /></button>
  </div>
);

// === Shared comment thread for projects / notices / alerts ===
// Matches the event/ticket thread style; adds optional sort, lightweight 👍 reactions,
// and a read-only lifecycle (for transient notices/alerts that expire).
const ItemComments = ({ title = 'Comments', seed = [], sortable = false, readOnly = false, banner = null, closedBanner = null, placeholder = 'Say something neighborly...' }) => {
  const { state, guardedSubmit } = window.useStore();
  const [list, setList] = useState(seed);
  const [text, setText] = useState('');
  const [sort, setSort] = useState('recent');
  const [reacted, setReacted] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  const score = (c, i) => (c.up || 0) + (reacted[i] ? 1 : 0);
  const withIdx = list.map((c, i) => ({ c, i }));
  let display = withIdx;
  if (sortable && sort === 'reactions') display = [...withIdx].sort((a, b) => score(b.c, b.i) - score(a.c, a.i));
  else if (sortable && sort === 'recent') display = [...withIdx].slice().reverse();

  const post = () => guardedSubmit(() => { setList([...list, { author: state.displayName, body: text, date: 'Just now', replyTo: replyingTo || undefined }]); setText(''); setReplyingTo(null); });

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: '#1F3864', letterSpacing: '-0.015em' }}>{title} <span style={{ fontWeight: 600, color: '#595959', fontSize: 15 }}>({list.length})</span></div>
        {sortable && list.length > 1 && (
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '5px 8px', fontFamily: 'inherit', fontSize: 12.5, border: '1.5px solid #BFBFBF', borderRadius: 6, background: '#FFF', color: '#1F3864' }}>
            <option value="recent">Most recent</option>
            <option value="reactions">Most reactions</option>
          </select>
        )}
      </div>
      <div style={{ width: 36, height: 3, background: '#1F3864', borderRadius: 2, marginBottom: 12 }} />

      {banner && !readOnly && (
        <div style={{ fontSize: 12, color: '#595959', marginBottom: 12, fontStyle: 'italic' }}>{banner}</div>
      )}

      {list.length === 0 && (
        <div style={{ padding: 10, fontSize: 13, color: '#595959', fontStyle: 'italic', background: '#FFF', border: '1.5px dashed #BFBFBF', borderRadius: 6, marginBottom: 10 }}>No comments yet. Be the first to add context for your neighbors.</div>
      )}

      {display.map(({ c, i }) => {
        const s = score(c, i);
        const isReply = !!c.replyTo;
        return (
          <div key={i} style={{ marginBottom: 8, marginLeft: isReply ? 18 : 0, borderLeft: isReply ? '2px solid #D7DEE8' : 'none', paddingLeft: isReply ? 10 : 0 }}>
          <div style={{ padding: 10, background: c.staff ? '#FFF4D6' : '#FFF', border: '1.5px solid ' + (c.staff ? '#D4A017' : '#BFBFBF'), borderRadius: 8 }}>
            {isReply && <div style={{ fontSize: 11, color: '#595959', fontStyle: 'italic', marginBottom: 3 }}>↳ Replying to {c.replyTo}</div>}
            <div style={{ fontSize: 12, fontWeight: 700, color: c.staff ? '#7A5A00' : '#1F3864' }}>{c.staff && '👷 '}{c.author} <span style={{ color: '#595959', fontWeight: 400 }}>· {c.date}</span></div>
            <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.45 }}>{c.body}</div>
            {!readOnly && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <button onClick={() => setReacted(r => ({ ...r, [i]: !r[i] }))} style={{ background: reacted[i] ? '#DBE5F1' : 'transparent', border: '1px solid #BFBFBF', borderRadius: 999, padding: '2px 10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#1F3864' }} aria-pressed={!!reacted[i]}>👍 {s > 0 ? s : ''}</button>
                <button onClick={() => { setReplyingTo(c.author); }} style={{ background: 'none', border: 'none', padding: 0, color: '#2E74B5', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Reply</button>
              </div>
            )}
            {readOnly && s > 0 && <div style={{ marginTop: 8, fontSize: 12, color: '#595959' }}>👍 {s}</div>}
          </div>
          </div>
        );
      })}

      {readOnly ? (
        <div style={{ marginTop: 6, padding: 12, background: '#F2F2F2', border: '1.5px solid #BFBFBF', borderRadius: 8, fontSize: 13, color: '#595959', lineHeight: 1.45 }}>{closedBanner || 'Comments are closed. The discussion is preserved above for reference.'}</div>
      ) : (
        <>
          {replyingTo && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4, marginBottom: 4, padding: '6px 10px', background: '#EEF3F9', border: '1px solid #C9DBF0', borderRadius: 6, fontSize: 12.5, color: '#1F3864' }}>
              <span>Replying to <strong>{replyingTo}</strong></span>
              <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', padding: 0, color: '#C00000', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          )}
          <FeedbackValueReminder style={{ marginTop: 4 }} />
          <window.PostingGuidance />
          <Field label={replyingTo ? 'Write your reply' : 'Add a comment'} multiline value={text} onChange={setText} placeholder={placeholder} />
          <SketchyButton primary small disabled={text.length < 5} onClick={post}>{replyingTo ? 'Post reply' : 'Post comment'}</SketchyButton>
        </>
      )}
    </div>
  );
};

window.CC_UI = {
  Icon, SketchyCard, SketchyButton, Chip, Pill, Underline, SectionH,
  PhotoBox, Field, ResponseCard, STATUS_COLORS, statusColorFor,
  LikertScale, ValueHelpModal, FeedbackValueReminder, SpeakUpValueBlock,
  FollowButton, FollowPrefsModal, ItemComments
};
