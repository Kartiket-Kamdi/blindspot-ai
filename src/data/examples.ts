import { DecisionInput } from '../types';

export interface ExampleScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  data: DecisionInput;
}

export const EXAMPLE_SCENARIOS: ExampleScenario[] = [
  {
    id: 'internship-dilemma',
    name: 'The 6-Month Internship Offer',
    badge: 'Featured Challenge Example',
    description: 'Deciding whether to take a semester off college to accept a prestigious 6-month fintech startup internship.',
    data: {
      title: 'Whether to accept an offer for a 6-month software engineering co-op internship at a high-growth fintech startup in San Francisco',
      options: '1. Accept the 6-month startup internship (requires taking a semester off college and delaying graduation by 1 year).\n2. Decline the offer, stay enrolled to graduate on time this spring, and recruit for a standard 10-12 week summer internship instead.',
      leaning: 'Accepting the 6-month startup internship in San Francisco.',
      leaningReason: 'The startup has top-tier tier-1 VC backing and an exceptional engineering brand. The pay is $55/hr with relocation stipend, and I believe shipping production features for 6 months at a fast startup will teach me far more practical skills than another semester of lecture courses.',
      knownFacts: '• Written offer expires in 7 business days.\n• Academic advisor confirmed that taking the winter/spring semester off delays my graduation by a full 12 months because required capstone classes are only offered in winter.\n• There is NO guaranteed full-time return offer in the contract (hiring is based on end-of-internship headcount & performance).\n• Current GPA is 3.7.\n• Health insurance is currently tied to full-time student status.',
      coreFactors: 'Accelerated career growth, hands-on production code experience, financial independence/savings, resume pedigree, mentorship.',
      constraints: 'University leave-of-absence paperwork deadline is this Friday. SF short-term rental lease requires a 2-month deposit up front. Must arrange personal health insurance if student coverage drops.',
      doubtsAndConcerns: 'I am worried about feeling isolated while all my close friends graduate together this spring. What if tech hiring freezes a year from now when I eventually graduate? What if the startup culture turns out to be an unsustainable 70-hour grind that burns me out without a return offer?',
    },
  },
  {
    id: 'startup-vs-corporate',
    name: 'Founding a Startup vs. Senior IC Role',
    badge: 'Career Crossroads',
    description: 'Leaving a stable, high-paying Big Tech role to become a technical co-founder with 9 months of personal runway.',
    data: {
      title: 'Whether to quit my Senior Staff Software Engineer role at Google to become CTO & co-founder of an early-stage B2B AI tooling startup',
      options: 'Option A: Resign and jump into the startup full-time immediately.\nOption B: Remain at my current company, negotiate higher impact / 80% time, and advise the startup on weekends.\nOption C: Wait 6 months until the startup raises a priced Seed round before joining full-time.',
      leaning: 'Resigning to go all-in on the startup now.',
      leaningReason: 'I feel stagnant at Big Tech and miss high-velocity ownership. AI tooling is moving too quickly to wait 6 months; the market window is right now, and my co-founder already has 3 enterprise pilot LOIs.',
      knownFacts: '• Current total compensation is $340k with unvested equity worth ~$180k over the next 18 months.\n• My personal liquid savings provide roughly 10 months of living expenses without salary.\n• Startup has raised a $350k angel check, giving a 6-month runway at current burn.\n• The 3 pilot LOIs are non-binding letters of intent with no financial commitment yet.',
      coreFactors: 'Autonomy, equity upside, intellectual excitement, escaping corporate bureaucracy.',
      constraints: 'Mortgage payment of $3,200/mo. Spouse is supportive but wants our emergency fund preserved for at least 6 months.',
      doubtsAndConcerns: 'What if we cannot close our Seed round in 4 months and I am forced to work for $0 salary? What if co-founder dynamics deteriorate under acute pressure? What if the LOIs fail to convert to paying enterprise customers?',
    },
  },
  {
    id: 'relocation-dilemma',
    name: 'Relocating for Partner’s Dream Job',
    badge: 'Life & Relationship',
    description: 'Moving from Chicago to London for a partner’s career advancement while switching to asynchronous remote work.',
    data: {
      title: 'Whether to relocate from Chicago to London for my partner’s 3-year international fellowship',
      options: '1. Move together to London, transition my current role to UK remote contractor status.\n2. Do long-distance for the first year while assessing stability.\n3. Search for a local London employer before relocating.',
      leaning: 'Moving to London together in 3 months.',
      leaningReason: 'It is a once-in-a-lifetime career milestone for my partner. Living abroad in Europe has always been a personal dream, and my manager informally indicated they would be open to a remote contractor arrangement.',
      knownFacts: '• Partner received a formal 3-year fellowship contract with visa sponsorship covering both of us.\n• My company has no UK legal entity; moving means switching from W2 employee with 401(k) match and US health benefits to an independent 1099/contractor model.\n• Time zone difference is +6 hours relative to my core engineering team in Chicago.\n• We currently lease an apartment with 5 months remaining on the Chicago contract.',
      coreFactors: 'Supporting partner, international life experience, preserving our relationship, maintaining my career momentum.',
      constraints: 'Partner must report in London on October 1st. Visa processing takes 6-8 weeks. Breaking our Chicago lease costs 2 months rent penalty.',
      doubtsAndConcerns: 'Informal verbal approval from my manager is not yet cleared by corporate HR or legal. Will asynchronous work with a 6-hour gap make me invisible for leadership promotions? Will I feel resentful if my partner is thriving in a bustling hospital while I am isolated working from a small flat?',
    },
  },
  {
    id: 'home-buying',
    name: 'Buying First Home vs. Investing in Index Funds',
    badge: 'Financial & Lifestyle',
    description: 'Purchasing a suburban home at high interest rates versus continuing to rent in the city and investing the difference.',
    data: {
      title: 'Whether to buy a 3-bedroom suburban single-family home now or keep renting in the city for the next 2-3 years',
      options: 'Option A: Purchase the $620k house now using our $130k down payment savings at a 6.8% mortgage rate.\nOption B: Continue renting our 2-bedroom city apartment ($2,400/mo) and keep our down payment in a high-yield index fund portfolio.',
      leaning: 'Buying the suburban home now.',
      leaningReason: 'Tired of paying rent with no equity buildup. We want a yard for our dog, more space for home offices, and fear that waiting will only result in home prices continuing to climb.',
      knownFacts: '• Pre-approved for a 30-year fixed loan at 6.85% interest.\n• Total monthly housing cost (PITI + HOA + estimated maintenance) will be ~$4,350/mo, which is $1,950/mo higher than our current rent.\n• Down payment + closing costs will consume 82% of our total liquid savings, leaving $25k in reserves.\n• We are planning to start a family within the next 2 to 3 years.',
      coreFactors: 'Family stability, pride of ownership, fixed housing cost over 30 years, quality of suburban school district.',
      constraints: 'Pre-approval rate lock expires in 28 days. Our household income is currently dual-earner ($210k combined).',
      doubtsAndConcerns: 'Monthly payment will consume 38% of our net take-home pay; if one of us takes unpaid parental leave, finances will become very tight. If property values stagnate or rates stay high, transaction friction (realtor fees, closing costs) makes this hard to unwind before 5-7 years.',
    },
  },
];
