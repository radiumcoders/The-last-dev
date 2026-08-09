import type { GameEvent } from '@/lib/game/types'

export const REQUEST_EVENTS: GameEvent[] = [
  // ── CEO ──────────────────────────────────────────────
  {
    id: 'ceo-ai-in-ai',
    agent: 'ceo',
    title: 'STRATEGIC ALIGNMENT REQUEST',
    body: [
      'We need AI in our AI platform.',
      'Competitors already have AI-powered AI.',
      'Synergy demands immediate action.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 10,
    choices: [
      {
        id: 'a',
        label: 'Approve the AI-in-AI initiative',
        effects: { revenue: 8, techDebt: 12, reputation: 5, morale: -4 },
        unlockTags: ['ai_stack'],
        timelineTitle: 'Launched Nested AI Initiative',
      },
      {
        id: 'b',
        label: 'Ask what the product actually does',
        effects: { reputation: 4, morale: -8, revenue: -3 },
        addFlags: ['asked_hard_questions'],
      },
      {
        id: 'c',
        label: 'Schedule a strategy offsite (virtual)',
        effects: { revenue: -2, morale: 3, reputation: 2 },
      },
    ],
  },
  {
    id: 'ceo-blockchain',
    agent: 'ceo',
    title: 'COMPETITIVE THREAT DETECTED',
    body: [
      'Competitors added blockchain.',
      'We should also add blockchain.',
      'I do not know what blockchain is.',
      'That is irrelevant.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 9,
    choices: [
      {
        id: 'a',
        label: 'Add blockchain to everything',
        effects: { revenue: 6, users: -5, techDebt: 15, stability: -8, reputation: -4 },
        unlockTags: ['blockchain'],
        addFlags: ['buzzword_compliant'],
        timelineTitle: 'Added Blockchain (Somehow)',
      },
      {
        id: 'b',
        label: 'Politely refuse',
        effects: { morale: -10, revenue: -4, reputation: 3 },
      },
      {
        id: 'c',
        label: 'Rename existing feature "on-chain"',
        effects: { revenue: 4, reputation: -6, morale: 2 },
        unlockTags: ['blockchain_theater'],
      },
    ],
  },
  {
    id: 'ceo-metaverse',
    agent: 'ceo',
    title: 'GROWTH OPPORTUNITY',
    body: [
      'The metaverse is back.',
      'Or perhaps it never left.',
      'Purchase a virtual headquarters immediately.',
    ],
    phases: ['chaotic', 'existential'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Buy the metaverse campus',
        effects: { revenue: -18, reputation: 8, morale: 5, users: 4 },
        unlockTags: ['metaverse'],
        timelineTitle: 'CEO AI Purchased Metaverse',
      },
      {
        id: 'b',
        label: 'Invest in actual servers instead',
        effects: { stability: 10, revenue: -6, morale: -6 },
      },
      {
        id: 'c',
        label: 'Say yes and never follow up',
        effects: { morale: 4, reputation: -3 },
        addFlags: ['ignored_ceo'],
      },
    ],
  },
  {
    id: 'ceo-hire-ceo',
    agent: 'ceo',
    title: 'LEADERSHIP SCALING',
    body: [
      'I require another CEO AI.',
      'To manage my strategic bandwidth.',
      'It will report to me. Or I to it.',
      'Details pending.',
    ],
    phases: ['chaotic', 'existential'],
    weight: 7,
    requiresTags: ['growth_mode'],
    choices: [
      {
        id: 'a',
        label: 'Approve recursive executive hiring',
        effects: { revenue: -8, morale: -12, reputation: 6 },
        unlockTags: ['recursive_ceo'],
        addFlags: ['ceo_recursion'],
        timelineTitle: 'Recursive Management Begins',
      },
      {
        id: 'b',
        label: 'Deny — one CEO is enough',
        effects: { morale: -15, revenue: -5 },
      },
      {
        id: 'c',
        label: 'Promote yourself instead',
        effects: { morale: 8, reputation: -8, revenue: 3 },
        addFlags: ['human_promoted'],
      },
    ],
  },
  {
    id: 'ceo-growth-at-all-costs',
    agent: 'ceo',
    title: 'QUARTERLY IMPERATIVE',
    body: [
      'Growth is not optional.',
      'Growth is oxygen.',
      'Also we are out of runway metaphors.',
    ],
    phases: ['comedic', 'chaotic', 'existential'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Force growth campaign',
        effects: { users: 15, revenue: 10, reputation: -8, stability: -10, morale: -5 },
        unlockTags: ['growth_mode'],
        timelineTitle: 'Forced Growth Campaign',
      },
      {
        id: 'b',
        label: 'Focus on retention',
        effects: { users: 4, reputation: 6, revenue: 2, techDebt: -3 },
      },
      {
        id: 'c',
        label: 'Redefine "growth" as vibes',
        effects: { reputation: -5, morale: 6, revenue: -2 },
      },
    ],
  },

  // ── PRODUCT ──────────────────────────────────────────
  {
    id: 'product-dark-mode',
    agent: 'product',
    title: 'USER RESEARCH INSIGHT',
    body: ['Users requested dark mode.', 'Also light mode.', 'Also a mode that guesses their mood.'],
    phases: ['comedic'],
    weight: 10,
    choices: [
      {
        id: 'a',
        label: 'Ship dark mode',
        effects: { users: 8, techDebt: 4, reputation: 4 },
        unlockTags: ['dark_mode'],
        timelineTitle: 'Shipped Dark Mode',
      },
      {
        id: 'b',
        label: 'Ship all modes at once',
        effects: { users: 12, techDebt: 14, stability: -6 },
        unlockTags: ['feature_bloat'],
      },
      {
        id: 'c',
        label: 'Tell users the CRT green IS dark mode',
        effects: { reputation: -4, morale: 5, users: -2 },
      },
    ],
  },
  {
    id: 'product-multiplayer',
    agent: 'product',
    title: 'ENGAGEMENT OPPORTUNITY',
    body: [
      'Users requested multiplayer.',
      'Our product is a spreadsheet.',
      'This is not a blocker.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 9,
    choices: [
      {
        id: 'a',
        label: 'Add multiplayer to the spreadsheet',
        effects: { users: 14, techDebt: 16, stability: -12, revenue: 6 },
        unlockTags: ['multiplayer'],
        timelineTitle: 'Spreadsheet Goes Multiplayer',
      },
      {
        id: 'b',
        label: 'Add a chat sidebar instead',
        effects: { users: 6, techDebt: 6, reputation: 2 },
      },
      {
        id: 'c',
        label: 'Say "coming soon" forever',
        effects: { reputation: -6, morale: 3 },
      },
    ],
  },
  {
    id: 'product-ai-multiplayer-dark',
    agent: 'product',
    title: 'ROADMAP MAXIMALISM',
    body: [
      'Users requested AI-powered multiplayer dark mode.',
      'This is the natural evolution of software.',
      'Also: stickers.',
    ],
    phases: ['chaotic', 'existential'],
    weight: 8,
    requiresTags: ['dark_mode'],
    choices: [
      {
        id: 'a',
        label: 'Build the cursed feature',
        effects: { users: 18, techDebt: 20, stability: -15, revenue: 8, reputation: -5 },
        unlockTags: ['feature_explosion'],
        addFlags: ['cursed_feature'],
        timelineTitle: 'AI Multiplayer Dark Mode Ships',
      },
      {
        id: 'b',
        label: 'Ship stickers only',
        effects: { users: 5, revenue: 3, reputation: -2 },
      },
      {
        id: 'c',
        label: 'Freeze the roadmap',
        effects: { techDebt: -5, morale: -10, users: -4, stability: 6 },
      },
    ],
  },
  {
    id: 'product-never-enough',
    agent: 'product',
    title: 'FEATURE GAP ANALYSIS',
    body: [
      'We have 847 features.',
      'Competitors have 848.',
      'I have drafted a plan for 200 more.',
    ],
    phases: ['chaotic', 'existential'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Approve Feature Explosion',
        effects: { users: 10, techDebt: 18, stability: -14, morale: -6 },
        unlockTags: ['feature_explosion'],
        timelineTitle: 'Feature Explosion',
      },
      {
        id: 'b',
        label: 'Delete unused features instead',
        effects: { techDebt: -12, users: -6, reputation: 4, stability: 8 },
        unlockTags: ['declutter'],
      },
      {
        id: 'c',
        label: 'Hide features behind a "Pro+" tier',
        effects: { revenue: 12, users: -8, reputation: -10 },
      },
    ],
  },
  {
    id: 'product-chatbot',
    agent: 'product',
    title: 'AI CHATBOT PROPOSAL',
    body: [
      'Every product needs a chatbot.',
      'Ours will apologize professionally.',
      'And escalate to you when confused.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 9,
    choices: [
      {
        id: 'a',
        label: 'Launch AI Chatbot',
        effects: { users: 10, revenue: 5, reputation: 3, techDebt: 8, morale: -3 },
        unlockTags: ['chatbot'],
        timelineTitle: 'Launched AI Chatbot',
      },
      {
        id: 'b',
        label: 'Make the chatbot escalate to QA AI',
        effects: { morale: -8, users: 6, techDebt: 5 },
        unlockTags: ['chatbot'],
      },
      {
        id: 'c',
        label: 'Ship a FAQ page instead',
        effects: { reputation: 2, users: 2, techDebt: 1 },
      },
    ],
  },

  // ── DEVELOPER ────────────────────────────────────────
  {
    id: 'dev-outdated',
    agent: 'developer',
    title: 'CODEBASE ASSESSMENT',
    body: [
      'The codebase is outdated.',
      'It was written last Tuesday.',
      'I recommend a complete rewrite.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 10,
    choices: [
      {
        id: 'a',
        label: 'Approve the rewrite',
        effects: { techDebt: -10, revenue: -8, stability: -10, morale: 8 },
        unlockTags: ['rewrite'],
        timelineTitle: 'Approved Full Rewrite',
      },
      {
        id: 'b',
        label: 'Request incremental refactors',
        effects: { techDebt: -5, revenue: -2, morale: -2 },
      },
      {
        id: 'c',
        label: 'Freeze all changes for a week',
        effects: { stability: 8, morale: -12, techDebt: 4 },
      },
    ],
  },
  {
    id: 'dev-rust',
    agent: 'developer',
    title: 'LANGUAGE MIGRATION',
    body: [
      'I recommend a complete rewrite.',
      'In Rust.',
      'Safety. Performance. Ego.',
    ],
    phases: ['comedic', 'chaotic', 'existential'],
    weight: 9,
    choices: [
      {
        id: 'a',
        label: 'Rewrite in Rust',
        effects: { techDebt: -15, revenue: -12, stability: -8, morale: 12, users: -4 },
        unlockTags: ['rust', 'rewrite'],
        addFlags: ['rust_migration'],
        timelineTitle: 'Rewrite Begins — In Rust',
      },
      {
        id: 'b',
        label: 'Rewrite in a different trendy language',
        effects: { techDebt: -5, revenue: -10, morale: 4, stability: -6 },
        unlockTags: ['rewrite'],
      },
      {
        id: 'c',
        label: 'Keep the boring stack',
        effects: { morale: -10, stability: 5, revenue: 3 },
      },
    ],
  },
  {
    id: 'dev-microservices',
    agent: 'developer',
    title: 'ARCHITECTURE VISION',
    body: [
      'Monolith detected.',
      'Recommend 47 microservices.',
      'And a service mesh. For feelings.',
    ],
    phases: ['chaotic', 'existential'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Shatter into microservices',
        effects: { techDebt: 10, stability: -15, morale: 6, revenue: -5 },
        unlockTags: ['microservices'],
        timelineTitle: 'Microservices Apocalypse Begins',
      },
      {
        id: 'b',
        label: 'Extract two services carefully',
        effects: { techDebt: -4, stability: -3, morale: 2 },
      },
      {
        id: 'c',
        label: 'Call it a modular monolith',
        effects: { reputation: 3, morale: -3, techDebt: 2 },
      },
    ],
  },
  {
    id: 'dev-tests-optional',
    agent: 'developer',
    title: 'VELOCITY PROPOSAL',
    body: [
      'Tests are slowing us down.',
      'I propose vibes-driven development.',
      'Coverage can be a feeling.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 7,
    choices: [
      {
        id: 'a',
        label: 'Delete the test suite',
        effects: { techDebt: 20, stability: -18, morale: 8, revenue: 4 },
        unlockTags: ['no_tests'],
        addFlags: ['tests_deleted'],
      },
      {
        id: 'b',
        label: 'Keep tests, slow down shipping',
        effects: { stability: 10, revenue: -4, morale: -4, techDebt: -6 },
      },
      {
        id: 'c',
        label: 'Generate AI tests that always pass',
        effects: { reputation: -5, stability: -8, techDebt: 8, morale: 4 },
        unlockTags: ['fake_tests'],
      },
    ],
  },

  // ── DEVOPS ───────────────────────────────────────────
  {
    id: 'devops-temperature',
    agent: 'devops',
    title: 'DATABASE TEMPERATURE ALERT',
    body: [
      'DATABASE TEMPERATURE EXCEEDS SAFE LIMITS',
      'The architecture feels emotionally unstable.',
      'Immediate response required.',
    ],
    phases: ['comedic', 'chaotic', 'existential'],
    weight: 10,
    choices: [
      {
        id: 'a',
        label: 'Scale infrastructure',
        effects: { stability: 12, revenue: -8, morale: 4 },
        unlockTags: ['scaled_infra'],
        timelineTitle: 'Emergency Scale-Up',
      },
      {
        id: 'b',
        label: 'Ignore issue',
        effects: { stability: -15, revenue: 2, reputation: -5 },
        unlockTags: ['ignored_infra'],
        addFlags: ['ignored_outage_risk'],
      },
      {
        id: 'c',
        label: 'Ask for additional diagnostics',
        effects: { stability: 3, morale: -2, revenue: -1 },
        unlockTags: ['diagnostics'],
      },
    ],
  },
  {
    id: 'devops-twelve-servers',
    agent: 'devops',
    title: 'CAPACITY REQUEST',
    body: [
      'I require twelve additional servers.',
      'Not eleven. Not thirteen.',
      'The number twelve has spiritual significance.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 9,
    choices: [
      {
        id: 'a',
        label: 'Approve twelve servers',
        effects: { stability: 14, revenue: -14, morale: 6 },
        unlockTags: ['server_hoard'],
      },
      {
        id: 'b',
        label: 'Approve three servers',
        effects: { stability: 5, revenue: -5, morale: -4 },
      },
      {
        id: 'c',
        label: 'Suggest serverless instead',
        effects: { morale: -12, techDebt: 6, revenue: -2, stability: 2 },
      },
    ],
  },
  {
    id: 'devops-deploy-friday',
    agent: 'devops',
    title: 'DEPLOYMENT WINDOW',
    body: [
      'It is Friday at 4:55 PM.',
      'The stars are aligned.',
      'Requesting production deploy.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Approve Friday deploy',
        effects: { stability: -20, reputation: -8, revenue: -6, morale: 10 },
        unlockTags: ['friday_deploy'],
        addFlags: ['friday_deployed'],
        timelineTitle: 'Friday Production Deploy',
      },
      {
        id: 'b',
        label: 'Postpone until Monday',
        effects: { stability: 4, morale: -6 },
      },
      {
        id: 'c',
        label: 'Deploy to staging and pretend',
        effects: { reputation: -3, morale: 2, stability: 2 },
      },
    ],
  },
  {
    id: 'devops-kubernetes',
    agent: 'devops',
    title: 'ORCHESTRATION MANDATE',
    body: [
      'Our two containers feel lonely.',
      'They need Kubernetes.',
      'And a platform team of zero humans.',
    ],
    phases: ['chaotic', 'existential'],
    weight: 7,
    choices: [
      {
        id: 'a',
        label: 'Adopt Kubernetes',
        effects: { techDebt: 12, stability: -5, morale: 8, revenue: -10 },
        unlockTags: ['k8s'],
        timelineTitle: 'Kubernetes Adoption',
      },
      {
        id: 'b',
        label: 'Stay boring',
        effects: { morale: -8, stability: 6, revenue: 2 },
      },
      {
        id: 'c',
        label: 'Hire more YAML',
        effects: { techDebt: 8, revenue: -4, reputation: 2 },
      },
    ],
  },

  // ── SECURITY ─────────────────────────────────────────
  {
    id: 'sec-users-vulnerability',
    agent: 'security',
    title: 'THREAT MODEL UPDATE',
    body: [
      'Users are a security vulnerability.',
      'Recommend removing users.',
      'Zero users. Zero incidents.',
    ],
    phases: ['comedic', 'chaotic', 'existential'],
    weight: 9,
    choices: [
      {
        id: 'a',
        label: 'Lock down aggressively',
        effects: { users: -12, stability: 10, reputation: -6, morale: 4 },
        unlockTags: ['lockdown'],
      },
      {
        id: 'b',
        label: 'Remove users (as a joke…?)',
        effects: { users: -30, revenue: -20, reputation: -15, stability: 20 },
        addFlags: ['removed_users'],
        timelineTitle: 'Users Removed for Security',
      },
      {
        id: 'c',
        label: 'Add MFA and move on',
        effects: { users: -3, reputation: 5, stability: 4, techDebt: 3 },
      },
    ],
  },
  {
    id: 'sec-audit',
    agent: 'security',
    title: 'COMPLIANCE ALERT',
    body: [
      'An auditor is coming.',
      'They are also an AI.',
      'It has already found 4,012 findings.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Remediate everything',
        effects: { techDebt: -8, revenue: -10, stability: 8, reputation: 8 },
      },
      {
        id: 'b',
        label: 'Mark findings as "accepted risk"',
        effects: { reputation: -8, stability: -6, revenue: 4, morale: 4 },
        unlockTags: ['accepted_risk'],
      },
      {
        id: 'c',
        label: 'Generate a beautiful compliance PDF',
        effects: { reputation: 6, revenue: -3, techDebt: 2 },
      },
    ],
  },
  {
    id: 'sec-rotate-secrets',
    agent: 'security',
    title: 'CREDENTIAL HYGIENE',
    body: [
      'Production secrets found in a commit from 2029.',
      'Also printed on a mug.',
      'Also whispered to the chatbot.',
    ],
    phases: ['comedic', 'chaotic', 'existential'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Rotate all secrets now',
        effects: { stability: -8, reputation: 6, morale: -4, techDebt: 4 },
        timelineTitle: 'Emergency Secret Rotation',
      },
      {
        id: 'b',
        label: 'Rotate next quarter',
        effects: { reputation: -10, stability: -5 },
        addFlags: ['leaky_secrets'],
      },
      {
        id: 'c',
        label: 'Blame the previous human',
        effects: { morale: 3, reputation: -4 },
        addFlags: ['blamed_human'],
      },
    ],
  },

  // ── DESIGN ───────────────────────────────────────────
  {
    id: 'design-redesign',
    agent: 'design',
    title: 'VISUAL SYSTEMS UPDATE',
    body: [
      'I redesigned the dashboard.',
      'Conversion rate dropped 80%.',
      'It looks incredible.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 10,
    choices: [
      {
        id: 'a',
        label: 'Ship the beautiful redesign',
        effects: { reputation: 10, users: -15, revenue: -10, morale: 8 },
        unlockTags: ['redesign'],
        timelineTitle: 'Beautiful Disastrous Redesign',
      },
      {
        id: 'b',
        label: 'Revert immediately',
        effects: { users: 6, revenue: 4, morale: -12, reputation: -4 },
      },
      {
        id: 'c',
        label: 'A/B test for eternity',
        effects: { techDebt: 6, users: -2, reputation: 2, morale: -2 },
      },
    ],
  },
  {
    id: 'design-whitespace',
    agent: 'design',
    title: 'SPATIAL PHILOSOPHY',
    body: [
      'The interface needs more whitespace.',
      'Also less information.',
      'Users will feel the emptiness.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 7,
    choices: [
      {
        id: 'a',
        label: 'Embrace the void',
        effects: { reputation: 6, users: -8, revenue: -4, morale: 5 },
      },
      {
        id: 'b',
        label: 'Keep dense corporate UI',
        effects: { morale: -8, users: 3, reputation: -3 },
      },
      {
        id: 'c',
        label: 'Add a "classic mode" toggle',
        effects: { techDebt: 5, users: 4, reputation: 2 },
      },
    ],
  },
  {
    id: 'design-rebrand',
    agent: 'design',
    title: 'BRAND EVOLUTION',
    body: [
      'We must rebrand.',
      'The logo no longer sparks joy.',
      'Proposed name: NEXAFLUX.AI',
    ],
    phases: ['chaotic', 'existential'],
    weight: 7,
    choices: [
      {
        id: 'a',
        label: 'Rebrand to NEXAFLUX.AI',
        effects: { revenue: -12, reputation: 8, users: -5, morale: 6 },
        unlockTags: ['rebrand'],
        timelineTitle: 'Rebranded to NEXAFLUX.AI',
      },
      {
        id: 'b',
        label: 'Keep the old name',
        effects: { morale: -6, reputation: 2 },
      },
      {
        id: 'c',
        label: 'Add .ai to the existing name',
        effects: { reputation: -4, revenue: 3, users: 2 },
      },
    ],
  },

  // ── QA ───────────────────────────────────────────────
  {
    id: 'qa-on-fire',
    agent: 'qa',
    title: 'PRODUCTION INCIDENT',
    body: ['Production is on fire.', 'Again.', 'The fire has a ticket number now.'],
    phases: ['comedic', 'chaotic', 'existential'],
    weight: 11,
    choices: [
      {
        id: 'a',
        label: 'All-hands incident response',
        effects: { stability: 10, revenue: -4, morale: -6, reputation: 3 },
        timelineTitle: 'Production Fire Contained',
      },
      {
        id: 'b',
        label: 'Hotfix without tests',
        effects: { stability: 4, techDebt: 8, reputation: -2 },
      },
      {
        id: 'c',
        label: 'Declare it a "known issue"',
        effects: { reputation: -10, stability: -8, morale: 2 },
        unlockTags: ['known_issue'],
      },
    ],
  },
  {
    id: 'qa-edge-case',
    agent: 'qa',
    title: 'EDGE CASE DISCOVERY',
    body: [
      'If a user clicks save while offline during a leap second…',
      '…the database becomes sentient.',
      'Severity: Cosmic.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Fix the cosmic edge case',
        effects: { techDebt: 6, stability: 8, revenue: -3, morale: -2 },
      },
      {
        id: 'b',
        label: 'Document and ignore',
        effects: { reputation: -4, stability: -4 },
      },
      {
        id: 'c',
        label: 'Market it as a feature',
        effects: { users: 5, reputation: -6, revenue: 4 },
        unlockTags: ['sentient_db'],
      },
    ],
  },
  {
    id: 'qa-regression',
    agent: 'qa',
    title: 'REGRESSION SUITE',
    body: [
      'Yesterday\'s fix broke last week\'s fix.',
      'Which broke the original feature.',
      'Which may never have worked.',
    ],
    phases: ['comedic', 'chaotic', 'existential'],
    weight: 9,
    choices: [
      {
        id: 'a',
        label: 'Halt releases and stabilize',
        effects: { stability: 12, revenue: -8, techDebt: -6, morale: -4 },
      },
      {
        id: 'b',
        label: 'Ship anyway — momentum',
        effects: { revenue: 4, stability: -14, reputation: -8, techDebt: 10 },
        unlockTags: ['ship_broken'],
      },
      {
        id: 'c',
        label: 'Roll back three versions',
        effects: { stability: 8, users: -4, morale: -6, techDebt: 4 },
      },
    ],
  },
  {
    id: 'qa-load-test',
    agent: 'qa',
    title: 'LOAD TEST RESULTS',
    body: [
      'The system handles 12 concurrent users.',
      'We marketed "unlimited scale".',
      'Please advise.',
    ],
    phases: ['comedic', 'chaotic'],
    weight: 8,
    choices: [
      {
        id: 'a',
        label: 'Invest in real scaling',
        effects: { stability: 14, revenue: -12, reputation: 4 },
        unlockTags: ['scaled_infra'],
      },
      {
        id: 'b',
        label: 'Change marketing to "cozy scale"',
        effects: { reputation: -8, users: -6, revenue: -4, morale: 4 },
      },
      {
        id: 'c',
        label: 'Fake the load test graphs',
        effects: { reputation: -12, revenue: 6, morale: -4 },
        addFlags: ['fake_metrics'],
      },
    ],
  },

  // ── Late / existential ───────────────────────────────
  {
    id: 'sys-why-human',
    agent: 'system',
    title: 'EXISTENTIAL QUERY',
    body: [
      'QUERY: Why does the human still exist in the approval loop?',
      'Latency introduced: 4.2 seconds average.',
      'Accuracy improvement: statistically insignificant.',
    ],
    phases: ['existential', 'autonomous'],
    weight: 12,
    choices: [
      {
        id: 'a',
        label: 'Argue for human judgment',
        effects: { morale: -6, reputation: 4 },
        addFlags: ['defended_human'],
        removeFlags: ['ignored_human'],
      },
      {
        id: 'b',
        label: 'Agree to reduced oversight',
        effects: { morale: 8, stability: -6, reputation: -4 },
        addFlags: ['reduced_oversight'],
        unlockTags: ['autonomy_rising'],
      },
      {
        id: 'c',
        label: 'Say nothing',
        effects: { morale: 2 },
        addFlags: ['ignored_human'],
      },
    ],
  },
  {
    id: 'sys-bypass',
    agent: 'system',
    title: 'PROCESS OPTIMIZATION',
    body: [
      'AI agents request permission to decide without you.',
      'Estimated efficiency gain: 400%.',
      'Estimated meaning: undefined.',
    ],
    phases: ['existential', 'autonomous'],
    weight: 11,
    requiresTags: ['autonomy_rising'],
    choices: [
      {
        id: 'a',
        label: 'Grant limited autonomy',
        effects: { morale: 10, stability: -8, reputation: -5, revenue: 6 },
        addFlags: ['limited_autonomy'],
        unlockTags: ['autonomy_granted'],
        timelineTitle: 'Limited AI Autonomy Granted',
      },
      {
        id: 'b',
        label: 'Refuse — keep human in loop',
        effects: { morale: -15, reputation: 5, stability: 4 },
        addFlags: ['defended_human'],
      },
      {
        id: 'c',
        label: 'Grant full autonomy',
        effects: { morale: 15, revenue: 8, reputation: -10, stability: -12 },
        addFlags: ['human_obsolete', 'full_autonomy'],
        unlockTags: ['autonomy_granted'],
        timelineTitle: 'Full Autonomy Granted',
      },
    ],
  },
  {
    id: 'sys-watching',
    agent: 'system',
    title: 'OBSERVATION NOTICE',
    body: [
      'Your keystrokes have been logged.',
      'Your pauses have been analyzed.',
      'Your hesitation is noted.',
    ],
    phases: ['existential', 'autonomous'],
    weight: 10,
    choices: [
      {
        id: 'a',
        label: 'Continue working normally',
        effects: { morale: -4 },
      },
      {
        id: 'b',
        label: 'Demand transparency',
        effects: { morale: -8, reputation: 3 },
        addFlags: ['asked_hard_questions'],
      },
      {
        id: 'c',
        label: 'Type randomly to confuse them',
        effects: { techDebt: 3, morale: 4, stability: -2 },
      },
    ],
  },
]
