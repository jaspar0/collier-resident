// Store: global state + persistence for Collier Connect prototype.
// Uses React Context. Persists to localStorage under 'cc.state'.

const { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useRef, useState } = React;

const STORAGE_KEY = 'cc.state.v2';

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function makeInitial() {
  const persisted = loadPersisted();
  const data = window.CC_DATA;
  const fresh = {
    // navigation
    route: { name: 'onboarding', step: 0 }, // onboarding | home | happening | decide | speak | me | engages | response | placeholder
    routeStack: [],

    // user
    user: { ...data.user },
    archetype: data.user.archetype,
    avatar: (data.archetypeToAvatar && data.archetypeToAvatar[data.user.archetype]) || 'Just Getting Started',
    stayConnected: true,   // "send me updates based on my quiz results" (Stay Connected toggle)
    quizFeedback: '',      // Q8 open-text, stored anonymously
    digest: data.user.digest,
    smsPref: data.user.smsPref,
    topics: [...data.user.topics],
    displayName: data.user.displayName,
    engagesOptedIn: true,

    // gamification
    points: data.user.points,
    bingoCard: data.bingoCard.map(b => ({ ...b })),
    completedActivities: Object.fromEntries((data.completedActivityIds || []).map(id => [id, true])),
    myRewards: data.myRewards.map(r => ({ ...r })),

    // social state
    followed: {}, // id -> true
    followedCategories: {},   // proposal category -> true
    followedNeighborhoods: {},// neighborhood -> true
    followChannel: 'text message',  // resident's general follow notification channel
    alertChannel: 'text message',   // alert-specific channel (faster by default)
    firstFollowSeen: false,         // has the resident followed anything yet (for first-follow toast)
    rsvps: {},    // eventId -> 'yes' | 'maybe' | 'no'
    affectsMe: {},// ticketId -> true
    reactions: {},// commentId -> 'up' | 'down'
    thanks: {},   // ticketId -> true
    comments: {}, // proposalId -> [comment]

    // submitted by user
    submittedTickets: [],
    submittedEventRequests: [],   // new resident event requests
    eventRequestReplies: {},      // requestId -> true once replied (Needs more info -> Under Review)

    // onboarding
    onboarded: false,              // gate: has the resident left the onboarding flow (tour started or skipped)
    onboardingCompleted: false,    // has the resident finished the whole flow (celebration done)
    archetypeAssigned: null,       // archetype assigned by the quiz (null if skipped)
    displayNamePref: 'resident',   // resident | first | full
    tour: { active: false, step: 0 },
    showCelebration: false,
    tourCompleted: false,         // finished the tour via "I'm ready"
    tourSkipped: false,           // exited the tour early (or skipped from intro)
    contextualTipsSeen: {},        // tipKey -> true once dismissed
    tipsEnabled: true,             // master switch for first-visit tips
    tipsForced: false,             // "Show me tips again" overrides the completed-tour suppression
    extraNotifications: [],        // dynamically-injected notifications (e.g. welcome)

    // ui
    happeningView: 'map',
    happeningFilters: { events: true, projects: true, issues: true, notices: true },
    happeningNeighborhood: 'All',
    happeningDate: 'All upcoming',
    calMonth: 6, // July 2026 (0-indexed)
    calYear: 2026,

    // notifications
    notifShownIds: {}, // id -> true once user opens panel; treated as read
    notifOpen: false,

    // community guidelines / posting
    firstPosterSeen: false,        // session-reset; testers always get first-time flow
    removedPosts: [],              // seeded below
    removedBannerDismissed: false,
    drafts: {},                    // key -> draft text (for revise & re-post prefill)

    // pre-seed follows so 'My followed items' starts populated
    _seeded: false
  };

  let merged = persisted ? { ...fresh, ...persisted } : fresh;
  if (!merged._seeded) {
    // seed followed items
    const seedFollows = ['pr1', 'p3', 'e6', 'e3', 'TKT-2026-0817', 'n2', 'n3', 'n0p25'];
    seedFollows.forEach(id => { merged.followed[id] = true; });
    merged.followedCategories = { 'Parks and Recreation': true, 'Traffic and Safety': true };
    merged.followedNeighborhoods = { 'Ewingsville': true };
    merged._seeded = true;
  }
  // Always reset per-session guidance state so the first-time flow is testable each load
  merged.firstPosterSeen = false;
  // Seed one removed post (Jane's Hilltop Park comment) if not present
  if (!merged.removedPosts || merged.removedPosts.length === 0) {
    merged.removedPosts = [{
      id: 'rm1',
      date: 'July 14, 2026',
      threadLabel: 'Hilltop Park Recreational Facilities Expansion',
      threadKind: 'proposal',
      threadId: 'p3',
      reason: 'Only venting, with no specific concern or suggestion',
      staffNote: 'We\u0027d genuinely like your take - a specific worry or idea about the expansion would help the design team.',
      original: 'This whole thing is ridiculous, who even approved it.'
    }];
  }
  return merged;
}

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE': {
      return {
        ...state,
        route: action.route,
        routeStack: action.replace ? state.routeStack : [...state.routeStack, state.route]
      };
    }
    case 'BACK': {
      const stack = [...state.routeStack];
      const prev = stack.pop();
      if (!prev) return state;
      return { ...state, route: prev, routeStack: stack };
    }
    case 'REPLACE_ROUTE': {
      return { ...state, route: action.route };
    }
    case 'TOGGLE_FOLLOW': {
      const followed = { ...state.followed };
      if (followed[action.id]) delete followed[action.id];
      else followed[action.id] = true;
      return { ...state, followed };
    }
    case 'SET_FIRST_FOLLOW': return { ...state, firstFollowSeen: true };
    case 'TOGGLE_FOLLOW_CATEGORY': {
      const m = { ...state.followedCategories };
      if (m[action.value]) delete m[action.value]; else m[action.value] = true;
      return { ...state, followedCategories: m };
    }
    case 'TOGGLE_FOLLOW_NEIGHBORHOOD': {
      const m = { ...state.followedNeighborhoods };
      if (m[action.value]) delete m[action.value]; else m[action.value] = true;
      return { ...state, followedNeighborhoods: m };
    }
    case 'SET_ALERT_CHANNEL': return { ...state, alertChannel: action.value };
    case 'SET_FOLLOW_CHANNEL': return { ...state, followChannel: action.value };
    case 'SET_RSVP': {
      return { ...state, rsvps: { ...state.rsvps, [action.eventId]: action.choice } };
    }
    case 'TOGGLE_AFFECTS': {
      const a = { ...state.affectsMe };
      if (a[action.id]) delete a[action.id]; else a[action.id] = true;
      return { ...state, affectsMe: a };
    }
    case 'REACT': {
      return { ...state, reactions: { ...state.reactions, [action.commentId]: action.value } };
    }
    case 'THANK': {
      return { ...state, thanks: { ...state.thanks, [action.ticketId]: true } };
    }
    case 'ADD_COMMENT': {
      const list = state.comments[action.proposalId] || [];
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.proposalId]: [{
            id: 'usr_' + Date.now(),
            author: state.displayName,
            date: 'Just now',
            body: action.body,
            reactions: { up: 0, down: 0 },
            isMine: true
          }, ...list]
        }
      };
    }
    case 'SUBMIT_EVENT_REQUEST': {
      const num = String(150 + state.submittedEventRequests.length).padStart(4, '0');
      const req = {
        id: 'REQ-2026-' + num,
        kind: 'eventRequest',
        status: 'Submitted',
        submitted: 'Just now',
        ...action.payload
      };
      return {
        ...state,
        submittedEventRequests: [req, ...state.submittedEventRequests],
        points: state.engagesOptedIn ? state.points + 25 : state.points
      };
    }
    case 'REPLY_EVENT_REQUEST': {
      return { ...state, eventRequestReplies: { ...state.eventRequestReplies, [action.id]: true } };
    }
    case 'REPLY_TICKET': {
      return { ...state, ticketReplies: { ...(state.ticketReplies || {}), [action.id]: true } };
    }
    case 'SUBMIT_TICKET': {
      const num = String(900 + state.submittedTickets.length).padStart(4, '0');
      const t = {
        id: 'TKT-2026-' + num,
        status: 'Submitted',
        date: 'Just now',
        type: action.payload.type,
        location: action.payload.location,
        description: action.payload.description,
        affected: 0,
        owner: 'Jane',
        neighborhood: state.user.neighborhood,
        displayName: action.payload.displayName || state.displayName,
        notifMilestones: action.payload.notifMilestones,
        notifChannel: action.payload.notifChannel,
        response: null,
        photo: action.payload.photo
      };
      // Persist the chosen notification prefs into the global per-topic prefs (Roads + Issues)
      const ch = action.payload.notifChannel;
      const channelMap = { email: 'Email', text: 'SMS', both: 'Email', none: 'None' };
      const issuePrefs = { ...(state.notifPrefs || {}), 'Issues': { channel: channelMap[ch] || 'Email', freq: 'Real-time' }, 'Roads and Traffic': { channel: channelMap[ch] || 'Email', freq: 'Real-time' } };
      return { ...state, submittedTickets: [t, ...state.submittedTickets], notifPrefs: issuePrefs };
    }
    case 'COMPLETE_BINGO': {
      const card = state.bingoCard.map(b => b.id === action.squareId ? { ...b, done: true } : b);
      const sq = state.bingoCard.find(b => b.id === action.squareId);
      const pts = (sq && sq.points) || 15;
      return { ...state, bingoCard: card, points: state.points + pts };
    }
    case 'EARN_ACTIVITY': {
      if (state.completedActivities[action.id]) return state;
      const completed = { ...state.completedActivities, [action.id]: true };
      const pts = state.engagesOptedIn ? (action.points || 0) : 0;
      return { ...state, completedActivities: completed, points: state.points + pts };
    }
    case 'REDEEM_REWARD': {
      const reward = window.CC_DATA.rewards.find(r => r.id === action.rewardId);
      if (!reward || state.points < reward.cost) return state;
      const code = 'COLLIER-' + reward.business.split(' ')[0].toUpperCase().slice(0, 5) + '-2026-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      return {
        ...state,
        points: state.points - reward.cost,
        myRewards: [{
          id: 'mr_' + Date.now(), name: reward.name, business: reward.business,
          code, status: 'Active', redeemed: 'Just now', expires: '30 days from now'
        }, ...state.myRewards]
      };
    }
    case 'SET_ARCHETYPE': {
      const arc = window.CC_DATA.archetypes[action.value];
      return { ...state, archetype: action.value, topics: arc ? arc.topics : state.topics };
    }
    case 'SET_AVATAR': {
      // The avatar is the visible identity; it maps to an existing personalization
      // archetype so the For You feed, tour, and notification mix keep working.
      const av = window.CC_DATA.avatars[action.value];
      const mappedArchetype = av ? av.archetype : state.archetype;
      const arc = window.CC_DATA.archetypes[mappedArchetype];
      return { ...state, avatar: action.value, archetype: mappedArchetype, topics: arc ? arc.topics : state.topics };
    }
    case 'SET_STAY_CONNECTED': return { ...state, stayConnected: action.value };
    case 'SET_QUIZ_FEEDBACK': return { ...state, quizFeedback: action.value };
    case 'SET_TOPICS': return { ...state, topics: action.value };
    case 'SET_DIGEST': return { ...state, digest: action.value };
    case 'SET_SMS': return { ...state, smsPref: action.value };
    case 'SET_EMAIL': return { ...state, user: { ...state.user, email: action.value } };
    case 'SET_DISPLAY_NAME': return { ...state, displayName: action.value };
    case 'SET_ENGAGES': return { ...state, engagesOptedIn: action.value };
    case 'FINISH_ONBOARDING': return { ...state, onboarded: true, route: { name: 'home' }, routeStack: [] };
    case 'START_TOUR': {
      const arc = action.archetype || state.archetype;
      return { ...state, onboarded: true, archetypeAssigned: arc, tour: { active: true, step: 0 }, showCelebration: false, route: { name: 'home' }, routeStack: [] };
    }
    case 'TOUR_NEXT': return { ...state, tour: { ...state.tour, step: state.tour.step + 1 } };
    case 'END_TOUR': return {
      ...state,
      tour: { active: false, step: 0 },
      showCelebration: true,
      tourCompleted: action.skipped ? state.tourCompleted : true,
      tourSkipped: action.skipped ? true : state.tourSkipped
    };
    case 'RESTART_TOUR': {
      const arc = state.archetypeAssigned || state.archetype;
      return { ...state, onboarded: true, archetypeAssigned: arc, tour: { active: true, step: 0 }, showCelebration: false, tourCompleted: false, tourSkipped: false, route: { name: 'home' }, routeStack: [] };
    }
    case 'SKIP_TOUR': {
      const arc = action.archetype || state.archetype;
      return { ...state, onboarded: true, archetypeAssigned: arc, tour: { active: false, step: 0 }, showCelebration: true, tourSkipped: true, route: { name: 'home' }, routeStack: [] };
    }
    case 'FINISH_CELEBRATION': {
      const welcome = {
        id: 'nt_welcome', unread: true, category: 'township', accent: '#1F3864',
        title: 'Welcome to Collier Connect',
        body: 'Welcome to Collier Connect, ' + state.user.name.split(' ')[0] + '. We\u0027re excited to have you. - The township team',
        time: 'Just now', action: { kind: 'none' }
      };
      const already = (state.extraNotifications || []).some(n => n.id === 'nt_welcome');
      return {
        ...state,
        showCelebration: false,
        onboardingCompleted: true,
        extraNotifications: already ? state.extraNotifications : [welcome, ...(state.extraNotifications || [])],
        route: { name: 'home' }, routeStack: []
      };
    }
    case 'RESTART_ONBOARDING': {
      return {
        ...state,
        onboarded: false, onboardingCompleted: false, archetypeAssigned: null,
        tour: { active: false, step: 0 }, showCelebration: false,
        tourCompleted: false, tourSkipped: false,
        contextualTipsSeen: {}, tipsEnabled: true, tipsForced: false,
        route: { name: 'onboarding', step: 0 }, routeStack: []
      };
    }
    case 'DISMISS_TIP': return { ...state, contextualTipsSeen: { ...state.contextualTipsSeen, [action.key]: true } };
    case 'DISABLE_TIPS': return { ...state, tipsEnabled: false };
    case 'RESET_TIPS': return { ...state, tipsEnabled: true, tipsForced: true, contextualTipsSeen: {} };
    case 'SET_DISPLAY_PREF': return { ...state, displayNamePref: action.value };
    case 'SET_HAPPENING_VIEW': return { ...state, happeningView: action.value };
    case 'TOGGLE_FILTER': {
      return { ...state, happeningFilters: { ...state.happeningFilters, [action.key]: !state.happeningFilters[action.key] } };
    }
    case 'SET_NEIGHBORHOOD': return { ...state, happeningNeighborhood: action.value };
    case 'SET_DATE_RANGE': return { ...state, happeningDate: action.value };
    case 'CAL_NAV': {
      let m = state.calMonth + action.delta;
      let y = state.calYear;
      if (m > 11) { m = 0; y++; }
      if (m < 0) { m = 11; y--; }
      return { ...state, calMonth: m, calYear: y };
    }
    case 'OPEN_NOTIFICATIONS': {
      return { ...state, notifOpen: true };
    }
    case 'MARK_NOTIF_READ': {
      return { ...state, notifShownIds: { ...state.notifShownIds, [action.id]: true } };
    }
    case 'MARK_ALL_NOTIFS_READ': {
      const seen = { ...state.notifShownIds };
      [...(state.extraNotifications || []), ...(window.CC_DATA.notifications || [])].forEach(n => { seen[n.id] = true; });
      return { ...state, notifShownIds: seen };
    }
    case 'CLOSE_NOTIFICATIONS': return { ...state, notifOpen: false };
    case 'SET_FIRST_POSTER_SEEN': return { ...state, firstPosterSeen: true };
    case 'DISMISS_REMOVED_BANNER': return { ...state, removedBannerDismissed: true };
    case 'SET_DRAFT': return { ...state, drafts: { ...state.drafts, [action.key]: action.value } };
    case 'RESET': {
      localStorage.removeItem(STORAGE_KEY);
      return makeInitial();
    }
    default: return state;
  }
}

