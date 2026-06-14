// FinLearnX – Premium Course Full Content (30 pages per course)
export const PREMIUM_CONTENT = {
  'value-investing': {
    pages: [
      {
        chapter: 1, pageInChapter: 1,
        title: 'What is Value Investing?',
        subtitle: 'The Philosophy That Created the World\'s Greatest Investors',
        content: `Value investing is the practice of buying securities that appear underpriced relative to their intrinsic value. Pioneered by Benjamin Graham and later perfected by Warren Buffett, it is the most proven wealth-building strategy in investment history.

The core idea is simple: the stock market is a voting machine in the short run but a weighing machine in the long run. In the short term, prices are driven by emotion, sentiment, and speculation. In the long run, prices converge to the true underlying value of the business.

Value investors exploit this gap between price and value. They buy when the market is pessimistic and prices are below intrinsic value, then wait patiently for the market to recognize the true worth of the business.`,
        keyPoints: [
          'Price is what you pay; Value is what you get — Warren Buffett',
          'The market is irrational in the short term, rational in the long term',
          'Value investing requires patience, discipline, and independent thinking',
          'Benjamin Graham\'s "Security Analysis" (1934) is the bible of value investing',
          'Warren Buffett turned $100 into $100 billion using these principles',
        ],
        highlight: '💡 "In the short run, the market is a voting machine. In the long run, it is a weighing machine." — Benjamin Graham',
        example: 'In 2008, Warren Buffett bought Goldman Sachs preferred shares at $5B when everyone was panicking. By 2013, this investment returned $3.7B in profit — a 74% gain in 5 years.',
        diagram: 'price_vs_value',
      },
      {
        chapter: 1, pageInChapter: 2,
        title: 'The History of Value Investing',
        subtitle: 'From Graham to Buffett to Modern Value Investors',
        content: `Value investing has a rich 90-year history of outperforming the market. Understanding this history gives you confidence in the strategy during difficult periods.

Benjamin Graham (1894-1976) developed the intellectual framework for value investing at Columbia Business School. His two landmark books — Security Analysis (1934) and The Intelligent Investor (1949) — remain the definitive texts on the subject.

Warren Buffett studied under Graham at Columbia and later worked at Graham-Newman Corporation. He then evolved Graham's purely quantitative approach by incorporating qualitative factors like brand strength, management quality, and competitive moats — concepts he learned from Charlie Munger and Philip Fisher.`,
        keyPoints: [
          '1934: Benjamin Graham publishes Security Analysis',
          '1949: The Intelligent Investor published — "the best book on investing ever written" (Buffett)',
          '1956: Warren Buffett starts Buffett Partnership with $105,000',
          '1965: Buffett takes control of Berkshire Hathaway',
          '2024: Berkshire Hathaway worth over $900 billion',
        ],
        highlight: '💡 Warren Buffett\'s net worth grew from $1M at age 30 to $100B+ at age 90 — entirely through value investing principles.',
        example: 'Buffett\'s Berkshire Hathaway has compounded at ~20% annually for 58 years vs S&P 500\'s ~10%. On $1,000 invested in 1965: Berkshire = $36 million vs S&P 500 = $235,000.',
        diagram: 'berkshire_vs_sp500',
      },
      {
        chapter: 1, pageInChapter: 3,
        title: 'Core Principles of Value Investing',
        subtitle: 'The 5 Pillars Every Value Investor Must Master',
        content: `Value investing rests on five foundational principles. Master these and you will have a significant edge over 95% of market participants.

Principle 1 — Intrinsic Value: Every business has an intrinsic value based on its future cash flows. This value can be estimated through careful analysis.

Principle 2 — Margin of Safety: Always buy at a significant discount to intrinsic value. Graham recommended buying at 2/3 of intrinsic value or less.

Principle 3 — Mr. Market: Treat the market as a manic-depressive business partner who offers to buy or sell at wildly varying prices. Use his irrationality to your advantage.

Principle 4 — Circle of Competence: Only invest in businesses you understand deeply. Buffett famously avoided tech stocks for decades because they were outside his circle.

Principle 5 — Long-Term Orientation: Value investing requires patience. The average holding period for Buffett's major positions is 20+ years.`,
        keyPoints: [
          'Intrinsic Value = Present value of all future cash flows',
          'Margin of Safety = Buy at 30-50% below intrinsic value',
          'Mr. Market = Your servant, not your master',
          'Circle of Competence = Only invest in what you understand',
          'Long-term = Think in decades, not quarters',
        ],
        highlight: '💡 "The stock market is designed to transfer money from the Active to the Patient." — Warren Buffett',
        example: 'Buffett bought Coca-Cola in 1988 at $1.3B. Today that stake is worth $25B+. He has never sold a single share in 36 years.',
        diagram: 'five_pillars',
      },
      {
        chapter: 2, pageInChapter: 1,
        title: 'Mr. Market — Your Greatest Ally',
        subtitle: 'Benjamin Graham\'s Most Powerful Mental Model',
        content: `Benjamin Graham's "Mr. Market" allegory is the most important mental model in investing. Imagine you own a small business with a partner named Mr. Market. Every day, Mr. Market offers to buy your share or sell you his share at a specific price.

The key insight: Mr. Market is emotionally unstable. Some days he is euphoric and offers absurdly high prices. Other days he is depressed and offers ridiculously low prices. You are never obligated to trade with him.

The intelligent investor uses Mr. Market's emotional swings to their advantage. When Mr. Market is depressed and offers low prices, you buy. When he is euphoric and offers high prices, you sell. The rest of the time, you ignore him completely.

This is the opposite of what most investors do. Most people buy when Mr. Market is euphoric (market highs) and sell when he is depressed (market crashes) — the exact wrong behavior.`,
        keyPoints: [
          'Mr. Market is your servant, not your guide',
          'Market prices are offers, not verdicts on value',
          'Volatility is opportunity, not risk (for value investors)',
          'The market is most dangerous when it feels safest',
          'The market is most attractive when it feels most dangerous',
        ],
        highlight: '💡 "Be fearful when others are greedy, and greedy when others are fearful." — Warren Buffett',
        example: 'March 2020 COVID crash: Nifty fell 38% in 6 weeks. Mr. Market was in extreme panic. Investors who bought during this period earned 100%+ returns within 18 months.',
        diagram: 'mr_market_cycle',
      },
      {
        chapter: 2, pageInChapter: 2,
        title: 'Margin of Safety — The Central Concept',
        subtitle: 'The Three Most Important Words in Investing',
        content: `"Margin of Safety" is the central concept of value investing. It means buying a security at a price significantly below its estimated intrinsic value, providing a cushion against errors in analysis or unexpected negative events.

Graham recommended buying stocks at no more than 2/3 of their net asset value (for deep value stocks) or at a significant discount to their earnings power value.

The margin of safety serves three purposes:
1. Protection against analytical errors — your intrinsic value estimate may be wrong
2. Protection against business deterioration — the business may perform worse than expected
3. Enhanced returns — buying cheap means more upside when price converges to value

The larger the margin of safety, the lower the risk and the higher the potential return. This is the rare case in investing where lower risk and higher return go together.`,
        keyPoints: [
          'Buy at 30-50% below intrinsic value for adequate margin of safety',
          'Larger margin of safety = Lower risk + Higher potential return',
          'Protects against errors in analysis and business deterioration',
          'Graham: "Margin of safety is the secret of sound investment"',
          'Buffett: "Rule 1 — Never lose money. Rule 2 — Never forget Rule 1"',
        ],
        highlight: '💡 Margin of Safety is like buying a ₹100 note for ₹60. Even if you are wrong about the value, you have significant protection.',
        example: 'If intrinsic value = ₹1,000/share and you buy at ₹600 (40% margin of safety): Even if you overestimated value by 20% (true value = ₹800), you still make 33% profit.',
        diagram: 'margin_of_safety',
      },
      {
        chapter: 2, pageInChapter: 3,
        title: 'Understanding Market Cycles',
        subtitle: 'How to Profit from Market Irrationality',
        content: `Markets move in cycles driven by human psychology. Understanding these cycles allows value investors to systematically buy low and sell high — not through market timing, but through valuation discipline.

The typical market cycle has four phases:
Phase 1 — Accumulation: Smart money buys after a crash. Sentiment is negative, prices are low, valuations are attractive.
Phase 2 — Markup: Prices rise as fundamentals improve. Institutional investors buy. Sentiment turns positive.
Phase 3 — Distribution: Smart money sells to retail investors at high prices. Sentiment is euphoric. Valuations are stretched.
Phase 4 — Markdown: Prices fall as reality sets in. Retail investors panic and sell. Cycle repeats.

Value investors operate primarily in Phase 1 (buying) and Phase 3 (selling). They use valuation metrics like P/E ratio, P/B ratio, and market cap to GDP to identify where we are in the cycle.`,
        keyPoints: [
          'Market cycles are driven by fear and greed, not fundamentals',
          'Nifty P/E below 15 = Attractive buying zone historically',
          'Nifty P/E above 25 = Caution zone, reduce equity allocation',
          'Market cap to GDP below 75% = Undervalued market (India)',
          'Buffett Indicator: Market Cap/GDP above 100% = Overvalued',
        ],
        highlight: '💡 The four most dangerous words in investing: "This time is different." — Sir John Templeton',
        example: 'India Nifty P/E in March 2020: 17x (attractive). By October 2021: 28x (expensive). Investors who bought in March 2020 and sold in late 2021 made 100%+ returns.',
        diagram: 'market_cycle',
      },
    ],
  },
};

