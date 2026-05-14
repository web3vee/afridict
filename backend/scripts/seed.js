/**
 * Seeds the MongoDB database with the 50 markets from staticData.
 * Run once: node backend/scripts/seed.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Market   = require("../models/Market");

const MARKETS = [
  { id: 1,   title: "Will Nigeria qualify for the 2026 FIFA World Cup?",                                yesOdds: 1.85, noOdds: 2.05, pool: 18450,  category: "Sports"      },
  { id: 2,   title: "Will Senegal win AFCON 2025?",                                                     yesOdds: 2.30, noOdds: 1.65, pool: 14200,  category: "Sports"      },
  { id: 6,   title: "Will CAF overturn the AFCON 2025 result before the new season?",                   yesOdds: 2.10, noOdds: 1.70, pool: 12400,  category: "Sports"      },
  { id: 7,   title: "Will Morocco officially host AFCON 2025 after the Senegal controversy?",           yesOdds: 1.65, noOdds: 2.25, pool: 15800,  category: "Sports"      },
  { id: 46,  title: "Will Ghana successfully host AFCON or a major football tournament soon?",          yesOdds: 2.50, noOdds: 1.50, pool: 7200,   category: "Sports"      },
  { id: 48,  title: "Will Senegal win the 2025 AFCON or retain hosting rights?",                        yesOdds: 2.80, noOdds: 1.45, pool: 9200,   category: "Sports"      },
  { id: 51,  title: "Will Egypt qualify for the 2026 FIFA World Cup?",                                  yesOdds: 1.70, noOdds: 2.20, pool: 12100,  category: "Sports"      },
  { id: 58,  title: "Will Morocco reach the semi-finals or better in the 2026 World Cup?",              yesOdds: 1.90, noOdds: 1.85, pool: 18200,  category: "Sports"      },
  { id: 69,  title: "Will Ivory Coast win or reach the final of AFCON 2025?",                           yesOdds: 2.10, noOdds: 1.75, pool: 11200,  category: "Sports"      },
  { id: 72,  title: "Will Cameroon qualify for the 2026 FIFA World Cup?",                               yesOdds: 1.80, noOdds: 2.00, pool: 9800,   category: "Sports"      },
  { id: 5,   title: "Will ANC win the South African election?",                                         yesOdds: 2.10, noOdds: 1.75, pool: 11300,  category: "Elections"   },
  { id: 15,  title: "Will Denis Sassou Nguesso win the Congo presidential election in 2026?",           yesOdds: 1.45, noOdds: 2.70, pool: 14500,  category: "Elections"   },
  { id: 44,  title: "Will John Mahama win the next Ghanaian presidential election?",                    yesOdds: 1.80, noOdds: 1.95, pool: 11300,  category: "Elections"   },
  { id: 78,  title: "Will President Hichilema win re-election in Zambia?",                              yesOdds: 1.75, noOdds: 2.10, pool: 7800,   category: "Elections"   },
  { id: 91,  title: "Will President Tebboune win re-election comfortably in Algeria?",                  yesOdds: 1.40, noOdds: 2.80, pool: 6500,   category: "Elections"   },
  { id: 16,  title: "Will South Africa pass new sovereignty protection laws before June?",               yesOdds: 1.80, noOdds: 1.95, pool: 7800,   category: "Politics"    },
  { id: 24,  title: "Will Zambia agree to Trump's mineral-for-HIV-aid deal before May?",                yesOdds: 1.95, noOdds: 1.75, pool: 7100,   category: "Politics"    },
  { id: 25,  title: "Will Burkina Faso President Ibrahim Traoré survive another coup attempt in 2026?", yesOdds: 1.55, noOdds: 2.40, pool: 9500,   category: "Politics"    },
  { id: 33,  title: "Will Peter Obi's movement officially form a new party before 2027 elections?",     yesOdds: 1.90, noOdds: 1.85, pool: 7300,   category: "Politics"    },
  { id: 40,  title: "Will President Ruto survive the next major political challenge in Kenya?",          yesOdds: 1.45, noOdds: 2.65, pool: 9100,   category: "Politics"    },
  { id: 56,  title: "Will Prime Minister Abiy Ahmed face a new major conflict or crisis in 2026?",      yesOdds: 2.00, noOdds: 1.80, pool: 7100,   category: "Politics"    },
  { id: 66,  title: "Will President Museveni run for another term in Uganda in 2026?",                  yesOdds: 1.40, noOdds: 2.80, pool: 8600,   category: "Politics"    },
  { id: 4,   title: "Will the Kenyan Shilling (KES) depreciate more than 5% this month?",              yesOdds: 1.95, noOdds: 1.80, pool: 7650,   category: "Economy"     },
  { id: 10,  title: "Will Dangote Refinery export over 20 cargoes of fuel across Africa by end of Q2?", yesOdds: 1.55, noOdds: 2.40, pool: 11300,  category: "Economy"     },
  { id: 23,  title: "Will South Africa legalize online gambling taxation nationwide by July?",           yesOdds: 1.40, noOdds: 2.80, pool: 12400,  category: "Economy"     },
  { id: 30,  title: "Will President Tinubu announce another major fuel subsidy reform by June 2026?",   yesOdds: 1.75, noOdds: 2.10, pool: 8500,   category: "Economy"     },
  { id: 32,  title: "Will the Naira strengthen below ₦1,500/USD by end of Q2 2026?",                   yesOdds: 2.40, noOdds: 1.55, pool: 9800,   category: "Economy"     },
  { id: 45,  title: "Will the Ghana Cedi depreciate more than 10% against the USD in 2026?",           yesOdds: 1.75, noOdds: 2.05, pool: 8500,   category: "Economy"     },
  { id: 52,  title: "Will President Sisi announce major economic reforms or a currency float in 2026?", yesOdds: 1.85, noOdds: 1.90, pool: 7800,   category: "Economy"     },
  { id: 55,  title: "Will Ethiopia successfully launch its new currency reform without major inflation?", yesOdds: 2.10, noOdds: 1.75, pool: 6400,  category: "Economy"     },
  { id: 79,  title: "Will Zambia's copper production hit record highs in 2026?",                        yesOdds: 1.85, noOdds: 1.90, pool: 8400,   category: "Economy"     },
  { id: 26,  title: "Will Burna Boy win a Grammy in 2026?",                                             yesOdds: 2.10, noOdds: 1.75, pool: 21400,  category: "Music"       },
  { id: 27,  title: "Will Afrobeats surpass Latin music on Spotify global charts by end of 2026?",      yesOdds: 1.90, noOdds: 1.85, pool: 17800,  category: "Music"       },
  { id: 28,  title: "Will Wizkid drop a new album before June 2026?",                                   yesOdds: 2.40, noOdds: 1.55, pool: 13200,  category: "Music"       },
  { id: 29,  title: "Will Tyla win another major international award this year?",                        yesOdds: 1.65, noOdds: 2.20, pool: 15600,  category: "Music"       },
  { id: 21,  title: "Will Nigeria rank #1 globally in crypto adoption again by June 2026?",             yesOdds: 1.60, noOdds: 2.30, pool: 9800,   category: "Crypto"      },
  { id: 22,  title: "Will Algorand power more than 50% of FIFA 2026 ticket sales in Africa?",           yesOdds: 2.50, noOdds: 1.50, pool: 8200,   category: "Crypto"      },
  { id: 9,   title: "Will Boko Haram/ISWAP carry out another major bombing in Maiduguri before July?",  yesOdds: 1.95, noOdds: 1.80, pool: 6800,   category: "Security"    },
  { id: 54,  title: "Will the peace deal in Tigray hold throughout 2026?",                               yesOdds: 1.80, noOdds: 2.00, pool: 8200,   category: "Security"    },
  { id: 60,  title: "Will the M23 conflict in DRC escalate or see a major ceasefire in 2026?",          yesOdds: 1.75, noOdds: 2.10, pool: 9300,   category: "Security"    },
  { id: 73,  title: "Will the Anglophone crisis in Cameroon see major progress or ceasefire in 2026?",  yesOdds: 2.50, noOdds: 1.50, pool: 6200,   category: "Security"    },
  { id: 81,  title: "Will the Sudan civil war see a major ceasefire or peace deal in 2026?",            yesOdds: 2.80, noOdds: 1.45, pool: 8900,   category: "Security"    },
  { id: 3,   title: "Will Cocoa price exceed $4,000/ton before end of 2026?",                           yesOdds: 1.70, noOdds: 2.20, pool: 9800,   category: "Commodities" },
  { id: 108, title: "Will Brent crude oil stay above $75/barrel through Q3 2026?",                      yesOdds: 1.80, noOdds: 1.95, pool: 8600,   category: "Commodities" },
  { id: 19,  title: "Will Malawi flooding displace over 50,000 people again before June 2026?",         yesOdds: 2.20, noOdds: 1.65, pool: 4900,   category: "Weather"     },
  { id: 104, title: "Will the 2026 cyclone season cause major damage in Mozambique?",                    yesOdds: 1.65, noOdds: 2.25, pool: 5600,   category: "Weather"     },
  { id: 109, title: "Will the Nigerian Stock Exchange (NGX) hit a new all-time high in 2026?",          yesOdds: 1.65, noOdds: 2.30, pool: 7400,   category: "Finance"     },
  { id: 110, title: "Will the African Development Bank cut interest rates before year-end 2026?",        yesOdds: 2.10, noOdds: 1.75, pool: 6200,   category: "Finance"     },
  { id: 111, title: "Will Africa surpass 1 billion mobile money transactions per month in 2026?",       yesOdds: 1.55, noOdds: 2.45, pool: 7800,   category: "Tech"        },
  { id: 112, title: "Will M-PESA expand to 5 or more new African countries by end of 2026?",            yesOdds: 2.20, noOdds: 1.65, pool: 5900,   category: "Tech"        },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/afridict");
  console.log("✅ Connected to MongoDB");

  let inserted = 0;
  let skipped  = 0;

  for (const m of MARKETS) {
    const exists = await Market.findOne({ id: m.id });
    if (exists) { skipped++; continue; }

    await Market.create({
      id:       m.id,
      title:    m.title,
      category: m.category,
      yesOdds:  m.yesOdds,
      noOdds:   m.noOdds,
      pool:     m.pool,
      yesPool:  Math.round(m.pool * (m.noOdds / (m.yesOdds + m.noOdds))),
      noPool:   Math.round(m.pool * (m.yesOdds / (m.yesOdds + m.noOdds))),
      status:   "active",
      region:   "Africa",
      creator:  "admin",
    });
    inserted++;
  }

  console.log(`✅ Seeded ${inserted} markets (${skipped} already existed)`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
