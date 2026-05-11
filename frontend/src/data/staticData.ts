export const LANGUAGES = [
  { code: "en", label: "English",   flag: "🇬🇧" },
  { code: "fr", label: "Français",  flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ar", label: "العربية",   flag: "🇸🇦" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "ha", label: "Hausa",     flag: "🇳🇬" },
  { code: "yo", label: "Yorùbá",    flag: "🇳🇬" },
  { code: "zu", label: "Zulu",      flag: "🇿🇦" },
  { code: "ig", label: "Igbo",      flag: "🇳🇬" },
  { code: "tw", label: "Twi",       flag: "🇬🇭" },
  { code: "am", label: "Amharic",   flag: "🇪🇹" },
  { code: "ln", label: "Lingala",   flag: "🇨🇩" },
  { code: "wo", label: "Wolof",     flag: "🇸🇳" },
];

export const HERO_MARKETS = [
  { title: "Will Nigeria qualify for the 2026 FIFA World Cup?", category: "Sports",    yesOdds: 1.85, noOdds: 2.05, yesChance: 47, noChance: 53, pool: "$18,450", predictors: "4,218", color: "#4ade80" },
  { title: "Will Bola Tinubu win re-election in 2027?",         category: "Elections", yesOdds: 1.60, noOdds: 2.40, yesChance: 62, noChance: 38, pool: "$31,200", predictors: "7,841", color: "#ffd700" },
  { title: "Will Bitcoin hit $150K before end of 2025?",        category: "Crypto",    yesOdds: 2.10, noOdds: 1.75, yesChance: 40, noChance: 60, pool: "$24,900", predictors: "5,530", color: "#a78bfa" },
  { title: "Will the Naira trade below ₦1,800/$1 in Q3 2025?",  category: "Economy",   yesOdds: 1.70, noOdds: 2.20, yesChance: 55, noChance: 45, pool: "$12,600", predictors: "3,102", color: "#60a5fa" },
];

export const MARKETS = [
  // ── Sports (10) ──
  { id: 1,  title: "Will Nigeria qualify for the 2026 FIFA World Cup?",                               yesOdds: 1.85, noOdds: 2.05, pool: 18450,  category: "Sports"      },
  { id: 2,  title: "Will Senegal win AFCON 2025?",                                                    yesOdds: 2.30, noOdds: 1.65, pool: 14200,  category: "Sports"      },
  { id: 6,  title: "Will CAF overturn the AFCON 2025 result before the new season?",                  yesOdds: 2.10, noOdds: 1.70, pool: 12400,  category: "Sports"      },
  { id: 7,  title: "Will Morocco officially host AFCON 2025 after the Senegal controversy?",          yesOdds: 1.65, noOdds: 2.25, pool: 15800,  category: "Sports"      },
  { id: 46, title: "Will Ghana successfully host AFCON or a major football tournament soon?",         yesOdds: 2.50, noOdds: 1.50, pool: 7200,   category: "Sports"      },
  { id: 48, title: "Will Senegal win the 2025 AFCON or retain hosting rights?",                       yesOdds: 2.80, noOdds: 1.45, pool: 9200,   category: "Sports"      },
  { id: 51, title: "Will Egypt qualify for the 2026 FIFA World Cup?",                                 yesOdds: 1.70, noOdds: 2.20, pool: 12100,  category: "Sports"      },
  { id: 58, title: "Will Morocco reach the semi-finals or better in the 2026 World Cup?",             yesOdds: 1.90, noOdds: 1.85, pool: 18200,  category: "Sports"      },
  { id: 69, title: "Will Ivory Coast win or reach the final of AFCON 2025?",                          yesOdds: 2.10, noOdds: 1.75, pool: 11200,  category: "Sports"      },
  { id: 72, title: "Will Cameroon qualify for the 2026 FIFA World Cup?",                              yesOdds: 1.80, noOdds: 2.00, pool: 9800,   category: "Sports"      },

  // ── Elections (5) ──
  { id: 5,  title: "Will ANC win the South African election?",                                        yesOdds: 2.10, noOdds: 1.75, pool: 11300,  category: "Elections"   },
  { id: 15, title: "Will Denis Sassou Nguesso win the Congo presidential election in 2026?",          yesOdds: 1.45, noOdds: 2.70, pool: 14500,  category: "Elections"   },
  { id: 44, title: "Will John Mahama win the next Ghanaian presidential election?",                   yesOdds: 1.80, noOdds: 1.95, pool: 11300,  category: "Elections"   },
  { id: 78, title: "Will President Hichilema win re-election in Zambia?",                             yesOdds: 1.75, noOdds: 2.10, pool: 7800,   category: "Elections"   },
  { id: 91, title: "Will President Tebboune win re-election comfortably in Algeria?",                 yesOdds: 1.40, noOdds: 2.80, pool: 6500,   category: "Elections"   },

  // ── Politics (7) ──
  { id: 16, title: "Will South Africa pass new sovereignty protection laws before June?",              yesOdds: 1.80, noOdds: 1.95, pool: 7800,   category: "Politics"    },
  { id: 24, title: "Will Zambia agree to Trump's mineral-for-HIV-aid deal before May?",               yesOdds: 1.95, noOdds: 1.75, pool: 7100,   category: "Politics"    },
  { id: 25, title: "Will Burkina Faso President Ibrahim Traoré survive another coup attempt in 2026?",yesOdds: 1.55, noOdds: 2.40, pool: 9500,   category: "Politics"    },
  { id: 33, title: "Will Peter Obi's movement officially form a new party before 2027 elections?",    yesOdds: 1.90, noOdds: 1.85, pool: 7300,   category: "Politics"    },
  { id: 40, title: "Will President Ruto survive the next major political challenge in Kenya?",         yesOdds: 1.45, noOdds: 2.65, pool: 9100,   category: "Politics"    },
  { id: 56, title: "Will Prime Minister Abiy Ahmed face a new major conflict or crisis in 2026?",     yesOdds: 2.00, noOdds: 1.80, pool: 7100,   category: "Politics"    },
  { id: 66, title: "Will President Museveni run for another term in Uganda in 2026?",                 yesOdds: 1.40, noOdds: 2.80, pool: 8600,   category: "Politics"    },

  // ── Economy (9) ──
  { id: 4,  title: "Will the Kenyan Shilling (KES) depreciate more than 5% this month?",             yesOdds: 1.95, noOdds: 1.80, pool: 7650,   category: "Economy"     },
  { id: 10, title: "Will Dangote Refinery export over 20 cargoes of fuel across Africa by end of Q2?",yesOdds: 1.55, noOdds: 2.40, pool: 11300,  category: "Economy"     },
  { id: 23, title: "Will South Africa legalize online gambling taxation nationwide by July?",          yesOdds: 1.40, noOdds: 2.80, pool: 12400,  category: "Economy"     },
  { id: 30, title: "Will President Tinubu announce another major fuel subsidy reform by June 2026?",  yesOdds: 1.75, noOdds: 2.10, pool: 8500,   category: "Economy"     },
  { id: 32, title: "Will the Naira strengthen below ₦1,500/USD by end of Q2 2026?",                  yesOdds: 2.40, noOdds: 1.55, pool: 9800,   category: "Economy"     },
  { id: 45, title: "Will the Ghana Cedi depreciate more than 10% against the USD in 2026?",          yesOdds: 1.75, noOdds: 2.05, pool: 8500,   category: "Economy"     },
  { id: 52, title: "Will President Sisi announce major economic reforms or a currency float in 2026?",yesOdds: 1.85, noOdds: 1.90, pool: 7800,   category: "Economy"     },
  { id: 55, title: "Will Ethiopia successfully launch its new currency reform without major inflation?",yesOdds: 2.10, noOdds: 1.75, pool: 6400,  category: "Economy"     },
  { id: 79, title: "Will Zambia's copper production hit record highs in 2026?",                       yesOdds: 1.85, noOdds: 1.90, pool: 8400,   category: "Economy"     },

  // ── Music (4) ──
  { id: 26, title: "Will Burna Boy win a Grammy in 2026?",                                            yesOdds: 2.10, noOdds: 1.75, pool: 21400,  category: "Music"       },
  { id: 27, title: "Will Afrobeats surpass Latin music on Spotify global charts by end of 2026?",     yesOdds: 1.90, noOdds: 1.85, pool: 17800,  category: "Music"       },
  { id: 28, title: "Will Wizkid drop a new album before June 2026?",                                  yesOdds: 2.40, noOdds: 1.55, pool: 13200,  category: "Music"       },
  { id: 29, title: "Will Tyla win another major international award this year?",                       yesOdds: 1.65, noOdds: 2.20, pool: 15600,  category: "Music"       },

  // ── Crypto (2) ──
  { id: 21, title: "Will Nigeria rank #1 globally in crypto adoption again by June 2026?",            yesOdds: 1.60, noOdds: 2.30, pool: 9800,   category: "Crypto"      },
  { id: 22, title: "Will Algorand power more than 50% of FIFA 2026 ticket sales in Africa?",          yesOdds: 2.50, noOdds: 1.50, pool: 8200,   category: "Crypto"      },

  // ── Security (5) ──
  { id: 9,  title: "Will Boko Haram/ISWAP carry out another major bombing in Maiduguri before July?", yesOdds: 1.95, noOdds: 1.80, pool: 6800,  category: "Security"    },
  { id: 54, title: "Will the peace deal in Tigray hold throughout 2026?",                              yesOdds: 1.80, noOdds: 2.00, pool: 8200,  category: "Security"    },
  { id: 60, title: "Will the M23 conflict in DRC escalate or see a major ceasefire in 2026?",         yesOdds: 1.75, noOdds: 2.10, pool: 9300,  category: "Security"    },
  { id: 73, title: "Will the Anglophone crisis in Cameroon see major progress or ceasefire in 2026?", yesOdds: 2.50, noOdds: 1.50, pool: 6200,  category: "Security"    },
  { id: 81, title: "Will the Sudan civil war see a major ceasefire or peace deal in 2026?",           yesOdds: 2.80, noOdds: 1.45, pool: 8900,  category: "Security"    },

  // ── Commodities (2) ──
  { id: 3,  title: "Will Cocoa price exceed $4,000/ton before end of 2026?",                          yesOdds: 1.70, noOdds: 2.20, pool: 9800,  category: "Commodities" },
  { id: 108, title: "Will Brent crude oil stay above $75/barrel through Q3 2026?",                    yesOdds: 1.80, noOdds: 1.95, pool: 8600,  category: "Commodities" },

  // ── Weather (2) ──
  { id: 19,  title: "Will Malawi flooding displace over 50,000 people again before June 2026?",       yesOdds: 2.20, noOdds: 1.65, pool: 4900,  category: "Weather"     },
  { id: 104, title: "Will the 2026 cyclone season cause major damage in Mozambique?",                  yesOdds: 1.65, noOdds: 2.25, pool: 5600,  category: "Weather"     },

  // ── Finance (2) ──
  { id: 109, title: "Will the Nigerian Stock Exchange (NGX) hit a new all-time high in 2026?",        yesOdds: 1.65, noOdds: 2.30, pool: 7400,  category: "Finance"     },
  { id: 110, title: "Will the African Development Bank cut interest rates before year-end 2026?",      yesOdds: 2.10, noOdds: 1.75, pool: 6200,  category: "Finance"     },

  // ── Tech (2) ──
  { id: 111, title: "Will Africa surpass 1 billion mobile money transactions per month in 2026?",     yesOdds: 1.55, noOdds: 2.45, pool: 7800,  category: "Tech"        },
  { id: 112, title: "Will M-PESA expand to 5 or more new African countries by end of 2026?",          yesOdds: 2.20, noOdds: 1.65, pool: 5900,  category: "Tech"        },
];

export const ADMIN_MARKETS_INITIAL = [
  { id: 1,  title: "Will Nigeria qualify for 2026 World Cup?",               category: "Sports",      pool: 18450, yes: 47, status: "active",   created: "2026-01-10" },
  { id: 2,  title: "Will Senegal win AFCON 2025?",                           category: "Sports",      pool: 14200, yes: 41, status: "active",   created: "2026-01-12" },
  { id: 3,  title: "Will Cocoa price exceed $4000/ton by Dec?",              category: "Commodities", pool: 9800,  yes: 55, status: "active",   created: "2026-01-15" },
  { id: 4,  title: "Will KES depreciate more than 5% this month?",           category: "Economy",     pool: 7650,  yes: 52, status: "active",   created: "2026-01-18" },
  { id: 5,  title: "Will ANC win South African election?",                   category: "Elections",   pool: 11300, yes: 38, status: "active",   created: "2026-01-20" },
  { id: 15, title: "Will Denis Sassou Nguesso win the Congo election?",      category: "Elections",   pool: 14500, yes: 69, status: "active",   created: "2026-02-01" },
  { id: 21, title: "Will Nigeria rank #1 globally in crypto adoption?",      category: "Crypto",      pool: 9800,  yes: 61, status: "active",   created: "2026-02-10" },
  { id: 26, title: "Will Burna Boy win a Grammy in 2026?",                   category: "Music",       pool: 21400, yes: 37, status: "active",   created: "2026-02-14" },
  { id: 27, title: "Will Afrobeats surpass Latin music on Spotify?",         category: "Music",       pool: 17800, yes: 44, status: "active",   created: "2026-02-16" },
  { id: 28, title: "Will Wizkid drop a new album before June?",              category: "Music",       pool: 13200, yes: 29, status: "active",   created: "2026-02-20" },
  { id: 29, title: "Will Tyla win another major international award?",       category: "Music",       pool: 15600, yes: 60, status: "active",   created: "2026-02-22" },
  { id: 25, title: "Will Burkina Faso President Traoré survive coup attempt?", category: "Politics",  pool: 9500,  yes: 71, status: "resolved", created: "2026-01-08" },
];

export const ADMIN_USERS = [
  { id: 1, name: "@web3vee",       email: "web3vee@gmail.com",    country: "🇳🇬", balance: 3240, bets: 47, status: "active",    joined: "2025-09-01" },
  { id: 2, name: "@kenyantrader",  email: "kenyan@gmail.com",     country: "🇰🇪", balance: 2890, bets: 31, status: "active",    joined: "2025-09-14" },
  { id: 3, name: "@afropredictor", email: "afropred@outlook.com", country: "🇿🇦", balance: 2310, bets: 39, status: "active",    joined: "2025-10-02" },
  { id: 4, name: "@senegalfan",    email: "senegalfan@yahoo.com", country: "🇸🇳", balance: 1980, bets: 22, status: "active",    joined: "2025-10-18" },
  { id: 5, name: "@cryptoghanam",  email: "cryptogh@gmail.com",   country: "🇬🇭", balance: 1750, bets: 28, status: "active",    joined: "2025-11-05" },
  { id: 6, name: "@ethiopianews",  email: "ethionews@gmail.com",  country: "🇪🇹", balance: 1420, bets: 19, status: "active",    joined: "2025-11-20" },
  { id: 7, name: "@naijacrypto",   email: "naija@crypto.com",     country: "🇳🇬", balance: 920,  bets: 14, status: "suspended", joined: "2025-12-01" },
  { id: 8, name: "@afromusic99",   email: "afromus@gmail.com",    country: "🇨🇮", balance: 540,  bets: 8,  status: "active",    joined: "2026-01-10" },
];

export const ADMIN_TXNS = [
  { id: "TX001", user: "@web3vee",       type: "Deposit",    amount: 500,  currency: "NGN→USDT", status: "completed", date: "2026-04-07 14:22" },
  { id: "TX002", user: "@kenyantrader",  type: "Bet",        amount: 200,  currency: "USDT",      status: "completed", date: "2026-04-07 13:45" },
  { id: "TX003", user: "@afropredictor", type: "Withdrawal", amount: 800,  currency: "USDT→ZAR",  status: "pending",   date: "2026-04-07 12:30" },
  { id: "TX004", user: "@senegalfan",    type: "Bet",        amount: 150,  currency: "USDT",      status: "completed", date: "2026-04-07 11:10" },
  { id: "TX005", user: "@cryptoghanam",  type: "Deposit",    amount: 300,  currency: "GHS→USDT",  status: "completed", date: "2026-04-07 10:05" },
  { id: "TX006", user: "@naijacrypto",   type: "Withdrawal", amount: 1200, currency: "USDT→NGN",  status: "failed",    date: "2026-04-07 09:44" },
  { id: "TX007", user: "@ethiopianews",  type: "Bet",        amount: 75,   currency: "USDT",      status: "completed", date: "2026-04-06 22:18" },
  { id: "TX008", user: "@afromusic99",   type: "Deposit",    amount: 100,  currency: "XOF→USDT",  status: "completed", date: "2026-04-06 20:00" },
];

export const ADMIN_FLAGS = [
  { id: 1, type: "Comment",  user: "@naijacrypto",  content: "This market is rigged! Admin is scamming!",                   market: "Will ANC win?",            date: "2026-04-07", severity: "high"   },
  { id: 2, type: "Dispute",  user: "@senegalfan",   content: "I bet YES but market resolved NO. Senegal clearly won AFCON.", market: "Will Senegal win AFCON?",  date: "2026-04-06", severity: "medium" },
  { id: 3, type: "Comment",  user: "@cryptoghanam", content: "Odds look manipulated on the Burna Boy Grammy market.",        market: "Will Burna Boy win Grammy?", date: "2026-04-05", severity: "low"  },
];

export const MY_POSITIONS_INITIAL = [
  { market: "Will Nigeria qualify for 2026 World Cup?",  side: "YES", avg: 1.85, now: 1.92, traded: 50,  toWin: 92,   value: 51.8,  category: "Sports"    },
  { market: "Will Burna Boy win a Grammy in 2026?",       side: "NO",  avg: 1.75, now: 1.68, traded: 30,  toWin: 52.5, value: 29.1,  category: "Music"     },
  { market: "Will Bola Tinubu win re-election in 2027?", side: "YES", avg: 1.60, now: 1.70, traded: 100, toWin: 160,  value: 107.5, category: "Elections" },
];