const StoreContext = createContext(null);

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, makeInitial);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // navigation helpers
  const nav = useCallback((route, opts) => {
    dispatch({ type: 'NAVIGATE', route, replace: opts && opts.replace });
  }, []);
  const back = useCallback(() => dispatch({ type: 'BACK' }), []);

  // === Community-guidelines / first-time-poster guidance ===
  const pendingRef = useRef(null);
  const [guidance, setGuidance] = useState({ firstPoster: false, overlay: false, tipsExpanded: false });

  // Wrap any text-submission action. Shows the first-time modal once per session.
  const guardedSubmit = useCallback((fn) => {
    if (state.firstPosterSeen) { fn(); return; }
    pendingRef.current = fn;
    setGuidance(g => ({ ...g, firstPoster: true }));
  }, [state.firstPosterSeen]);

  const confirmFirstPost = useCallback(() => {
    dispatch({ type: 'SET_FIRST_POSTER_SEEN' });
    setGuidance(g => ({ ...g, firstPoster: false, overlay: false }));
    const fn = pendingRef.current;
    pendingRef.current = null;
    if (fn) fn();
  }, []);

  const cancelFirstPost = useCallback(() => {
    pendingRef.current = null;
    setGuidance(g => ({ ...g, firstPoster: false }));
  }, []);

  // "Read full guidelines" from the modal: show overlay, keep pending draft
  const openGuidelinesOverlay = useCallback(() => setGuidance(g => ({ ...g, overlay: true, firstPoster: false })), []);
  const closeGuidelinesOverlay = useCallback(() => setGuidance(g => ({ ...g, overlay: false, firstPoster: pendingRef.current ? true : false })), []);
  const setTipsExpanded = useCallback((v) => setGuidance(g => ({ ...g, tipsExpanded: typeof v === 'function' ? v(g.tipsExpanded) : v })), []);

  const value = useMemo(() => ({
    state, dispatch, nav, back,
    guardedSubmit, confirmFirstPost, cancelFirstPost,
    openGuidelinesOverlay, closeGuidelinesOverlay, setTipsExpanded,
    guidance
  }), [state, nav, back, guardedSubmit, confirmFirstPost, cancelFirstPost, openGuidelinesOverlay, closeGuidelinesOverlay, setTipsExpanded, guidance]);
  return React.createElement(StoreContext.Provider, { value }, children);
}

function useStore() {
  return useContext(StoreContext);
}

window.StoreProvider = StoreProvider;
window.useStore = useStore;
