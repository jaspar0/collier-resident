// All seeded data for Collier Connect wireframe prototype.
// Pulled verbatim from the spec where possible; invented copy clearly marked with /* invented */.

window.CC_DATA = (function () {
  const responses = [
    {
      id: 'r0',
      theme: 'Last month\u0027s leaderboard winner: Rennerdale',
      excerpt: 'Rennerdale topped the per-household leaderboard in June and voted to put their $500 toward basketball court resurfacing at Rennerdale Park.',
      aggregatedInput: 'Rennerdale finished first on June\u0027s per-household leaderboard. Residents were given three township-proposed options for the $500 neighborhood improvement budget and voted.',
      full: 'Congratulations to Rennerdale, June\u0027s winning neighborhood. Residents voted to put the $500 discretionary budget toward resurfacing the basketball court at Rennerdale Park. Work is scheduled for late summer. The July leaderboard is now underway - every neighborhood starts fresh.',
      responder: 'Amy Medway',
      role: "Manager's Office",
      shortName: 'Amy, Manager\u0027s Office',
      date: 'July 1, 2026',
      department: "Manager's Office",
      sources: [
        { id: 's0', label: 'June neighborhood leaderboard - final standings', kind: 'activity' },
        { id: 's0b', label: 'Rennerdale $500 spending vote - 31 residents', kind: 'poll' }
      ]
    },
    {
      id: 'r1',
      theme: 'Hilltop Road potholes',
      excerpt: 'Public Works crews patched the worst potholes on June 8.',
      aggregatedInput: '23 residents reported potholes on Hilltop Road, with most pointing to the stretch between Boyce and Chartiers Creek.',
      full: 'Public Works crews patched the worst potholes on June 8. The surrounding section will be crack-sealed the week of July 21, weather permitting. If you see new problems on Hilltop, please report them.',
      responder: 'Jen Murphy',
      role: 'Public Works',
      shortName: 'Jen, Public Works',
      date: 'June 12, 2026',
      department: 'Public Works',
      sources: [
        { id: 's1', label: 'Pothole on Hilltop near Boyce - 14 affected', kind: 'ticket' },
        { id: 's2', label: 'Pothole at Hilltop & Chartiers Creek - 9 affected', kind: 'ticket' },
        { id: 's3', label: 'Spring road conditions poll - 47 responses', kind: 'poll' }
      ]
    },
    {
      id: 'r2',
      theme: 'Washington Pike crosswalks',
      excerpt: 'The project was approved at the May 19 board meeting.',
      aggregatedInput: '62 residents weighed in on the proposed crosswalks and flashing beacon. The vote was nearly unanimous in support.',
      full: 'The project was approved at the May 19 board meeting. Construction begins July 15 and continues through end of September. Expect single-lane closures on weekdays between 9am and 3pm.',
      responder: 'Mike Sullivan',
      role: 'Engineering',
      shortName: 'Mike, Engineering',
      date: 'June 20, 2026',
      department: 'Engineering',
      sources: [
        { id: 's4', label: 'Proposal feedback - Washington Pike crosswalks', kind: 'proposal' },
        { id: 's5', label: 'Open comments thread - 38 comments', kind: 'discussion' }
      ]
    },
    {
      id: 'r3',
      theme: 'Family-friendly evening programming',
      excerpt: 'Movies in the Park starts Saturday, July 12 at 8:30pm.',
      aggregatedInput: '14 residents asked for more family-friendly programming after work hours.',
      full: 'Movies in the Park starts Saturday, July 12 at 8:30pm in Collier Community Park, and continues every other Saturday through August. First feature: The Princess Bride.',
      responder: 'Rita Chen',
      role: 'Parks and Recreation',
      shortName: 'Rita, Parks & Rec',
      date: 'June 25, 2026',
      department: 'Parks and Recreation',
      sources: [
        { id: 's6', label: 'Spring poll - what would you like more of?', kind: 'poll' },
        { id: 's7', label: 'Earn Points activity - Community event ideas (8 entries)', kind: 'activity' }
      ]
    },
    {
      id: 'r4',
      theme: 'Brush collection schedule visibility',
      excerpt: 'The schedule will be posted on a dedicated page by July 10.',
      aggregatedInput: 'Several residents reported difficulty finding the brush collection schedule on the township website.',
      full: 'The schedule will be posted on a dedicated page by July 10. Longer term, the brush collection schedule will be one of the first things on the new township platform we are piloting this fall.',
      responder: 'Amy Medway',
      role: "Manager's Office",
      shortName: 'Amy, Manager\u0027s Office',
      date: 'June 28, 2026',
      department: "Manager's Office",
      sources: [
        { id: 's8', label: 'Township website feedback activity - 11 entries', kind: 'activity' }
      ]
    },
    {
      id: 'r5',
      theme: 'Senior van service hours',
      excerpt: 'Saturday hours are returning starting August 1.',
      aggregatedInput: '9 residents asked for Saturday senior van service to be reinstated.',
      full: 'Saturday hours are returning starting August 1 on a 90-day trial. The van will run two loops, 9am and 1pm, to the library, Giant Eagle, and the senior center. We\u0027ll evaluate ridership in October.',
      responder: 'Tom Reilly',
      role: 'Senior Services',
      shortName: 'Tom, Senior Services',
      date: 'May 30, 2026',
      department: 'Senior Services',
      sources: [
        { id: 's9', label: 'Senior services awareness activity', kind: 'activity' }
      ]
    },
    {
      id: 'r6',
      theme: 'Webb Park trail safety',
      excerpt: 'Trail lighting at the north entrance is now scheduled for fall.',
      aggregatedInput: '11 residents flagged the unlit north entrance to Webb Park as a safety concern after sunset.',
      full: 'Trail lighting at the north entrance is now scheduled for the fall capital cycle, with installation expected in October. In the interim, Public Works trimmed back the brush at the entrance on June 9.',
      responder: 'Jen Murphy',
      role: 'Public Works',
      shortName: 'Jen, Public Works',
      date: 'May 22, 2026',
      department: 'Public Works',
      sources: [
        { id: 's10', label: 'Trail conditions activity - 6 entries', kind: 'activity' },
        { id: 's11', label: 'Resident ticket - Webb Park entrance unlit', kind: 'ticket' }
      ]
    },
    {
      id: 'r7',
      theme: 'Newsletter delivery gaps',
      excerpt: 'We\u0027ve switched mail carriers for the printed newsletter.',
      aggregatedInput: '6 households in Rennerdale and Walkers Mill reported not receiving the May newsletter.',
      full: 'We\u0027ve switched mail carriers for the printed newsletter starting with the July issue. If your household has missed two issues in a row, email amy.medway@colliertownship.net and we\u0027ll add you to the make-good list.',
      responder: 'Amy Medway',
      role: "Manager's Office",
      shortName: 'Amy, Manager\u0027s Office',
      date: 'May 14, 2026',
      department: "Manager's Office",
      sources: [
        { id: 's12', label: 'Newsletter readership activity', kind: 'activity' }
      ]
    },
    {
      id: 'r8',
      theme: 'Snow removal priority routes',
      excerpt: 'Priority maps for the 2026-27 season are published.',
      aggregatedInput: '18 residents asked which streets are plowed first during snow events.',
      full: 'Priority maps for the 2026-27 season are published in the Documents tab. Primary routes (school bus, emergency access) are cleared first; cul-de-sacs typically follow within 8 hours of snowfall ending.',
      responder: 'Jen Murphy',
      role: 'Public Works',
      shortName: 'Jen, Public Works',
      date: 'April 28, 2026',
      department: 'Public Works',
      sources: [
        { id: 's13', label: 'Snow removal rating activity - 23 entries', kind: 'activity' }
      ]
    }
  ];

  const proposals = [
    {
      id: 'p1',
      title: 'Expanded recycling pickup',
      category: 'Infrastructure',
      neighborhoods: ['All neighborhoods'],
      status: 'Feedback open',
      deadline: 'July 25, 2026',
      cost: '~$36 / household / year',
      affected: '~2,800 households',
      summary: 'Currently the township provides curbside recycling pickup once per month. The proposal would expand to twice per month, mirroring trash pickup.',
      paragraphs: [
        'Right now, your blue bin gets picked up once a month - the second Wednesday. Many residents tell us their bins overflow before pickup, especially around holidays, and end up putting recyclables in the trash.',
        'This proposal doubles pickup to twice a month (2nd and 4th Wednesdays), matching the trash pickup schedule. Same hauler, same bins, no change to what you can put in.',
        'The cost would be about $36 per household per year, added to your quarterly trash bill. The vendor estimate and a comparison to neighboring townships are in the Documents tab.',
        'If approved on July 28, the new schedule starts September 1.'
      ],
      forYou: 'You\u0027re in Rennerdale and you said curbside recycling matters to you. Your current pickup is the 1st Wednesday. If approved, you\u0027d also get the 4th Wednesday starting September 1.',
      costBreakdown: [
        { label: 'Hauler fee increase', value: '$78,000 / yr' },
        { label: 'Extra route fuel', value: '$14,000 / yr' },
        { label: 'Bin replacements (estimated)', value: '$8,000 / yr' },
        { label: 'Total annual cost', value: '$100,000 / yr' },
        { label: 'Per household', value: '$36 / yr' }
      ],
      stages: [
        { id: 'p1s1', name: 'Initial proposal', date: 'May 3, 2026', status: 'done', detail: 'Proposal drafted by the Sustainability Committee after a March resident survey. Estimated cost based on 2025 hauler contract.', docs: ['Initial proposal memo.pdf'], comments: 2 },
        { id: 'p1s2', name: 'Public comment opens', date: 'June 15, 2026', status: 'done', detail: 'Comment period opened. Three info sessions held - 14 residents attended in person.', docs: ['Info session notes.pdf'], comments: 6 },
        { id: 'p1s3', name: 'Public comment closes', date: 'July 25, 2026', status: 'current', detail: 'Comment period is open right now. We\u0027ve read every comment so far. A summary of themes will be presented to the board on July 28.', docs: [], comments: 8, feedbackShaped: 'Five residents asked whether the schedule could shift to weekly. Sustainability Committee will present a weekly-pickup alternative alongside the proposal for the board\u0027s consideration.' },
        { id: 'p1s4', name: 'Board vote', date: 'July 28, 2026', status: 'upcoming', detail: 'Township Board of Commissioners meeting, Municipal Building, 7pm. Public welcome.', docs: [], comments: 0 },
        { id: 'p1s5', name: 'Implementation begins', date: 'September 1, 2026 (if approved)', status: 'upcoming', detail: 'New twice-monthly schedule begins. Door-hanger reminder mailed in late August.', docs: [], comments: 0 }
      ],
      comments: [
        { id: 'c1', author: 'Collier Resident from Nevillewood', date: 'July 5, 2026', body: 'Yes please. My family of five fills the bin in two weeks, and I end up driving cardboard to the dropoff at Settlers Ridge.', reactions: { up: 14, down: 0 } },
        { id: 'c2', author: 'Collier Resident from Walkers Mill', date: 'July 4, 2026', body: 'Support, with one ask: please keep the same hauler. They\u0027re reliable and the drivers are kind to my dog.', reactions: { up: 9, down: 1 } },
        { id: 'c3', author: 'Collier Resident from Rennerdale', date: 'July 2, 2026', body: 'Not sure $36/year is worth it for me. I\u0027m single and my bin is rarely half full. Could there be a smaller cart option?', reactions: { up: 6, down: 2 } },
        { id: 'c4', author: 'Sustainability Committee - Rita Chen', date: 'July 3, 2026', body: 'Good question. The current hauler offers a 35-gallon mini-cart at a small monthly discount. We\u0027ll include this in the board presentation.', reactions: { up: 11, down: 0 }, staff: true },
        { id: 'c5', author: 'Collier Resident from Fort Pitt', date: 'June 30, 2026', body: 'Could we just have weekly trash + weekly recycling, like Mt. Lebanon does? I\u0027d rather pay a little more for that.', reactions: { up: 7, down: 1 } },
        { id: 'c6', author: 'Collier Resident from Presto', date: 'June 28, 2026', body: 'Oppose. Taxes keep creeping up by small amounts and it adds up. The dropoff at the public works yard is fine.', reactions: { up: 4, down: 5 } },
        { id: 'c7', author: 'Collier Resident from Ewingsville', date: 'June 26, 2026', body: 'Strong support. We have three kids and the bin overflows the week before pickup every single time.', reactions: { up: 12, down: 0 } },
        { id: 'c8', author: 'Collier Resident from Kirwan Heights', date: 'June 22, 2026', body: 'Support, but please publish the new schedule with magnet calendars again. Last schedule change confused half my street.', reactions: { up: 15, down: 0 } }
      ],
      documents: [
        { name: 'Vendor cost estimate.pdf', type: 'PDF', date: 'May 1, 2026', size: '420 KB' },
        { name: 'Comparable township programs.pdf', type: 'PDF', date: 'May 1, 2026', size: '1.2 MB' },
        { name: 'Info session notes.pdf', type: 'PDF', date: 'June 18, 2026', size: '180 KB' },
        { name: 'Initial proposal memo.pdf', type: 'PDF', date: 'May 3, 2026', size: '90 KB' }
      ]
    },
    {
      id: 'p2',
      title: 'Boyce Road stormwater drainage upgrade',
      category: 'Infrastructure',
      neighborhoods: ['Boyce Road corridor'],
      status: 'Feedback open',
      deadline: 'August 15, 2026',
      cost: '$850,000',
      affected: '~240 households',
      summary: 'Five catch basins on Boyce Road have been flagged as causes of recurring flooding. The proposal replaces all five, regrades a section of curb, and adds a new drain at the intersection.',
      paragraphs: [
        'After heavy rain, Boyce Road floods at five known spots between Hilltop and the township line. Public Works has flagged it for years; 17 residents reported standing water this spring alone.',
        'This proposal replaces all five catch basins, regrades a 400-foot section of curb near the worst flood spot, and adds a new drain at the intersection with Chartiers Creek Road.',
        'Total cost is $850,000. It would be paid for from Capital Reserves plus a $300,000 grant from the Pittsburgh Foundation that we\u0027ve already been awarded.',
        'Construction would happen in spring 2027 - likely March to May. Expect single-lane closures on weekdays and full closures on two weekends.'
      ],
      forYou: 'You\u0027re in Rennerdale and not directly on Boyce Road, but Boyce is on your route into the township center. Expect detours through Chartiers Creek Road during construction in spring 2027.',
      costBreakdown: [
        { label: 'Catch basin replacement (5)', value: '$310,000' },
        { label: 'Curb regrading', value: '$220,000' },
        { label: 'New intersection drain', value: '$190,000' },
        { label: 'Engineering & inspection', value: '$95,000' },
        { label: 'Contingency (5%)', value: '$35,000' },
        { label: 'Total', value: '$850,000' },
        { label: 'Funded by', value: 'Capital Reserves + Pittsburgh Foundation grant' }
      ],
      stages: [
        { id: 'p2s1', name: 'Engineering study', date: 'April 8, 2026', status: 'done', detail: 'Engineering firm Gateway Civil completed a stormwater capacity study, identifying five catch basins at end of life.', docs: ['Engineering study summary.pdf'], comments: 1 },
        { id: 'p2s2', name: 'Cost estimate', date: 'May 22, 2026', status: 'done', detail: 'Cost estimate received and reconciled against last year\u0027s contractor bids. Pittsburgh Foundation grant confirmed.', docs: ['Cost breakdown.pdf'], comments: 0 },
        { id: 'p2s3', name: 'Public comment opens', date: 'June 30, 2026', status: 'current', detail: 'Comment period is open. An informational meeting is set for August 18 at the Municipal Building.', docs: [], comments: 12, feedbackShaped: 'Several Boyce Road residents asked whether construction could avoid the school bus morning window. Engineering is rescheduling closures to start at 9am instead of 7am.' },
        { id: 'p2s4', name: 'Informational meeting', date: 'August 18, 2026', status: 'upcoming', detail: 'Open meeting at Municipal Building, 7pm. Engineering will present plans and answer questions.', docs: [], comments: 0 },
        { id: 'p2s5', name: 'Board vote', date: 'September 8, 2026', status: 'upcoming', detail: 'Township Board of Commissioners meeting.', docs: [], comments: 0 },
        { id: 'p2s6', name: 'Construction', date: 'Spring 2027', status: 'upcoming', detail: 'Estimated March-May 2027. Expect single-lane closures on weekdays.', docs: [], comments: 0 }
      ],
      comments: [
        { id: 'c1', author: 'Collier Resident from Boyce Road corridor', date: 'July 4, 2026', body: 'Yes - the water in my driveway during the June 17 storm came halfway up the garage. This is overdue.', reactions: { up: 18, down: 0 } },
        { id: 'c2', author: 'Collier Resident from Boyce Road corridor', date: 'July 1, 2026', body: 'Support. Can the curb regrading also include the section near 4118? Water pools there too.', reactions: { up: 7, down: 0 } },
        { id: 'c3', author: 'Public Works - Jen Murphy', date: 'July 2, 2026', body: 'Good catch - 4118 is just outside the scope but I\u0027ll add it to the visual inspection list. If the slope is wrong it can be folded in.', reactions: { up: 13, down: 0 }, staff: true },
        { id: 'c4', author: 'Collier Resident from Boyce Road corridor', date: 'June 30, 2026', body: 'How disruptive will the spring 2027 construction be? I work from home and three Zoom meetings during jackhammering will end my career.', reactions: { up: 9, down: 0 } }
      ],
      documents: [
        { name: 'Engineering study summary.pdf', type: 'PDF', date: 'April 10, 2026', size: '2.4 MB' },
        { name: 'Cost breakdown.pdf', type: 'PDF', date: 'May 22, 2026', size: '320 KB' },
        { name: 'Pittsburgh Foundation grant letter.pdf', type: 'PDF', date: 'May 18, 2026', size: '110 KB' }
      ]
    },
    {
      id: 'p3',
      title: 'Hilltop Park Recreational Facilities Expansion',
      category: 'Parks and Recreation',
      neighborhoods: ['Presto', 'Rennerdale', 'Ewingsville'],
      status: 'In design',
      deadline: 'Design selection Aug 15',
      cost: '$1.2M',
      affected: '~1,500 residents',
      summary: 'Doubling Hilltop Park with new pickleball courts, an accessible playground, ADA-compliant pavilion, walking trails, and additional parking.',
      paragraphs: [
        'Hilltop Park is our most-used park, and it\u0027s outgrown itself. This project doubles the park footprint onto the adjacent 4 acres the township purchased in 2024.',
        'New: 4 pickleball courts, an accessible playground designed for kids of all abilities, an ADA-compliant pavilion that seats 60, 0.8 miles of new walking trail, and 30 additional parking spaces.',
        'The project was approved at the May 19 board meeting with a $1.2M budget. We\u0027re now in the design phase - three firms responded to our RFP and final selection happens August 15.',
        'Construction begins spring 2027 and completion is targeted for fall 2028. Comments are still open and will be passed along to the design firm.'
      ],
      forYou: 'You\u0027re in Rennerdale, a short drive to Hilltop Park. You said Parks and Recreation matters to you. Expect occasional weekend trail closures in 2027.',
      costBreakdown: [
        { label: 'Pickleball courts (4)', value: '$180,000' },
        { label: 'Accessible playground', value: '$340,000' },
        { label: 'ADA pavilion (60 seats)', value: '$240,000' },
        { label: 'Walking trail (0.8 mi)', value: '$120,000' },
        { label: 'Parking (30 spaces) + lighting', value: '$210,000' },
        { label: 'Design & contingency', value: '$110,000' },
        { label: 'Total', value: '$1,200,000' }
      ],
      stages: [
        { id: 'p3s1', name: 'Initial proposal', date: 'February 4, 2026', status: 'done', detail: 'Concept developed after 2024 land acquisition. Parks Committee held two design workshops.', docs: ['Concept brief.pdf'], comments: 4 },
        { id: 'p3s2', name: 'Public comment', date: 'March 1 - April 30, 2026', status: 'done', detail: '34 residents commented. Strong support overall; concerns concentrated on parking, noise from pickleball courts, and tree preservation.', docs: ['Public comment summary.pdf'], comments: 34, feedbackShaped: 'Several neighbors of the park asked for a tree buffer between pickleball courts and homes. The RFP now requires a 20-foot vegetated buffer.' },
        { id: 'p3s3', name: 'Board approval', date: 'May 19, 2026', status: 'done', detail: 'Approved 5-0 at the May board meeting with $1.2M budget.', docs: ['Board resolution.pdf'], comments: 0 },
        { id: 'p3s4', name: 'Design RFP issued', date: 'May 28, 2026', status: 'done', detail: 'RFP issued. Three firms responded by the July 1 deadline.', docs: ['RFP.pdf'], comments: 1 },
        { id: 'p3s5', name: 'Design selection', date: 'August 15, 2026', status: 'current', detail: 'Selection panel meets August 12. Public comments through August 14 will be shared with the panel.', docs: [], comments: 8, feedbackShaped: 'Several residents have asked the panel to weight accessibility experience heavily. The panel\u0027s scoring rubric now includes a specific accessibility track-record category worth 20% of the score.' },
        { id: 'p3s6', name: 'Construction begins', date: 'Spring 2027', status: 'upcoming', detail: 'Construction kickoff target: March 2027. Phased to keep at least half the park open at all times.', docs: [], comments: 0 },
        { id: 'p3s7', name: 'Completion', date: 'Fall 2028', status: 'upcoming', detail: 'Ribbon-cutting target: September 2028.', docs: [], comments: 0 }
      ],
      comments: [
        { id: 'c1', author: 'Collier Resident from Presto', date: 'July 6, 2026', body: 'Followed since the start. Thrilled about the accessible playground - my niece uses a wheelchair and we drive to Bridgeville for park time.', reactions: { up: 28, down: 0 } },
        { id: 'c2', author: 'Collier Resident from Presto', date: 'July 5, 2026', body: 'Please please pick a firm that has actually built pickleball courts before. Sound buffering matters.', reactions: { up: 16, down: 1 } },
        { id: 'c3', author: 'Parks & Rec - Rita Chen', date: 'July 5, 2026', body: 'Two of the three responding firms have built pickleball complexes, and we\u0027re requiring acoustic samples from each. Thank you.', reactions: { up: 22, down: 0 }, staff: true },
        { id: 'c4', author: 'Collier Resident from Nevillewood', date: 'July 3, 2026', body: 'I followed this proposal in March and just wanted to say - it actually moved. That\u0027s rare. Thank you for the updates.', reactions: { up: 31, down: 0 } },
        { id: 'c5', author: 'Collier Resident from Ewingsville', date: 'June 28, 2026', body: 'Will the new trails connect to Webb Park? That would be amazing for the kids.', reactions: { up: 14, down: 0 } }
      ],
      documents: [
        { name: 'Approved concept design.pdf', type: 'PDF', date: 'May 20, 2026', size: '3.8 MB' },
        { name: 'Public comment summary.pdf', type: 'PDF', date: 'May 5, 2026', size: '440 KB' },
        { name: 'Board resolution.pdf', type: 'PDF', date: 'May 19, 2026', size: '85 KB' },
        { name: 'RFP.pdf', type: 'PDF', date: 'May 28, 2026', size: '620 KB' }
      ]
    },
    {
      id: 'p4', title: "Webb Park Community Garden Plots", category: 'Parks and Recreation', neighborhoods: ["Ewingsville","Kirwan Heights","Fort Pitt"], status: 'Feedback open', deadline: 'August 10, 2026', cost: '$42,000 setup', affected: '~80 plots planned',
      summary: "The township is considering adding 80 community garden plots along the underused eastern slope of Webb Park.",
      paragraphs: ["The township is considering adding 80 community garden plots along the underused eastern slope of Webb Park.","Plots would be assigned by lottery each year, with priority for Ewingsville-area residents in the first season.","Plot fees ($45 per season) would cover ongoing water and maintenance."],
      forYou: "You said Parks and Recreation matters to you. If approved, the first-season lottery gives priority to Ewingsville residents.",
      costBreakdown: [{"label":"Site prep & soil","value":"$26,000"},{"label":"Water line & spigots","value":"$12,000"},{"label":"Fencing & signage","value":"$4,000"},{"label":"Total","value":"$42,000"}],
      stages: [{"id":"s1","name":"Initial proposal","date":"June 2026","status":"done","detail":"Drafted and posted for resident review.","docs":[],"comments":1},{"id":"s2","name":"Public comment opens","date":"July 2026","status":"current","detail":"Comment period is open. Every comment is read before the board discussion.","docs":[],"comments":3},{"id":"s3","name":"Board vote","date":"Fall 2026","status":"upcoming","detail":"Township Board of Commissioners meeting.","docs":[],"comments":0}],
      comments: [{"id":"c1","author":"Collier Resident from Ewingsville","date":"4 days ago","body":"Yes please - my apartment has no yard and I would love a plot.","reactions":{"up":9,"down":0}}],
      documents: [{"name":"Garden plot layout.pdf","type":"PDF","date":"July 2026","size":"310 KB"}]
    },
    {
      id: 'p5', title: "Speed Limit Reduction in School Zones", category: 'Traffic and Safety', neighborhoods: ["Presto","Ewingsville","Kirwan Heights"], status: 'Feedback open', deadline: 'September 1, 2026', cost: '~$18,000 signage', affected: 'Drivers near 3 schools',
      summary: "Reduce the speed limit from 25 to 20 mph on residential streets within 1,000 feet of school buildings during school hours.",
      paragraphs: ["The township is considering reducing the speed limit from 25 to 20 mph on residential streets within 1,000 feet of school buildings, during weekday school hours.","Enforcement would begin September 1 with a 30-day warning period followed by ticketing."],
      forYou: "This affects the residential streets around Hilltop Elementary, Webb Middle, and Bridgeville High.",
      costBreakdown: [{"label":"New & replacement signage","value":"$12,000"},{"label":"Enforcement campaign","value":"$6,000"},{"label":"Total","value":"$18,000"}],
      stages: [{"id":"s1","name":"Initial proposal","date":"June 2026","status":"done","detail":"Drafted and posted for resident review.","docs":[],"comments":1},{"id":"s2","name":"Public comment opens","date":"July 2026","status":"current","detail":"Comment period is open. Every comment is read before the board discussion.","docs":[],"comments":3},{"id":"s3","name":"Board vote","date":"Fall 2026","status":"upcoming","detail":"Township Board of Commissioners meeting.","docs":[],"comments":0}],
      comments: [{"id":"c1","author":"Carol from Presto","date":"2 days ago","body":"Long overdue. People fly down our street at pickup time.","reactions":{"up":14,"down":1}}],
      documents: [{"name":"School zone map.pdf","type":"PDF","date":"July 2026","size":"220 KB"}]
    },
    {
      id: 'p6', title: "Downtown Mixed-Use Zoning Amendment", category: 'Zoning and Planning', neighborhoods: ["Fort Pitt","Rennerdale"], status: 'Feedback open', deadline: 'August 30, 2026', cost: 'No direct township cost', affected: '~840 households',
      summary: "Amend the zoning code to allow mixed-use development along the downtown Washington Pike corridor.",
      paragraphs: ["The proposal would amend the zoning code to allow mixed-use development (ground-floor commercial with residential above) along the downtown corridor of Washington Pike, on parcels currently zoned residential-only.","The change is intended to support small business growth and walkable downtown areas."],
      forYou: "You commute through the downtown corridor. This would change what can be built along Washington Pike over time.",
      costBreakdown: [{"label":"Regulatory change","value":"No direct cost"},{"label":"Staff review time","value":"Absorbed"}],
      stages: [{"id":"s1","name":"Initial proposal","date":"June 2026","status":"done","detail":"Drafted and posted for resident review.","docs":[],"comments":1},{"id":"s2","name":"Public comment opens","date":"July 2026","status":"current","detail":"Comment period is open. Every comment is read before the board discussion.","docs":[],"comments":3},{"id":"s3","name":"Board vote","date":"Fall 2026","status":"upcoming","detail":"Township Board of Commissioners meeting.","docs":[],"comments":0}],
      comments: [{"id":"c1","author":"Collier Resident from Fort Pitt","date":"3 days ago","body":"Would love a coffee shop I can walk to. Support.","reactions":{"up":11,"down":2}}],
      documents: [{"name":"Zoning amendment draft.pdf","type":"PDF","date":"July 2026","size":"480 KB"}]
    },
    {
      id: 'p7', title: "Small-Scale Mixed-Use Development Standards", category: 'Zoning and Planning', neighborhoods: ["All neighborhoods"], status: 'In design', deadline: 'Review through fall', cost: 'No direct township cost', affected: 'Any neighborhood',
      summary: "Define the standards (height, setbacks, parking, design review) any mixed-use project must meet.",
      paragraphs: ["A companion proposal to the Downtown Mixed-Use Zoning Amendment. This proposal would define the standards - height limits, setbacks, parking minimums, design review - that any mixed-use project must meet.","Working out these standards now would let future developments move forward more predictably."],
      forYou: "Sets the ground rules for any future mixed-use project anywhere in the township, including near you.",
      costBreakdown: [{"label":"Consultant review","value":"$30,000"},{"label":"Funded by","value":"Planning budget"}],
      stages: [{"id":"s1","name":"Engineering & legal review","date":"July 2026","status":"current","detail":"Standards are being drafted with the solicitor and engineering staff.","docs":[],"comments":0},{"id":"s2","name":"Public comment","date":"Fall 2026","status":"upcoming","detail":"Opens once a draft is ready.","docs":[],"comments":0}],
      comments: [],
      documents: [{"name":"Draft standards outline.pdf","type":"PDF","date":"July 2026","size":"190 KB"}]
    },
    {
      id: 'p8', title: "Police Body Camera Program Funding", category: 'Public Safety', neighborhoods: ["All neighborhoods"], status: 'Feedback open', deadline: 'August 25, 2026', cost: '$185,000', affected: 'All residents',
      summary: "Equip all 12 sworn officers with body cameras, including storage and a public records process.",
      paragraphs: ["The Police Department is requesting funding to equip all 12 sworn officers with body cameras. The proposal includes equipment, training, storage infrastructure, and a public records process for footage requests.","The Chief and the Township Manager would like resident input on the public records process specifically: what types of footage requests should be honored and how quickly."],
      forYou: "The township is asking residents to weigh in on how footage requests should work - your input shapes the policy.",
      costBreakdown: [{"label":"Cameras & equipment","value":"$78,000"},{"label":"3-year storage contract","value":"$84,000"},{"label":"Training","value":"$15,000"},{"label":"Records process setup","value":"$8,000"},{"label":"Total","value":"$185,000"}],
      stages: [{"id":"s1","name":"Initial proposal","date":"June 2026","status":"done","detail":"Drafted and posted for resident review.","docs":[],"comments":1},{"id":"s2","name":"Public comment opens","date":"July 2026","status":"current","detail":"Comment period is open. Every comment is read before the board discussion.","docs":[],"comments":3},{"id":"s3","name":"Board vote","date":"Fall 2026","status":"upcoming","detail":"Township Board of Commissioners meeting.","docs":[],"comments":0}],
      comments: [{"id":"c1","author":"Collier Resident from Kirwan Heights","date":"1 day ago","body":"Support. Please make the records request process genuinely accessible, not buried in forms.","reactions":{"up":17,"down":0}}],
      documents: [{"name":"Body camera program brief.pdf","type":"PDF","date":"July 2026","size":"260 KB"}]
    }
  ];

  const events = [
    { id: 'e1', date: '2026-07-04', time: '10:00 AM', name: 'Independence Day Parade', location: 'Township Square to Community Park', neighborhood: 'All', description: 'Annual parade kicking off at Township Square and ending with refreshments at Community Park. Strollers, dogs on leashes, and folding chairs all welcome.', attending: 142 },
    { id: 'e2', date: '2026-07-08', time: '7:00 PM', name: 'Township Board of Commissioners Meeting', location: 'Municipal Building, Main Hall', neighborhood: 'All', description: 'Regular monthly board meeting. Agenda includes budget update and a presentation from Public Works. Public comment period at the end.', attending: 18 },
    { id: 'e3', date: '2026-07-12', time: '8:30 PM', name: 'Movies in the Park: The Princess Bride', location: 'Collier Community Park', neighborhood: 'Webb', description: 'First in the summer outdoor movie series. Bring a blanket and a picnic. Free popcorn from the Parks & Rec tent.', attending: 67 },
    { id: 'e4', date: '2026-07-15', time: 'All day', name: 'Brush Collection Week', location: 'All neighborhoods, curbside', neighborhood: 'All', description: 'Place brush curbside by 7am on your normal trash day. Branches under 4 inches in diameter, bundled and no longer than 4 feet.', attending: 0, isNotice: true, dateRange: 'July 14-18' },
    { id: 'e5', date: '2026-07-19', time: '8:30 PM', name: 'Movies in the Park: Coco', location: 'Collier Community Park', neighborhood: 'Webb', description: 'Second feature in the summer outdoor movie series. Bring a blanket and a picnic.', attending: 41 },
    { id: 'e6', date: '2026-07-26', time: '7:00 PM', name: 'Summer Concert: Bridgeville Brass', location: 'Community Park Pavilion 2', neighborhood: 'Webb', description: 'Local brass quintet plays a mix of marches, jazz, and crowd-request standards. Free food truck onsite (Engages voucher works here).', attending: 89 },
    { id: 'e7', date: '2026-07-28', time: '7:00 PM', name: 'Township Board Meeting (Recycling vote)', location: 'Municipal Building', neighborhood: 'All', description: 'Special-attention meeting with the vote on the expanded recycling pickup proposal. Public comment opens at 7:15pm.', attending: 34 },
    { id: 'e8', date: '2026-07-11', time: '12:00 PM', name: 'Senior Lunch', location: 'Senior Center, Walkers Mill', neighborhood: 'Walkers Mill', description: 'Monthly senior lunch - baked ziti and salad this month. $5 suggested donation. RSVP appreciated for headcount.', attending: 28 },
    { id: 'e9', date: '2026-07-09', time: '10:30 AM', name: 'Library Story Time', location: 'Collier Branch Library', neighborhood: 'Webb', description: 'Weekly story time for ages 2-5. This week\u0027s theme: things that go fast.', attending: 14 },
    { id: 'e10', date: '2026-07-25', time: '11:00 AM', name: 'Bridgeville Fire Co. Open House', location: 'Bridgeville Fire Station', neighborhood: 'Bridgeville Heights', description: 'Walk through the trucks, meet the volunteer firefighters, kids can spray the hose. Hot dogs and hose demos.', attending: 52 }
  ];

  // Approved community (resident-organized) events. Appear on map/calendar/list like township events,
  // but flagged community:true with organizer attribution.
  const communityEvents = [
    {
      id: 'ce1', date: '2026-07-11', time: '10:00 AM', name: 'Nevillewood Garden Club Spring Plant Swap',
      location: 'Webb Park Pavilion 1', neighborhood: 'Webb', community: true,
      organizer: 'Patricia Kim', organizerGroup: 'Nevillewood Garden Club',
      recurring: 'Monthly, 2nd Saturday', approvedAgo: 'one month ago', approvedDate: 'June 9, 2026',
      reviewer: 'Amy Medway, Manager\u0027s Office',
      description: 'Bring divisions, cuttings, seeds, or seedlings to trade with fellow gardeners. No plants? Come anyway - there are always extras to give away, and Garden Club members are glad to answer questions. Kid-friendly. Free.',
      attending: 33
    },
    {
      id: 'ce2', date: '2026-07-19', time: '2:00 PM', name: 'Collier History Society Lecture: The Mills of Chartiers Creek',
      location: 'Municipal Building, Main Hall', neighborhood: 'All', community: true,
      organizer: 'Robert Chen', organizerGroup: 'Collier History Society',
      approvedAgo: 'two weeks ago', approvedDate: 'June 24, 2026',
      reviewer: 'Amy Medway, Manager\u0027s Office',
      description: 'A free public talk on the grist and textile mills that lined Chartiers Creek in the 1800s, with historic photos and maps. Light refreshments. All ages welcome; great for students.',
      attending: 21
    },
    {
      id: 'ce3', date: '2026-08-09', time: '8:00 AM', name: 'Webb Park 5K for Local Schools',
      location: 'Start/finish at Webb Park', neighborhood: 'Webb', community: true,
      organizer: 'Maria Santos', organizerGroup: 'Collier Parents Association',
      approvedAgo: 'three weeks ago', approvedDate: 'June 17, 2026',
      reviewer: 'Amy Medway, Manager\u0027s Office',
      description: 'A family-friendly chip-timed 5K and 1-mile fun run benefiting Collier elementary classroom supplies. Strollers welcome on the fun run. Registration $25 adults, kids free. Water stations and post-race snacks provided.',
      attending: 47
    }
  ];

  // Resident event requests (Jane's submissions). Statuses: Submitted / Under Review / Needs more info / Approved / Declined
  const eventRequests = [
    {
      id: 'REQ-2026-0142',
      kind: 'eventRequest',
      name: 'Nevillewood Block Cleanup Day',
      eventDate: 'Saturday, August 16, 2026',
      eventTime: '9:00 AM - 12:00 PM',
      submitted: 'July 12, 2026',
      status: 'Needs more info',
      locationName: 'Nevillewood entrance & common areas',
      descr: 'Our annual neighborhood cleanup. Neighbors meet at the Nevillewood entrance, split into teams, and clear litter and overgrowth along the main roads and common areas. Bags and gloves provided. Kids welcome with a parent. We finish with coffee and donuts donated by Grist House.',
      organizerType: 'group',
      organizerGroup: 'Nevillewood neighbors (informal)',
      attendance: '25 to 100',
      openToPublic: 'Yes, anyone in Collier can come',
      indoorOutdoor: 'Outdoor',
      rainPlan: 'Rain date the following Saturday, August 23',
      permission: 'Yes, I have permission verbally',
      organizerName: 'Jane Smith',
      organizerEmail: 'jane.smith@example.com',
      organizerPhone: '(412) 555-0188',
      notes: 'Third year running. Jen Murphy in Public Works helped with a debris pickup last year.',
      reviewer: 'Amy Medway, Manager\u0027s Office',
      reviewerNote: 'Hi Jane, thanks for organizing this. Could you let us know whether the township needs to arrange for a Public Works pickup for collected debris, and if so, how much you estimate? Also, do you have a rain date in mind? Reply when you can. Thanks, Amy Medway, Manager\u0027s Office.'
    },
    {
      id: 'REQ-2026-0098',
      kind: 'eventRequest',
      name: 'Backyard Tomato Sale',
      eventDate: 'Saturday, May 24, 2026',
      eventTime: '9:00 AM - 1:00 PM',
      submitted: 'May 8, 2026',
      status: 'Declined',
      locationName: '142 Quail Run Dr (my driveway)',
      descr: 'Selling extra heirloom tomato seedlings from my garden, plus jars of homemade sauce.',
      organizerType: 'individual',
      attendance: 'Under 25 people',
      openToPublic: 'Yes, anyone in Collier can come',
      indoorOutdoor: 'Outdoor',
      permission: 'Yes, I have permission and a confirmation in writing',
      organizerName: 'Jane Smith',
      organizerEmail: 'jane.smith@example.com',
      organizerPhone: '(412) 555-0188',
      notes: '',
      reviewer: 'Amy Medway, Manager\u0027s Office',
      reviewerNote: 'Hi Jane, thanks for the request. This is a one-person commercial sale rather than a community event, and falls outside what we publish on the map. The Collier Farmers Market on Sundays at Township Square might be a great venue, and they accept new vendors. Here is their contact information: market@colliertwp.net. Best, Amy Medway, Manager\u0027s Office.'
    }
  ];

  const notices = [
    { id: 'n0p25', date: '2025-07-04', name: 'Independence Day Parade Road Closure', kind: 'alert', expired: true, dateLabel: 'July 4, 2025', area: 'Township Square to Community Park', body: 'Road closures along the 2025 parade route, 9am-1pm. Roads reopened that afternoon. (This alert has ended and is kept for your records.)' },
    { id: 'n1', date: '2026-07-03', name: 'Trash and recycling delayed by one day for July 4', kind: 'alert', expired: true, dateLabel: 'July 4 (Fri)', area: 'All neighborhoods', body: 'Because of the holiday, trash and recycling pickup are pushed back one day. Friday pickup happens Saturday.' },
    { id: 'n2', date: '2026-07-14', name: 'Brush collection week', kind: 'notice', dateLabel: 'July 14-18', area: 'All neighborhoods', body: 'Place brush curbside by 7am. Branches under 4 inches, bundled, max 4 feet.' },
    { id: 'n3', date: '2026-07-15', name: 'Washington Pike construction begins', kind: 'alert', dateLabel: 'July 15 - Sept 30', area: 'Washington Pike between Boyce and Settlers Ridge', body: 'Crosswalk and flashing beacon construction. Single-lane closures weekdays 9am-3pm. Plan extra time during commute hours.' },
    { id: 'n4', date: '2026-07-21', name: 'Boyce Road resurfacing', kind: 'alert', dateLabel: 'July 21-23', area: 'Boyce Road from Hilltop to Chartiers Creek', body: 'Road closed 7am-4pm each day. Detour via Chartiers Creek Road. Driveways accessible after hours.' },
    { id: 'n5', date: '2026-07-21', name: 'Hilltop Road crack-seal', kind: 'notice', dateLabel: 'Week of July 21', area: 'Hilltop Road, full length', body: 'Brief lane closures during daytime. No detour needed; flaggers will direct traffic.' }
  ];

  const tickets = [
    { id: 'TKT-2026-0817', kind: 'ticket', status: 'In Progress', date: 'June 28, 2026', reviewedDate: 'June 30, 2026', approvedDate: 'July 2, 2026', inProgressDate: 'July 18, 2026', completeBy: 'July 25, 2026', staff: 'Jen Murphy, Public Works', department: 'Public Works', type: 'Pothole / road hazard', location: 'Boyce Road at Hilltop', description: 'Deep pothole at the south corner. Tire impact. Already worse than two weeks ago.', affected: 23, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: null },
    { id: 'TKT-2026-0823', kind: 'ticket', status: 'Received', date: 'July 5, 2026', receivedDate: 'July 5, 2026', staff: 'Amy Medway, Manager\u0027s Office', type: 'Trail or park', location: 'Webb Park, north entrance', description: 'Overgrown brush blocking the trail entrance, especially on the right side.', affected: 6, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: null },
    { id: 'TKT-2026-0840', kind: 'ticket', status: 'Approved for work', date: 'July 1, 2026', scheduledFor: 'the week of July 21', staff: 'Jen Murphy, Public Works', type: 'Lighting', location: 'Hilltop Road near the school', description: 'Two streetlights out along the school walking route. Kids walk this before sunrise in winter.', affected: 14, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: null },
    { id: 'TKT-2026-0838', kind: 'ticket', status: 'In Progress', date: 'June 24, 2026', inProgressDate: 'July 7, 2026', completeBy: 'July 11, 2026', staff: 'Jen Murphy, Public Works', type: 'Trail or park', location: 'Webb Park main loop', description: 'Several washed-out spots on the trail after the June storms.', affected: 9, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: null },
    { id: 'TKT-2026-0846', kind: 'ticket', status: 'Needs more info', date: 'July 9, 2026', staff: 'Amy Medway, Manager\u0027s Office', type: 'Flooding', location: 'Webb Park entrance', description: 'Water collecting near the entrance after rain.', affected: 4, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: null, reviewerNote: 'Hi Jane, thanks for this. Could you let us know whether the water is pooling on the path itself or in the grass alongside, and roughly how big the area is? That will help us decide whether this needs a contractor or just a crew with shovels. Reply when you can. Thanks, Amy Medway, Manager\u0027s Office.' },
    { id: 'TKT-2026-0834', kind: 'ticket', status: 'Resolved', date: 'June 22, 2026', resolvedDate: 'July 2, 2026', staff: 'Jen Murphy, Public Works', department: 'Public Works', type: 'Lighting', location: 'Chartiers Creek Road near 5800', description: 'Streetlight out for about a week. Very dark coming around the bend at night.', affected: 11, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: { staff: 'Jen Murphy, Public Works', body: 'Replaced the failed photocell and confirmed the bulb is working. If you see this come back, please report it again - it\u0027s been the second outage this year so we may swap the whole head this fall.' }, thanks: 4 },
    { id: 'TKT-2026-0801', kind: 'ticket', status: 'Resolved', date: 'May 14, 2026', resolvedDate: 'May 22, 2026', type: 'Property or blight', location: 'Rennerdale common area', description: 'Trash dumping behind the mailboxes again.', affected: 8, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: { staff: 'Code Enforcement', body: 'Removed May 22. We\u0027ll add this spot to the weekly patrol route.' }, thanks: 2 },
    { id: 'TKT-2026-0712', kind: 'ticket', status: 'Resolved', date: 'April 3, 2026', resolvedDate: 'April 11, 2026', type: 'Traffic or pedestrian safety', location: 'Washington Pike at school crossing', description: 'Crossing guard sign knocked over.', affected: 3, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: { staff: 'Public Works', body: 'Sign reinstalled April 11 with a heavier base.' }, thanks: 1 },
    { id: 'TKT-2026-0772', kind: 'ticket', status: 'Declined', date: 'May 9, 2026', reviewedDate: 'May 12, 2026', declinedDate: 'May 13, 2026', staff: 'Amy Medway, Manager\u0027s Office', reviewer: 'Amy Medway, Manager\u0027s Office', type: 'Traffic or pedestrian safety', location: 'Route 50 at Washington Pike', description: 'The left-turn signal cycles too fast - only two or three cars get through before it turns red. Backs up badly at rush hour.', affected: 16, owner: 'Jane', neighborhood: 'Rennerdale', linkedProject: null, response: null, reviewerNote: 'Hi Jane, thanks for the report. The traffic signal at Route 50 and Washington Pike is owned and operated by PennDOT, not by Collier Township. We have forwarded your report to PennDOT\u0027s regional office and you should hear from them within ten business days. If you do not, please let us know and we will follow up. Best, Amy Medway, Manager\u0027s Office.' }
  ];

  // Tickets submitted by other residents (visible on map)
  const otherTickets = [
    { id: 'TKT-2026-0791', status: 'Resolved', date: 'June 28, 2026', resolvedDate: 'July 2, 2026', type: 'Lighting', location: 'Chartiers Creek Road', description: 'Streetlight out near the bridge.', affected: 7, response: { staff: 'Jen Murphy, Public Works', body: 'Bulb replaced July 2.' } },
    { id: 'TKT-2026-0822', status: 'Submitted', date: 'July 6, 2026', type: 'Flooding', location: 'Summit Ridge Road', description: 'Standing water at the cul-de-sac after the June 17 rain. Still there.', affected: 12 },
    { id: 'TKT-2026-0815', status: 'Under Review', date: 'July 4, 2026', type: 'Pothole / road hazard', location: 'Settlers Ridge', description: 'Faded lane markings, hard to see at night.', affected: 9 },
    { id: 'TKT-2026-0808', status: 'Escalated', date: 'May 18, 2026', type: 'Traffic or pedestrian safety', location: 'Washington Pike', description: 'Need a crosswalk near the strip mall - too many near-misses.', affected: 41, linkedProject: 'Washington Pike crosswalks' }
  ];

  // Township projects (orange pins on map)
  const projects = [
    { id: 'pr1', kind: 'project', name: 'Washington Pike crosswalks', status: 'In Construction', neighborhood: 'Webb', location: 'Washington Pike between Boyce and Settlers Ridge', description: 'Three new ADA-compliant crosswalks and a flashing pedestrian beacon. Approved May 19; construction begins July 15.', phase: 'construction', staff: 'Mike Sullivan, Engineering', update: 'Survey markings placed July 6. Construction starts July 15.', updateDate: 'July 6, 2026', phaseUpdated: 'July 6, 2026 · 2:14 PM', phaseHistory: {"Proposed":"Jan 14, 2026 · 6:40 PM","Approved":"May 19, 2026 · 8:05 PM","Design":"June 24, 2026 · 1:30 PM","Bid":"July 2, 2026 · 4:10 PM"} },
    { id: 'pr2', kind: 'project', name: 'Boyce Road stormwater design', status: 'In Design', neighborhood: 'Nevillewood', location: 'Boyce Road corridor', description: 'Design phase of the catch-basin replacement and curb regrading proposal. Construction targeted for spring 2027.', phase: 'design', staff: 'Jen Murphy, Public Works', update: 'Engineering firm Gateway Civil began site survey July 7.', updateDate: 'July 7, 2026', phaseUpdated: 'July 7, 2026 · 9:03 AM', phaseHistory: {"Proposed":"Mar 3, 2026 · 7:15 PM","Approved":"June 9, 2026 · 7:50 PM"} },
    { id: 'pr3', kind: 'project', name: 'Hilltop Park Expansion', status: 'In Design', neighborhood: 'Hilltop', location: 'Hilltop Park, north 4 acres', description: 'Park expansion with pickleball, accessible playground, ADA pavilion, trails, and parking. Design selection August 15.', phase: 'design', staff: 'Rita Chen, Parks & Rec', update: 'Three design firms shortlisted. Public review of design boards posted July 8.', updateDate: 'July 8, 2026', phaseUpdated: 'July 8, 2026 · 4:35 PM', phaseHistory: {"Proposed":"Feb 4, 2026 · 7:00 PM","Approved":"May 19, 2026 · 8:20 PM"} },
    { id: 'pr4', kind: 'project', name: 'Settlers Ridge sidewalk repair', status: 'In Construction', neighborhood: 'Settlers Point', location: 'Settlers Ridge Road, west side', description: 'Repair of 600 feet of cracked sidewalk with ADA-compliant curb cuts.', phase: 'construction', staff: 'Jen Murphy, Public Works', update: 'Concrete pour completed July 5. Curing through July 10.', updateDate: 'July 5, 2026', phaseUpdated: 'July 5, 2026 · 11:20 AM', phaseHistory: {"Proposed":"Nov 12, 2025 · 6:30 PM","Approved":"Feb 17, 2026 · 7:45 PM","Design":"Apr 30, 2026 · 2:00 PM","Bid":"June 11, 2026 · 3:25 PM"} },
    { id: 'pr5', kind: 'project', name: 'Webb Park trail improvement', status: 'In Design', neighborhood: 'Webb', location: 'Webb Park, main loop', description: 'Resurfacing of the 1.2-mile main trail loop and addition of two benches and a small bridge replacement.', phase: 'design', staff: 'Rita Chen, Parks & Rec', update: 'Trail survey completed June 28.', updateDate: 'June 28, 2026', phaseUpdated: 'June 28, 2026 · 3:48 PM', phaseHistory: {"Proposed":"Mar 18, 2026 · 6:55 PM","Approved":"June 2, 2026 · 8:10 PM"} },
    { id: 'pr6', kind: 'project', name: 'Chartiers Creek bridge inspection', status: 'Inspection underway', neighborhood: 'Nevillewood', location: 'Chartiers Creek Road bridge', description: 'Routine 5-year structural inspection.', phase: 'design', staff: 'Mike Sullivan, Engineering', update: 'Inspection scheduled for July 22.', updateDate: 'July 6, 2026', phaseUpdated: 'July 6, 2026 · 10:05 AM', phaseHistory: {"Proposed":"Apr 1, 2026 · 5:20 PM","Approved":"June 16, 2026 · 7:30 PM"} }
  ];

  const bingoCard = [
    // row 0
    { id: 'b00', label: 'Park usage rating', done: true },
    { id: 'b01', label: 'Trail conditions', done: false, points: 15 },
    { id: 'b02', label: 'Snow removal rating', done: false, points: 15 },
    { id: 'b03', label: 'Coffee with Manager attended', done: false, points: 25 },
    { id: 'b04', label: 'Police interaction rating', done: false, points: 15 },
    // row 1
    { id: 'b10', label: 'Library usage', done: false, points: 10 },
    { id: 'b11', label: 'Township meeting attended', done: true },
    { id: 'b12', label: 'Senior services awareness', done: false, points: 15 },
    { id: 'b13', label: 'Newsletter readership', done: false, points: 10 },
    { id: 'b14', label: 'Emergency alert feedback', done: false, points: 15 },
    // row 2
    { id: 'b20', label: 'Recycling habits', done: true },
    { id: 'b21', label: 'Stormwater concerns', done: false, points: 15 },
    { id: 'b22', label: 'Free square', done: true, freeSquare: true },
    { id: 'b23', label: 'Township Website Feedback', done: false, points: 15, highlight: true },
    { id: 'b24', label: 'Community event ideas', done: false, points: 20 },
    // row 3
    { id: 'b30', label: 'Volunteer interest', done: false, points: 20 },
    { id: 'b31', label: 'Yard waste pickup', done: false, points: 10 },
    { id: 'b32', label: 'Neighborhood watch?', done: false, points: 15 },
    { id: 'b33', label: 'Bus stop usage', done: false, points: 10 },
    { id: 'b34', label: 'Parks event ideas', done: false, points: 15 },
    // row 4
    { id: 'b40', label: 'Tree planting interest', done: false, points: 15 },
    { id: 'b41', label: 'Sidewalk condition rating', done: false, points: 15 },
    { id: 'b42', label: 'Cell coverage rating', done: false, points: 10 },
    { id: 'b43', label: 'Local business shoutout', done: false, points: 10 },
    { id: 'b44', label: 'Three-words feedback', done: false, points: 25 }
  ];

  const badges = [
    { id: 'b_first', name: 'First Step', desc: 'Complete the onboarding quiz.', earned: true, earnedDate: 'June 3, 2026' },
    { id: 'b_heard', name: 'Heard', desc: 'Submit your first feedback comment on a proposal.', earned: true, earnedDate: 'June 8, 2026' },
    { id: 'b_show', name: 'Show Up', desc: 'RSVP to a township event.', earned: true, earnedDate: 'June 12, 2026' },
    { id: 'b_blaze', name: 'Trail Blazer', desc: 'Report a trail or park issue.', earned: true, earnedDate: 'June 19, 2026' },
    { id: 'b_record', name: 'On the Record', desc: 'Have a comment featured in a township response.', earned: true, earnedDate: 'June 22, 2026' },
    { id: 'b_neighbor', name: 'Neighbor', desc: 'Follow 5 items in your neighborhood.', earned: true, earnedDate: 'July 5, 2026', recent: true },
    { id: 'b_five', name: 'Five-for-Five', desc: 'Complete five Earn Points activities in a single period.', earned: false, dest: 'speak/earn' },
    { id: 'b_civic', name: 'Civic Reader', desc: 'Read 3 proposals end to end.', earned: false, dest: 'decide' },
    { id: 'b_voice', name: 'Voice', desc: 'Submit feedback on 3 different proposals.', earned: false, dest: 'decide' },
    { id: 'b_attend', name: 'Regular', desc: 'Attend 3 township events in a quarter.', earned: false, dest: 'happening' },
    { id: 'b_starter', name: 'Conversation Starter', desc: 'Start a comment thread that gets 10+ reactions.', earned: false, dest: 'decide' },
    { id: 'b_repeat', name: 'Comeback', desc: 'Log in three weeks in a row.', earned: false, dest: 'home' },
    { id: 'b_referral', name: 'Recruiter', desc: 'Refer a neighbor who joins and verifies.', earned: false, dest: 'speak/home' },
    { id: 'b_quiz', name: 'Self-Aware', desc: 'Retake the quiz to refresh your archetype.', earned: false, dest: 'me/profile' },
    { id: 'b_thanks', name: 'Gracious', desc: 'Leave a thank-you on a resolved ticket.', earned: false, dest: 'me/issues' },
    { id: 'b_helper', name: 'Helper', desc: 'React to 10 neighbor comments.', earned: false, dest: 'decide' },
    { id: 'b_local', name: 'Local Champion', desc: 'Redeem a reward at a local business.', earned: false, dest: 'speak/rewards' },
    { id: 'b_full', name: 'Full Slate', desc: 'Complete twenty Earn Points activities.', earned: false, dest: 'speak/earn' },
    { id: 'b_builder', name: 'Community Builder', desc: 'Have a community event you organized reach 25 RSVPs.', earned: false, dest: 'happening' }
  ];

  const rewards = [
    { id: 'rw1', name: 'Grist House free drip coffee', business: 'Grist House Coffee Roasters', cost: 100, tier: 'Contributor', desc: 'One free 12-oz drip coffee at the Bridgeville Grist House location.', expiry: 'Voucher valid 30 days from redemption.', logo: '\u2615' },
    { id: 'rw2', name: 'Pittsburgh Bottleshop 15% off', business: 'Pittsburgh Bottleshop', cost: 100, tier: 'Contributor', desc: '15% off your next purchase (excluding sale items and growler fills).', expiry: 'Voucher valid 60 days from redemption.', logo: '\ud83c\udf7a' },
    { id: 'rw3', name: 'Free Senior Lunch admission', business: 'Collier Senior Center', cost: 125, tier: 'Contributor', desc: 'One admission to the monthly Senior Lunch - entree + drink included.', expiry: 'Valid for the next scheduled lunch.', logo: '\ud83c\udf7d\ufe0f' },
    { id: 'rw4', name: 'Collier Fest food truck voucher', business: 'Collier Fest (Aug 23)', cost: 150, tier: 'Contributor', desc: '$10 food truck voucher, good at any participating Collier Fest truck.', expiry: 'Valid August 23 only.', logo: '\ud83c\udf2e' },
    { id: 'rw5', name: 'Summer Concert food voucher', business: 'Summer Concert series', cost: 150, tier: 'Contributor', desc: '$10 food voucher at the on-site truck at any Summer Concert.', expiry: 'Valid through Sept 5, 2026.', logo: '\ud83c\udfb7' },
    { id: 'rw6', name: 'Priority Parks & Rec registration', business: 'Collier Parks & Rec', cost: 200, tier: 'Contributor', desc: 'Register for one fall Parks & Rec program one day before public registration opens.', expiry: 'Valid for fall 2026 registration.', logo: '\u26be' },
    { id: 'rw7', name: '20% off Washington Pike businesses', business: 'Participating Washington Pike businesses', cost: 300, tier: 'Champion', desc: 'A pooled 20% discount at participating businesses on Washington Pike.', expiry: 'Valid 60 days.', logo: '\ud83c\udfea', locked: true },
    { id: 'rw8', name: 'Private library room booking', business: 'Collier Branch Library', cost: 350, tier: 'Champion', desc: 'Reserve the small meeting room for up to 2 hours.', expiry: 'Booking required within 30 days.', logo: '\ud83d\udcda', locked: true }
  ];

  // Pre-redeemed reward records
  const myRewards = [
    { id: 'mr1', name: 'Pittsburgh Bottleshop 15% off', business: 'Pittsburgh Bottleshop', code: 'COLLIER-BOTL-2026-3M9V', status: 'Active', redeemed: 'June 15, 2026', expires: 'August 14, 2026' },
    { id: 'mr2', name: 'Grist House free drip coffee', business: 'Grist House Coffee Roasters', code: 'COLLIER-GRIST-2026-8K2R', status: 'Used', redeemed: 'May 2, 2026', expires: 'June 1, 2026' }
  ];

  // === Five resident archetypes (assigned by the onboarding quiz) ===
  // topics      → digest topic vocabulary (matches ProfilePrefs allTopics)
  // categories  → the five proposal categories pre-checked in onboarding Phase 2.8
  // notifChannel/notifFreq → sensible Phase 2.9 defaults
  // preview     → 3-4 "here's what we recommend showing you" lines on the reveal
  const archetypes = {
    'Civic Champion': {
      name: 'Civic Champion',
      desc: 'You show up, speak up, and rarely miss a meeting. You care about the policy details, the votes, the long-term direction of the township. We\u0027ll keep you in the loop on decisions and give you ways to track them stage by stage.',
      topics: ['Active proposals', 'Board meetings', 'Road and Traffic', 'Taxes and Budget'],
      categories: ['Parks and Recreation', 'Traffic and Safety', 'Zoning and Planning', 'Infrastructure', 'Public Safety'],
      notifChannel: 'Email', notifFreq: 'Real-time',
      preview: ['Active proposals open for feedback', 'Upcoming board meetings', 'Decisions in the design phase']
    },
    'Newcomer': {
      name: 'Newcomer',
      desc: 'You\u0027re getting settled in. You want a clear sense of what\u0027s happening without spending hours on it. We\u0027ll keep things focused on the essentials and help you find what you need fast.',
      topics: ['Family events', 'Parks and Recreation', 'Road and Traffic'],
      categories: ['Parks and Recreation', 'Traffic and Safety'],
      notifChannel: 'Email', notifFreq: 'Weekly digest',
      preview: ['What\u0027s happening near you', 'This week\u0027s 2-minute poll', 'A proposal that affects your neighborhood']
    },
    'Quiet Supporter': {
      name: 'Quiet Supporter',
      desc: 'You like to stay informed without spending much time on it. We\u0027ll send you a weekly digest with what mattered most, and let you opt in to more if you ever want to.',
      topics: ['Weekly digest', 'Parks and Recreation', 'Trails and environment'],
      categories: ['Parks and Recreation', 'Infrastructure'],
      notifChannel: 'Email', notifFreq: 'Weekly digest',
      preview: ['A light weekly digest', 'Follow items without commenting', 'What the township decided this month']
    },
    'Event-Goer': {
      name: 'Event-Goer',
      desc: 'You like the community side of Collier: events, gatherings, things to do with neighbors. We\u0027ll make sure you never miss a concert, a parade, or a family-friendly event in your area.',
      topics: ['Family events', 'Parks and Recreation', 'Trails and environment'],
      categories: ['Parks and Recreation'],
      notifChannel: 'Email', notifFreq: 'Daily digest',
      preview: ['Upcoming concerts and events', 'Family-friendly happenings', 'RSVP to events near you']
    },
    'Watchdog': {
      name: 'Watchdog',
      desc: 'You want accountability. You want to track specific decisions and verify that the township follows through. We\u0027ll give you the tools to follow individual items closely and see the township\u0027s responses in writing.',
      topics: ['Active proposals', 'Taxes and Budget', 'Safety and Police'],
      categories: ['Public Safety', 'Zoning and Planning', 'Infrastructure'],
      notifChannel: 'Push notifications', notifFreq: 'Real-time',
      preview: ['Track decisions stage by stage', 'Township responses, in writing', 'Follow specific tickets and projects']
    }
  };

  // For You feed composition per archetype (string ids resolved by Home / DesktopHomeLayout)
  const forYouFeeds = {
    'Civic Champion': ['p1', 'p2', 'e7', 'poll', 'n3'],
    'Newcomer': ['e6', 'p3', 'poll', 'n2', 'pr1'],
    'Quiet Supporter': ['n2', 'e3', 'pr5', 'p3', 'poll'],
    'Event-Goer': ['e6', 'e3', 'e10', 'e5', 'poll'],
    'Watchdog': ['pr1', 'p2', 'p3', 'n3', 'poll']
  };

  // Valid Collier Township (and immediately adjacent) zip codes for verification.
  const validZips = ['15142', '15106', '15017', '15071', '15057'];

  // === Onboarding spotlight tour ===
  // Two step types, interleaved so residents learn navigation by doing:
  //   type 'feature' → highlights a feature, explains it, advances on the "Got it" button.
  //   type 'nav'     → highlights a navigation element; advances only when the resident TAPS it
  //                    (the tap also performs the real navigation). No primary button.
  // Each step: { id, type, target (data-tour key), title, body }.
  // If a target can't be found at runtime the tooltip centers (feature) or shows a Continue
  // fallback (nav) so the tour can never trap the resident.
  const tourUniversal = [
    { id: 'U1', type: 'feature', target: 'response-strip', title: 'The response loop', body: 'Township staff respond publicly to your input. Every month, what residents share becomes named, public responses from staff - right here on Home.' },
    { id: 'U2', type: 'nav', target: 'nav-happening', title: 'Find what\u0027s happening', body: 'Tap What\u0027s happening to see the map and learn how to submit a ticket.' },
    { id: 'U3', type: 'feature', target: 'submit-ticket', title: 'Submit a ticket', body: 'See something to report - a pothole, a broken light? Submit a ticket sends it to the township. You can follow your ticket through 6 stages, and staff respond by name.' },
    { id: 'U4', type: 'nav', target: 'nav-me', title: 'Your settings live in Profile', body: 'Tap Profile to see your notification settings.' },
    { id: 'U5', type: 'feature', target: 'notif-row', title: 'Notification settings', body: 'Change how often and through what channel you hear from us anytime - email, text, push, or off. We set sensible defaults during setup, but it\u0027s all adjustable.' }
  ];

  const tourByArchetype = {
    'Civic Champion': [
      { id: 'CC-1', type: 'nav', target: 'nav-decide', title: 'Where decisions live', body: 'Civic Champions live here. Tap What\u0027s being decided to see active proposals.' },
      { id: 'CC-2', type: 'feature', target: 'cat-chips', title: 'Browse by category', body: 'Active proposals are tagged by category: Parks and Recreation, Traffic and Safety, Zoning and Planning, Infrastructure, and Public Safety. This is your home base.' },
      { id: 'CC-3', type: 'feature', target: 'cat-chips', title: 'Follow a category', body: 'Tap the star on any category chip to follow it - you\u0027ll be notified whenever a new proposal in that category opens. The neighborhood dropdown works the same way.' },
      { id: 'CC-4', type: 'nav', target: 'proposal-card', title: 'Open a proposal', body: 'Let\u0027s look inside one. Tap the Expanded recycling pickup proposal.' },
      { id: 'CC-5', type: 'nav', target: 'ptab-timeline', title: 'See the decision history', body: 'Tap the Timeline tab to see the proposal\u0027s stages.' },
      { id: 'CC-6', type: 'feature', target: 'proposal-timeline', title: 'Comment stage by stage', body: 'Every stage has its own comment thread. You can react to a specific moment in the decision, and staff often respond stage by stage. Tap any stage to expand it.' },
      { id: 'CC-7', type: 'feature', target: 'proposal-follow', title: 'Follow a proposal', body: 'Tap Follow to be notified at each stage change - how Civic Champions track proposals start to finish without checking back constantly.' }
    ],
    'Newcomer': [
      { id: 'NC-1', type: 'nav', target: 'nav-home', title: 'Back to Home', body: 'Let\u0027s head back to Home. Tap the Home tab.' },
      { id: 'NC-2', type: 'feature', target: 'mainnav', title: 'Getting around', body: 'These tabs are how you move around: Home, What\u0027s happening, What\u0027s being decided, How to engage, and Me. You\u0027ll use Home and What\u0027s happening most as a Newcomer.' },
      { id: 'NC-3', type: 'feature', target: 'foryou', title: 'Your For You feed', body: 'This is your personalized feed, based on the quiz. The more you engage, the better it gets at recommending things.' },
      { id: 'NC-4', type: 'nav', target: 'nav-me', title: 'Where help lives', body: 'Tap Profile to see where help lives.' },
      { id: 'NC-5', type: 'feature', target: 'help-row', title: 'Help and contact', body: 'Stuck? Help and contact has answers, plus a phone number to call the township directly. There\u0027s always a person on the other end.' },
      { id: 'NC-6', type: 'feature', target: 'help-row', title: 'Community guidelines', body: 'Before you comment for the first time, peek at the Community Guidelines (inside Help, and linked at the bottom of every page). They help everyone post in ways that get a response.' }
    ],
    'Quiet Supporter': [
      { id: 'QS-1', type: 'feature', target: 'notif-row', title: 'The weekly digest', body: 'Quiet Supporters spend most of their time here. The weekly digest is the lightest touch: one email a week with what mattered most. Set it once and forget it.' },
      { id: 'QS-2', type: 'nav', target: 'followed-row', title: 'Track things quietly', body: 'Tap My followed items to see how you can track things without commenting.' },
      { id: 'QS-3', type: 'feature', target: 'followed-list', title: 'Everything you follow', body: 'Everything you follow lives here. You can follow proposals, projects, or notices without ever commenting. The platform respects passive participation.' },
      { id: 'QS-4', type: 'nav', target: 'nav-happening', title: 'One more thing', body: 'Tap What\u0027s happening.' },
      { id: 'QS-5', type: 'nav', target: 'view-calendar', title: 'Switch to Calendar', body: 'Tap Calendar to switch views.' },
      { id: 'QS-6', type: 'feature', target: 'cal-subscribe', title: 'Subscribe and forget', body: 'Prefer everything in your Google or Apple Calendar? Subscribe once and never open the app - the township calendar updates itself in your existing app. The lightest-touch way to stay informed.' }
    ],
    'Event-Goer': [
      { id: 'EG-1', type: 'nav', target: 'nav-happening', title: 'Where the events are', body: 'Event-Goers spend most of their time on What\u0027s happening. Tap it.' },
      { id: 'EG-2', type: 'feature', target: 'happening-views', title: 'Three ways to browse', body: 'Map for geographic browsing, Calendar for date browsing, List for plain chronological. Event-Goers usually prefer Calendar or List.' },
      { id: 'EG-3', type: 'nav', target: 'view-list', title: 'See the list', body: 'Tap List to see everything chronologically.' },
      { id: 'EG-4', type: 'feature', target: 'event-card', title: 'Details and RSVP', body: 'Tap any event to see details, RSVP (Yes / Maybe / Can\u0027t make it), and add it to your calendar. RSVPing earns Engages points if you opted in, and helps the township plan capacity.' }
    ],
    'Watchdog': [
      { id: 'WD-1', type: 'nav', target: 'mysubmitted-row', title: 'Your audit trail', body: 'Watchdogs track specific items. Tap My submitted items.' },
      { id: 'WD-2', type: 'nav', target: 'item-ticket', title: 'Open a ticket', body: 'Tap a ticket to see it in full detail.' },
      { id: 'WD-3', type: 'feature', target: 'ticket-phases', title: 'Six stages, on the record', body: 'Every ticket moves through 6 stages - Submitted, Received, Approved, Planning, In progress, Resolved - or it\u0027s Declined with an explanation. This is your audit trail.' },
      { id: 'WD-4', type: 'feature', target: 'ticket-follow', title: 'Follow anything', body: 'Tap Follow on anything you want to track - you\u0027re notified at every stage change. The info icon next to Follow tells you exactly what to expect.' }
    ]
  };

  // === Phase 4: contextual first-visit tips ===
  const contextualTips = {
    speak: { title: 'How to engage', body: 'Browse activities you can do to engage, see your badges, and check rewards if you opted into Engages. Start with the Active opportunities at the top.' },
    calendar: { title: 'Calendar view', body: 'Browse by month, and tap any day to see events, projects, and notices scheduled for that day.' },
    proposalDetail: { title: 'Proposal detail', body: 'Tabs at the top: Overview for the summary, Timeline to see how decisions evolve, Documents for source files, Discussion for comments from neighbors.' },
    earn: { title: 'Earn points', body: 'Every activity earns points if you\u0027re in Engages. Filter for Quick wins under 5 minutes if you want low-effort options.' },
    leaderboard: { title: 'Leaderboard', body: 'We rank neighborhoods by average points per household, not raw totals - so smaller neighborhoods can win. Tap \u0022How is this calculated?\u0022 to see the rules.' },
    myItems: { title: 'My submitted items', body: 'Tickets and event requests you\u0027ve created. Filter at the top to switch between them.' },
    myFollowed: { title: 'My followed items', body: 'Everything you follow, grouped by type. Tap the gear next to any item to change notification settings just for that one.' },
    discussion: { title: 'Discussion', body: 'Comments from neighbors plus responses from township staff. Tap any comment to reply. Staff comments are amber so you can spot them easily.' }
  };

  const neighborhoods = ['Beechmont', 'Ewingsville', 'Fort Pitt', 'Hickman', 'Kirwan Heights', 'Nevillewood', 'Presto', 'Rennerdale', 'Walkers Mill'];

  // === Onboarding quiz: the 5 resident avatars ============================
  // Visible identity assigned by the 8-question quiz. Each maps to an existing
  // personalization archetype (used by the For You feed, tour, and notifications)
  // and carries a preferred event-category order for the reveal screen.
  const avatars = {
    'Leading Lion': {
      key: 'Leading Lion', emoji: '\uD83E\uDD81', percent: 8, archetype: 'Civic Champion',
      desc: 'You\u0027re a civic leader who shows up and speaks up. You attend meetings, advocate for important issues, and help shape our community\u0027s future. Your voice matters and makes a difference.',
      recs: [
        'Attend Manager\u0027s Coffee Hours for direct dialogue',
        'Join the Planning Commission or Zoning Hearing Board',
        'Share your expertise at Board of Commissioners Meetings',
        'Connect with other civic leaders in the community'
      ],
      eventCats: ['civic']
    },
    'Busy Bee': {
      key: 'Busy Bee', emoji: '\uD83D\uDC1D', percent: 12, archetype: 'Event-Goer',
      desc: 'You\u0027re always in motion in the community. You volunteer, help out at events, and pitch in where the township needs hands. Collier runs better because of people like you.',
      recs: [
        'Sign up for Clean Up Day and volunteer events',
        'Help organize Concerts in the Park or the Spring Craft Show',
        'Join the Parks and Recreation volunteer roster',
        'Connect with other volunteers through the township directory'
      ],
      eventCats: ['civic', 'family', 'youth']
    },
    'Social Butterfly': {
      key: 'Social Butterfly', emoji: '\uD83E\uDD8B', percent: 35, archetype: 'Event-Goer',
      desc: 'You love the community side of Collier. You show up to concerts, festivals, and family events, and you keep the township connected through your social presence. You make Collier feel like home.',
      recs: [
        'Browse the events calendar for upcoming concerts and festivals',
        'Follow Collier\u0027s social channels for event announcements',
        'Bring friends and family to community gatherings',
        'Share your favorite Collier moments with neighbors'
      ],
      eventCats: ['family', 'youth', 'civic']
    },
    'Mystical Dragon': {
      key: 'Mystical Dragon', emoji: '\uD83D\uDC09', percent: 5, archetype: 'Watchdog',
      desc: 'You\u0027re an independent voice in the community. You engage on your own terms, often through online discussions and unconventional channels. You bring a different perspective that the township needs to hear.',
      recs: [
        'Submit ideas or feedback through the Speak Up section',
        'Comment on township proposals during public comment periods',
        'Share your perspective in online community discussions',
        'Email staff directly with questions or concerns'
      ],
      eventCats: []
    },
    'Just Getting Started': {
      key: 'Just Getting Started', emoji: '\uD83D\uDE48', percent: 40, archetype: 'Newcomer',
      desc: 'You\u0027re new to engaging with Collier, and that\u0027s okay. There\u0027s no wrong way to start. Even reading this and taking the quiz is a step. We\u0027re glad you\u0027re here.',
      recs: [
        'Browse the events calendar to find something that interests you',
        'Sign up for the monthly newsletter to stay informed',
        'Try attending one event to see what Collier is about',
        'Follow a topic you care about to get updates that matter to you'
      ],
      eventCats: []
    }
  };
  // Comparison-chart row order (top to bottom), verbatim from the spec.
  const avatarComparisonOrder = ['Busy Bee', 'Leading Lion', 'Social Butterfly', 'Mystical Dragon', 'Just Getting Started'];
  // Reverse lookup so the Me section can show an avatar even for a seeded archetype.
  const archetypeToAvatar = { 'Civic Champion': 'Leading Lion', 'Event-Goer': 'Social Butterfly', 'Watchdog': 'Mystical Dragon', 'Newcomer': 'Just Getting Started', 'Quiet Supporter': 'Just Getting Started' };

  // Seeded events shown on the reveal screen (reordered per avatar at render time).
  const quizEvents = [
    { id: 'qe1', name: 'Manager\u0027s Coffee Hour', category: 'civic', date: 'May 20, 2026', time: '9:30 AM', location: 'Township Building', description: 'Meet with township leadership in an informal setting. Ask questions, share ideas, and learn about current initiatives.' },
    { id: 'qe2', name: 'Concerts in the Park', category: 'family', date: 'June through August 2026', time: 'Thursday evenings', location: 'Collier Community Park', description: 'Free live music all summer long. Bring your lawn chairs and enjoy family-friendly entertainment.' },
    { id: 'qe3', name: 'Summer Camp Programs', category: 'youth', date: 'June through August 2026', time: 'Weekdays', location: 'Various locations', description: 'Fun, educational programs for kids of all ages. Sports, arts, crafts, and more.' },
    { id: 'qe4', name: 'Manager\u0027s Coffee Hour', category: 'civic', date: 'August 19, 2026', time: '9:30 AM', location: 'Township Building', description: 'Meet with township leadership in an informal setting.' }
  ];
  const quizEventCatColors = { civic: '#1F3864', family: '#7030A0', youth: '#548235' };

  // Recurring township meetings shown on the reveal screen.
  const regularMeetings = [
    { name: 'Board of Commissioners Meetings', schedule: '2nd and 4th Wednesday, 7:00 PM', description: 'Official township business meetings open to the public.' },
    { name: 'Planning Commission', schedule: '3rd Tuesday, 7:00 PM', description: 'Review development plans and make recommendations.' },
    { name: 'Zoning Hearing Board', schedule: 'As needed', description: 'Hear appeals and requests for zoning variances.' }
  ];

  // Household counts (official township records) used for per-household leaderboard scoring.
  const householdCounts = {
    'Beechmont': 310, 'Ewingsville': 290, 'Fort Pitt': 195, 'Hickman': 220, 'Kirwan Heights': 420,
    'Nevillewood': 240, 'Presto': 380, 'Rennerdale': 560, 'Walkers Mill': 180
  };

  // Adjusted neighborhood leaderboard: ranked by per-household average (avg), not raw totals.
  // spots = how many places the neighborhood moved vs. last month.
  const leaderboard = [
    { neighborhood: 'Nevillewood', avg: 17.5, points: 4210, households: 240, trend: 'up', spots: 2 },
    { neighborhood: 'Walkers Mill', avg: 16.2, points: 2916, households: 180, trend: 'up', spots: 4 },
    { neighborhood: 'Fort Pitt', avg: 15.8, points: 3081, households: 195, trend: 'up', spots: 1 },
    { neighborhood: 'Hickman', avg: 13.4, points: 2948, households: 220, trend: 'flat', spots: 0 },
    { neighborhood: 'Beechmont', avg: 12.8, points: 3968, households: 310, trend: 'up', spots: 1 },
    { neighborhood: 'Ewingsville', avg: 12.5, points: 3625, households: 290, trend: 'flat', spots: 0 },
    { neighborhood: 'Presto', avg: 12.1, points: 4598, households: 380, trend: 'down', spots: 2 },
    { neighborhood: 'Rennerdale', avg: 8.6, points: 4820, households: 560, trend: 'down', spots: 5, isUser: true },
    { neighborhood: 'Kirwan Heights', avg: 7.6, points: 3192, households: 420, trend: 'down', spots: 1 }
  ];

  const individualLeaderboard = [
    { name: 'Collier Resident from Rennerdale', points: 1240 },
    { name: 'Collier Resident from Ewingsville', points: 980 },
    { name: 'Collier Resident from Presto', points: 720 },
    { name: 'Collier Resident from Fort Pitt', points: 510 },
    { name: 'Collier Resident from Rennerdale', points: 340, isUser: true },
    { name: 'Collier Resident from Kirwan Heights', points: 320 },
    { name: 'Collier Resident from Rennerdale', points: 290 },
    { name: 'Collier Resident from Walkers Mill', points: 260 },
    { name: 'Collier Resident from Presto', points: 240 },
    { name: 'Collier Resident from Nevillewood', points: 215 }
  ];

  const activityLog = [
    { date: 'Jul 15', text: 'A post on the Hilltop Park proposal was removed (only venting)' },
    { date: 'Jul 7', text: 'Followed the Hilltop Park Expansion proposal' },
    { date: 'Jul 6', text: 'Reacted to a comment by Collier Resident from Presto' },
    { date: 'Jul 5', text: 'Earned the \u0022On the Record\u0022 badge' },
    { date: 'Jul 5', text: 'Reported an issue: Trail brush near Webb' },
    { date: 'Jul 3', text: 'Read response: Family-friendly evening programming' },
    { date: 'Jun 28', text: 'Reported an issue: Pothole on Boyce Road' },
    { date: 'Jun 25', text: 'Completed activity: Recycling Habits (+15 pts)' },
    { date: 'Jun 22', text: 'Reported an issue: Streetlight on Chartiers Creek' },
    { date: 'Jun 18', text: 'Followed the Summer Concert series' },
    { date: 'Jun 15', text: 'Redeemed Pittsburgh Bottleshop 15% off' },
    { date: 'Jun 10', text: 'Reacted to a township response from Public Works' },
    { date: 'Jun 5', text: 'Completed activity: Township meeting attended (+20 pts)' },
    { date: 'May 30', text: 'Submitted feedback on Hilltop Park Expansion' },
    { date: 'May 14', text: 'Reported an issue: Trash dumping in Rennerdale' },
    { date: 'May 2', text: 'Redeemed Grist House free drip coffee' },
    { date: 'Apr 28', text: 'Completed activity: Park usage rating (+15 pts)' }
  ];

  const followedItems = [
    { kind: 'project', id: 'pr1', name: 'Washington Pike Crosswalks', updated: 'Jul 6' },
    { kind: 'proposal', id: 'p3', name: 'Hilltop Park Expansion', updated: 'Jul 5' },
    { kind: 'event', id: 'e6', name: 'Summer Concert series', updated: 'Jul 1' },
    { kind: 'proposal', id: 'p1', name: 'Expanded recycling pickup', updated: 'Jul 3' },
    { kind: 'project', id: 'pr2', name: 'Boyce Road stormwater design', updated: 'Jul 7' },
    { kind: 'event', id: 'e3', name: 'Movies in the Park', updated: 'Jun 28' },
    { kind: 'ticket', id: 'TKT-2026-0817', name: 'Pothole on Boyce Road (your ticket)', updated: 'Jun 28' },
    { kind: 'project', id: 'pr5', name: 'Webb Park trail improvement', updated: 'Jun 28' }
  ];

  const pollSeed = {
    id: 'poll1',
    question: 'How was last week\u0027s Independence Day Parade?',
    description: 'Quick read so we can plan next year. Pick a rating and add a few words.',
    points: 10,
    labelSet: 'satisfaction'
  };

  // === 5-point Likert label sets (platform-wide rating standard) ===
  const likertSets = {
    satisfaction: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'],
    quality: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'],
    agreement: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
    likelihood: ['Very unlikely', 'Unlikely', 'Maybe', 'Likely', 'Very likely'],
    importance: ['Not at all important', 'Slightly important', 'Moderately important', 'Very important', 'Extremely important']
  };

  // 3-point Likert (deliberate exception for "Was this helpful?")
  const helpfulSet = ['Not helpful', 'Somewhat helpful', 'Very helpful'];

  // === Value-explanation copy (used verbatim across the platform) ===
  const valueCopy = {
    // Speak Up Home gray panel
    block: 'Every action you take here is read by township staff in the first week of each month. Patterns across many residents become themes that get a public response on the home screen. Your specific feedback becomes part of the data that informs decisions, budget conversations, and grant applications. This is how your time turns into actual change.',
    blockLink: 'How this works in detail',
    // Inline reminder above every feedback form
    reminder: 'Your response goes into the township\u0027s monthly review. Staff read every one.',
    reminderLink: 'How your feedback becomes change',
    // Help panel
    helpTitle: 'How your feedback becomes change',
    helpIntro: 'Everything you submit on Collier Connect goes into the same review process. Here is what happens to it.',
    helpSteps: [
      ['In the first week of every month', 'Every activity response, poll answer, rating, comment, and feedback form from the prior month is read by township staff.'],
      ['Patterns become themes', 'When multiple residents flag the same intersection as dangerous, that is a theme. Themes get a public, named response from a township staff member, published on the home screen for everyone to see.'],
      ['Individual feedback gets a direct response when it needs one', 'A specific question or concern that does not fall into a broader pattern may still get a reply, either via email if you opted in, or by appearing on your ticket or comment thread.'],
      ['Data becomes decisions', 'The numbers behind your responses go into the township\u0027s planning process affecting things like budgeting, grant applications, and other decision-making processes. '],
      ['Your time does not disappear into a form', 'It becomes part of how Collier Township operates and what it spends money on. The Township Manager reviews the monthly themes report and sets priorities for the following month based partly on what residents shared.']
    ],
    helpFooter: 'If you ever want to know what happened to a specific submission you made, you can check the status anytime in Profile, under My Submitted Items. Or call the Manager\u0027s Office at (412) 279-2525 and ask. We are happy to walk you through what was done with your input.'
  };

  // === Speak Up Home: active opportunities ===
  const speakUpOpportunities = [
    { id: 'op_website', icon: 'chart', accent: '#2E74B5', title: 'Township Website Feedback', desc: 'Tell us what\u0027s easy to find on the township site and what isn\u0027t.', points: 15, route: { name: 'speak', tab: 'earn', focus: 'a_website' }, cta: 'Do this now', highlight: true },
    { id: 'op_concert', icon: 'cal', accent: '#7030A0', title: 'Summer Concert Series', desc: 'Bridgeville Brass at Community Park, July 26. RSVP, then attend.', pointsLabel: '5 pts to RSVP \u00b7 10 pts to attend', route: { name: 'happening', detail: { kind: 'event', id: 'e6' } }, cta: 'RSVP now' },
    { id: 'op_report', icon: 'warn', accent: '#7030A0', title: 'Submit a ticket', desc: 'Pothole, broken streetlight, downed branch - anything on the map.', points: 20, route: { name: 'speak', screen: 'submit' }, cta: 'Report now' },
    { id: 'op_poll', icon: 'speak', accent: '#ED7D31', title: 'This week\u0027s poll', desc: 'How was the Independence Day Parade? Two-minute read.', points: 10, route: { name: 'speak', screen: 'poll' }, cta: 'Answer now' },
    { id: 'op_refer', icon: 'me', accent: '#548235', title: 'Refer a neighbor', desc: 'Invite a neighbor to Collier Connect. You\u0027ve referred 1 so far.', points: 25, pointsSuffix: 'per converted referral', route: { name: 'placeholder', kind: 'email', label: 'Invite a neighbor to Collier Connect' }, cta: 'Refer now' }
  ];

  // Speak Up Home: most recent three actions
  const speakUpRecent = [
    { text: 'Completed activity: Recycling Habits', date: 'June 25', points: 15 },
    { text: 'Earned the \u0022On the Record\u0022 badge', date: 'June 22', points: 50 },
    { text: 'Followed the Hilltop Park Expansion proposal', date: 'June 20', points: null }
  ];

  // === Earn Points activity list (replaces Bingo) ===
  // category: Feedback | Events | Township meetings | Community
  const earnActivities = [
    // Feedback
    { id: 'a_poll', cat: 'Feedback', name: 'Answer this week\u0027s poll about the Independence Day Parade', desc: 'A quick satisfaction read so we can plan next year.', points: 10, mins: 2, route: { name: 'speak', screen: 'poll' } },
    { id: 'a_website', cat: 'Feedback', name: 'Share your experience with the township website', desc: 'What\u0027s easy to find on colliertownship.net? What isn\u0027t?', points: 15, mins: 3, isNew: true, rating: 'satisfaction' },
    { id: 'a_publicworks', cat: 'Feedback', name: 'Rate your recent interaction with Public Works', desc: 'You had a streetlight resolved on July 2. How did it go?', points: 10, mins: 1, rating: 'satisfaction' },
    { id: 'a_recycling', cat: 'Feedback', name: 'Give feedback on the recycling expansion proposal', desc: 'Twice-monthly curbside pickup. Comment period closes July 25.', points: 20, mins: 5, deadline: 'July 25', route: { name: 'decide', id: 'p1' } },
    { id: 'a_stormwater', cat: 'Feedback', name: 'Give feedback on the Boyce Road stormwater proposal', desc: 'Catch-basin replacement and curb regrading. Open through August 15.', points: 20, mins: 5, deadline: 'August 15', route: { name: 'decide', id: 'p2' } },
    // Events
    { id: 'a_concertrsvp', cat: 'Events', name: 'RSVP to the Summer Concert Series', desc: 'Bridgeville Brass at Community Park Pavilion 2, July 26.', points: 5, mins: 1, minsLabel: '< 1 min', route: { name: 'happening', detail: { kind: 'event', id: 'e6' } } },
    { id: 'a_movies', cat: 'Events', name: 'RSVP and attend Movies in the Park on July 12', desc: 'The Princess Bride. Points awarded for attending.', points: 15, mins: 2, route: { name: 'happening', detail: { kind: 'event', id: 'e3' } } },
    { id: 'a_board708', cat: 'Events', name: 'Attend the July 8 Board of Commissioners meeting', desc: 'Budget update and a Public Works presentation. Public comment at the end.', points: 30, mins: 90, route: { name: 'happening', detail: { kind: 'event', id: 'e2' } } },
    { id: 'a_board728', cat: 'Events', name: 'Attend the July 28 Board meeting for the recycling vote', desc: 'The expanded recycling pickup proposal goes to a vote.', points: 30, mins: 90, route: { name: 'happening', detail: { kind: 'event', id: 'e7' } } },
    // Township meetings
    { id: 'a_agenda', cat: 'Township meetings', name: 'Submit a comment for a future Board agenda', desc: 'Add an item or question to an upcoming Board of Commissioners agenda.', points: 25, mins: 5, route: { name: 'placeholder', kind: 'email', label: 'Submit a comment for a future Board agenda' } },
    { id: 'a_speak', cat: 'Township meetings', name: 'Sign up to speak during public comment at the July 28 meeting', desc: 'Reserve a two-minute slot to address the Board in person.', points: 15, mins: 1, route: { name: 'placeholder', kind: 'email', label: 'Sign up to speak at the July 28 meeting' } },
    // Community
    { id: 'a_refer', cat: 'Community', name: 'Refer a neighbor to the platform', desc: 'Per converted referral. You\u0027ve referred 1 so far.', points: 25, mins: 2, pointsSuffix: 'per referral', route: { name: 'placeholder', kind: 'email', label: 'Invite a neighbor to Collier Connect' } },
    { id: 'a_5k', cat: 'Community', name: 'Volunteer at the Webb Park 5K on August 9', desc: 'Benefiting Collier elementary classroom supplies. Sign-up through the organizer.', points: 50, mins: null, minsLabel: 'Sign-up required', route: { name: 'happening', detail: { kind: 'event', id: 'ce3' } } },
    { id: 'a_report', cat: 'Community', name: 'Submit a ticket on the map', desc: 'Pothole, lighting, flooding, trail, anything. Repeatable weekly.', points: 20, mins: 4, minsLabel: '3-5 min', route: { name: 'speak', screen: 'submit' } },
    { id: 'a_eventreq', cat: 'Community', name: 'Request a community event for the map', desc: 'Propose a neighborhood event for township review and listing.', points: 25, mins: 10, route: { name: 'eventRequest' } },
    // Platform feedback
    { id: 'a_rules', cat: 'Platform feedback', name: 'Give feedback on platform rules (such as how the leaderboard works)', desc: 'Have thoughts on how the leaderboard, points, badges, or other platform rules work? We review feedback every six months and update the rules when residents make good cases for change.', points: 15, mins: 5, route: { name: 'speak', screen: 'rules' } }
  ];

  // Activities Jane has already completed this period (rendered at the bottom with a Done label)
  const completedActivityIds = [];

  const user = {
    name: 'Jane Smith',
    initial: 'J',
    email: 'jane.smith@example.com',
    neighborhood: 'Rennerdale',
    memberSince: 'June 2026',
    archetype: 'Newcomer',
    topics: ['Family events', 'Parks and Recreation', 'Road and Traffic'],
    displayName: 'Collier Resident from Rennerdale',
    digest: 'Weekly',
    smsPref: 'Emergencies only',
    points: 340,
    tier: 'Contributor',
    nextTier: 'Champion',
    pointsToNext: 160,
    address: '142 Quail Run Dr, Presto, PA 15142'
  };

  const notifications = [
    {
      id: 'nt0', unread: true, category: 'following', accent: '#7030A0',
      title: 'New Parks and Recreation proposal',
      body: 'Webb Park Community Garden Plots. Feedback open through August 10. (You follow Parks and Recreation.)',
      time: '4 days ago',
      action: { kind: 'decide', id: 'p4' }
    },
    {
      id: 'nt1', unread: true, category: 'earn', accent: '#1F3864',
      title: 'New way to earn points',
      body: 'This week\u0027s poll about the Independence Day Parade is open. Worth 10 points. Takes about 2 minutes.',
      bodyNoPoints: 'New activity available: this week\u0027s poll about the Independence Day Parade is open. Takes about 2 minutes.',
      time: '2 hours ago',
      action: { kind: 'poll' }
    },
    {
      id: 'nt2', unread: true, category: 'township', accent: '#D4A017',
      title: 'Township response',
      body: 'Amy Medway responded to your feedback on the recycling proposal.',
      time: '6 hours ago',
      action: { kind: 'decide', id: 'p1' }
    },
    {
      id: 'nt3', unread: true, category: 'activity', accent: '#548235',
      title: 'Your ticket was approved',
      body: 'Your ticket about the pothole on Boyce Road was approved to be worked on. Public Works has it scheduled for the week of July 21.',
      time: '1 day ago',
      action: { kind: 'ticket', id: 'TKT-2026-0817' }
    },
    {
      id: 'nt4', unread: false, category: 'following', accent: '#2E74B5',
      title: 'Proposal advanced',
      body: 'The Hilltop Park Expansion proposal advanced to the Design Phase.',
      time: '2 days ago',
      action: { kind: 'decide', id: 'p3' }
    },
    {
      id: 'nt5', unread: false, category: 'earn', accent: '#1F3864',
      title: 'New way to earn points',
      body: 'The August 9 Webb Park 5K is open for RSVPs. Worth 50 points to volunteer.',
      bodyNoPoints: 'New activity available: the August 9 Webb Park 5K is open for RSVPs.',
      time: '3 days ago',
      action: { kind: 'event', id: 'ce3' }
    },
    {
      id: 'nt6', unread: false, category: 'township', accent: '#D4A017',
      title: 'Service reminder',
      body: 'Reminder: trash and recycling delayed by one day for July 4.',
      time: '4 days ago',
      action: { kind: 'notice', id: 'n1' }
    }
  ];
  // Round 4: distribute seeded ticket attribution. Only two tickets are Jane's; the rest
  // belong to other residents so the map reads as a populated community, not a personal sandbox.
  const JANE_TICKET_IDS = { 'TKT-2026-0817': true, 'TKT-2026-0772': true };
  const OTHER_TICKET_SUBMITTERS = {
    'TKT-2026-0823': 'Tom from Ewingsville',
    'TKT-2026-0840': 'Collier Resident from Presto',
    'TKT-2026-0838': 'Collier Resident from Walkers Mill',
    'TKT-2026-0846': 'Carol from Presto',
    'TKT-2026-0834': 'Anonymous Collier Resident',
    'TKT-2026-0801': 'Collier Resident from Rennerdale',
    'TKT-2026-0712': 'Collier Resident from Fort Pitt'
  };
  tickets.forEach(t => {
    if (JANE_TICKET_IDS[t.id]) { t.owner = 'Jane'; t.mine = true; }
    else {
      t.mine = false;
      t.submittedBy = OTHER_TICKET_SUBMITTERS[t.id] || ('Collier Resident from ' + (t.neighborhood || 'Collier'));
      t.owner = t.submittedBy;
      // Re-address any reviewer salutation to the actual submitter (e.g. "Hi Jane," -> "Hi Carol,")
      if (t.reviewerNote) t.reviewerNote = t.reviewerNote.replace('Hi Jane,', 'Hi ' + t.submittedBy.split(' ')[0] + ',');
    }
  });

  return {
    responses, proposals, events, communityEvents, eventRequests, notices, tickets, otherTickets, projects,
    bingoCard, badges, rewards, myRewards, archetypes, neighborhoods,
    leaderboard, individualLeaderboard, activityLog, followedItems,
    pollSeed, user, notifications, householdCounts,
    likertSets, helpfulSet, valueCopy, speakUpOpportunities, speakUpRecent, earnActivities, completedActivityIds,
    forYouFeeds, validZips, tourUniversal, tourByArchetype, contextualTips,
    avatars, avatarComparisonOrder, archetypeToAvatar, quizEvents, quizEventCatColors, regularMeetings
  };
})();