// Premium Quiz Data
export const PREMIUM_QUIZZES = {
  'value-investing': [
    { q: 'Benjamin Graham\'s "Mr. Market" allegory teaches investors to:', opts: ['Follow market prices daily','Use market irrationality to buy low and sell high','Always sell when market falls','Buy index funds only'], ans: 1 },
    { q: 'Margin of Safety means:', opts: ['Stop loss level','Buying significantly below intrinsic value as protection','Profit margin of company','Safety deposit in bank'], ans: 1 },
    { q: 'Intrinsic Value is calculated as:', opts: ['Current market price','Present value of all future cash flows','Book value of assets','Revenue × P/E ratio'], ans: 1 },
    { q: 'Warren Buffett\'s Berkshire Hathaway has compounded at approximately:', opts: ['10% annually','15% annually','20% annually','30% annually'], ans: 2 },
    { q: 'Graham recommended buying stocks at no more than:', opts: ['50% of intrinsic value','2/3 of net asset value','90% of market price','Equal to book value'], ans: 1 },
    { q: 'Circle of Competence means:', opts: ['Investing in all sectors','Only investing in businesses you deeply understand','Diversifying globally','Following analyst recommendations'], ans: 1 },
    { q: 'The "weighing machine" metaphor means the market:', opts: ['Is always efficient','Reflects true value in the long run','Is random in the long run','Follows technical patterns'], ans: 1 },
    { q: 'Which metric did Graham primarily use for deep value stocks?', opts: ['P/E ratio','Price to Net Asset Value (P/NAV)','Revenue growth','Dividend yield'], ans: 1 },
    { q: 'Buffett\'s average holding period for major positions is:', opts: ['1-2 years','5-7 years','10-15 years','20+ years'], ans: 3 },
    { q: 'The Buffett Indicator (Market Cap/GDP) above 100% suggests:', opts: ['Undervalued market','Fairly valued market','Overvalued market','No significance'], ans: 2 },
    { q: 'Philip Fisher\'s "Scuttlebutt" method involves:', opts: ['Reading annual reports only','Gathering information from customers, suppliers, competitors','Technical chart analysis','Quantitative screening'], ans: 1 },
    { q: 'A company\'s "moat" refers to:', opts: ['Physical assets','Sustainable competitive advantage','Cash reserves','Debt level'], ans: 1 },
    { q: 'Nifty P/E below 15 historically indicates:', opts: ['Overvalued market','Fairly valued market','Attractive buying opportunity','Market crash imminent'], ans: 2 },
    { q: 'DCF stands for:', opts: ['Dividend Cash Flow','Discounted Cash Flow','Direct Capital Fund','Debt Coverage Factor'], ans: 1 },
    { q: 'Graham\'s "Defensive Investor" should hold:', opts: ['100% stocks','100% bonds','50-75% stocks, 25-50% bonds','Only index funds'], ans: 2 },
    { q: 'Return on Equity (ROE) measures:', opts: ['Total revenue','Profit generated per rupee of shareholder equity','Asset turnover','Debt ratio'], ans: 1 },
    { q: 'Free Cash Flow is important because:', opts: ['It equals net profit','It represents actual cash available after capital expenditures','It measures revenue','It shows debt level'], ans: 1 },
    { q: 'Buffett\'s famous Coca-Cola investment in 1988 was worth how much by 2024?', opts: ['₹1.3B (cost)','$5B','$25B+','$100B'], ans: 2 },
    { q: 'The "Price is what you pay, Value is what you get" quote is from:', opts: ['Benjamin Graham','Philip Fisher','Peter Lynch','Warren Buffett'], ans: 3 },
    { q: 'Value investing requires primarily:', opts: ['Advanced mathematics','Patience, discipline, and independent thinking','Daily market monitoring','Algorithmic trading'], ans: 1 },
  ],
  'wealth-psychology': [
    { q: 'Morgan Housel\'s "Psychology of Money" main thesis is:', opts: ['Technical analysis works best','Financial success is more about behavior than intelligence','Markets are always efficient','Diversification is unnecessary'], ans: 1 },
    { q: 'The DALBAR study shows average investors earn:', opts: ['Same as market','More than market','Significantly less than market due to behavior','Exactly 12% annually'], ans: 2 },
    { q: 'Rich Dad Poor Dad\'s core lesson is:', opts: ['Get a good job','Assets put money in your pocket; liabilities take money out','Save 10% of income','Invest in stocks only'], ans: 1 },
    { q: 'The "Rat Race" in Rich Dad Poor Dad refers to:', opts: ['Stock market volatility','Working for money instead of making money work for you','Competitive job market','Day trading'], ans: 1 },
    { q: 'Housel\'s concept of "Getting Wealthy vs Staying Wealthy" means:', opts: ['Same skills needed','Getting wealthy requires risk-taking; staying wealthy requires humility and caution','Staying wealthy is easier','Getting wealthy is impossible'], ans: 1 },
    { q: 'Loss Aversion means the pain of loss is approximately:', opts: ['Equal to joy of gain','Half the joy of gain','2x stronger than joy of equivalent gain','3x stronger'], ans: 2 },
    { q: 'Kiyosaki\'s "Cashflow Quadrant" has how many quadrants?', opts: ['2','3','4','5'], ans: 2 },
    { q: 'The "E" in ESBI quadrant stands for:', opts: ['Entrepreneur','Employee','Equity','Exchange'], ans: 1 },
    { q: 'Compound interest is most powerful when:', opts: ['Returns are highest','Time period is longest','Investment amount is largest','Market is bullish'], ans: 1 },
    { q: 'Housel\'s "Reasonable vs Rational" concept means:', opts: ['Same thing','Reasonable (emotionally sustainable) beats purely rational in practice','Rational always wins','Emotions should be ignored'], ans: 1 },
    { q: 'The Hedonic Treadmill in wealth means:', opts: ['Exercise for wealth','Returning to baseline happiness after financial gains','Saving more over time','Investing in treadmills'], ans: 1 },
    { q: 'Rich Dad\'s definition of an asset is:', opts: ['Everything you own','Something that puts money in your pocket','Your house','Your car'], ans: 1 },
    { q: 'Housel\'s "Saving Without a Goal" concept means:', opts: ['Saving is pointless without goals','Saving builds optionality and freedom beyond specific goals','Goals are unnecessary','Random saving works'], ans: 1 },
    { q: 'The "Arrival Fallacy" in wealth means:', opts: ['Reaching financial goals brings lasting happiness','Reaching financial milestones does not bring lasting happiness','Financial goals are impossible','Wealth is meaningless'], ans: 1 },
    { q: 'Kiyosaki\'s "B" quadrant represents:', opts: ['Banker','Business owner (system works without you)','Broker','Buyer'], ans: 1 },
    { q: 'Behavioral gap in investing refers to:', opts: ['Market inefficiency','Difference between fund returns and investor returns due to behavior','Price gap','None'], ans: 1 },
    { q: 'Housel\'s concept of "Luck vs Skill" in wealth means:', opts: ['Luck is irrelevant','Luck plays a larger role than most successful people acknowledge','Skill is irrelevant','Both are equal'], ans: 1 },
    { q: 'The most important financial skill according to Housel is:', opts: ['Stock picking','Getting rich quickly','Saving rate and not needing a specific return','Technical analysis'], ans: 2 },
    { q: 'Rich Dad\'s "Pay Yourself First" means:', opts: ['Spend on yourself first','Invest/save before paying expenses','Pay all bills first','Buy luxury items first'], ans: 1 },
    { q: 'The "Enough Number" in financial planning means:', opts: ['Minimum savings','Defining personal financial sufficiency to avoid endless accumulation','Maximum savings','None'], ans: 1 },
  ],
  'trading-psychology': [
    { q: 'Mark Douglas\'s "Trading in the Zone" main concept is:', opts: ['Technical analysis','Probabilistic thinking and mental framework for consistent trading','Fundamental analysis','Algorithmic trading'], ans: 1 },
    { q: 'The primary reason 90% of traders fail is:', opts: ['Bad strategy','Poor psychology and emotional decision-making','Lack of capital','Wrong broker'], ans: 1 },
    { q: 'James Clear\'s Atomic Habits "1% Rule" means:', opts: ['Risk 1% per trade','1% daily improvement = 37x better in a year','Save 1% of income','1% return target'], ans: 1 },
    { q: 'A trading journal helps traders:', opts: ['Predict markets','Identify patterns in their own behavior and improve systematically','Copy other traders','Avoid taxes'], ans: 1 },
    { q: 'Probabilistic thinking in trading means:', opts: ['Predicting exact outcomes','Thinking in terms of probabilities and expected value, not certainties','Avoiding uncertainty','Using probability calculators'], ans: 1 },
    { q: 'The "Identity-based habits" concept from Atomic Habits means:', opts: ['Changing outcomes first','Changing identity first ("I am a disciplined trader") drives behavior change','Focusing on results','Ignoring habits'], ans: 1 },
    { q: 'Fear in trading typically causes:', opts: ['Better decisions','Premature exits from winning trades and avoiding good setups','More profits','Better risk management'], ans: 1 },
    { q: 'Greed in trading typically causes:', opts: ['Better returns','Holding losing trades too long and over-leveraging','Consistent profits','Better entries'], ans: 1 },
    { q: 'A trading edge means:', opts: ['Better software','A strategy with positive expected value over many trades','Higher leverage','Faster execution'], ans: 1 },
    { q: 'Position sizing is critical because:', opts: ['It maximizes single trade profit','It determines survival and long-term compounding','It predicts market direction','It reduces commissions'], ans: 1 },
    { q: 'The "2% Rule" in trading means:', opts: ['Target 2% profit per trade','Never risk more than 2% of capital on a single trade','Use 2x leverage','Trade 2 hours daily'], ans: 1 },
    { q: 'Habit stacking (Atomic Habits) in trading means:', opts: ['Multiple strategies','Linking new trading habits to existing routines for consistency','Stacking positions','Multiple timeframes'], ans: 1 },
    { q: 'The Disposition Effect in trading means:', opts: ['Smart selling','Selling winners too early and holding losers too long','Value investing','Momentum trading'], ans: 1 },
    { q: 'Douglas\'s concept of "accepting risk" means:', opts: ['Taking maximum risk','Fully accepting the possibility of loss before entering a trade','Avoiding risk','Hedging all trades'], ans: 1 },
    { q: 'A trading system should be:', opts: ['Flexible and intuitive','Mechanical, rule-based, and consistently applied','Changed frequently','Based on tips'], ans: 1 },
    { q: 'The "Four Cs" of trading psychology are:', opts: ['Charts, Candles, Cycles, Cash','Confidence, Commitment, Consistency, Courage','Capital, Cost, Correlation, Conviction','None'], ans: 1 },
    { q: 'Overconfidence bias in trading leads to:', opts: ['Better returns','Over-trading, excessive risk, and underestimating market uncertainty','More discipline','Better analysis'], ans: 1 },
    { q: 'The best way to build trading discipline is:', opts: ['Willpower alone','Systems, automation, and environment design (Atomic Habits)','Motivation','Watching trading videos'], ans: 1 },
    { q: 'Revenge trading means:', opts: ['Profitable trading','Trading impulsively to recover losses, leading to more losses','Systematic trading','Algorithmic trading'], ans: 1 },
    { q: 'The professional trader mindset views losses as:', opts: ['Failures','Cost of doing business and learning opportunities','Reasons to quit','Market manipulation'], ans: 1 },
  ],
  'financial-freedom': [
    { q: 'Napoleon Hill\'s "Definiteness of Purpose" means:', opts: ['Vague financial goals','Having a clear, specific, burning desire for a financial goal','Working hard','Saving money'], ans: 1 },
    { q: 'The FIRE movement stands for:', opts: ['Financial Investment Return Estimate','Financial Independence Retire Early','Fixed Income Retirement Earnings','None'], ans: 1 },
    { q: 'The 4% Safe Withdrawal Rate means:', opts: ['Invest 4% of income','Withdraw 4% of corpus annually for indefinite retirement','4% return target','4% tax rate'], ans: 1 },
    { q: 'Kiyosaki\'s "I" quadrant represents:', opts: ['Insurance','Investor (money works for you)','Income','Interest'], ans: 1 },
    { q: 'The "Financial Freedom Number" is calculated as:', opts: ['Annual income × 10','Annual expenses × 25 (4% rule)','Monthly expenses × 100','Net worth target'], ans: 1 },
    { q: 'Hill\'s "Mastermind Principle" means:', opts: ['Being the smartest person','Surrounding yourself with people whose knowledge and skills complement yours','Working alone','Reading books'], ans: 1 },
    { q: 'Passive income differs from active income because:', opts: ['It is lower','It continues without direct time investment','It is tax-free','It is guaranteed'], ans: 1 },
    { q: 'The "Specialized Knowledge" principle (Think & Grow Rich) means:', opts: ['General education is enough','Deep expertise in a specific area creates disproportionate financial value','All knowledge is equal','Degrees are necessary'], ans: 1 },
    { q: 'Real estate creates wealth through:', opts: ['Rental income only','Appreciation + Rental income + Leverage + Tax benefits','Price appreciation only','None'], ans: 1 },
    { q: 'The "Latte Factor" concept shows:', opts: ['Coffee is bad','Small daily expenses compound to massive amounts over decades','Saving is impossible','None'], ans: 1 },
    { q: 'Lean FIRE vs Fat FIRE:', opts: ['Same thing','Lean = minimal lifestyle retirement, Fat = comfortable lifestyle retirement','Fat = more savings','Lean = more spending'], ans: 1 },
    { q: 'Hill\'s "Autosuggestion" applied to finance means:', opts: ['Hypnosis','Repeatedly affirming financial goals to program the subconscious mind','Advertising','None'], ans: 1 },
    { q: 'The "Barista FIRE" concept means:', opts: ['Full retirement','Semi-retirement with part-time work covering basic expenses','Working as barista','None'], ans: 1 },
    { q: 'Sequence of Returns Risk in retirement means:', opts: ['Order of investments','Poor returns early in retirement can devastate portfolio even with good average returns','Return sequence in SIP','None'], ans: 1 },
    { q: 'The "Infinite Banking Concept" uses:', opts: ['Regular savings account','Whole life insurance policy as personal banking system','Crypto','Real estate'], ans: 1 },
    { q: 'Hill\'s "Persistence" principle in finance means:', opts: ['Stubbornness','Continuing toward financial goals despite setbacks and failures','Avoiding change','None'], ans: 1 },
    { q: 'The optimal order for building wealth is:', opts: ['Invest first, then save','Emergency fund → Debt payoff → Invest → Build passive income','Spend first','Borrow to invest'], ans: 1 },
    { q: 'Kiyosaki\'s "Cash Flow Quadrant" teaches that financial freedom comes from:', opts: ['E quadrant (employee)','B and I quadrants (business owner and investor)','S quadrant (self-employed)','All quadrants equally'], ans: 1 },
    { q: 'The "10,000 Hour Rule" applied to investing means:', opts: ['Trade for 10,000 hours','Deep expertise requires deliberate practice and continuous learning','None','Trade 10,000 stocks'], ans: 1 },
    { q: 'True financial freedom means:', opts: ['Having a high salary','Passive income exceeds all expenses without needing to work','Being debt-free only','Having ₹1 crore'], ans: 1 },
  ],
};
