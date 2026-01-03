/**
 * Maine Lobster Dealer Tycoon
 * A tycoon-style game about the lobster dealer industry in Maine
 * Phase 2: Dynamic pricing, equipment, relationships, finance
 */

// ============================================
// GAME CONFIGURATION
// ============================================
const CONFIG = {
    startingCash: 5000,
    winCondition: 100000,
    bankruptcyThreshold: -10000, // Very forgiving - only end if deeply in debt
    daysUntilBankruptcy: 7,      // Full week to recover before game over

    // Daily operating expenses (auto-deducted each day)
    dailyExpenses: {
        base: 50,           // Basic dock fees, insurance
        perLbInventory: 1,  // Tank maintenance per lb stored
        debtPayment: 0.05   // 5% of debt auto-paid daily (if you have cash)
    },

    // Season goal - summer challenge
    summerLength: 30,  // Days of summer (the challenge period)
    goalTiers: [
        { cash: 10000, title: "Dock Hand", stars: 1, description: "You survived your first season!" },
        { cash: 25000, title: "Junior Dealer", stars: 2, description: "A promising start to your career." },
        { cash: 50000, title: "Established Dealer", stars: 3, description: "You've made a name for yourself." },
        { cash: 100000, title: "Lobster Tycoon", stars: 4, description: "The coast knows your name!" },
        { cash: 250000, title: "Lobster Legend", stars: 5, description: "A true master of the trade!" }
    ],

    // Base pricing
    baseLobsterPrice: 4.50,
    priceVariation: 1.00,

    // Seasonal modifiers
    seasons: {
        Summer: { buyMod: 1.15, sellMod: 1.25, boatChance: 0.9, name: "Summer" },
        Fall: { buyMod: 1.0, sellMod: 1.0, boatChance: 0.8, name: "Fall" },
        Winter: { buyMod: 0.8, sellMod: 0.9, boatChance: 0.5, name: "Winter" },
        Spring: { buyMod: 0.95, sellMod: 1.1, boatChance: 0.75, name: "Spring" }
    },

    // Weather effects
    weather: {
        sunny: { icon: "☀️", name: "Sunny", boatMod: 1.0, buyerMod: 1.0, priceMod: 1.0 },
        cloudy: { icon: "☁️", name: "Cloudy", boatMod: 0.9, buyerMod: 0.9, priceMod: 1.0 },
        rainy: { icon: "🌧️", name: "Rainy", boatMod: 0.7, buyerMod: 0.7, priceMod: 1.1 },
        stormy: { icon: "⛈️", name: "Stormy", boatMod: 0.0, buyerMod: 0.5, priceMod: 1.3 },
        foggy: { icon: "🌫️", name: "Foggy", boatMod: 0.4, buyerMod: 0.8, priceMod: 1.05 }
    },

    // Quality grades
    // Lobster grades (authentic Maine system)
    // Selects: 2+ lbs, premium price
    // Quarters: 1.25-2 lbs, good price
    // Chix: 1-1.25 lbs (chicken lobsters), lower price
    // Run: ungraded mix, sold as-is before grading table
    grades: {
        select: { name: "Selects", shortName: "Sel", buyMod: 1.25, sellMod: 1.5, color: "#ffd700", weight: "2+ lbs" },
        quarter: { name: "Quarters", shortName: "Qtr", buyMod: 1.0, sellMod: 1.15, color: "#c0c0c0", weight: "1.25-2 lbs" },
        chix: { name: "Chix", shortName: "Chx", buyMod: 0.85, sellMod: 0.85, color: "#cd7f32", weight: "1-1.25 lbs" }
    },

    // Boat names
    boatNames: [
        "Mary Lou", "Downeast Dreamer", "Lucky Catch", "Sea Spray",
        "Morning Star", "Old Salt", "Coastal Runner", "Tide Rider",
        "Harbor Queen", "Misty Morning", "Wave Dancer", "Salty Dog",
        "Blue Horizon", "Lobster Lady", "Captain's Pride", "Sea Breeze"
    ],

    // Boat types - different vessels with different characteristics
    boatTypes: {
        dory: {
            name: "Dory",
            emoji: "🚣",
            minCatch: 30,
            maxCatch: 80,
            timer: 25,  // Seconds before leaving
            qualityBias: -0.1,  // Slightly lower quality
            arrivalDelay: 0,  // Arrives immediately
            description: "Small but fast"
        },
        lobsterBoat: {
            name: "Lobster Boat",
            emoji: "🚤",
            minCatch: 80,
            maxCatch: 200,
            timer: 40,
            qualityBias: 0,
            arrivalDelay: 2,  // 2 second delay
            description: "Standard vessel"
        },
        trawler: {
            name: "Trawler",
            emoji: "🚢",
            minCatch: 150,
            maxCatch: 400,
            timer: 60,
            qualityBias: 0.15,  // Higher quality catch
            arrivalDelay: 4,  // 4 second delay
            description: "Big haul, premium catch"
        }
    },

    // Rival dealer who steals boats
    rivalDealer: {
        name: "Slick Rick",
        taunt: [
            "Too slow! Slick Rick takes the catch!",
            "Slick Rick swoops in! Better luck next time!",
            "Rick's been watching... and waiting!",
            "That lobster's going to Rick's now!",
            "Snooze you lose! Rick wins again!"
        ]
    },

    // Captains with personality traits
    captains: {
        "Cap'n Joe": { trait: "reliable", priceVar: 0.95, catchMod: 1.0, flavorText: "Always arrives on time" },
        "Old Pete": { trait: "generous", priceVar: 0.85, catchMod: 0.9, flavorText: "Gives good prices to regulars" },
        "Sarah Mae": { trait: "ambitious", priceVar: 1.05, catchMod: 1.2, flavorText: "Big hauls, premium prices" },
        "Big Mike": { trait: "steady", priceVar: 1.0, catchMod: 1.1, flavorText: "Consistent quality every time" },
        "Tommy Two-Traps": { trait: "haggler", priceVar: 0.9, catchMod: 0.85, flavorText: "Will deal if you're loyal" },
        "Weathered Walt": { trait: "grumpy", priceVar: 1.1, catchMod: 1.05, flavorText: "Pricey but experienced" },
        "Lucky Lucy": { trait: "lucky", priceVar: 1.0, catchMod: 1.15, flavorText: "Her traps always produce" },
        "Salty Sam": { trait: "storyteller", priceVar: 0.95, catchMod: 0.95, flavorText: "Great tales, fair prices" },
        "Iron Jim": { trait: "tough", priceVar: 1.05, catchMod: 1.25, flavorText: "Works all weather conditions" },
        "Young Ben": { trait: "eager", priceVar: 0.9, catchMod: 0.8, flavorText: "New to the trade, keen to sell" }
    },
    captainNames: [
        "Cap'n Joe", "Old Pete", "Sarah Mae", "Big Mike", "Tommy Two-Traps",
        "Weathered Walt", "Lucky Lucy", "Salty Sam", "Iron Jim", "Young Ben"
    ],

    // Crusty dockworker commentary
    dockworker: {
        name: "Old Barnacle Bob",
        emoji: "🧔",

        // Greetings based on time
        morning: [
            "Ayuh, another day on the dock!",
            "Coffee's hot and lobstahs are crawlin'!",
            "The gulls are hungry, just like me wallet.",
            "Rise and shine! Them bugs ain't gonna sell themselves.",
            "Mornin'! My bones say it's gonna be a good one."
        ],

        // Weather commentary
        weather: {
            sunny: [
                "Perfect day for haulin' traps!",
                "Sun's out, the tourists'll be spendin'!",
                "Ain't a cloud in sight - boats'll be loaded!"
            ],
            cloudy: [
                "Bit overcast, but we've seen worse.",
                "Clouds rollin' in, but that ain't stoppin' nobody.",
                "Gray skies never hurt a lobstah."
            ],
            rainy: [
                "Weathah's sour today. Fewer boats I reckon.",
                "Rain's keepin' the tourists home. Sales'll be slow.",
                "Wet day ahead. At least the lobstahs don't mind!"
            ],
            stormy: [
                "Wicked storm brewin'! No boats today, I'd wager.",
                "Stay off the watah! Mother Nature's angry.",
                "Storm's comin' in fierce. Smart captains stay in port."
            ],
            foggy: [
                "Fog's thickah than chowdah out there.",
                "Can't see past the end of the dock. Boats'll be late.",
                "Pea soup fog today. Hope the captains find their way."
            ]
        },

        // Buying commentary
        buying: {
            good_deal: [
                "Now that's a fair price! You got a good eye.",
                "Smart buyin' there. Old timers would approve.",
                "That captain gave ya a square deal."
            ],
            expensive: [
                "Ouch! That's steep. Market must be hot.",
                "Prices like that make my wallet weep.",
                "Expensive catch! Hope you can flip it quick."
            ],
            big_haul: [
                "Holy mackerel! That's a lot of lobstah!",
                "You're gonna need a biggah tank!",
                "Big haul! The tanks'll be jumpin' tonight."
            ],
            loyal_captain: [
                "That captain's been good to ya. Keep 'im close.",
                "Loyalty goes both ways on these docks.",
                "A trusted fishahman is worth their weight in lobstah."
            ]
        },

        // Selling commentary
        selling: {
            good_sale: [
                "Cha-ching! That's what I like to hear!",
                "Nice sale! Keep that money flowin'!",
                "You're gettin' the hang of this, kid."
            ],
            big_sale: [
                "Now THAT'S a payday!",
                "Whoa! You just made some serious clams!",
                "Hot dog! That buyer's got deep pockets!"
            ],
            premium_buyer: [
                "Fancy buyer there. They pay top dollah for quality.",
                "Treat them special buyers right, they'll come back.",
                "Rich folks love their Maine lobstah!"
            ]
        },

        // Market trends
        market: {
            rising: [
                "Prices are climbin'! Might be time to sell.",
                "Market's hot! Everyone wants lobstah today.",
                "Get 'em while they're payin' top dollah!"
            ],
            falling: [
                "Market's droppin'. Might wanna hold onto some inventory.",
                "Prices are sinkin' like a leaky dory.",
                "Tough market today. Happens to the best of us."
            ],
            stable: [
                "Market's steady as she goes.",
                "Prices are holdin'. Nothing fancy, nothing bad.",
                "Stable market - predictable, just how I like it."
            ]
        },

        // Season commentary
        season: {
            Summer: [
                "Summer's peak season! Tourists everywhere!",
                "Lobstah rolls and sunshine - life is good!",
                "Hot months mean hot sales!"
            ],
            Fall: [
                "Fall's comin'. Prices settle down a bit.",
                "Leaf peepers still buy lobstah, just not as many.",
                "Autumn in Maine. Best time of year, I'd say."
            ],
            Winter: [
                "Brrr! Cold months ahead. Boats stay in more.",
                "Winter's tough, but we're toughah!",
                "Fewer boats, fewer buyers. But we manage."
            ],
            Spring: [
                "Spring's arrivin'! Waters warmin' up.",
                "New season, new opportunities!",
                "Birds are back, and so are the buyers."
            ]
        },

        // Equipment purchase
        equipment: [
            "Smart investment! That'll pay for itself.",
            "Upgradin' eh? Movin' up in the world!",
            "Good gear makes good business.",
            "Now you're lookin' like a real dealah!"
        ],

        // Low cash warnings
        low_cash: [
            "Careful there! Wallet's lookin' thin.",
            "Might wanna watch your spendin', friend.",
            "Bank's always there if you need a loan. Just watch the interest!"
        ],

        // Success milestones
        milestones: {
            first_10k: "Ten thousand dollahs! You're on your way!",
            first_25k: "Twenty-five grand! I knew you had it in ya!",
            first_50k: "Fifty thousand! You're a proper lobstah baron now!",
            first_75k: "Seventy-five K! Almost at the top!"
        },

        // Random idle chatter
        idle: [
            "You know, my grandpappy was a lobstahman too...",
            "Best chowdah in Maine is down at the Clam Shack.",
            "Seen a lot of dealah come and go. You got the look of a stayer.",
            "These docks have stories, I tell ya. Stories.",
            "Seagulls are gettin' bold this year.",
            "Remember: buy low, sell high. Oldest trick in the book.",
            "Trust your gut - it knows the lobstah business.",
            "Maine's the only place to be, I always say."
        ]
    },

    // Daily flavor events (one-liners, no popups)
    dailyFlavor: [
        "A pod of harbor seals passes by the dock.",
        "The coffee pot at the bait shop is finally fixed.",
        "Someone left a half-eaten lobster roll on the dock.",
        "A tourist asks if the lobsters bite.",
        "The lighthouse horn sounds twice.",
        "A gull steals a fisherman's sandwich.",
        "Old Pete is humming a sea shanty.",
        "The tide is unusually high today.",
        "A fishing cat watches from the pier.",
        "Someone's truck won't start in the parking lot.",
        "The church bells ring noon.",
        "A whale spout spotted in the distance.",
        "Kids are crabbing off the end of the dock.",
        "The harbormaster is arguing with a yacht owner.",
        "Fresh donuts at the bait shop today.",
        "A pelican lands on a mooring post.",
        "The wind shifted north overnight.",
        "A local band is setting up at the pier restaurant.",
        "First cruise ship of the season docked this morning.",
        "The fishermen are talking about 'the big one'."
    ],

    // Old Pete's Fortune Cookie Tips (shown once per day)
    fortuneTips: [
        "A wise dealer knows when to hold and when to fold.",
        "The early bird gets the lobster, but the patient bird gets the best price.",
        "Trust is earned one pound at a time.",
        "A full tank and empty wallet is better than the reverse.",
        "The sea provides, but only to those who show up.",
        "Your reputation arrives before you do.",
        "Bad weather makes for good stories and empty docks.",
        "The best deals come to those who wait... but not too long.",
        "A captain who trusts you will save you money in the long run.",
        "Fresh lobster sells itself. Old lobster sits and stinks.",
        "Today's loss is tomorrow's lesson.",
        "The coast has a long memory. Trade fairly.",
        "When the tourists arrive, so do the profits.",
        "A streak of luck is just hard work in disguise.",
        "The dock never forgets who was there on the slow days.",
        "Buy from friends, sell to strangers.",
        "A penny saved on buying is a penny earned on selling.",
        "The fog lifts, the boats come in, and life goes on.",
        "Fortune favors the prepared dealer.",
        "Every captain was once a newcomer too.",
        "The best time to buy was yesterday. The second best is now.",
        "A good name is worth more than a full wallet.",
        "When others fear the storm, opportunity awaits.",
        "Small margins, many trades - that's the Maine way.",
        "The lobster doesn't care who catches it. You should care who sells it.",
        "Consistency builds empires. Panic destroys them.",
        "A loyal buyer is worth ten tourists.",
        "The sea gives and the sea takes. Balance your books accordingly.",
        "When Cap'n Joe smiles, buy everything he's got.",
        "The secret to success? Show up every day."
    ],

    // Nickname components based on playstyle
    nicknames: {
        prefixes: {
            highVolume: ["The", "Big", "Mighty", "Legendary"],
            cautious: ["Careful", "Steady", "Wise", "Patient"],
            risky: ["Wild", "Reckless", "Lucky", "Bold"],
            consistent: ["Reliable", "Iron", "Steady", "Old"],
            newbie: ["Young", "Fresh", "New", "Eager"]
        },
        locations: ["Stonington", "Portland", "Bar Harbor", "Rockland", "Camden", "Boothbay", "Kennebunk", "Maine"],
        suffixes: {
            highProfit: ["Shark", "Tycoon", "Baron", "King", "Master"],
            trader: ["Trader", "Dealer", "Merchant", "Handler"],
            survivor: ["Survivor", "Fighter", "Scrapper", "Hustler"],
            legendary: ["Legend", "Icon", "Pioneer", "Champion"],
            animal: ["Lobster", "Crab", "Seal", "Whale", "Gull"]
        }
    },

    // Speed run milestones
    speedRunTargets: [10000, 25000, 50000, 75000, 100000]
};

// ============================================
// REPUTATION & TRUST SYSTEM
// ============================================
const REPUTATION_TIERS = {
    "Dock Nobody": { min: 0, max: 99 },
    "Local Regular": { min: 100, max: 249 },
    "Known Dealer": { min: 250, max: 499 },
    "Regional Player": { min: 500, max: 899 },
    "Statewide Power": { min: 900, max: Infinity }
};

const TRUST_THRESHOLDS = {
    cold: { min: -100, max: -30 },
    neutral: { min: -29, max: 29 },
    warm: { min: 30, max: 69 },
    preferred: { min: 70, max: 100 }
};

// Trust effects on prices
const TRUST_PRICE_EFFECTS = {
    cold: { buyMod: 1.08, sellMod: 0.94 },      // +8% buy, -6% sell
    neutral: { buyMod: 1.0, sellMod: 1.0 },     // No effect
    warm: { buyMod: 0.97, sellMod: 1.03 },      // -3% buy, +3% sell
    preferred: { buyMod: 0.94, sellMod: 1.05 }  // -6% buy, +5% sell
};

// Reputation-gated unlocks
const REPUTATION_UNLOCKS = {
    "Dock Nobody": {
        maxSellers: 2,
        maxBuyers: 2,
        features: []
    },
    "Local Regular": {
        maxSellers: 3,
        maxBuyers: 3,
        features: ["premium_buyers"]
    },
    "Known Dealer": {
        maxSellers: 4,
        maxBuyers: 4,
        features: ["premium_buyers", "bulk_orders"]
    },
    "Regional Player": {
        maxSellers: 5,
        maxBuyers: 5,
        features: ["premium_buyers", "bulk_orders", "exclusive_suppliers"]
    },
    "Statewide Power": {
        maxSellers: 6,
        maxBuyers: 6,
        features: ["premium_buyers", "bulk_orders", "exclusive_suppliers", "price_negotiation"]
    }
};

// Seller NPC archetypes
const SELLER_ARCHETYPES = {
    reliable: { priceVar: 0.95, supplyMod: 1.0, description: "Consistent prices, steady supply" },
    generous: { priceVar: 0.85, supplyMod: 0.9, description: "Great prices, smaller catches" },
    ambitious: { priceVar: 1.05, supplyMod: 1.3, description: "Premium prices, big hauls" },
    grumpy: { priceVar: 1.0, supplyMod: 1.0, description: "Fair but hard to impress" },
    newcomer: { priceVar: 0.90, supplyMod: 0.8, description: "Eager to build relationships" }
};

// Buyer NPC types
const BUYER_TYPES = {
    restaurant: { priceMod: 1.1, minFreshness: 80, volumeRange: [20, 80], description: "Pays premium for fresh" },
    wholesaler: { priceMod: 0.95, minFreshness: 50, volumeRange: [100, 300], description: "Bulk orders, lower prices" },
    tourist: { priceMod: 1.05, minFreshness: 70, volumeRange: [5, 30], description: "Small orders, decent prices" },
    exporter: { priceMod: 1.0, minFreshness: 90, volumeRange: [150, 400], description: "Huge orders, needs top quality" }
};

// Equipment definitions
const EQUIPMENT = {
    // Tanks
    largeTank: {
        id: "largeTank", name: "Large Tank", category: "tanks",
        cost: 3000, description: "Increases capacity to 800 lbs",
        effect: { capacityBonus: 300 }
    },
    industrialTank: {
        id: "industrialTank", name: "Industrial Tank", category: "tanks",
        cost: 8000, description: "Increases capacity to 1,500 lbs",
        effect: { capacityBonus: 1000 }, requires: "largeTank"
    },
    filtration: {
        id: "filtration", name: "Filtration System", category: "tanks",
        cost: 2000, description: "Reduces daily mortality to 2%",
        effect: { mortalityRate: 0.02 }
    },
    chiller: {
        id: "chiller", name: "Chiller Unit", category: "tanks",
        cost: 4000, description: "Mortality 0.5%, slows quality decay",
        effect: { mortalityRate: 0.005, qualityDecayMod: 0.5 }, requires: "filtration"
    },

    // Vehicles
    deliveryVan: {
        id: "deliveryVan", name: "Delivery Van", category: "vehicles",
        cost: 5000, description: "Access premium buyers, +15% sell prices",
        effect: { premiumBuyers: true, deliveryBonus: 0.15 }
    },
    refrigeratedTruck: {
        id: "refrigeratedTruck", name: "Refrigerated Truck", category: "vehicles",
        cost: 12000, description: "-20% decay rate, +25% sell prices",
        effect: { decayReduction: 0.2, deliveryBonus: 0.25 }, requires: "deliveryVan"
    },
    dockRunner: {
        id: "dockRunner", name: "Dock Runner", category: "vehicles",
        cost: 3500, description: "See 2 extra boats per day",
        effect: { extraBoats: 2 }
    },

    // Processing
    scale: {
        id: "scale", name: "Commercial Scale", category: "processing",
        cost: 800, description: "+5% on all transactions",
        effect: { transactionBonus: 0.05 }
    },
    gradingTable: {
        id: "gradingTable", name: "Grading Table", category: "processing",
        cost: 1500, description: "Grade lobsters into Sel/Qtr/Chx for premium sales",
        effect: { gradingEnabled: true }
    },
    bandingStation: {
        id: "bandingStation", name: "Banding Station", category: "processing",
        cost: 600, description: "Required for restaurant sales",
        effect: { restaurantEnabled: true }
    },
    marketIntel: {
        id: "marketIntel", name: "Market Intel", category: "processing",
        cost: 2500, description: "Preview tomorrow's buyer demand range",
        effect: { demandForecast: true }
    }
};

// ============================================
// RIVAL DEALERS CONFIGURATION
// ============================================
const RIVALS = {
    slickRick: {
        id: "slickRick",
        name: "Slick Rick",
        emoji: "🎩",
        personality: "aggressive", // Bids high, takes risks
        startingCash: 6000,
        bidStyle: 1.15, // Willing to pay 15% over base
        taunt: [
            "Too slow there, friend!",
            "Maybe next time, rookie.",
            "This dock ain't big enough for both of us!",
            "You snooze, you lose!"
        ],
        lose: [
            "Hmph. Lucky break.",
            "Won't happen again.",
            "Enjoy it while it lasts."
        ]
    },
    prudentPenny: {
        id: "prudentPenny",
        name: "Prudent Penny",
        emoji: "📊",
        personality: "conservative", // Only bids on good deals
        startingCash: 8000,
        bidStyle: 0.95, // Only pays below market
        taunt: [
            "The numbers don't lie, dear.",
            "Patience wins the race.",
            "I calculated this perfectly."
        ],
        lose: [
            "Hmm, my spreadsheet needs updating.",
            "A minor miscalculation.",
            "Well played, I suppose."
        ]
    },
    crazyCarl: {
        id: "crazyCarl",
        name: "Crazy Carl",
        emoji: "🤪",
        personality: "chaotic", // Unpredictable bidding
        startingCash: 4000,
        bidStyle: 1.0, // Random modifier applied
        taunt: [
            "LOBSTERS! I NEED 'EM ALL!",
            "You can't predict CRAZY!",
            "My horoscope said today was MY day!",
            "THE OCEAN SPEAKS TO ME!"
        ],
        lose: [
            "The stars weren't aligned...",
            "Mercury must be in retrograde!",
            "NOOOOO! My precious lobsters!"
        ]
    }
};

// ============================================
// ACHIEVEMENTS SYSTEM
// ============================================
const ACHIEVEMENTS = {
    // Money milestones (based on earnings, not starting cash)
    firstSale: {
        id: "firstSale",
        name: "First Sale",
        description: "Sell your first lobster",
        emoji: "💵",
        condition: (state) => state.stats.totalMoneyEarned > 0,
        reward: { type: "cash", amount: 50 },
        tier: "bronze"
    },
    thousandEarned: {
        id: "thousandEarned",
        name: "Getting Started",
        description: "Earn $1,000 from sales",
        emoji: "💰",
        condition: (state) => state.stats.totalMoneyEarned >= 1000,
        reward: { type: "cash", amount: 100 },
        tier: "bronze"
    },
    tenThousandEarned: {
        id: "tenThousandEarned",
        name: "Serious Business",
        description: "Earn $10,000 from sales",
        emoji: "💎",
        condition: (state) => state.stats.totalMoneyEarned >= 10000,
        reward: { type: "cash", amount: 500 },
        tier: "silver"
    },
    fiftyThousandEarned: {
        id: "fiftyThousandEarned",
        name: "Big League",
        description: "Earn $50,000 from sales",
        emoji: "🏆",
        condition: (state) => state.stats.totalMoneyEarned >= 50000,
        reward: { type: "cash", amount: 2000 },
        tier: "gold"
    },

    // Trading achievements
    firstBuy: {
        id: "firstBuy",
        name: "First Catch",
        description: "Buy your first lobster",
        emoji: "🦞",
        condition: (state) => state.stats.totalLobstersBought > 0,
        reward: { type: "reputation", amount: 5 },
        tier: "bronze"
    },
    bulkBuyer: {
        id: "bulkBuyer",
        name: "Bulk Buyer",
        description: "Buy 1,000 lbs total",
        emoji: "📦",
        condition: (state) => state.stats.totalLobstersBought >= 1000,
        reward: { type: "cash", amount: 300 },
        tier: "silver"
    },
    lobsterBaron: {
        id: "lobsterBaron",
        name: "Lobster Baron",
        description: "Buy 10,000 lbs total",
        emoji: "👑",
        condition: (state) => state.stats.totalLobstersBought >= 10000,
        reward: { type: "prestige", amount: 1 },
        tier: "gold"
    },

    // Quality achievements
    qualityDealer: {
        id: "qualityDealer",
        name: "Quality Dealer",
        description: "Sell 200 lbs of selects",
        emoji: "⭐",
        condition: (state) => (state.stats.selectsSold || 0) >= 200,
        reward: { type: "reputation", amount: 10 },
        tier: "silver"
    },
    premiumOnly: {
        id: "premiumOnly",
        name: "Premium Only",
        description: "Sell 1,000 lbs of selects",
        emoji: "💎",
        condition: (state) => (state.stats.selectsSold || 0) >= 1000,
        reward: { type: "prestige", amount: 1 },
        tier: "gold"
    },

    // Location achievements
    worldTraveler: {
        id: "worldTraveler",
        name: "Coast Explorer",
        description: "Visit all 7 towns",
        emoji: "🗺️",
        condition: (state) => (state.townsVisited || []).length >= 7,
        reward: { type: "cash", amount: 1000 },
        tier: "silver"
    },
    arbitrageMaster: {
        id: "arbitrageMaster",
        name: "Arbitrage Master",
        description: "Make $5,000 profit from geographic arbitrage",
        emoji: "📈",
        condition: (state) => (state.stats.arbitrageProfit || 0) >= 5000,
        reward: { type: "prestige", amount: 1 },
        tier: "gold"
    },

    // Rival achievements
    rivalSlayer: {
        id: "rivalSlayer",
        name: "Rival Slayer",
        description: "Outbid rivals 10 times",
        emoji: "⚔️",
        condition: (state) => state.stats.rivalsOutbid >= 10,
        reward: { type: "reputation", amount: 15 },
        tier: "silver"
    },
    topDog: {
        id: "topDog",
        name: "Top Dog",
        description: "Have a 7-day profit streak",
        emoji: "🥇",
        condition: (state) => (state.bestStreak || 0) >= 7,
        reward: { type: "prestige", amount: 2 },
        tier: "gold"
    },

    // Survival achievements
    survivor: {
        id: "survivor",
        name: "Survivor",
        description: "Recover from negative net worth",
        emoji: "💪",
        condition: (state) => state.stats.recoveredFromDebt || false,
        reward: { type: "reputation", amount: 20 },
        tier: "silver"
    },
    debtFree: {
        id: "debtFree",
        name: "Debt Free",
        description: "Pay off a loan completely",
        emoji: "🎉",
        condition: (state) => state.stats.loansPaidOff >= 1,
        reward: { type: "cash", amount: 500 },
        tier: "bronze"
    },

    // Relationship achievements
    friendOfFishermen: {
        id: "friendOfFishermen",
        name: "Friend of Fishermen",
        description: "Max loyalty with 3 captains",
        emoji: "🎣",
        condition: (state) => {
            const maxLoyal = Object.values(state.fishermenRelations || {}).filter(v => v >= 50).length;
            return maxLoyal >= 3;
        },
        reward: { type: "reputation", amount: 25 },
        tier: "gold"
    },

    // Special achievements
    marketManipulator: {
        id: "marketManipulator",
        name: "Market Manipulator",
        description: "Corner the market (own 80% of town supply)",
        emoji: "🎭",
        condition: (state) => state.stats.marketsCornered >= 1,
        reward: { type: "prestige", amount: 2 },
        tier: "gold"
    },
    centuryClub: {
        id: "centuryClub",
        name: "Century Club",
        description: "Survive 100 days",
        emoji: "📅",
        condition: (state) => state.day >= 100,
        reward: { type: "prestige", amount: 1 },
        tier: "gold"
    }
};

// ============================================
// CAPTAIN STORYLINES
// ============================================
const CAPTAIN_STORIES = {
    boatRepair: {
        id: "boatRepair",
        title: "A Captain in Need",
        trigger: (state, captain) => {
            const loyalty = state.fishermenRelations[captain] || 0;
            return loyalty >= 20 && Math.random() < 0.02;
        },
        story: (captain) => `Captain ${captain}'s boat engine is failing. He needs $1,500 for repairs or he'll be out of business for weeks.`,
        choices: [
            {
                text: "Lend $1,500 (They'll remember this)",
                cost: 1500,
                effect: (state, captain) => {
                    state.fishermenRelations[captain] = Math.min(100, (state.fishermenRelations[captain] || 0) + 30);
                    state.reputation = (state.reputation || 50) + 10;
                    return `${captain} is deeply grateful. "I won't forget this, friend."`;
                }
            },
            {
                text: "Offer $500 (Partial help)",
                cost: 500,
                effect: (state, captain) => {
                    state.fishermenRelations[captain] = Math.min(100, (state.fishermenRelations[captain] || 0) + 10);
                    return `${captain} thanks you. "Every bit helps."`;
                }
            },
            {
                text: "Can't help right now",
                cost: 0,
                effect: (state, captain) => {
                    state.fishermenRelations[captain] = Math.max(0, (state.fishermenRelations[captain] || 0) - 10);
                    return `${captain} nods sadly. "I understand. Times are tough for everyone."`;
                }
            }
        ]
    },
    familyEmergency: {
        id: "familyEmergency",
        title: "Family Matters",
        trigger: (state, captain) => {
            const loyalty = state.fishermenRelations[captain] || 0;
            return loyalty >= 30 && Math.random() < 0.015;
        },
        story: (captain) => `Captain ${captain}'s daughter is getting married next week. He wants to take a few days off but is worried about losing his best customer (you) to rivals.`,
        choices: [
            {
                text: "\"Family first. I'll wait for you.\" (+loyalty, skip 3 days of his boats)",
                cost: 0,
                effect: (state, captain) => {
                    state.fishermenRelations[captain] = Math.min(100, (state.fishermenRelations[captain] || 0) + 25);
                    state.captainAbsent = state.captainAbsent || {};
                    state.captainAbsent[captain] = 3;
                    state.reputation = (state.reputation || 50) + 5;
                    return `${captain}'s eyes light up. "You're good people. I'll bring you the best catch when I'm back!"`;
                }
            },
            {
                text: "\"Business is business. I'll buy from others.\"",
                cost: 0,
                effect: (state, captain) => {
                    state.fishermenRelations[captain] = Math.max(0, (state.fishermenRelations[captain] || 0) - 15);
                    return `${captain} frowns. "I see how it is."`;
                }
            }
        ]
    },
    secretSpot: {
        id: "secretSpot",
        title: "The Secret Spot",
        trigger: (state, captain) => {
            const loyalty = state.fishermenRelations[captain] || 0;
            return loyalty >= 50 && Math.random() < 0.01 && !state.secretSpotRevealed;
        },
        story: (captain) => `Captain ${captain} pulls you aside. "I've been fishing these waters for 30 years. I know a spot... pristine lobsters, barely touched. But I only share it with people I trust."`,
        choices: [
            {
                text: "\"I'm honored. Show me.\" (Unlock premium catches from this captain)",
                cost: 0,
                effect: (state, captain) => {
                    state.secretSpotRevealed = true;
                    state.secretSpotCaptain = captain;
                    state.fishermenRelations[captain] = 100;
                    return `${captain} grins. "From now on, I'll bring you the good stuff. A-grade, every time."`;
                }
            }
        ]
    },
    rivalPoaching: {
        id: "rivalPoaching",
        title: "A Tempting Offer",
        trigger: (state, captain) => {
            const loyalty = state.fishermenRelations[captain] || 0;
            return loyalty >= 10 && loyalty < 40 && Math.random() < 0.03;
        },
        story: (captain) => `Captain ${captain} seems uncomfortable. "Look, I like doing business with you, but ${Object.keys(RIVALS)[0]} offered me 20% more for exclusive rights to my catch..."`,
        choices: [
            {
                text: "Match the offer (+20% cost for this captain's lobsters)",
                cost: 0,
                effect: (state, captain) => {
                    state.captainPremiums = state.captainPremiums || {};
                    state.captainPremiums[captain] = 1.2;
                    state.fishermenRelations[captain] = Math.min(100, (state.fishermenRelations[captain] || 0) + 15);
                    return `${captain} shakes your hand. "Deal. I'll keep bringing my catch to you."`;
                }
            },
            {
                text: "\"I won't be held hostage. Do what you must.\"",
                cost: 0,
                effect: (state, captain) => {
                    state.fishermenRelations[captain] = 0;
                    state.captainLostToRival = state.captainLostToRival || [];
                    state.captainLostToRival.push(captain);
                    return `${captain} shrugs. "Business is business." He walks toward your rival's stand.`;
                }
            },
            {
                text: "Counter-offer: \"I'll take ALL your catch, guaranteed. 10% premium.\"",
                cost: 0,
                effect: (state, captain) => {
                    state.captainPremiums = state.captainPremiums || {};
                    state.captainPremiums[captain] = 1.1;
                    state.exclusiveCaptains = state.exclusiveCaptains || [];
                    state.exclusiveCaptains.push(captain);
                    state.fishermenRelations[captain] = Math.min(100, (state.fishermenRelations[captain] || 0) + 20);
                    return `${captain} considers, then nods. "Guaranteed sale? That's worth more than a few extra cents. You've got a deal."`;
                }
            }
        ]
    },
    bigCatch: {
        id: "bigCatch",
        title: "Once in a Lifetime",
        trigger: (state, captain) => {
            const loyalty = state.fishermenRelations[captain] || 0;
            return loyalty >= 40 && Math.random() < 0.01;
        },
        story: (captain) => `Captain ${captain} radios in, excitement in his voice. "You're not gonna believe this - I found a MASSIVE haul! 500 lbs, mostly premium! But I need $3,000 upfront to pay my crew overtime to haul it all in. You in?"`,
        choices: [
            {
                text: "\"Take my money!\" (Pay $3,000, get 500 lbs A-grade at normal price)",
                cost: 3000,
                effect: (state, captain) => {
                    state.pendingSpecialDelivery = {
                        captain: captain,
                        amount: 500,
                        grade: 'A',
                        day: state.day + 1
                    };
                    return `${captain} whoops with joy. "Coming in tomorrow with the catch of a lifetime!"`;
                }
            },
            {
                text: "\"Too risky for me.\"",
                cost: 0,
                effect: (state, captain) => {
                    state.fishermenRelations[captain] = Math.max(0, (state.fishermenRelations[captain] || 0) - 5);
                    // Rival gets it instead
                    const rivalId = Object.keys(state.rivals)[Math.floor(Math.random() * Object.keys(state.rivals).length)];
                    if (rivalId && state.rivals[rivalId]) {
                        state.rivals[rivalId].inventory += 400;
                    }
                    return `${captain} sighs. "Alright, I'll see if ${RIVALS[rivalId]?.name || 'someone else'} is interested..."`;
                }
            }
        ]
    }
};

// ============================================
// PRESTIGE & LEGACY SYSTEM
// ============================================
const PRESTIGE_REWARDS = {
    1: { name: "Apprentice Dealer", bonus: "startingCash", amount: 500 },
    2: { name: "Journeyman Dealer", bonus: "startingCash", amount: 1000 },
    3: { name: "Expert Dealer", bonus: "startingReputation", amount: 10 },
    5: { name: "Master Dealer", bonus: "priceBonus", amount: 0.05 },
    7: { name: "Lobster Tycoon", bonus: "startingEquipment", item: "commercialScale" },
    10: { name: "Lobster Baron", bonus: "startingCash", amount: 5000 },
    15: { name: "Lobster Legend", bonus: "allBonuses", amount: 1 }
};

const RETIREMENT_OPTIONS = {
    comfortable: {
        id: "comfortable",
        name: "Comfortable Retirement",
        requirement: 50000,
        prestige: 1,
        description: "Sell your business and retire to a quiet life.",
        ending: "You sold your dealership and bought a small cottage overlooking the harbor. Some say they still see you on the docks at sunrise, coffee in hand, watching the boats come in."
    },
    wealthy: {
        id: "wealthy",
        name: "Wealthy Magnate",
        requirement: 100000,
        prestige: 2,
        description: "Build an empire and become a legend.",
        ending: "Your name is synonymous with Maine lobster. The 'Lobster Baron' they call you. Your empire spans the coast, and young dealers dream of following in your footsteps."
    },
    legendary: {
        id: "legendary",
        name: "Living Legend",
        requirement: 250000,
        prestige: 5,
        description: "Achieve immortal status in Maine lobster history.",
        ending: "They named a harbor after you. The annual Lobster Festival features a statue in your honor. Old Barnacle Bob tells stories of your legendary deals to wide-eyed newcomers. You didn't just play the game - you became the game."
    }
};

// ============================================
// MARKET SUPPLY SYSTEM
// ============================================
const MARKET_CONFIG = {
    baseSupply: 500,           // Base supply per town
    supplyRecoveryRate: 0.15,  // 15% recovery per day
    priceImpactThreshold: 0.3, // 30% market share affects prices
    cornerThreshold: 0.8,      // 80% = cornered market
    maxPriceImpact: 0.4        // Max 40% price change from manipulation
};

// ============================================
// TUTORIAL SYSTEM
// ============================================
const TUTORIAL_STEPS = [
    {
        id: "welcome",
        title: "Welcome to Maine!",
        message: "You have 30 days of summer to build your lobster dealing empire. Buy low from fishermen, sell high to buyers, and try to earn as much as you can before the season ends!",
        highlight: null,
        position: "center"
    },
    {
        id: "goal",
        title: "Your Goal",
        message: "Make as much money as possible in 30 days!\n\n⭐ $10,000 = Dock Hand\n⭐⭐ $25,000 = Junior Dealer\n⭐⭐⭐ $50,000 = Established Dealer\n⭐⭐⭐⭐ $100,000 = Lobster Tycoon",
        highlight: null,
        position: "center"
    },
    {
        id: "dock",
        title: "The Dock",
        message: "Fishing boats arrive here with fresh lobsters. Click 'Buy All' or 'Buy Half' to purchase their catch. Stonington has the cheapest lobsters on the coast!",
        highlight: "#tab-dock",
        position: "bottom"
    },
    {
        id: "tank",
        title: "Your Tank",
        message: "Lobsters you buy are stored here. Watch your capacity and freshness! Lobsters lose value if stored too long.",
        highlight: "#tab-tanks",
        position: "bottom"
    },
    {
        id: "buyers",
        title: "Buyers",
        message: "Sell your lobsters to buyers who visit. Different buyers pay different prices. Restaurants and tourists pay more than wholesalers!",
        highlight: "#tab-buyers",
        position: "bottom"
    },
    {
        id: "arbitrage",
        title: "The Secret to Profit",
        message: "Here's the key: Different towns have different prices! Buy cheap in fishing villages like Stonington, then sell high in tourist towns like Camden or Bar Harbor. This is called arbitrage.",
        highlight: "#tab-travel",
        position: "bottom"
    },
    {
        id: "travel",
        title: "Get a Delivery Van",
        message: "To travel between towns, you'll need a Delivery Van from the Shop. It's your first big investment - save up $2,000 and the coast opens up!",
        highlight: "#shop-btn",
        position: "bottom"
    },
    {
        id: "nextday",
        title: "End Day",
        message: "Click 'End Day' to advance time. New boats and buyers arrive each day. Watch the weather - storms mean fewer boats!",
        highlight: "#end-day-button",
        position: "top"
    },
    {
        id: "reputation",
        title: "Build Your Reputation",
        message: "As you trade more, your reputation grows. Higher reputation unlocks access to premium ports where the real money is made. Start small, dream big!",
        highlight: "#badge-icon",
        position: "bottom"
    },
    {
        id: "ready",
        title: "You're Ready!",
        message: "Good luck! Remember: Buy cheap in fishing towns, sell high in tourist towns, and build your reputation. Summer won't last forever!",
        highlight: null,
        position: "center"
    }
];

// Contextual helper tips that appear during gameplay
const HELPER_TIPS = {
    firstBoat: {
        id: "firstBoat",
        condition: (state) => state.stats.totalLobstersBought === 0 && state.boats.length > 0,
        message: "💡 Tip: A boat is at the dock! Click 'Buy All' to purchase their lobsters.",
        once: true
    },
    tankGettingFull: {
        id: "tankGettingFull",
        condition: (state) => {
            const total = state.inventory.select + state.inventory.quarter + state.inventory.chix + state.inventory.run;
            const cap = state.tankCapacity;
            return total > cap * 0.8 && total < cap;
        },
        message: "💡 Tip: Your tank is getting full! Sell some lobsters or upgrade your tank in the Shop.",
        once: true
    },
    haveLobstersNoBuyers: {
        id: "haveLobstersNoBuyers",
        condition: (state) => {
            const total = state.inventory.select + state.inventory.quarter + state.inventory.chix + state.inventory.run;
            return total > 0 && state.buyers.length === 0;
        },
        message: "💡 Tip: No buyers today, but you have lobsters. They'll keep until tomorrow (though quality may drop).",
        once: true
    },
    goodSellPrice: {
        id: "goodSellPrice",
        condition: (state) => state.marketTrend > 0 && (state.inventory.select + state.inventory.quarter + state.inventory.chix + state.inventory.run) > 50,
        message: "💡 Tip: Market prices are rising! Now might be a good time to sell.",
        once: true
    },
    lowOnCash: {
        id: "lowOnCash",
        condition: (state) => state.cash < 500 && state.debt === 0,
        message: "💡 Tip: Running low on cash? Visit the Bank to take out a loan, or sell your lobsters!",
        once: true
    },
    canTravel: {
        id: "canTravel",
        condition: (state) => hasEquipment('deliveryVan') && !state.shownTravelTip,
        message: "💡 Tip: You have a Delivery Van! Open the Map to travel to other towns for different prices.",
        once: true
    },
    stormComing: {
        id: "stormComing",
        condition: (state) => state.tomorrowWeather === "stormy",
        message: "⚠️ Storm tomorrow! Stock up on lobsters today - no boats will arrive in a storm.",
        once: false
    },
    halfwayPoint: {
        id: "halfwayPoint",
        condition: (state) => state.day === 15,
        message: "📅 Halfway through summer! You have 15 days left. Keep pushing!",
        once: true
    },
    fiveDaysLeft: {
        id: "fiveDaysLeft",
        condition: (state) => state.day === 25,
        message: "📅 Only 5 days of summer left! Make them count!",
        once: true
    },
    lastDay: {
        id: "lastDay",
        condition: (state) => state.day === 30,
        message: "📅 FINAL DAY! This is your last chance to buy and sell before summer ends!",
        once: true
    }
};

// ============================================
// RANDOM EVENTS
// ============================================
const RANDOM_EVENTS = {
    // Negative events
    truckBreakdown: {
        id: "truckBreakdown",
        name: "Truck Breakdown",
        emoji: "🔧",
        type: "negative",
        chance: 0.08,  // 8% per day
        requiresEquipment: "deliveryVan",
        effect: (state) => {
            const repairCost = randomInt(200, 500);
            state.cash -= repairCost;
            state.dailySpent += repairCost;
            return { cost: repairCost };
        },
        message: (data) => `Your delivery van broke down! Repairs cost $${formatMoney(data.cost)}.`,
        bobComment: [
            "Dang thing always breaks at the worst time!",
            "Should've bought the extended warranty, eh?",
            "Them roads are murder on vehicles."
        ]
    },
    tankLeak: {
        id: "tankLeak",
        name: "Tank Leak",
        emoji: "💧",
        type: "negative",
        chance: 0.05,  // 5% per day
        minInventory: 50,
        effect: (state) => {
            const lostPercent = randomFloat(0.05, 0.15);
            // Lose proportionally from each grade using lot system
            const lostSelect = Math.floor(state.inventory.select * lostPercent);
            const lostQuarter = Math.floor(state.inventory.quarter * lostPercent);
            const lostChix = Math.floor(state.inventory.chix * lostPercent);
            const lostRun = Math.floor(state.inventory.run * lostPercent);
            if (lostSelect > 0) removeLotAmount('select', lostSelect);
            if (lostQuarter > 0) removeLotAmount('quarter', lostQuarter);
            if (lostChix > 0) removeLotAmount('chix', lostChix);
            if (lostRun > 0) removeLotAmount('run', lostRun);
            return { lost: lostSelect + lostQuarter + lostChix + lostRun };
        },
        message: (data) => `Tank sprung a leak! Lost ${data.lost} lbs of lobster.`,
        bobComment: [
            "Quick, grab the bucket!",
            "Salt water's rough on them seals.",
            "Better patch that up 'fore you lose more!"
        ]
    },
    healthInspection: {
        id: "healthInspection",
        name: "Health Inspection",
        emoji: "📋",
        type: "negative",
        chance: 0.04,  // 4% per day
        effect: (state) => {
            const fine = randomInt(100, 300);
            state.cash -= fine;
            state.dailySpent += fine;
            return { fine: fine };
        },
        message: (data) => `Surprise health inspection! Minor violations, fined $${formatMoney(data.fine)}.`,
        bobComment: [
            "Them inspectors always find somethin'!",
            "Bureaucrats, I tell ya!",
            "Least it wasn't worse..."
        ]
    },
    equipmentMalfunction: {
        id: "equipmentMalfunction",
        name: "Equipment Malfunction",
        emoji: "⚡",
        type: "negative",
        chance: 0.06,
        requiresAnyEquipment: true,
        effect: (state) => {
            const repairCost = randomInt(150, 400);
            state.cash -= repairCost;
            state.dailySpent += repairCost;
            return { cost: repairCost };
        },
        message: (data) => `Equipment malfunction! Repair cost: $${formatMoney(data.cost)}.`,
        bobComment: [
            "Nothin' lasts forever out here.",
            "Salt air corrodes everything eventually.",
            "Better fix it quick or it'll cost ya more!"
        ]
    },
    spoiledCatch: {
        id: "spoiledCatch",
        name: "Spoiled Inventory",
        emoji: "🦠",
        type: "negative",
        chance: 0.04,
        minInventory: 30,
        effect: (state) => {
            // Reduce freshness of all lots
            const freshnessLoss = randomInt(15, 30);
            for (const lot of state.lots) {
                lot.freshness = Math.max(0, lot.freshness - freshnessLoss);
            }
            return { freshnessLoss: freshnessLoss };
        },
        message: (data) => `Temperature fluctuation! All stock lost ${data.freshnessLoss}% freshness.`,
        bobComment: [
            "Gotta keep them tanks cold!",
            "Quality control's important in this business.",
            "Hopefully the buyers won't notice..."
        ]
    },

    // Positive events
    luckyFind: {
        id: "luckyFind",
        name: "Lucky Find",
        emoji: "🍀",
        type: "positive",
        chance: 0.05,
        effect: (state) => {
            const amount = randomInt(20, 50);
            // Add as run (ungraded) - or quarters if you have grading table
            if (hasEquipment('gradingTable')) {
                addLot('quarter', amount, 100);
            } else {
                addLot('run', amount, 100);
            }
            return { amount: amount };
        },
        message: (data) => `A fisherman dropped off ${data.amount} lbs for free - said you've been good to him!`,
        bobComment: [
            "Good karma comin' back to ya!",
            "That's what loyalty gets ya!",
            "Free lobstah? Best kind there is!"
        ]
    },
    bumpBuyer: {
        id: "bumpBuyer",
        name: "Walk-In Buyer",
        emoji: "💰",
        type: "positive",
        chance: 0.07,
        minInventory: 20,
        effect: (state) => {
            const premium = randomFloat(1.15, 1.35);
            // Add a premium buyer
            const buyer = {
                name: randomChoice(["Wealthy Tourist", "Yacht Owner", "Restaurant Scout", "Celebrity Chef"]),
                emoji: "🌟",
                type: "special",
                wantsAmount: randomInt(30, 80),
                acceptsRun: false,
                acceptsGrades: ['select', 'quarter'],
                pricePerLb: calculateSellPrice('select') * premium,
                trust: 0,
                isEvent: true
            };
            state.buyers.push(buyer);
            return { buyer: buyer.name, premium: Math.round((premium - 1) * 100) };
        },
        message: (data) => `${data.buyer} walked in offering premium prices (+${data.premium}%)!`,
        bobComment: [
            "Now THAT'S a customer!",
            "Rich folks love their Maine lobstah!",
            "Don't let that one get away!"
        ]
    },
    bonusCatch: {
        id: "bonusCatch",
        name: "Bonus Boat",
        emoji: "🚤",
        type: "positive",
        chance: 0.06,
        effect: (state) => {
            // Add an extra boat with good prices
            const discount = randomFloat(0.85, 0.95);
            const boat = {
                name: randomChoice(["Lucky Strike", "Full Hold", "Big Haul", "Jackpot"]),
                captain: randomChoice(CONFIG.captainNames),
                loyalty: randomInt(10, 30),
                catchAmount: randomInt(100, 250),
                pricePerLb: calculateBuyPrice('B') * discount,
                isEvent: true
            };
            state.boats.push(boat);
            return { boat: boat.name, discount: Math.round((1 - discount) * 100) };
        },
        message: (data) => `The ${data.boat} pulled in with extra catch at ${data.discount}% off!`,
        bobComment: [
            "More boats means more options!",
            "Someone had a good day out there!",
            "Fresh off the watah!"
        ]
    },
    marketTip: {
        id: "marketTip",
        name: "Market Tip",
        emoji: "📈",
        type: "positive",
        chance: 0.05,
        effect: (state) => {
            // Temporary boost to sell prices (represented by adding a premium buyer)
            const tomorrowWeather = CONFIG.weather[state.tomorrowWeather];
            return { forecast: tomorrowWeather.name };
        },
        message: (data) => `A buyer tipped you off - big demand coming tomorrow!`,
        bobComment: [
            "Pays to have connections!",
            "Inside info's worth its weight in gold!",
            "Sometimes it's who ya know!"
        ]
    },
    taxRefund: {
        id: "taxRefund",
        name: "Tax Refund",
        emoji: "💵",
        type: "positive",
        chance: 0.03,
        effect: (state) => {
            const refund = randomInt(200, 600);
            state.cash += refund;
            state.dailyEarned += refund;
            return { amount: refund };
        },
        message: (data) => `State of Maine sent you a business tax refund: $${formatMoney(data.amount)}!`,
        bobComment: [
            "Government money? I'll take it!",
            "Rare to see money comin' back!",
            "Don't spend it all in one place!"
        ]
    }
};

// ============================================
// TOWNS & LOCATIONS
// ============================================
const TOWNS = {
    stonington: {
        id: "stonington",
        name: "Stonington",
        description: "Remote fishing village - cheapest lobster",
        emoji: "🎣",
        // Deer Isle - Penobscot Bay islands
        x: 54,
        y: 69,
        buyMod: 0.80,   // 20% cheaper to buy
        sellMod: 0.85,  // 15% less when selling
        boatBonus: 2,   // Extra boats available
        buyerPenalty: 1, // Fewer buyers
        travelCost: 0,  // Base location
        traits: ["fishing_hub", "remote"]
    },
    rockland: {
        id: "rockland",
        name: "Rockland",
        description: "Working harbor - good supply, fair prices",
        emoji: "⚓",
        // West side of Penobscot Bay
        x: 48,
        y: 76,
        buyMod: 0.90,
        sellMod: 0.95,
        boatBonus: 1,
        buyerPenalty: 0,
        travelCost: 100,
        traits: ["fishing_hub", "working_class"]
    },
    camden: {
        id: "camden",
        name: "Camden",
        description: "Wealthy yacht town - premium buyers",
        emoji: "⛵",
        // North of Rockland on Penobscot Bay
        x: 50,
        y: 73,
        buyMod: 1.10,
        sellMod: 1.20,
        boatBonus: 0,
        buyerPenalty: 0,
        travelCost: 150,
        traits: ["tourist", "wealthy"]
    },
    portland: {
        id: "portland",
        name: "Portland",
        description: "Big city - high volume, competitive prices",
        emoji: "🏙️",
        // Casco Bay - southern Maine
        x: 21,
        y: 86,
        buyMod: 1.00,
        sellMod: 1.05,
        boatBonus: 1,
        buyerPenalty: -1, // Extra buyers
        travelCost: 200,
        traits: ["city", "high_volume"]
    },
    boothbay: {
        id: "boothbay",
        name: "Boothbay Harbor",
        description: "Tourist destination - seasonal demand",
        emoji: "🌊",
        // Boothbay peninsula
        x: 35,
        y: 81,
        buyMod: 1.05,
        sellMod: 1.15,
        boatBonus: 0,
        buyerPenalty: 0,
        travelCost: 150,
        traits: ["tourist", "seasonal"]
    },
    barHarbor: {
        id: "barHarbor",
        name: "Bar Harbor",
        description: "Acadia tourists - highest sell prices!",
        emoji: "🏔️",
        // Mount Desert Island - Acadia
        x: 87,
        y: 65,
        buyMod: 1.20,   // Expensive to buy
        sellMod: 1.40,  // But great sell prices!
        boatBonus: -1,  // Fewer boats
        buyerPenalty: -2, // Lots of buyers
        travelCost: 250,
        traits: ["tourist", "premium", "remote"]
    },
    kennebunkport: {
        id: "kennebunkport",
        name: "Kennebunkport",
        description: "Bush family territory - old money buyers",
        emoji: "🦞",
        // Southern Maine coast
        x: 13,
        y: 93,
        buyMod: 1.15,
        sellMod: 1.30,
        boatBonus: 0,
        buyerPenalty: -1,
        travelCost: 250,
        traits: ["wealthy", "exclusive"]
    }
};

// Route connections between adjacent ports (for map visualization)
const ROUTES = [
    ['kennebunkport', 'portland'],
    ['portland', 'boothbay'],
    ['boothbay', 'rockland'],
    ['rockland', 'camden'],
    ['camden', 'stonington'],
    ['stonington', 'barHarbor']
];

// ============================================
// GAME STATE
// ============================================
let gameState = {
    cash: CONFIG.startingCash,
    debt: 0,
    day: 1,
    week: 1,
    season: "Summer",
    weather: "sunny",
    tomorrowWeather: "sunny",
    marketTrend: 0, // -1 falling, 0 stable, 1 rising
    currentLocation: "stonington", // Starting town
    travelingTo: null,  // Town being traveled to (if any)

    // Inventory by grade (run = ungraded, others = graded)
    inventory: { select: 0, quarter: 0, chix: 0, run: 0 },
    // Lot-based tracking for freshness/decay system
    lots: [], // Each lot: { id, grade, amount, freshness, decayRate, dayBought }
    tankCapacity: 500,
    baseMortalityRate: 0.05,
    qualityDecayRate: 0.1, // 10% chance per day to drop a grade
    nextLotId: 1,

    // Equipment owned
    equipment: {},

    // Current dock boats
    boats: [],
    maxBoats: 1,

    // Buyers available today
    buyers: [],

    // Relationships (legacy - being replaced by trust system)
    fishermenRelations: {}, // captainName -> loyalty (0-100)
    buyerRelations: {}, // buyerName -> trust (0-100)

    // NEW: Reputation & Trust System
    reputation: 0, // Player reputation [0, 1000+]
    repTier: "Dock Nobody", // Derived tier

    // Persistent Seller NPCs with trust
    sellerNPCs: {}, // sellerId -> { name, trust, consecutiveDaysBought, daysSinceInteraction, archetype }

    // Persistent Buyer NPCs with trust
    buyerNPCs: {}, // buyerId -> { name, trust, consecutiveDaysSold, daysSinceInteraction, type }

    // Daily tracking for rep/trust calculations
    dailyLbsBought: {}, // sellerId -> lbs bought today
    dailyLbsSold: {}, // buyerId -> lbs sold today
    dailyFreshnessSold: {}, // buyerId -> { totalFreshness, totalLbs }
    dailySpoilage: 0, // lbs lost to spoilage today
    dailyInventoryStart: 0, // inventory at start of day (for spoilage %)

    // Finance
    loanAvailable: true,
    maxLoan: 10000,
    interestRate: 0.05, // 5% per week

    // Daily tracking
    dailySpent: 0,      // Money spent buying lobsters
    dailyEarned: 0,     // Money earned selling lobsters
    dailyCosts: 0,      // Operating costs
    dailyTravels: 0,    // Number of travels today (max 2 for round trip)
    visitedTownsToday: {}, // Towns visited today (no new boats on return)
    yesterdayNet: 0,    // Yesterday's profit/loss for summary bar

    // Streak & Speed Run Tracking
    profitStreak: 0,        // Consecutive profitable days
    bestStreak: 0,          // Best streak this run
    lossStreak: 0,          // Consecutive loss days (for nickname)
    speedRunMilestones: {}, // { "10000": dayReached, "25000": dayReached, etc. }
    todayFortune: null,     // Today's fortune cookie tip

    // Playstyle tracking (for nickname)
    biggestSingleBuy: 0,    // Largest single purchase
    biggestSingleSale: 0,   // Largest single sale
    totalDaysTraded: 0,     // Days with any activity
    perfectDays: 0,         // Days with no spoilage and profit
    riskyDeals: 0,          // Deals made with <$500 remaining

    // Missed opportunities (for day summary)
    missedBoats: [],     // Boats that left (passed or timed out)
    missedBuyers: [],    // Buyers not sold to
    boatsLostToRival: 0, // Boats that timed out and went to Slick Rick
    potentialEarnings: 0, // Money that could have been earned

    // UI state
    mapRevealed: false,  // Track first map reveal for cinematic animation

    // Boat timer system
    boatTimers: {},      // boatId -> { timeLeft, intervalId }

    // Statistics tracking
    stats: {
        totalLobstersBought: 0,
        totalLobstersSold: 0,
        totalMoneyEarned: 0,
        totalMoneySpent: 0,
        bestDayProfit: 0,
        worstDayLoss: 0,
        dealsWithCaptains: {},  // captainName -> count
        salesToBuyers: {},      // buyerName -> count
        loansTotal: 0,
        interestPaid: 0,
        rivalsOutbid: 0,        // Times you beat a rival
        lostToRivals: 0,        // Times rival beat you
        selectsSold: 0,         // Premium lobster sold
        quartersSold: 0,
        chixSold: 0,
        runSold: 0,
        loansPaidOff: 0,
        recoveredFromDebt: false,
        marketsCornered: 0,
        arbitrageProfit: 0
    },

    // Achievements
    achievements: {},        // achievementId -> { unlocked: true, date: day }

    // Prestige system
    prestige: 0,             // Total prestige points earned
    lifetimeEarnings: 0,     // Total money earned across all games
    gamesCompleted: 0,

    // Market supply tracking
    marketSupply: {},        // townId -> current supply

    // Captain storylines
    townsVisited: [],
    activeStory: null,       // Current story event being shown
    completedStories: [],    // Story IDs already seen
    captainPremiums: {},     // captainName -> price multiplier
    exclusiveCaptains: [],   // Captains with exclusive deals
    captainAbsent: {},       // captainName -> days absent
    secretSpotCaptain: null,
    secretSpotRevealed: false,
    pendingSpecialDelivery: null,
    captainLostToRival: [],


    // Rival dealers
    rivals: {},

    // Game status
    gameOver: false,
    daysInTrouble: 0  // Days with negative net worth
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Seeded random number generator (Mulberry32)
// Returns a function that produces deterministic random numbers from a seed
function mulberry32(seed) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function formatMoney(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function isMobile() {
    return window.innerWidth < 768;
}

// Flash an element to indicate a change
function flashElement(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 500);
}

// ============================================
// REPUTATION & TRUST HELPER FUNCTIONS
// ============================================

// Get reputation tier name from reputation value
function getReputationTier(rep) {
    for (const [tier, range] of Object.entries(REPUTATION_TIERS)) {
        if (rep >= range.min && rep <= range.max) {
            return tier;
        }
    }
    return "Dock Nobody";
}

// Get trust tier from trust value
function getTrustTier(trust) {
    if (trust <= -30) return "cold";
    if (trust >= 70) return "preferred";
    if (trust >= 30) return "warm";
    return "neutral";
}

// Get trust-based price modifier for buying (from seller)
function getTrustBuyMod(sellerId) {
    const npc = gameState.sellerNPCs[sellerId];
    if (!npc) return 1.0;
    const tier = getTrustTier(npc.trust);
    return TRUST_PRICE_EFFECTS[tier].buyMod;
}

// Get trust-based price modifier for selling (to buyer)
function getTrustSellMod(buyerId) {
    const npc = gameState.buyerNPCs[buyerId];
    if (!npc) return 1.0;
    const tier = getTrustTier(npc.trust);
    return TRUST_PRICE_EFFECTS[tier].sellMod;
}

// Update player reputation and tier
function updateReputation(delta) {
    gameState.reputation = Math.max(0, gameState.reputation + delta);
    gameState.repTier = getReputationTier(gameState.reputation);
}

// Update NPC trust (clamped to -100, +100)
function updateSellerTrust(sellerId, delta) {
    const npc = gameState.sellerNPCs[sellerId];
    if (!npc) return;
    npc.trust = Math.max(-100, Math.min(100, npc.trust + delta));
}

function updateBuyerTrust(buyerId, delta) {
    const npc = gameState.buyerNPCs[buyerId];
    if (!npc) return;
    npc.trust = Math.max(-100, Math.min(100, npc.trust + delta));
}

// Get unlocked features for current reputation tier
function getReputationUnlocks() {
    return REPUTATION_UNLOCKS[gameState.repTier] || REPUTATION_UNLOCKS["Dock Nobody"];
}

// Check if a feature is unlocked
function isFeatureUnlocked(feature) {
    const unlocks = getReputationUnlocks();
    return unlocks.features.includes(feature);
}

// Generate a unique NPC ID
function generateNPCId(type, name) {
    return `${type}_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
}

// Create a new seller NPC
function createSellerNPC(name, archetype = null) {
    const archetypeKey = archetype || randomChoice(Object.keys(SELLER_ARCHETYPES));
    const archetypeData = SELLER_ARCHETYPES[archetypeKey];
    const id = generateNPCId('seller', name);

    gameState.sellerNPCs[id] = {
        id: id,
        name: name,
        trust: 0,
        consecutiveDaysBought: 0,
        daysSinceInteraction: 0,
        archetype: archetypeKey,
        priceVar: archetypeData.priceVar,
        supplyMod: archetypeData.supplyMod
    };

    return id;
}

// Create a new buyer NPC
function createBuyerNPC(name, type = null) {
    const typeKey = type || randomChoice(Object.keys(BUYER_TYPES));
    const typeData = BUYER_TYPES[typeKey];
    const id = generateNPCId('buyer', name);

    gameState.buyerNPCs[id] = {
        id: id,
        name: name,
        trust: 0,
        consecutiveDaysSold: 0,
        daysSinceInteraction: 0,
        type: typeKey,
        priceMod: typeData.priceMod,
        minFreshness: typeData.minFreshness,
        volumeRange: typeData.volumeRange
    };

    return id;
}

// Get or create a seller NPC by name
function getOrCreateSeller(name, archetype = null) {
    // Check if seller already exists
    for (const [id, npc] of Object.entries(gameState.sellerNPCs)) {
        if (npc.name === name) return id;
    }
    // Create new seller
    return createSellerNPC(name, archetype);
}

// Get or create a buyer NPC by name
function getOrCreateBuyer(name, type = null) {
    // Check if buyer already exists
    for (const [id, npc] of Object.entries(gameState.buyerNPCs)) {
        if (npc.name === name) return id;
    }
    // Create new buyer
    return createBuyerNPC(name, type);
}

// Process end-of-day trust and reputation changes
function processEndOfDayTrust() {
    const interactedSellers = new Set(Object.keys(gameState.dailyLbsBought));
    const interactedBuyers = new Set(Object.keys(gameState.dailyLbsSold));

    let totalRepGain = 0;
    let totalLbsBought = 0;
    let totalLbsSold = 0;

    // Process seller trust changes
    for (const [sellerId, npc] of Object.entries(gameState.sellerNPCs)) {
        const lbsBought = gameState.dailyLbsBought[sellerId] || 0;

        if (lbsBought > 0) {
            // Bought from this seller: +2 base + 1 per 50 lbs
            const trustGain = 2 + Math.floor(lbsBought / 50);
            updateSellerTrust(sellerId, trustGain);
            npc.consecutiveDaysBought++;
            npc.daysSinceInteraction = 0;
            totalLbsBought += lbsBought;

            // Consecutive day bonus: extra +1 trust if 3+ days
            if (npc.consecutiveDaysBought >= 3) {
                updateSellerTrust(sellerId, 1);
            }
        } else {
            // Didn't buy from this seller
            npc.daysSinceInteraction++;
            npc.consecutiveDaysBought = 0;

            // Trust decay: -1 per day without interaction
            if (npc.daysSinceInteraction > 0) {
                updateSellerTrust(sellerId, -1);
            }
        }
    }

    // Process buyer trust changes
    for (const [buyerId, npc] of Object.entries(gameState.buyerNPCs)) {
        const lbsSold = gameState.dailyLbsSold[buyerId] || 0;
        const freshnessData = gameState.dailyFreshnessSold[buyerId];

        if (lbsSold > 0) {
            // Sold to this buyer: +1 base + 1 per 100 lbs
            let trustGain = 1 + Math.floor(lbsSold / 100);

            // Freshness bonus: +1 if average freshness > 80
            if (freshnessData && freshnessData.totalLbs > 0) {
                const avgFreshness = freshnessData.totalFreshness / freshnessData.totalLbs;
                if (avgFreshness >= 80) {
                    trustGain += 1;
                }
                // Penalty for selling low freshness
                if (avgFreshness < 50) {
                    trustGain -= 2;
                }
            }

            updateBuyerTrust(buyerId, trustGain);
            npc.consecutiveDaysSold++;
            npc.daysSinceInteraction = 0;
            totalLbsSold += lbsSold;

            // Consecutive day bonus
            if (npc.consecutiveDaysSold >= 3) {
                updateBuyerTrust(buyerId, 1);
            }
        } else {
            // Didn't sell to this buyer
            npc.daysSinceInteraction++;
            npc.consecutiveDaysSold = 0;

            // Trust decay
            if (npc.daysSinceInteraction > 0) {
                updateBuyerTrust(buyerId, -1);
            }
        }
    }

    // Calculate reputation gain for the day
    // Base: 5 rep for any activity
    if (totalLbsBought > 0 || totalLbsSold > 0) {
        totalRepGain += 5;
    }

    // Volume bonuses: +1 rep per 100 lbs bought, +1 per 100 lbs sold
    totalRepGain += Math.floor(totalLbsBought / 100);
    totalRepGain += Math.floor(totalLbsSold / 100);

    // Spoilage penalty: lose rep if >10% of inventory spoiled
    if (gameState.dailyInventoryStart > 0 && gameState.dailySpoilage > 0) {
        const spoilageRate = gameState.dailySpoilage / gameState.dailyInventoryStart;
        if (spoilageRate > 0.1) {
            totalRepGain -= Math.floor(spoilageRate * 10);
        }
    }

    // Apply reputation change
    if (totalRepGain !== 0) {
        const oldTier = gameState.repTier;
        updateReputation(totalRepGain);

        // Notify on tier change
        if (gameState.repTier !== oldTier) {
            log(`Your reputation has grown! You are now: ${gameState.repTier}`, "positive");
        }
    }

    // Reset daily tracking
    gameState.dailyLbsBought = {};
    gameState.dailyLbsSold = {};
    gameState.dailyFreshnessSold = {};
    gameState.dailySpoilage = 0;
}

// Track the start of day inventory for spoilage calculations
function trackDayStartInventory() {
    gameState.dailyInventoryStart = getTotalInventory();
}

// ============================================
// STREAK, NICKNAME, FORTUNE & SPEED RUN
// ============================================

// Update streak at end of day
function updateStreaks(dailyProfit) {
    if (dailyProfit > 0) {
        gameState.profitStreak++;
        gameState.lossStreak = 0;
        if (gameState.profitStreak > gameState.bestStreak) {
            gameState.bestStreak = gameState.profitStreak;
        }
        // Check for perfect day (profit + no spoilage)
        if (gameState.dailySpoilage === 0) {
            gameState.perfectDays++;
        }
    } else if (dailyProfit < 0) {
        gameState.lossStreak++;
        gameState.profitStreak = 0;
    }
    // Track if any trading happened
    if (gameState.dailySpent > 0 || gameState.dailyEarned > 0) {
        gameState.totalDaysTraded++;
    }
}

// Check and record speed run milestones
function checkSpeedRunMilestones() {
    for (const target of CONFIG.speedRunTargets) {
        const key = target.toString();
        if (!gameState.speedRunMilestones[key] && gameState.cash >= target) {
            gameState.speedRunMilestones[key] = gameState.day;
            log(`🏆 MILESTONE: Reached $${formatMoney(target)} on Day ${gameState.day}!`, "positive");
        }
    }
}

// Generate nickname based on playstyle
function generateNickname() {
    const nn = CONFIG.nicknames;
    let prefixPool, suffixPool;

    // Determine prefix based on playstyle
    if (gameState.riskyDeals > 5) {
        prefixPool = nn.prefixes.risky;
    } else if (gameState.bestStreak >= 7) {
        prefixPool = nn.prefixes.consistent;
    } else if (gameState.stats.totalMoneySpent > 50000) {
        prefixPool = nn.prefixes.highVolume;
    } else if (gameState.day < 10) {
        prefixPool = nn.prefixes.newbie;
    } else {
        prefixPool = nn.prefixes.cautious;
    }

    // Determine suffix based on performance
    if (gameState.cash >= 100000) {
        suffixPool = nn.suffixes.legendary;
    } else if (gameState.cash >= 50000) {
        suffixPool = nn.suffixes.highProfit;
    } else if (gameState.lossStreak >= 3) {
        suffixPool = nn.suffixes.survivor;
    } else if (gameState.perfectDays >= 5) {
        suffixPool = nn.suffixes.animal;
    } else {
        suffixPool = nn.suffixes.trader;
    }

    const prefix = randomChoice(prefixPool);
    const location = randomChoice(nn.locations);
    const suffix = randomChoice(suffixPool);

    return `${prefix} ${location} ${suffix}`;
}

// Get today's fortune tip (consistent for the day)
function getTodayFortune() {
    if (!gameState.todayFortune) {
        // Use day as seed for consistent fortune
        const index = (gameState.day - 1) % CONFIG.fortuneTips.length;
        gameState.todayFortune = CONFIG.fortuneTips[index];
    }
    return gameState.todayFortune;
}

// Show fortune toast at start of day
function showFortuneTip() {
    const fortune = getTodayFortune();
    showToast(`🥠 Old Pete says: "${fortune}"`, 5000);
}

// Show toast notification
function showToast(message, duration = 3000) {
    // Remove existing toast if any
    const existing = document.querySelector('.fortune-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'fortune-toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Photo mode - freeze and style the dock scene
function enterPhotoMode() {
    const gameContainer = document.querySelector('.game-container');
    const photoOverlay = document.createElement('div');
    photoOverlay.className = 'photo-mode-overlay';
    photoOverlay.innerHTML = `
        <div class="photo-frame">
            <div class="photo-header">
                <span class="photo-title">📸 ${getCurrentTown().name} Docks</span>
                <span class="photo-date">Day ${gameState.day} • ${CONFIG.weather[gameState.weather].name}</span>
            </div>
            <div class="photo-stats">
                <div class="photo-stat">💰 $${formatMoney(gameState.cash)}</div>
                <div class="photo-stat">🦞 ${getTotalInventory()} lbs</div>
                <div class="photo-stat">🔥 ${gameState.profitStreak} day streak</div>
                <div class="photo-stat">⭐ ${gameState.repTier}</div>
            </div>
            <div class="photo-nickname">"${generateNickname()}"</div>
            <div class="photo-fortune">${getTodayFortune()}</div>
            <div class="photo-watermark">Maine Lobster Dealer Tycoon</div>
        </div>
        <div class="photo-controls">
            <button class="btn btn-primary" id="exit-photo-mode">Exit Photo Mode</button>
        </div>
    `;

    document.body.appendChild(photoOverlay);
    document.body.classList.add('photo-mode-active');

    // Animate in
    setTimeout(() => photoOverlay.classList.add('show'), 10);

    // Exit handler
    document.getElementById('exit-photo-mode').addEventListener('click', exitPhotoMode);
    photoOverlay.addEventListener('click', (e) => {
        if (e.target === photoOverlay) exitPhotoMode();
    });
}

function exitPhotoMode() {
    const overlay = document.querySelector('.photo-mode-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
    document.body.classList.remove('photo-mode-active');
}

// Get streak display text
function getStreakDisplay() {
    if (gameState.profitStreak >= 7) {
        return `🔥🔥🔥 ${gameState.profitStreak}-day streak!`;
    } else if (gameState.profitStreak >= 5) {
        return `🔥🔥 ${gameState.profitStreak}-day streak!`;
    } else if (gameState.profitStreak >= 3) {
        return `🔥 ${gameState.profitStreak}-day streak`;
    } else if (gameState.profitStreak > 0) {
        return `${gameState.profitStreak}-day streak`;
    } else if (gameState.lossStreak >= 3) {
        return `📉 ${gameState.lossStreak} rough days`;
    }
    return '';
}

function getTotalInventory() {
    return gameState.inventory.select + gameState.inventory.quarter +
           gameState.inventory.chix + gameState.inventory.run;
}

// Get total graded inventory (excludes run)
function getGradedInventory() {
    return gameState.inventory.select + gameState.inventory.quarter + gameState.inventory.chix;
}

// Lot management functions
function addLot(grade, amount, freshness = 100) {
    const lot = {
        id: gameState.nextLotId++,
        grade: grade,
        amount: amount,
        freshness: freshness,
        decayRate: 10 + randomInt(0, 5), // 10-15% freshness loss per day
        dayBought: gameState.day
    };
    gameState.lots.push(lot);
    gameState.inventory[grade] += amount;
    return lot;
}

function removeLotAmount(grade, amountToRemove) {
    // Remove from oldest lots first (FIFO)
    let remaining = amountToRemove;
    const lotsOfGrade = gameState.lots.filter(l => l.grade === grade).sort((a, b) => a.dayBought - b.dayBought);

    for (const lot of lotsOfGrade) {
        if (remaining <= 0) break;
        const removeFromLot = Math.min(lot.amount, remaining);
        lot.amount -= removeFromLot;
        remaining -= removeFromLot;
    }

    // Remove empty lots
    gameState.lots = gameState.lots.filter(l => l.amount > 0);

    // Update inventory
    gameState.inventory[grade] = Math.max(0, gameState.inventory[grade] - amountToRemove);
}

function getAverageFreshness(grade) {
    const lotsOfGrade = gameState.lots.filter(l => l.grade === grade);
    if (lotsOfGrade.length === 0) return 100;
    const totalWeight = lotsOfGrade.reduce((sum, l) => sum + l.amount, 0);
    if (totalWeight === 0) return 100;
    const weightedFreshness = lotsOfGrade.reduce((sum, l) => sum + (l.freshness * l.amount), 0);
    return Math.round(weightedFreshness / totalWeight);
}

function getOverallFreshness() {
    if (gameState.lots.length === 0) return 100;
    const totalWeight = gameState.lots.reduce((sum, l) => sum + l.amount, 0);
    if (totalWeight === 0) return 100;
    const weightedFreshness = gameState.lots.reduce((sum, l) => sum + (l.freshness * l.amount), 0);
    return Math.round(weightedFreshness / totalWeight);
}

function getSeason(day) {
    const dayOfYear = day % 120;
    if (dayOfYear < 30) return "Summer";
    if (dayOfYear < 60) return "Fall";
    if (dayOfYear < 90) return "Winter";
    return "Spring";
}

function hasEquipment(id) {
    return gameState.equipment[id] === true;
}

function getEquipmentEffect(effectName, defaultValue) {
    let value = defaultValue;
    for (const [id, owned] of Object.entries(gameState.equipment)) {
        if (owned && EQUIPMENT[id] && EQUIPMENT[id].effect[effectName] !== undefined) {
            const effect = EQUIPMENT[id].effect[effectName];
            if (typeof effect === 'boolean') return effect;
            if (effectName.includes('Bonus') || effectName.includes('Mod')) {
                value = Math.max(value, effect);
            } else {
                value = effect;
            }
        }
    }
    return value;
}

// ============================================
// LOCATION & TRAVEL SYSTEM
// ============================================
function getCurrentTown() {
    return TOWNS[gameState.currentLocation];
}

function getTownById(townId) {
    return TOWNS[townId];
}

function canTravelTo(townId) {
    if (townId === gameState.currentLocation) return false;
    if (gameState.travelingTo) return false;

    const town = TOWNS[townId];
    if (!town) return false;

    // Need delivery van for travel
    if (!hasEquipment('deliveryVan')) return false;

    // Limit: can only make one round trip per day (2 travels: there and back)
    if (gameState.dailyTravels >= 2) return false;

    // Check if can afford travel
    return gameState.cash >= town.travelCost;
}

function travelTo(townId) {
    if (!canTravelTo(townId)) {
        log("Can't travel there right now!", "negative");
        return false;
    }

    const town = TOWNS[townId];
    const fromTown = getCurrentTown();

    // Pay travel cost
    gameState.cash -= town.travelCost;
    gameState.dailySpent += town.travelCost;

    // Track daily travels
    gameState.dailyTravels = (gameState.dailyTravels || 0) + 1;

    // Mark current location as visited before leaving
    if (!gameState.visitedTownsToday) {
        gameState.visitedTownsToday = {};
    }
    gameState.visitedTownsToday[gameState.currentLocation] = true;

    // Travel happens instantly
    gameState.currentLocation = townId;

    log(`Traveled from ${fromTown.name} to ${town.name} (-$${formatMoney(town.travelCost)})`, "warning");

    // Play truck travel animation
    playTruckTravel();

    // Fisherman comments on the new location
    const travelComments = [
        `${town.name}, eh? ${town.description}`,
        `Welcome to ${town.name}! Different waters, different opportunities.`,
        `${town.name}'s got its own rhythm. You'll figure it out.`,
        `Ah, ${town.name}. I know a few folks 'round here.`
    ];
    fishermanSays(randomChoice(travelComments));

    // Check if we've already visited this town today
    const alreadyVisited = gameState.visitedTownsToday[townId];

    if (alreadyVisited) {
        // No new boats if returning to a town we already bought from
        gameState.boats = [];
        log(`The dock is quiet - you've already been here today.`);
    } else {
        // Fresh boats at a new location
        gameState.boats = generateBoats();
    }

    // Always regenerate buyers (different buyers might show up)
    gameState.buyers = generateBuyers();

    // Mark this town as visited
    gameState.visitedTownsToday[townId] = true;

    // Check remaining travels
    if (gameState.dailyTravels >= 2) {
        log(`You've used your travel for today.`, "warning");
    }

    updateUI();
    return true;
}

function getLocationPriceModifier(type) {
    const town = getCurrentTown();
    if (!town) return 1.0;

    if (type === 'buy') {
        return town.buyMod;
    } else if (type === 'sell') {
        // Tourist towns get extra boost in summer
        let mod = town.sellMod;
        if (town.traits.includes('tourist') && gameState.season === 'Summer') {
            mod *= 1.15;
        }
        // Wealthy towns less affected by bad weather
        if (town.traits.includes('wealthy') && gameState.weather === 'rainy') {
            mod *= 1.05; // Partial protection
        }
        return mod;
    }
    return 1.0;
}

function getLocationBoatBonus() {
    const town = getCurrentTown();
    return town ? town.boatBonus : 0;
}

function getLocationBuyerBonus() {
    const town = getCurrentTown();
    return town ? -town.buyerPenalty : 0; // Negative penalty = bonus
}

// ============================================
// FISHERMAN COMMENTARY SYSTEM
// ============================================
function fishermanSays(message) {
    const bob = CONFIG.dockworker;
    log(`${bob.emoji} ${bob.name}: "${message}"`, "fisherman");

    // Skip popup on mobile to reduce clutter
    if (isMobile()) return;

    // Also show as popup on desktop
    showBobPopup(message);
}

// Show daily flavor event as one-liner (no popup)
function showDailyFlavorEvent() {
    const flavors = CONFIG.dailyFlavor;
    const event = randomChoice(flavors);
    log(`🌊 ${event}`, "flavor");
}

// Show Barnacle Bob popup on screen
function showBobPopup(message) {
    // Remove any existing Bob popup
    const existing = document.querySelector('.bob-popup');
    if (existing) {
        existing.remove();
    }

    const bob = CONFIG.dockworker;
    const popup = document.createElement('div');
    popup.className = 'bob-popup';
    popup.innerHTML = `
        <div class="bob-avatar">${bob.emoji}</div>
        <div class="bob-speech">
            <div class="bob-name">${bob.name}</div>
            <div class="bob-message">"${message}"</div>
        </div>
        <button class="bob-dismiss">×</button>
    `;

    document.body.appendChild(popup);

    // Add dismiss handler
    popup.querySelector('.bob-dismiss').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    });

    // Animate in
    setTimeout(() => popup.classList.add('show'), 10);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) popup.remove();
            }, 300);
        }
    }, 5000);
}

function getRandomComment(category) {
    const comments = category;
    if (!comments || comments.length === 0) return null;
    return randomChoice(comments);
}

// Track milestones that have been announced
let announcedMilestones = {};

function resetMilestones() {
    announcedMilestones = {};
}

function checkMilestones() {
    const cash = gameState.cash;
    const milestones = CONFIG.dockworker.milestones;

    if (cash >= 10000 && !announcedMilestones.first_10k) {
        announcedMilestones.first_10k = true;
        fishermanSays(milestones.first_10k);
    } else if (cash >= 25000 && !announcedMilestones.first_25k) {
        announcedMilestones.first_25k = true;
        fishermanSays(milestones.first_25k);
    } else if (cash >= 50000 && !announcedMilestones.first_50k) {
        announcedMilestones.first_50k = true;
        fishermanSays(milestones.first_50k);
    } else if (cash >= 75000 && !announcedMilestones.first_75k) {
        announcedMilestones.first_75k = true;
        fishermanSays(milestones.first_75k);
    }
}

function maybeIdleChatter() {
    // 5% chance of random chatter (reduced to minimize popup overload)
    if (Math.random() < 0.05) {
        fishermanSays(getRandomComment(CONFIG.dockworker.idle));
    }
}

// ============================================
// RIVAL DEALER SYSTEM
// ============================================
function initializeRivals() {
    gameState.rivals = {};
    for (const [id, rival] of Object.entries(RIVALS)) {
        gameState.rivals[id] = {
            id: id,
            cash: rival.startingCash,
            inventory: 0,
            reputation: 50,
            isActive: true,
            lastAction: null
        };
    }
}

function getRivalState(rivalId) {
    return gameState.rivals[rivalId];
}

function rivalSays(rivalId, messageType) {
    const rival = RIVALS[rivalId];
    if (!rival) return;
    const messages = rival[messageType];
    if (messages && messages.length > 0) {
        const message = randomChoice(messages);
        log(`${rival.emoji} ${rival.name}: "${message}"`, "rival");
    }
}

// Determine if a rival wants to bid on a boat
function rivalWantsToBuy(rivalId, boat) {
    const rival = RIVALS[rivalId];
    const state = getRivalState(rivalId);

    if (!state || !state.isActive || state.cash < 200) return null;

    const totalCost = boat.catchAmount * boat.pricePerLb;

    switch (rival.personality) {
        case "aggressive":
            // Slick Rick: Always interested, bids high
            if (state.cash >= totalCost * rival.bidStyle) {
                return {
                    willBuy: true,
                    maxPrice: totalCost * rival.bidStyle,
                    urgency: 0.8 // High chance to act first
                };
            }
            break;

        case "conservative":
            // Prudent Penny: Only buys good deals
            if (boat.pricePerLb < 4.50 && state.cash >= totalCost) {
                return {
                    willBuy: true,
                    maxPrice: totalCost * rival.bidStyle,
                    urgency: 0.3 // Low chance to act first
                };
            }
            break;

        case "chaotic":
            // Crazy Carl: Random decisions
            if (Math.random() > 0.4 && state.cash >= totalCost * 0.5) {
                const randomMod = 0.8 + Math.random() * 0.5; // 0.8 to 1.3
                return {
                    willBuy: true,
                    maxPrice: Math.min(state.cash, totalCost * randomMod),
                    urgency: Math.random() // Completely random
                };
            }
            break;
    }

    return null;
}

// Process rival actions for the day
function processRivalActions() {
    const actionsThisTurn = [];

    // Check each boat for rival interest
    for (let i = gameState.boats.length - 1; i >= 0; i--) {
        const boat = gameState.boats[i];
        let interestedRivals = [];

        // Gather interested rivals
        for (const rivalId of Object.keys(RIVALS)) {
            const interest = rivalWantsToBuy(rivalId, boat);
            if (interest) {
                interestedRivals.push({ rivalId, ...interest });
            }
        }

        // Sort by urgency (highest first)
        interestedRivals.sort((a, b) => b.urgency - a.urgency);

        // The most urgent rival acts (if any) - but only 40% chance per boat
        if (interestedRivals.length > 0 && Math.random() < 0.4) {
            const acting = interestedRivals[0];
            const rival = RIVALS[acting.rivalId];
            const state = getRivalState(acting.rivalId);

            const cost = Math.round(boat.catchAmount * boat.pricePerLb);

            if (state.cash >= cost) {
                // Rival buys the boat's catch
                state.cash -= cost;
                state.inventory += boat.catchAmount;
                state.lastAction = `Bought ${boat.catchAmount} lbs`;

                log(`${rival.emoji} ${rival.name} bought ${boat.catchAmount} lbs from ${boat.name}!`, "rival-action");
                rivalSays(acting.rivalId, "taunt");

                gameState.stats.lostToRivals++;
                gameState.boats.splice(i, 1);

                actionsThisTurn.push({
                    rivalId: acting.rivalId,
                    action: "bought",
                    amount: boat.catchAmount
                });
            }
        }
    }

    // Rivals sell some inventory each day (simplified)
    for (const [rivalId, state] of Object.entries(gameState.rivals)) {
        if (state.inventory > 50 && Math.random() > 0.5) {
            const sellAmount = Math.floor(state.inventory * randomFloat(0.3, 0.6));
            const sellPrice = randomFloat(5.5, 7.5);
            state.cash += Math.round(sellAmount * sellPrice);
            state.inventory -= sellAmount;
        }
    }

    return actionsThisTurn;
}

// Update statistics
function updateStats(type, data) {
    const stats = gameState.stats;

    switch (type) {
        case "buy":
            stats.totalLobstersBought += data.amount;
            stats.totalMoneySpent += data.cost;
            if (data.captain) {
                stats.dealsWithCaptains[data.captain] = (stats.dealsWithCaptains[data.captain] || 0) + 1;
            }
            break;

        case "sell":
            stats.totalLobstersSold += data.amount;
            stats.totalMoneyEarned += data.revenue;
            if (data.buyer) {
                stats.salesToBuyers[data.buyer] = (stats.salesToBuyers[data.buyer] || 0) + 1;
            }
            break;

        case "dayEnd":
            const dayProfit = data.earned - data.spent;
            if (dayProfit > stats.bestDayProfit) {
                stats.bestDayProfit = dayProfit;
            }
            if (dayProfit < stats.worstDayLoss) {
                stats.worstDayLoss = dayProfit;
            }
            break;

        case "loan":
            stats.loansTotal += data.amount;
            break;

        case "interest":
            stats.interestPaid += data.amount;
            break;

        case "outbidRival":
            stats.rivalsOutbid++;
            break;
    }
}

// Get favorite captain (most deals)
function getFavoriteCaptain() {
    const deals = gameState.stats.dealsWithCaptains;
    let max = 0;
    let favorite = "None yet";
    for (const [captain, count] of Object.entries(deals)) {
        if (count > max) {
            max = count;
            favorite = captain;
        }
    }
    return { name: favorite, count: max };
}

// Get best buyer (most sales)
function getBestBuyer() {
    const sales = gameState.stats.salesToBuyers;
    let max = 0;
    let best = "None yet";
    for (const [buyer, count] of Object.entries(sales)) {
        if (count > max) {
            max = count;
            best = buyer;
        }
    }
    return { name: best, count: max };
}

// ============================================
// RANDOM EVENTS SYSTEM
// ============================================
function processRandomEvents() {
    const events = [];

    for (const [eventId, event] of Object.entries(RANDOM_EVENTS)) {
        // Check if event can trigger
        if (Math.random() > event.chance) continue;

        // Check requirements
        if (event.requiresEquipment && !hasEquipment(event.requiresEquipment)) continue;
        if (event.requiresAnyEquipment && Object.keys(gameState.equipment).length === 0) continue;
        if (event.minInventory && getTotalInventory() < event.minInventory) continue;

        // Limit to 1 event per day (50% chance of second event)
        if (events.length >= 1 && Math.random() > 0.5) break;

        // Apply event effect
        const data = event.effect(gameState);

        // Log the event with special styling (toast will show automatically)
        const logType = event.type === 'positive' ? 'event-positive' : 'event-negative';
        log(`${event.emoji} ${event.name}: ${event.message(data)}`, logType);

        // Bob comments on the event
        if (event.bobComment && event.bobComment.length > 0) {
            fishermanSays(randomChoice(event.bobComment));
        }

        events.push({ event, data });
    }

    return events;
}

// ============================================
// WEATHER SYSTEM
// ============================================
function generateWeather() {
    const weathers = Object.keys(CONFIG.weather);
    const weights = {
        Summer: { sunny: 50, cloudy: 30, rainy: 15, stormy: 3, foggy: 2 },
        Fall: { sunny: 30, cloudy: 35, rainy: 25, stormy: 5, foggy: 5 },
        Winter: { sunny: 20, cloudy: 30, rainy: 20, stormy: 15, foggy: 15 },
        Spring: { sunny: 35, cloudy: 30, rainy: 25, stormy: 5, foggy: 5 }
    };

    const seasonWeights = weights[gameState.season];
    const total = Object.values(seasonWeights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;

    for (const weather of weathers) {
        roll -= seasonWeights[weather];
        if (roll <= 0) return weather;
    }
    return "sunny";
}

function getMarketTrend() {
    // Simple trend based on recent conditions
    const roll = Math.random();
    if (roll < 0.3) return -1; // falling
    if (roll < 0.7) return 0; // stable
    return 1; // rising
}

// ============================================
// PRICING SYSTEM
// ============================================
function calculateBuyPrice(grade) {
    let price = CONFIG.baseLobsterPrice;

    // Season modifier
    price *= CONFIG.seasons[gameState.season].buyMod;

    // Weather modifier
    price *= CONFIG.weather[gameState.weather].priceMod;

    // Grade modifier (run uses quarter pricing as baseline)
    const gradeData = CONFIG.grades[grade] || CONFIG.grades.quarter;
    price *= gradeData.buyMod;

    // Location modifier - fishing hubs are cheaper!
    price *= getLocationPriceModifier('buy');

    // Market trend
    price *= (1 + gameState.marketTrend * 0.1);

    // Random variation
    price += randomFloat(-0.50, 0.50);

    return Math.round(price * 100) / 100;
}

function calculateSellPrice(grade) {
    let price = CONFIG.baseLobsterPrice;

    // Season modifier
    price *= CONFIG.seasons[gameState.season].sellMod;

    // Grade modifier (run uses quarter pricing as baseline, slightly lower)
    const gradeData = CONFIG.grades[grade] || { sellMod: 0.95 }; // run sells at 95% of quarter
    price *= gradeData.sellMod;

    // Location modifier - tourist towns pay more!
    price *= getLocationPriceModifier('sell');

    // Market trend (inverse for selling - high demand = good prices)
    price *= (1 + gameState.marketTrend * 0.15);

    // Equipment bonuses
    const transactionBonus = getEquipmentEffect('transactionBonus', 0);
    price *= (1 + transactionBonus);

    // Random variation
    price += randomFloat(-0.30, 0.50);

    return Math.round(price * 100) / 100;
}

// ============================================
// ONBOARDING BOATS (First 3 Days)
// ============================================
function generateOnboardingBoats() {
    const boats = [];
    const boatIdCounter = Date.now();

    // Use game seed for variations in onboarding (keeps tutorial functional but feels different)
    const seedRng = mulberry32(gameState.gameSeed + gameState.day);

    // More noticeable variation in catch and price
    const catchVariation = 0.75 + seedRng() * 0.5; // 75-125% of base (60-100 lbs)
    const priceVariation = 0.85 + seedRng() * 0.3; // 85-115% of base ($3.40-$4.60)

    // Boat name variety (keeps same captain for tutorial consistency)
    const boatNames = ["Mary Lou", "Sea Spirit", "Lucky Strike", "Morning Star", "Blue Wave"];
    const boatNameIndex = Math.floor(seedRng() * boatNames.length);

    // Day 1: Single reliable captain, easy deal
    if (gameState.day === 1) {
        const captain = "Cap'n Joe";
        const captainData = CONFIG.captains[captain] || { priceVar: 0.95, catchMod: 1.0, trait: "reliable" };
        const sellerId = getOrCreateSeller(captain, "reliable");
        const sellerNPC = gameState.sellerNPCs[sellerId];

        boats.push({
            id: `boat_${boatIdCounter}_0`,
            name: boatNames[boatNameIndex],
            captain: captain,
            sellerId: sellerId,
            captainTrait: "reliable",
            captainFlavor: "First day? I'll give you a fair deal.",
            loyalty: 0,
            sellerTrust: sellerNPC ? sellerNPC.trust : 0,
            catchAmount: Math.round(80 * catchVariation), // 60-100 lbs
            pricePerLb: Math.round(4.00 * priceVariation * 100) / 100, // $3.40-$4.60
            boatType: 'lobsterBoat',
            boatTypeData: CONFIG.boatTypes.lobsterBoat,
            timeLeft: 60, // Generous timer
            arrived: true,
            timerStarted: false
        });
    }

    // Day 2: Two boats - reliable and newcomer
    if (gameState.day === 2) {
        const captain1 = "Cap'n Joe";
        const captainData1 = CONFIG.captains[captain1] || { priceVar: 0.95, catchMod: 1.0, trait: "reliable" };
        const sellerId1 = getOrCreateSeller(captain1, "reliable");
        const sellerNPC1 = gameState.sellerNPCs[sellerId1];

        boats.push({
            id: `boat_${boatIdCounter}_0`,
            name: "Mary Lou",
            captain: captain1,
            sellerId: sellerId1,
            captainTrait: "reliable",
            captainFlavor: "Good to see you back! Building trust.",
            loyalty: 1,
            sellerTrust: sellerNPC1 ? sellerNPC1.trust : 0,
            catchAmount: 100,
            pricePerLb: 3.90, // Slight loyalty discount
            boatType: 'lobsterBoat',
            boatTypeData: CONFIG.boatTypes.lobsterBoat,
            timeLeft: 50,
            arrived: true,
            timerStarted: false
        });

        const captain2 = "Young Davey";
        const sellerId2 = getOrCreateSeller(captain2, "newcomer");
        const sellerNPC2 = gameState.sellerNPCs[sellerId2];

        boats.push({
            id: `boat_${boatIdCounter}_1`,
            name: "Sea Spray",
            captain: captain2,
            sellerId: sellerId2,
            captainTrait: "newcomer",
            captainFlavor: "New to selling - eager to make a deal!",
            loyalty: 0,
            sellerTrust: sellerNPC2 ? sellerNPC2.trust : 0,
            catchAmount: 60,
            pricePerLb: 3.75, // Newcomer discount
            boatType: 'dory',
            boatTypeData: CONFIG.boatTypes.dory,
            timeLeft: 40,
            arrived: true,
            timerStarted: false
        });
    }

    // Day 3: Transition - mix of known captains and new one
    if (gameState.day === 3) {
        const captain1 = "Cap'n Joe";
        const sellerId1 = getOrCreateSeller(captain1, "reliable");
        const sellerNPC1 = gameState.sellerNPCs[sellerId1];

        boats.push({
            id: `boat_${boatIdCounter}_0`,
            name: "Mary Lou",
            captain: captain1,
            sellerId: sellerId1,
            captainTrait: "reliable",
            captainFlavor: "Three days in a row! You're becoming a regular.",
            loyalty: 2,
            sellerTrust: sellerNPC1 ? sellerNPC1.trust : 0,
            catchAmount: 120,
            pricePerLb: 3.85,
            boatType: 'lobsterBoat',
            boatTypeData: CONFIG.boatTypes.lobsterBoat,
            timeLeft: 45,
            arrived: true,
            timerStarted: false
        });

        // Random second boat
        const captain2 = randomChoice(["Sarah Mae", "Old Pete", "Young Davey"]);
        const captainData2 = CONFIG.captains[captain2] || { priceVar: 1.0, catchMod: 1.0, trait: "regular" };
        const sellerId2 = getOrCreateSeller(captain2, captainData2.trait);
        const sellerNPC2 = gameState.sellerNPCs[sellerId2];

        boats.push({
            id: `boat_${boatIdCounter}_1`,
            name: randomChoice(CONFIG.boatNames),
            captain: captain2,
            sellerId: sellerId2,
            captainTrait: captainData2.trait || "regular",
            captainFlavor: captainData2.flavorText || "Good morning!",
            loyalty: 0,
            sellerTrust: sellerNPC2 ? sellerNPC2.trust : 0,
            catchAmount: randomInt(50, 100),
            pricePerLb: calculateBuyPrice('B') * (captainData2.priceVar || 1.0),
            boatType: 'lobsterBoat',
            boatTypeData: CONFIG.boatTypes.lobsterBoat,
            timeLeft: 40,
            arrived: true,
            timerStarted: false
        });
    }

    return boats;
}

// ============================================
// BOAT GENERATION
// ============================================
function generateBoats() {
    // Scripted onboarding for first 3 days
    if (gameState.day <= 3) {
        return generateOnboardingBoats();
    }

    const boats = [];
    const seasonData = CONFIG.seasons[gameState.season];
    const weatherData = CONFIG.weather[gameState.weather];

    // Location affects number of boats - fishing hubs have more!
    const locationBoatBonus = getLocationBoatBonus();
    const maxBoats = Math.max(1, gameState.maxBoats + getEquipmentEffect('extraBoats', 0) + locationBoatBonus);

    // Boat type distribution (weighted random)
    const boatTypeWeights = [
        { type: 'dory', weight: 40 },
        { type: 'lobsterBoat', weight: 45 },
        { type: 'trawler', weight: 15 }
    ];

    let boatIdCounter = Date.now();

    for (let i = 0; i < maxBoats; i++) {
        const boatChance = seasonData.boatChance * weatherData.boatMod;
        if (Math.random() > boatChance) continue;

        // Select boat type based on weights
        const boatTypeId = weightedRandom(boatTypeWeights);
        const boatType = CONFIG.boatTypes[boatTypeId] || CONFIG.boatTypes.lobsterBoat;

        const captain = randomChoice(CONFIG.captainNames);
        const captainData = CONFIG.captains[captain] || { priceVar: 1.0, catchMod: 1.0, trait: "regular" };
        const boatName = randomChoice(CONFIG.boatNames);

        // Get or create seller NPC for this captain
        const sellerId = getOrCreateSeller(captain, captainData.trait);
        const sellerNPC = gameState.sellerNPCs[sellerId];

        // Catch amount based on boat type and captain trait
        let catchAmount = randomInt(boatType.minCatch || 50, boatType.maxCatch || 200);
        catchAmount = Math.round(catchAmount * captainData.catchMod);

        // Get loyalty bonus (legacy)
        const loyalty = gameState.fishermenRelations[captain] || 0;
        const loyaltyDiscount = loyalty * 0.001; // Up to 10% discount at max loyalty

        // NEW: Get trust-based price modifier
        const trustMod = getTrustBuyMod(sellerId);

        // Base price affected by season, weather, market, loyalty, boat quality, captain trait, and trust
        let pricePerLb = calculateBuyPrice('B'); // Use B-grade as baseline
        pricePerLb = pricePerLb * (1 + (boatType.qualityBias || 0) * 0.5); // Quality affects price
        pricePerLb = pricePerLb * captainData.priceVar; // Captain personality affects price
        pricePerLb = pricePerLb * trustMod; // Trust affects price
        pricePerLb = Math.round((pricePerLb * (1 - loyaltyDiscount)) * 100) / 100;

        boats.push({
            id: `boat_${boatIdCounter}_${i}`,
            name: boatName,
            captain: captain,
            sellerId: sellerId, // NEW: Link to seller NPC
            captainTrait: captainData.trait,
            captainFlavor: captainData.flavorText,
            loyalty: loyalty,
            sellerTrust: sellerNPC ? sellerNPC.trust : 0, // NEW: Trust level
            catchAmount: catchAmount,
            pricePerLb: pricePerLb,
            boatType: boatTypeId || 'lobsterBoat',
            boatTypeData: boatType,
            timeLeft: boatType.timer || 40,
            arrived: true,
            timerStarted: false
        });
    }

    return boats;
}

// Weighted random selection helper
function weightedRandom(options) {
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;

    for (const option of options) {
        random -= option.weight;
        if (random <= 0) return option.type;
    }
    return options[0].type;
}

// ============================================
// ONBOARDING BUYERS (First 3 Days)
// ============================================
function generateOnboardingBuyers() {
    const buyers = [];

    // Day 1: Single wholesaler - will buy anything (run)
    if (gameState.day === 1) {
        const buyerName = "Portland Seafood Co.";
        const buyerId = getOrCreateBuyer(buyerName, "wholesaler");

        buyers.push({
            name: buyerName,
            buyerId: buyerId,
            emoji: "🏭",
            type: "wholesaler",
            wantsAmount: 100, // Will buy everything you have
            acceptsRun: true,
            acceptsGrades: ['select', 'quarter', 'chix'],
            pricePerLb: 5.50, // Good starting sell price
            trust: 0,
            buyerTrust: 0
        });
    }

    // Day 2: Wholesaler + budget buyer
    if (gameState.day === 2) {
        const buyerName1 = "Portland Seafood Co.";
        const buyerId1 = getOrCreateBuyer(buyerName1, "wholesaler");

        buyers.push({
            name: buyerName1,
            buyerId: buyerId1,
            emoji: "🏭",
            type: "wholesaler",
            wantsAmount: 120,
            acceptsRun: true,
            acceptsGrades: ['select', 'quarter', 'chix'],
            pricePerLb: 5.60, // Slight trust bump
            trust: 1,
            buyerTrust: gameState.buyerNPCs[buyerId1]?.trust || 0
        });

        const buyerName2 = "Lobster Roll Stand";
        const buyerId2 = getOrCreateBuyer(buyerName2, "restaurant");

        buyers.push({
            name: buyerName2,
            buyerId: buyerId2,
            emoji: "🦞",
            type: "budget",
            wantsAmount: 50,
            acceptsRun: true,
            acceptsGrades: ['chix', 'quarter'],
            pricePerLb: 5.25,
            trust: 0,
            buyerTrust: 0
        });
    }

    // Day 3: Mix of buyers - transition to normal
    if (gameState.day === 3) {
        const buyerName1 = "Portland Seafood Co.";
        const buyerId1 = getOrCreateBuyer(buyerName1, "wholesaler");

        buyers.push({
            name: buyerName1,
            buyerId: buyerId1,
            emoji: "🏭",
            type: "wholesaler",
            wantsAmount: 150,
            acceptsRun: true,
            acceptsGrades: ['select', 'quarter', 'chix'],
            pricePerLb: 5.70,
            trust: 2,
            buyerTrust: gameState.buyerNPCs[buyerId1]?.trust || 0
        });

        // Random additional buyer
        const extraBuyers = ["Harbor Bistro", "The Clam Shack", "Lobster Roll Stand"];
        const buyerName2 = randomChoice(extraBuyers);
        const buyerId2 = getOrCreateBuyer(buyerName2, "restaurant");

        buyers.push({
            name: buyerName2,
            buyerId: buyerId2,
            emoji: "🍽️",
            type: "restaurant",
            wantsAmount: randomInt(30, 60),
            acceptsRun: false,
            acceptsGrades: ['select', 'quarter'],
            pricePerLb: 6.00,
            trust: 0,
            buyerTrust: 0
        });
    }

    return buyers;
}

// ============================================
// BUYER GENERATION
// ============================================
// Location-specific buyer names
const LOCATION_BUYERS = {
    stonington: {
        wholesalers: ["Stonington Fish Pier", "Island Seafood Co.", "Deer Isle Dist."],
        restaurants: ["Fisherman's Friend", "The Granite Inn", "Isle au Haut Diner"],
        special: ["Quarry Workers Union", "Fishing Derby", "Island Wedding"],
        budget: ["Lobster Roll Shack", "Harbor Takeout", "Pier Side Stand"]
    },
    rockland: {
        wholesalers: ["Rockland Seafood", "Midcoast Lobster", "Atlantic Fish House"],
        restaurants: ["Primo Restaurant", "Archer's on the Pier", "The Pearl"],
        special: ["Schooner Festival", "Art Museum Gala", "Lighthouse Tours"],
        budget: ["Red's Eats", "Rock City Cafe", "Breakwater Grill"]
    },
    camden: {
        wholesalers: ["Camden Harbor Co.", "Penobscot Bay Seafood", "Yacht Club Supply"],
        restaurants: ["Natalie's at Camden", "The Waterfront", "Hartstone Inn"],
        special: ["Regatta Catering", "Estate Wedding", "Private Yacht Party"],
        budget: ["Camden Deli", "Cappy's Chowder", "Sea Dog Brewing"]
    },
    portland: {
        wholesalers: ["Portland Seafood Co.", "Harbor Fish Market", "Maine Coast Dist."],
        restaurants: ["Fore Street", "Eventide Oyster", "Street & Co."],
        special: ["Old Port Festival", "Cruise Ship Galley", "Convention Center"],
        budget: ["J's Oyster", "Gilbert's Chowder", "Flatbread Company"]
    },
    boothbay: {
        wholesalers: ["Boothbay Lobster Wharf", "Linekin Bay Seafood", "Coastal Maine Co."],
        restaurants: ["Ports of Italy", "McSeagull's", "Lobsterman's Wharf"],
        special: ["Windjammer Days", "Harbor Wedding", "Kayak Tours BBQ"],
        budget: ["Chowder House", "Tugboat Inn", "Blue Moon Cafe"]
    },
    barHarbor: {
        wholesalers: ["Bar Harbor Lobster", "Acadia Seafood", "Frenchman Bay Dist."],
        restaurants: ["Havana", "Mache Bistro", "Reading Room"],
        special: ["Acadia Tour Group", "Cruise Ship VIP", "Park Lodge Event"],
        budget: ["Geddy's", "Side Street Cafe", "Jordan's Restaurant"]
    },
    kennebunkport: {
        wholesalers: ["Cape Porpoise Lobster", "Kennebunk Seafood", "Southern Maine Dist."],
        restaurants: ["White Barn Inn", "The Tides", "Old Vines"],
        special: ["Bush Compound Staff", "Estate Party", "Yacht Club Gala"],
        budget: ["The Clam Shack", "Allisson's", "Bandaloop"]
    }
};

function generateBuyers() {
    // Scripted onboarding for first 3 days
    if (gameState.day <= 3) {
        return generateOnboardingBuyers();
    }

    const buyers = [];
    const weatherData = CONFIG.weather[gameState.weather];
    const locationBuyerBonus = getLocationBuyerBonus(); // Positive = more buyers
    const town = getCurrentTown();
    const locationId = gameState.currentLocation;

    // Get location-specific buyer names or fall back to generic
    const localBuyers = LOCATION_BUYERS[locationId] || LOCATION_BUYERS.portland;

    // Wholesaler buyer - always present, accepts run or any grade
    const wName = randomChoice(localBuyers.wholesalers);
    const wTrust = gameState.buyerRelations[wName] || 0;
    const wBuyerId = getOrCreateBuyer(wName, "wholesaler");
    const wTrustMod = getTrustSellMod(wBuyerId);

    buyers.push({
        name: wName,
        buyerId: wBuyerId,
        emoji: "🏭",
        type: "wholesaler",
        wantsAmount: randomInt(80, 200) + Math.floor(wTrust / 5),
        acceptsRun: true,
        acceptsGrades: ['select', 'quarter', 'chix'],
        pricePerLb: calculateSellPrice('quarter') * wTrustMod,
        trust: wTrust,
        buyerTrust: gameState.buyerNPCs[wBuyerId]?.trust || 0
    });

    // Restaurant buyer - wants quarters or selects (graded only)
    const restaurantChance = town.traits.includes('tourist') || town.traits.includes('wealthy') ? 0.2 : 0.3;
    if (hasEquipment('bandingStation') || Math.random() > restaurantChance) {
        const name = randomChoice(localBuyers.restaurants);
        const trust = gameState.buyerRelations[name] || 0;
        const rBuyerId = getOrCreateBuyer(name, "restaurant");
        const rTrustMod = getTrustSellMod(rBuyerId);

        if (Math.random() < weatherData.buyerMod) {
            const wantsSelects = Math.random() > 0.6;
            buyers.push({
                name: name,
                buyerId: rBuyerId,
                emoji: "🍽️",
                type: "restaurant",
                wantsAmount: randomInt(15, 40) + Math.floor(trust / 10) + (locationBuyerBonus * 5),
                acceptsRun: false,
                acceptsGrades: wantsSelects ? ['select'] : ['select', 'quarter'],
                pricePerLb: calculateSellPrice(wantsSelects ? 'select' : 'quarter') * rTrustMod,
                trust: trust,
                buyerTrust: gameState.buyerNPCs[rBuyerId]?.trust || 0
            });
        }
    }

    // Special buyer (tourists, events) - wants selects only (premium)
    const specialChance = town.traits.includes('tourist') ? 0.3 : town.traits.includes('wealthy') ? 0.4 : 0.5;
    if (Math.random() > specialChance && weatherData.buyerMod > 0.7) {
        const sName = randomChoice(localBuyers.special);
        const sBuyerId = getOrCreateBuyer(sName, "tourist");
        const sTrustMod = getTrustSellMod(sBuyerId);
        buyers.push({
            name: sName,
            buyerId: sBuyerId,
            emoji: "⭐",
            type: "special",
            wantsAmount: randomInt(30, 80) + (locationBuyerBonus * 10),
            acceptsRun: false,
            acceptsGrades: ['select'],
            pricePerLb: calculateSellPrice('select') * sTrustMod,
            trust: 0,
            buyerTrust: gameState.buyerNPCs[sBuyerId]?.trust || 0
        });
    }

    // Chix buyer - specifically wants smaller lobsters (cheaper for them)
    if (Math.random() > 0.6) {
        const cName = randomChoice(localBuyers.budget);
        const cBuyerId = getOrCreateBuyer(cName, "restaurant");
        const cTrustMod = getTrustSellMod(cBuyerId);
        buyers.push({
            name: cName,
            buyerId: cBuyerId,
            emoji: "🦞",
            type: "budget",
            wantsAmount: randomInt(40, 100),
            acceptsRun: false,
            acceptsGrades: ['chix', 'quarter'],
            pricePerLb: calculateSellPrice('chix') * cTrustMod,
            trust: 0,
            buyerTrust: gameState.buyerNPCs[cBuyerId]?.trust || 0
        });
    }

    // Extra buyer in high-volume towns (Portland, Bar Harbor) - accepts run
    if (locationBuyerBonus >= 1 && Math.random() > 0.5) {
        // Use a wholesaler from a different location for variety
        const otherLocations = Object.keys(LOCATION_BUYERS).filter(l => l !== locationId);
        const otherLocation = randomChoice(otherLocations);
        const eName = randomChoice(LOCATION_BUYERS[otherLocation].wholesalers);
        const eBuyerId = getOrCreateBuyer(eName, "wholesaler");
        const eTrustMod = getTrustSellMod(eBuyerId);
        buyers.push({
            name: eName,
            buyerId: eBuyerId,
            emoji: "🏪",
            type: "bulk",
            wantsAmount: randomInt(50, 150),
            acceptsRun: true,
            acceptsGrades: ['select', 'quarter', 'chix'],
            pricePerLb: calculateSellPrice('quarter') * 0.95 * eTrustMod,
            trust: 0,
            buyerTrust: gameState.buyerNPCs[eBuyerId]?.trust || 0
        });
    }

    return buyers;
}

// ============================================
// TANK MANAGEMENT
// ============================================
function processTankDaily() {
    const baseMortalityRate = getEquipmentEffect('mortalityRate', gameState.baseMortalityRate);
    const qualityDecayMod = getEquipmentEffect('qualityDecayMod', 1);

    let totalLost = 0;
    let lotsRotted = 0;

    // Process each lot
    for (const lot of gameState.lots) {
        // Decay freshness
        const decayAmount = lot.decayRate * qualityDecayMod;
        lot.freshness = Math.max(0, lot.freshness - decayAmount);

        // Mortality increases as freshness drops
        // At 100% freshness: base mortality rate
        // At 0% freshness: 3x mortality rate
        const freshnessPenalty = 1 + (2 * (1 - lot.freshness / 100));
        const effectiveMortality = baseMortalityRate * freshnessPenalty;

        // Apply mortality
        const lost = Math.floor(lot.amount * effectiveMortality);
        if (lost > 0) {
            lot.amount -= lost;
            gameState.inventory[lot.grade] = Math.max(0, gameState.inventory[lot.grade] - lost);
            totalLost += lost;
        }

        // Very low freshness lots rot completely
        if (lot.freshness <= 10 && lot.amount > 0) {
            const rotAmount = Math.ceil(lot.amount * 0.3); // 30% of remaining rots
            lot.amount -= rotAmount;
            gameState.inventory[lot.grade] = Math.max(0, gameState.inventory[lot.grade] - rotAmount);
            lotsRotted += rotAmount;
        }
    }

    // Remove empty lots
    gameState.lots = gameState.lots.filter(l => l.amount > 0);

    // Track spoilage for reputation calculations
    gameState.dailySpoilage = totalLost + lotsRotted;

    if (totalLost > 0) {
        log(`Lost ${totalLost} lbs to mortality.`, "negative");
    }
    if (lotsRotted > 0) {
        log(`${lotsRotted} lbs rotted from old stock!`, "negative");
    }
}

// ============================================
// FINANCE SYSTEM
// ============================================
function takeLoan(amount) {
    if (gameState.debt > 0) {
        log("Pay off existing loan first!", "negative");
        return false;
    }

    const maxLoan = Math.max(5000, gameState.cash * 2);
    amount = Math.min(amount, maxLoan);

    gameState.debt = amount;
    gameState.cash += amount;
    updateStats("loan", { amount: amount });
    log(`Took out a loan for $${formatMoney(amount)}`, "warning");
    updateUI();
    return true;
}

function payLoan(amount) {
    amount = Math.min(amount, gameState.debt, gameState.cash);
    if (amount <= 0) return false;

    gameState.cash -= amount;
    gameState.debt -= amount;
    log(`Paid $${formatMoney(amount)} toward loan.`, "positive");
    updateUI();
    return true;
}

function processWeeklyInterest() {
    if (gameState.debt > 0) {
        const interest = Math.ceil(gameState.debt * gameState.interestRate);
        gameState.debt += interest;
        updateStats("interest", { amount: interest });
        log(`Interest added: $${formatMoney(interest)}. Total debt: $${formatMoney(gameState.debt)}`, "negative");
    }
}

// ============================================
// BUYING & SELLING
// ============================================

// Grade lobsters when purchased - the dealer does the grading, not the fisherman
function gradeLobsters(amount) {
    // Without grading table, all lobsters are "run" (ungraded)
    if (!hasEquipment('gradingTable')) {
        return {
            select: 0,
            quarter: 0,
            chix: 0,
            run: amount
        };
    }

    // With grading table: grade into selects, quarters, chix
    // Selects (2+ lbs): ~15-25% of catch
    // Quarters (1.25-2 lbs): ~40-50% of catch
    // Chix (1-1.25 lbs): remainder
    const selectPercent = randomFloat(0.15, 0.25);
    const quarterPercent = randomFloat(0.40, 0.50);

    const selects = Math.round(amount * selectPercent);
    const quarters = Math.round(amount * quarterPercent);
    const chix = amount - selects - quarters;

    return {
        select: selects,
        quarter: quarters,
        chix: Math.max(0, chix),
        run: 0
    };
}

function buyFromBoat(boatIndex, amount) {
    const boat = gameState.boats[boatIndex];
    if (!boat) return false;

    const capacity = gameState.tankCapacity + getEquipmentEffect('capacityBonus', 0);
    const currentInventory = getTotalInventory();
    const availableSpace = capacity - currentInventory;

    // Determine how much to buy
    let buyAmount = amount || boat.catchAmount;
    buyAmount = Math.min(buyAmount, boat.catchAmount, availableSpace);

    if (buyAmount <= 0) {
        log("No room in tanks or no lobsters available!", "negative");
        return false;
    }

    const cost = Math.round(buyAmount * boat.pricePerLb);

    if (cost > gameState.cash) {
        log("Can't afford that!", "negative");
        return false;
    }

    // Buy the lobsters
    gameState.cash -= cost;
    gameState.dailySpent += cost;  // Track daily spending
    boat.catchAmount -= buyAmount;

    // Track statistics
    updateStats("buy", { amount: buyAmount, cost: cost, captain: boat.captain });

    // Grade the lobsters (dealer does the grading)
    const graded = gradeLobsters(buyAmount);

    // Create lots for each grade with freshness tracking
    if (graded.select > 0) addLot('select', graded.select, 100);
    if (graded.quarter > 0) addLot('quarter', graded.quarter, 100);
    if (graded.chix > 0) addLot('chix', graded.chix, 100);
    if (graded.run > 0) addLot('run', graded.run, 100);

    // Build relationship with captain (legacy)
    const currentLoyalty = gameState.fishermenRelations[boat.captain] || 0;
    gameState.fishermenRelations[boat.captain] = Math.min(100, currentLoyalty + 1);

    // NEW: Track for trust system
    if (boat.sellerId) {
        // Track daily lbs bought from this seller
        gameState.dailyLbsBought[boat.sellerId] = (gameState.dailyLbsBought[boat.sellerId] || 0) + buyAmount;
    }

    // Log message - more informative feedback
    const cashLeft = gameState.cash;
    if (hasEquipment('gradingTable')) {
        log(`Bought ${buyAmount} lbs @ $${boat.pricePerLb.toFixed(2)}/lb — $${formatMoney(cost)} spent, $${formatMoney(cashLeft)} left`, "positive");
    } else {
        log(`Bought ${buyAmount} lbs (run) @ $${boat.pricePerLb.toFixed(2)}/lb — $${formatMoney(cost)} spent, $${formatMoney(cashLeft)} left`, "positive");
    }

    // Flash cash display to show change
    flashElement('summary-cash');

    // Track playstyle stats
    if (cost > gameState.biggestSingleBuy) {
        gameState.biggestSingleBuy = cost;
    }
    if (gameState.cash < 500) {
        gameState.riskyDeals++;
    }

    // Check speed run milestones
    checkSpeedRunMilestones();

    // Fisherman commentary on the purchase (25% chance - reduced for less popup spam)
    if (Math.random() < 0.25) {
        const bob = CONFIG.dockworker;
        if (buyAmount >= 150) {
            fishermanSays(getRandomComment(bob.buying.big_haul));
        } else if (boat.loyalty >= 50) {
            fishermanSays(getRandomComment(bob.buying.loyal_captain));
        } else if (boat.pricePerLb > 5.50) {
            fishermanSays(getRandomComment(bob.buying.expensive));
        } else if (boat.pricePerLb < 4.00) {
            fishermanSays(getRandomComment(bob.buying.good_deal));
        }
    }

    // Check for low cash warning (20% chance)
    if (gameState.cash < 500 && Math.random() < 0.2) {
        fishermanSays(getRandomComment(CONFIG.dockworker.low_cash));
    }

    // Remove boat if empty
    if (boat.catchAmount <= 0) {
        // Clear boat timer
        if (boat.id && gameState.boatTimers && gameState.boatTimers[boat.id]) {
            clearInterval(gameState.boatTimers[boat.id].intervalId);
            delete gameState.boatTimers[boat.id];
        }
        gameState.boats.splice(boatIndex, 1);
    }

    updateUI();
    return true;
}

function passBoat(boatIndex) {
    const boat = gameState.boats[boatIndex];
    if (boat) {
        // Clear boat's timer
        if (boat.id && gameState.boatTimers && gameState.boatTimers[boat.id]) {
            clearInterval(gameState.boatTimers[boat.id].intervalId);
            delete gameState.boatTimers[boat.id];
        }

        // Track as missed opportunity
        const potentialValue = Math.round(boat.catchAmount * boat.pricePerLb);
        gameState.missedBoats.push({
            name: boat.name,
            captain: boat.captain,
            catchAmount: boat.catchAmount,
            value: potentialValue,
            reason: 'passed'
        });

        log(`${boat.name} sailed away.`);
        gameState.boats.splice(boatIndex, 1);
        updateUI();
    }
}

function sellToBuyer(buyerIndex) {
    const buyer = gameState.buyers[buyerIndex];
    if (!buyer) return false;

    // Check equipment requirements
    if (buyer.type === 'restaurant' && !hasEquipment('bandingStation')) {
        log("Need Banding Station for restaurant sales!", "negative");
        return false;
    }

    let sold = 0;
    let revenue = 0;
    const hasGradingTable = hasEquipment('gradingTable');

    // Without grading table: can only sell "run" (ungraded) to buyers who accept it
    if (!hasGradingTable) {
        if (!buyer.acceptsRun) {
            log(`${buyer.name} only wants graded lobsters! Get a Grading Table.`, "negative");
            return false;
        }
        // Sell from run inventory
        const amount = Math.min(gameState.inventory.run, buyer.wantsAmount);
        if (amount > 0) {
            // Apply freshness modifier to price (old lobsters sell for less)
            const freshness = getAverageFreshness('run');
            const freshnessMod = 0.7 + (freshness / 100) * 0.3; // 70-100% of price based on freshness
            removeLotAmount('run', amount);
            sold = amount;
            revenue = amount * buyer.pricePerLb * freshnessMod;
        }
    } else {
        // With grading table: sell graded inventory to buyers based on what they accept
        // Also can sell run to buyers who accept it

        // First, sell graded lobsters (priority: select > quarter > chix)
        for (const grade of ['select', 'quarter', 'chix']) {
            if (!buyer.acceptsGrades.includes(grade)) continue;
            const amount = Math.min(gameState.inventory[grade], buyer.wantsAmount - sold);
            if (amount > 0) {
                const gradeData = CONFIG.grades[grade];
                const gradePrice = buyer.pricePerLb * (gradeData ? gradeData.sellMod / CONFIG.grades.quarter.sellMod : 1);
                // Apply freshness modifier
                const freshness = getAverageFreshness(grade);
                const freshnessMod = 0.7 + (freshness / 100) * 0.3;
                removeLotAmount(grade, amount);
                sold += amount;
                revenue += amount * gradePrice * freshnessMod;
            }
        }

        // If buyer accepts run and still wants more, sell from run
        if (buyer.acceptsRun && sold < buyer.wantsAmount && gameState.inventory.run > 0) {
            const amount = Math.min(gameState.inventory.run, buyer.wantsAmount - sold);
            const freshness = getAverageFreshness('run');
            const freshnessMod = 0.7 + (freshness / 100) * 0.3;
            removeLotAmount('run', amount);
            sold += amount;
            revenue += amount * buyer.pricePerLb * 0.9 * freshnessMod;
        }
    }

    if (sold <= 0) {
        log("No suitable inventory to sell!", "negative");
        return false;
    }

    // Apply equipment bonus
    const bonus = getEquipmentEffect('transactionBonus', 0);
    revenue *= (1 + bonus);
    const finalRevenue = Math.round(revenue);

    gameState.cash += finalRevenue;
    gameState.dailyEarned += finalRevenue;  // Track daily earnings
    buyer.wantsAmount -= sold;

    // Track statistics
    updateStats("sell", { amount: sold, revenue: finalRevenue, buyer: buyer.name });

    // Build relationship (legacy)
    if (buyer.name) {
        const currentTrust = gameState.buyerRelations[buyer.name] || 0;
        gameState.buyerRelations[buyer.name] = Math.min(100, currentTrust + 1);
    }

    // NEW: Track for trust system
    if (buyer.buyerId) {
        // Track daily lbs sold to this buyer
        gameState.dailyLbsSold[buyer.buyerId] = (gameState.dailyLbsSold[buyer.buyerId] || 0) + sold;

        // Track freshness for this buyer (average freshness of what was sold)
        // We use overall freshness as proxy since we've already removed lots
        const overallFreshness = getOverallFreshness();
        if (!gameState.dailyFreshnessSold[buyer.buyerId]) {
            gameState.dailyFreshnessSold[buyer.buyerId] = { totalFreshness: 0, totalLbs: 0 };
        }
        gameState.dailyFreshnessSold[buyer.buyerId].totalFreshness += overallFreshness * sold;
        gameState.dailyFreshnessSold[buyer.buyerId].totalLbs += sold;
    }

    const gradeInfo = hasGradingTable ? "" : " (run)";
    const pricePerLb = (finalRevenue / sold).toFixed(2);
    log(`Sold ${sold} lbs${gradeInfo} @ $${pricePerLb}/lb — +$${formatMoney(finalRevenue)}, now $${formatMoney(gameState.cash)}`, "positive");

    // Flash cash display to show change
    flashElement('summary-cash');

    // Track playstyle stats
    if (finalRevenue > gameState.biggestSingleSale) {
        gameState.biggestSingleSale = finalRevenue;
    }

    // Check speed run milestones
    checkSpeedRunMilestones();

    // Fisherman commentary on the sale (25% chance - reduced for less popup spam)
    if (Math.random() < 0.25) {
        const bob = CONFIG.dockworker;
        if (finalRevenue >= 500) {
            fishermanSays(getRandomComment(bob.selling.big_sale));
        } else if (buyer.type === 'special') {
            fishermanSays(getRandomComment(bob.selling.premium_buyer));
        }
        // Removed generic "good_sale" comment to reduce noise
    }

    // Check milestones after earning money
    checkMilestones();

    if (buyer.wantsAmount <= 0) {
        gameState.buyers.splice(buyerIndex, 1);
    }

    updateUI();
    checkGameEnd();
    return true;
}

// ============================================
// EQUIPMENT SHOP
// ============================================
function buyEquipment(id) {
    const equip = EQUIPMENT[id];
    if (!equip) return false;

    if (hasEquipment(id)) {
        log("Already owned!", "negative");
        return false;
    }

    if (equip.requires && !hasEquipment(equip.requires)) {
        log(`Requires ${EQUIPMENT[equip.requires].name} first!`, "negative");
        return false;
    }

    if (gameState.cash < equip.cost) {
        log("Can't afford that!", "negative");
        return false;
    }

    gameState.cash -= equip.cost;
    gameState.equipment[id] = true;

    // Note: capacityBonus and extraBoats are calculated dynamically via getEquipmentEffect()
    // No need to apply immediate effects here

    log(`Purchased ${equip.name}!`, "positive");

    // Fisherman congratulates on upgrade
    fishermanSays(getRandomComment(CONFIG.dockworker.equipment));

    updateUI();
    return true;
}

// ============================================
// DAY PROGRESSION
// ============================================
function nextDay() {
    // Clear all boat timers first
    clearAllBoatTimers();

    // Track remaining boats as missed opportunities
    gameState.boats.forEach(boat => {
        const potentialValue = Math.round(boat.catchAmount * boat.pricePerLb);
        gameState.missedBoats.push({
            name: boat.name,
            captain: boat.captain,
            catchAmount: boat.catchAmount,
            value: potentialValue,
            reason: 'dayEnd'
        });
    });

    // Track remaining buyers as missed opportunities
    gameState.buyers.forEach(buyer => {
        const total = getTotalInventory();
        if (total > 0) {
            const potentialSale = Math.min(total, buyer.wantAmount || 100);
            const avgSellPrice = calculateSellPrice('B');
            gameState.missedBuyers.push({
                name: buyer.name,
                type: buyer.type,
                potentialLbs: potentialSale,
                potentialValue: Math.round(potentialSale * avgSellPrice)
            });
        }
    });

    // Store current day's data for summary (before resetting)
    const previousDay = gameState.day;
    const previousDayEarned = gameState.dailyEarned;
    const previousDaySpent = gameState.dailySpent;
    const hadActivity = previousDayEarned > 0 || previousDaySpent > 0 || gameState.missedBoats.length > 0;

    // Calculate total missed value
    const totalMissedValue = gameState.missedBoats.reduce((sum, b) => sum + b.value, 0) +
                             gameState.missedBuyers.reduce((sum, b) => sum + (b.potentialValue || 0), 0);

    // Show daily profit/loss summary for the day that just ended
    const dailyProfit = gameState.dailyEarned - gameState.dailySpent;
    if (hadActivity || gameState.missedBoats.length > 0) {
        const profitText = dailyProfit >= 0
            ? `+$${formatMoney(dailyProfit)}`
            : `-$${formatMoney(Math.abs(dailyProfit))}`;
        const profitType = dailyProfit >= 0 ? "positive" : "negative";
        log(`━━━ Day ${previousDay} Summary: Earned $${formatMoney(gameState.dailyEarned)} | Spent $${formatMoney(gameState.dailySpent)} | Net: ${profitText} ━━━`, profitType);

        // Track best/worst day stats
        updateStats("dayEnd", { earned: gameState.dailyEarned, spent: gameState.dailySpent });
    }

    // Store tier before processing changes (for rank-up detection)
    const oldTier = gameState.repTier;

    // Store for summary modal (before reset)
    gameState.previousDayData = {
        day: previousDay,
        earned: previousDayEarned,
        spent: previousDaySpent,
        hadActivity: hadActivity,
        missedBoats: [...gameState.missedBoats],
        missedBuyers: [...gameState.missedBuyers],
        boatsLostToRival: gameState.boatsLostToRival,
        totalMissedValue: totalMissedValue,
        rankUp: null // Will be set if rank changes
    };

    // Save yesterday's net before resetting
    gameState.yesterdayNet = gameState.dailyEarned - gameState.dailySpent - gameState.dailyCosts;

    // Update streaks based on daily profit
    updateStreaks(gameState.yesterdayNet);

    // Process end-of-day trust and reputation changes
    processEndOfDayTrust();

    // Check for rank-up after reputation processing
    if (gameState.repTier !== oldTier) {
        gameState.previousDayData.rankUp = {
            oldTier: oldTier,
            newTier: gameState.repTier
        };
    }

    // CRITICAL: Show day summary IMMEDIATELY after all summary data is prepared
    // This ensures summary always appears regardless of what happens next
    try {
        showDaySummary();
    } catch (e) {
        console.error("Error showing day summary:", e);
    }

    // Clear today's fortune for new day
    gameState.todayFortune = null;

    // Reset daily trackers for new day
    gameState.dailySpent = 0;
    gameState.dailyEarned = 0;
    gameState.dailyCosts = 0;
    gameState.dailyTravels = 0;
    gameState.visitedTownsToday = {};
    gameState.missedBoats = [];
    gameState.missedBuyers = [];
    gameState.boatsLostToRival = 0;

    // Pay daily operating expenses (dock fees, tank maintenance)
    const expenses = CONFIG.dailyExpenses;
    const inventoryLbs = getTotalInventory();
    const baseCost = expenses.base;
    const tankCost = Math.floor(inventoryLbs * expenses.perLbInventory);
    let totalExpense = baseCost + tankCost;

    // Auto-pay portion of debt if player has cash and debt
    let debtPayment = 0;
    if (gameState.debt > 0 && gameState.cash > totalExpense) {
        debtPayment = Math.min(
            Math.ceil(gameState.debt * expenses.debtPayment),
            gameState.cash - totalExpense - 100 // Keep at least $100 buffer
        );
        if (debtPayment > 0) {
            debtPayment = Math.max(0, debtPayment);
            gameState.debt -= debtPayment;
            totalExpense += debtPayment;
            if (gameState.debt === 0) {
                gameState.stats.loansPaidOff = (gameState.stats.loansPaidOff || 0) + 1;
                log(`Loan fully paid off! Debt-free!`, "positive");
            }
        }
    }

    // Deduct total from cash (can go negative)
    gameState.cash -= totalExpense;
    gameState.dailyCosts = totalExpense;

    // Show expense breakdown
    let expenseMsg = `Daily expenses: $${baseCost} dock + $${tankCost} tank`;
    if (debtPayment > 0) {
        expenseMsg += ` + $${debtPayment} debt payment`;
    }
    log(expenseMsg, "warning");

    // Track inventory at start of day for spoilage calculations
    trackDayStartInventory();

    // Process tank (mortality, quality decay)
    processTankDaily();

    // Check for weekly events
    const oldWeek = gameState.week;
    gameState.day++;
    gameState.week = Math.ceil(gameState.day / 7);

    if (gameState.week > oldWeek) {
        processWeeklyEvents();
    }

    // Update season
    gameState.season = getSeason(gameState.day);

    // Weather progression
    gameState.weather = gameState.tomorrowWeather;
    gameState.tomorrowWeather = generateWeather();

    // Market trend
    gameState.marketTrend = getMarketTrend();

    // Generate new boats and buyers
    gameState.boats = generateBoats();
    gameState.buyers = generateBuyers();

    // Start boat arrival processing (for staggered arrivals)
    if (gameState.boats.length > 0) {
        startBoatArrivalProcessing();
    }

    // Rival dealers try to buy boats before you can!
    if (gameState.boats.length > 0) {
        processRivalActions();
    }

    // Process random events (after boats/buyers generated)
    processRandomEvents();

    // Check for captain storylines
    checkCaptainStories();

    // Update market supply tracking
    updateMarketSupply();

    // Day summary was already shown earlier in the function

    // Check if summer season has ended
    if (checkSeasonEnd()) {
        updateUI();
        return;
    }

    // Check game end (isDayEnd = true for full bankruptcy check)
    if (!checkGameEnd(true)) {
        const weatherIcon = CONFIG.weather[gameState.weather].icon;
        if (gameState.boats.length === 0) {
            log(`Day ${gameState.day} ${weatherIcon}: No boats today.`);
        } else {
            log(`Day ${gameState.day} ${weatherIcon}: ${gameState.boats.length} boat(s) at dock!`);
            // Play boat arrival animation
            playBoatArrival();
        }

        // Fisherman morning commentary (15% chance - reduced for less popup spam)
        if (Math.random() < 0.15) {
            fishermanSays(getRandomComment(CONFIG.dockworker.morning));
        }

        // Weather-specific commentary (20% chance - only on notable weather)
        if (Math.random() < 0.2 && gameState.weather !== "sunny") {
            const weatherComments = CONFIG.dockworker.weather[gameState.weather];
            if (weatherComments) {
                fishermanSays(getRandomComment(weatherComments));
            }
        }

        // Market trend commentary (15% chance - only when trending)
        if (Math.random() < 0.15 && gameState.marketTrend !== 0) {
            const trendType = gameState.marketTrend > 0 ? 'rising' : 'falling';
            fishermanSays(getRandomComment(CONFIG.dockworker.market[trendType]));
        }

        // Season change commentary
        const oldSeason = getSeason(gameState.day - 1);
        if (oldSeason !== gameState.season) {
            fishermanSays(getRandomComment(CONFIG.dockworker.season[gameState.season]));
        }

        // Daily flavor event (one-liner, no popup) - 50% chance
        if (Math.random() < 0.5) {
            showDailyFlavorEvent();
        }

        // Fortune cookie tip from Old Pete (every day)
        setTimeout(() => showFortuneTip(), 1500);

        // Display streak if active
        const streakText = getStreakDisplay();
        if (streakText) {
            log(`${streakText}`, "positive");
        }

        // Occasional idle chatter
        maybeIdleChatter();
    }

    updateUI();
}

function processWeeklyEvents() {
    log(`=== Week ${gameState.week} ===`, "");

    // Process loan interest
    processWeeklyInterest();
}

// ============================================
// GAME END CONDITIONS
// ============================================

// Track if we've already done the daily bankruptcy check
let lastBankruptcyCheckDay = 0;

function checkGameEnd(isDayEnd = false) {
    const netWorth = gameState.cash - gameState.debt + getTotalInventory() * 3;

    // Check for win condition (can happen anytime)
    if (gameState.cash >= CONFIG.winCondition) {
        endGame(true, `You've amassed $${formatMoney(CONFIG.winCondition)}! You're the Lobster Baron of Maine!`);
        return true;
    }

    // Bankruptcy checks only happen at day end (not during trading)
    if (!isDayEnd) {
        // Only end during trading if severely in debt with no hope
        if (netWorth < CONFIG.bankruptcyThreshold && gameState.cash < 0) {
            endGame(false, "The bank has seized your assets. The lobster business is brutal.");
            return true;
        }
        return false;
    }

    // Full bankruptcy check at day end
    if (netWorth < 0 && lastBankruptcyCheckDay !== gameState.day) {
        lastBankruptcyCheckDay = gameState.day;
        gameState.daysInTrouble++;

        if (netWorth < CONFIG.bankruptcyThreshold) {
            // Severe debt - immediate bankruptcy
            endGame(false, "The bank has seized your assets. You're too deep in debt to recover.");
            return true;
        } else if (gameState.daysInTrouble >= CONFIG.daysUntilBankruptcy) {
            // Bankruptcy after extended grace period
            endGame(false, `After ${CONFIG.daysUntilBankruptcy} days struggling, the bank has called in your debts. Better luck next season!`);
            return true;
        } else {
            // Warning - player has time to recover
            const daysLeft = CONFIG.daysUntilBankruptcy - gameState.daysInTrouble;
            if (gameState.daysInTrouble === 1) {
                log(`⚠️ Finances tight! Net worth: $${formatMoney(netWorth)}. You have ${daysLeft} days to get back in the black.`, "negative");
                fishermanSays(`Money's tight, but we've all been there. Sell some lobster and you'll be fine!`);
            } else if (gameState.daysInTrouble >= 4) {
                log(`⚠️ CRITICAL: Net worth $${formatMoney(netWorth)}! Only ${daysLeft} day(s) left!`, "negative");
                fishermanSays(`This is serious now! You gotta move some product or the bank's gonna come knockin'!`);
            } else {
                log(`⚠️ Still in the red ($${formatMoney(netWorth)}). ${daysLeft} days remaining.`, "negative");
            }
        }
    } else if (netWorth >= 0) {
        // Reset trouble counter when back in positive
        if (gameState.daysInTrouble > 0) {
            gameState.daysInTrouble = 0;
            log(`Back in the black! Financial crisis averted.`, "positive");
            fishermanSays(`That's the spirit! Knew you had it in ya!`);

            // Track recovery from debt for achievements
            if (gameState.debt > 0) {
                gameState.stats.recoveredFromDebt = true;
            }
        }
    }

    return false;
}

function endGame(won, message) {
    gameState.gameOver = true;

    const modal = document.getElementById("game-over-modal");
    const title = document.getElementById("game-over-title");
    const msg = document.getElementById("game-over-message");

    title.textContent = won ? "Victory!" : "Game Over";
    title.style.color = won ? "var(--success)" : "var(--danger)";
    msg.innerHTML = message + `<br><br>Final stats: Day ${gameState.day}, Cash: $${formatMoney(gameState.cash)}, Debt: $${formatMoney(gameState.debt)}`;

    modal.style.display = "flex";
}

function resetGame() {
    // Reset milestones tracker
    resetMilestones();

    // Reset bankruptcy day tracker
    lastBankruptcyCheckDay = 0;

    // Load prestige data from previous runs
    const prestigeData = loadPrestige();
    const startingPrestige = prestigeData?.prestige || 0;
    const prestigeBonuses = getPrestigeBonuses();

    // Calculate starting cash with prestige bonus
    const startingCash = CONFIG.startingCash + (prestigeBonuses.startingCash || 0);

    // Generate a random seed for this game run
    const gameSeed = Date.now() + Math.floor(Math.random() * 10000);

    // Use seed to create initial variety
    const seedRng = mulberry32(gameSeed);
    const initialWeather = seedRng() > 0.7 ? "cloudy" : "sunny"; // 30% chance cloudy start
    const initialMarketTrend = seedRng() > 0.6 ? (seedRng() > 0.5 ? 1 : -1) : 0; // 40% chance of initial trend

    gameState = {
        gameSeed: gameSeed,
        cash: startingCash,
        debt: 0,
        day: 1,
        week: 1,
        season: "Summer",
        weather: initialWeather,
        tomorrowWeather: generateWeather(),
        marketTrend: initialMarketTrend,
        currentLocation: "stonington", // Start in cheapest fishing village
        travelingTo: null,
        inventory: { select: 0, quarter: 0, chix: 0, run: 0 },
        lots: [],
        tankCapacity: 500,
        baseMortalityRate: 0.05,
        qualityDecayRate: 0.1,
        nextLotId: 1,
        equipment: {},
        boats: [],
        maxBoats: 1,
        buyers: [],
        fishermenRelations: {},
        buyerRelations: {},
        // NEW: Reputation & Trust System
        reputation: 0,
        repTier: "Dock Nobody",
        sellerNPCs: {},
        buyerNPCs: {},
        dailyLbsBought: {},
        dailyLbsSold: {},
        dailyFreshnessSold: {},
        dailySpoilage: 0,
        dailyInventoryStart: 0,
        loanAvailable: true,
        maxLoan: 10000,
        interestRate: 0.05,
        dailySpent: 0,
        dailyEarned: 0,
        dailyCosts: 0,
        dailyTravels: 0,
        visitedTownsToday: {},
        yesterdayNet: 0,
        // Streak & Speed Run Tracking
        profitStreak: 0,
        bestStreak: 0,
        lossStreak: 0,
        speedRunMilestones: {},
        todayFortune: null,
        // Playstyle tracking
        biggestSingleBuy: 0,
        biggestSingleSale: 0,
        totalDaysTraded: 0,
        perfectDays: 0,
        riskyDeals: 0,
        // Missed opportunities (for day summary)
        missedBoats: [],
        missedBuyers: [],
        boatsLostToRival: 0,
        potentialEarnings: 0,
        // Boat timer system
        boatTimers: {},
        stats: {
            totalLobstersBought: 0,
            totalLobstersSold: 0,
            totalMoneyEarned: 0,
            totalMoneySpent: 0,
            bestDayProfit: 0,
            worstDayLoss: 0,
            dealsWithCaptains: {},
            salesToBuyers: {},
            loansTotal: 0,
            interestPaid: 0,
            rivalsOutbid: 0,
            lostToRivals: 0,
            selectsSold: 0,
            quartersSold: 0,
            chixSold: 0,
            runSold: 0,
            loansPaidOff: 0,
            recoveredFromDebt: false,
            marketsCornered: 0,
            arbitrageProfit: 0,
            townsVisited: []
        },
        rivals: {},
        gameOver: false,
        daysInTrouble: 0,
        // New systems
        achievements: prestigeData?.achievements || {},
        prestige: startingPrestige,
        lifetimeEarnings: prestigeData?.lifetimeEarnings || 0,
        gamesCompleted: prestigeData?.gamesCompleted || 0,
        marketSupply: {},
        activeStory: null,
        completedStories: [],
        storyChoicesMade: {}
    };

    // Initialize rival dealers
    initializeRivals();

    // Initialize market supply tracking
    initializeMarketSupply();

    document.getElementById("game-over-modal").style.display = "none";
    document.getElementById("game-log").innerHTML = "<p>Welcome to Maine! Build your lobster empire!</p>";

    // Show prestige bonus if applicable
    if (prestigeBonuses.startingCash > 0) {
        log(`Prestige bonus: +$${formatMoney(prestigeBonuses.startingCash)} starting cash!`, "positive");
    }

    // Initial generation
    gameState.boats = generateBoats();
    gameState.buyers = generateBuyers();

    // Fisherman welcome greeting
    fishermanSays(getRandomComment(CONFIG.dockworker.morning));

    if (gameState.boats.length > 0) {
        log(`${gameState.boats[0].captain} has arrived with fresh lobsters!`);
    }

    updateUI();
}

// ============================================
// LOGGING & TOAST NOTIFICATIONS
// ============================================

// Track active toasts for stacking
let activeToasts = [];

function log(message, type = "") {
    const logEl = document.getElementById("game-log");
    const p = document.createElement("p");
    p.textContent = message;
    if (type) p.className = `log-${type}`;
    logEl.insertBefore(p, logEl.firstChild);

    while (logEl.children.length > 100) {
        logEl.removeChild(logEl.lastChild);
    }

    // Show as toast notification (skip for fisherman - Bob has his own popup)
    if (type !== "fisherman") {
        showToast(message, type);
    }
}

function showToast(message, type = "") {
    // On mobile, only show important toasts (positive/negative events, warnings)
    if (isMobile()) {
        const importantTypes = ['positive', 'negative', 'event-positive', 'event-negative', 'warning'];
        if (!importantTypes.includes(type)) return;
    }

    // Create toast container if it doesn't exist
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    // Determine icon based on type
    let icon = "📋";
    if (type === "positive" || type === "event-positive") icon = "✅";
    else if (type === "negative" || type === "event-negative") icon = "❌";
    else if (type === "warning") icon = "⚠️";
    else if (message.includes("Day")) icon = "📅";
    else if (message.includes("boat") || message.includes("Boat")) icon = "🚤";
    else if (message.includes("Bought") || message.includes("bought")) icon = "🦞";
    else if (message.includes("Sold") || message.includes("sold")) icon = "💰";
    else if (message.includes("$")) icon = "💵";

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast toast-${type || "default"}`;
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">×</button>
    `;

    // Add to container
    container.appendChild(toast);
    activeToasts.push(toast);

    // Limit max toasts shown
    while (activeToasts.length > 5) {
        const oldToast = activeToasts.shift();
        if (oldToast.parentNode) {
            oldToast.remove();
        }
    }

    // Animate in
    setTimeout(() => toast.classList.add("show"), 10);

    // Add close handler
    toast.querySelector(".toast-close").addEventListener("click", () => {
        dismissToast(toast);
    });

    // Auto-dismiss after delay (longer for important messages)
    const delay = (type === "negative" || type === "event-negative" || type === "warning") ? 5000 : 3500;
    setTimeout(() => {
        dismissToast(toast);
    }, delay);
}

function dismissToast(toast) {
    toast.classList.remove("show");
    toast.classList.add("hiding");

    // Remove from active list
    const index = activeToasts.indexOf(toast);
    if (index > -1) {
        activeToasts.splice(index, 1);
    }

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

// ============================================
// UI UPDATES
// ============================================
function updateUI() {
    // === STATUS STRIP UPDATES ===
    // Cash
    const cashEl = document.getElementById("cash");
    if (cashEl) cashEl.textContent = `$${formatMoney(gameState.cash)}`;

    // Day
    const dayEl = document.getElementById("day");
    if (dayEl) dayEl.textContent = gameState.day;

    // Inventory total and capacity
    const invTotal = document.getElementById("inventory-total");
    if (invTotal) invTotal.textContent = getTotalInventory();

    const capEl = document.getElementById("capacity");
    if (capEl) capEl.textContent = gameState.tankCapacity;

    // Average freshness
    const avgFresh = document.getElementById("avg-freshness");
    if (avgFresh) {
        const freshness = getAverageFreshness();
        avgFresh.textContent = `${freshness}%`;
    }

    // Weather
    const weatherIcon = document.getElementById("weather-icon");
    if (weatherIcon) weatherIcon.textContent = CONFIG.weather[gameState.weather].icon;

    const tomorrowWeather = document.getElementById("tomorrow-weather");
    if (tomorrowWeather) tomorrowWeather.textContent = CONFIG.weather[gameState.tomorrowWeather].icon;

    // Market trend
    const trendEl = document.getElementById("market-trend");
    if (trendEl) {
        if (gameState.marketTrend > 0) {
            trendEl.textContent = "Rising";
            trendEl.className = "trend-rising";
        } else if (gameState.marketTrend < 0) {
            trendEl.textContent = "Falling";
            trendEl.className = "trend-falling";
        } else {
            trendEl.textContent = "Stable";
            trendEl.className = "trend-stable";
        }
    }

    // Reputation in strip
    const stripRep = document.getElementById("strip-reputation");
    if (stripRep) {
        stripRep.textContent = gameState.repTier;
    }

    // Update badge visual in strip
    const badgeData = BADGE_TIERS[gameState.repTier] || BADGE_TIERS["Dock Nobody"];
    const badgeVisual = document.getElementById("badge-visual");
    if (badgeVisual) badgeVisual.textContent = badgeData.emblem;

    // === DOCK VIEW UPDATES ===
    const town = getCurrentTown();

    // Location name and emoji in dock view
    const locEmoji = document.getElementById("location-emoji");
    if (locEmoji) locEmoji.textContent = town.emoji;

    const locName = document.getElementById("location-name");
    if (locName) locName.textContent = town.name;

    // Buy/sell modifiers
    const buyMod = document.getElementById("buy-mod");
    if (buyMod) {
        const mod = Math.round((town.buyMod - 1) * 100);
        buyMod.textContent = `${mod >= 0 ? '+' : ''}${mod}%`;
    }

    const sellMod = document.getElementById("sell-mod");
    if (sellMod) {
        const mod = Math.round((town.sellMod - 1) * 100);
        sellMod.textContent = `${mod >= 0 ? '+' : ''}${mod}%`;
    }

    // Dock empty state visibility
    const dockEmpty = document.getElementById("dock-empty");
    if (dockEmpty) {
        dockEmpty.style.display = gameState.boats.length === 0 ? 'block' : 'none';
    }

    // Buyers empty state visibility
    const buyersEmpty = document.getElementById("buyers-empty");
    if (buyersEmpty) {
        buyersEmpty.style.display = gameState.buyers.length === 0 ? 'block' : 'none';
    }

    // Markets panel (Desktop left column)
    updateMarketsPanel();

    // Daily tracker (optional elements)
    const dailySpentEl = document.getElementById("daily-spent");
    const dailyEarnedEl = document.getElementById("daily-earned");
    const profitEl = document.getElementById("daily-profit");
    if (dailySpentEl) dailySpentEl.textContent = formatMoney(gameState.dailySpent);
    if (dailyEarnedEl) dailyEarnedEl.textContent = formatMoney(gameState.dailyEarned);
    if (profitEl) {
        const dailyNet = gameState.dailyEarned - gameState.dailySpent;
        if (dailyNet >= 0) {
            profitEl.textContent = `Net: +$${formatMoney(dailyNet)}`;
            profitEl.className = "daily-stat profit-positive";
        } else {
            profitEl.textContent = `Net: -$${formatMoney(Math.abs(dailyNet))}`;
            profitEl.className = "daily-stat profit-negative";
        }
    }

    // Tank display
    const capacity = gameState.tankCapacity + getEquipmentEffect('capacityBonus', 0);
    const total = getTotalInventory();

    // Only show grade breakdown if player has grading table
    const breakdownEl = document.getElementById("inventory-breakdown");
    if (breakdownEl) {
        if (hasEquipment('gradingTable')) {
            breakdownEl.style.display = "flex";
            const invA = document.getElementById("inventory-a");
            const invB = document.getElementById("inventory-b");
            const invC = document.getElementById("inventory-c");
            if (invA) invA.textContent = gameState.inventory.select;
            if (invB) invB.textContent = gameState.inventory.quarter;
            if (invC) invC.textContent = gameState.inventory.chix;
            // Update labels if needed
            const labelA = document.getElementById("label-a");
            const labelB = document.getElementById("label-b");
            const labelC = document.getElementById("label-c");
            if (labelA) labelA.textContent = "Sel:";
            if (labelB) labelB.textContent = "Qtr:";
            if (labelC) labelC.textContent = "Chx:";
        } else {
            breakdownEl.style.display = "none";
        }
    }

    const invTotalEl = document.getElementById("inventory-total");
    const capacityEl = document.getElementById("capacity");
    if (invTotalEl) invTotalEl.textContent = total;
    if (capacityEl) capacityEl.textContent = capacity;

    const tankFillEl = document.getElementById("tank-fill");
    if (tankFillEl) {
        const fillPercent = (total / capacity) * 100;
        tankFillEl.style.height = `${fillPercent}%`;
    }

    const lobsterIconsEl = document.getElementById("lobster-icons");
    if (lobsterIconsEl) {
        const lobsterCount = Math.min(Math.floor(total / 25), 15);
        lobsterIconsEl.textContent = "🦞".repeat(lobsterCount);
    }

    // Dock
    updateDockUI();

    // Buyers
    updateBuyersUI();

    // Equipment shop
    updateShopUI();


    // Location
    updateLocationUI();

    // Weather effects
    updateWeatherEffects();

    // Goal progress and countdown
    updateGoalUI();

    // Check achievements
    checkAchievements();

    // Check for helper tips
    checkHelperTips();
}

// Determine price tags for a boat offer
function getBoatPriceTags(boat) {
    const tags = [];
    const avgPrice = CONFIG.baseLobsterPrice * CONFIG.seasons[gameState.season].buyMod;
    const priceDiff = (boat.pricePerLb - avgPrice) / avgPrice;

    // Price-based tags
    if (priceDiff <= -0.15) {
        tags.push({ label: "CHEAP", class: "tag-cheap" });
    } else if (priceDiff >= 0.20) {
        tags.push({ label: "PREMIUM", class: "tag-premium" });
    }

    // Risky indicators
    if (boat.timeLeft <= 15) {
        tags.push({ label: "URGENT", class: "tag-risky" });
    }
    if (boat.loyalty < 25) {
        tags.push({ label: "NEW", class: "tag-neutral" });
    }
    if (boat.catchAmount >= 150) {
        tags.push({ label: "BIG HAUL", class: "tag-info" });
    }

    return tags;
}

function updateDockUI() {
    const container = document.getElementById("boats-container");
    if (!container) return;

    // Remove only boat cards, keep empty state
    container.querySelectorAll('.boat-card').forEach(el => el.remove());

    // Show/hide empty state
    const emptyState = document.getElementById("dock-empty");
    if (emptyState) {
        emptyState.style.display = gameState.boats.length === 0 ? 'block' : 'none';
    }

    // Update dock context message (why no boats)
    updateDockContext();

    // Update dock ambient pressure
    updateDockAmbient();

    if (gameState.boats.length === 0) {
        return;
    }

    gameState.boats.forEach((boat, index) => {
        const totalCost = Math.round(boat.catchAmount * boat.pricePerLb);
        const halfCost = Math.round((boat.catchAmount / 2) * boat.pricePerLb);
        const loyaltyStars = Math.floor(boat.loyalty / 25);
        const boatEmoji = boat.boatTypeData ? boat.boatTypeData.emoji : '🚤';
        const boatTypeName = boat.boatTypeData ? boat.boatTypeData.name : 'Boat';

        // Get price tags
        const tags = getBoatPriceTags(boat);
        const tagsHtml = tags.map(t => `<span class="price-tag ${t.class}">${t.label}</span>`).join('');

        // Timer urgency classes
        const timerUrgent = boat.timeLeft <= 10 ? 'timer-urgent' : boat.timeLeft <= 20 ? 'timer-warning' : '';

        // Trust indicator
        const sellerNPC = boat.sellerId ? gameState.sellerNPCs[boat.sellerId] : null;
        const trustLevel = sellerNPC ? sellerNPC.trust : 0;
        const trustTier = getTrustTier(trustLevel);
        const trustIcon = trustTier === 'preferred' ? '💎' :
                          trustTier === 'warm' ? '🤝' :
                          trustTier === 'cold' ? '❄️' : '';
        const trustClass = trustTier === 'preferred' ? 'trust-preferred' :
                           trustTier === 'warm' ? 'trust-warm' :
                           trustTier === 'cold' ? 'trust-cold' : '';

        const div = document.createElement("div");
        div.className = `boat-card boat-type-${boat.boatType || 'lobsterBoat'}`;
        div.dataset.boatId = boat.id;
        div.dataset.boatIndex = index;
        div.innerHTML = `
            <div class="boat-timer-bar ${timerUrgent}">
                <div class="timer-fill" style="width: ${(boat.timeLeft / (boat.boatTypeData?.timer || 40)) * 100}%"></div>
                <span class="timer-text">${boat.timeLeft}s</span>
            </div>
            <div class="boat-header">
                <span class="boat-emoji floating">${boatEmoji}</span>
                <div class="boat-info">
                    <span class="boat-name">${boat.name}</span>
                    <span class="boat-type-label">${boatTypeName}</span>
                </div>
                <div class="captain-info">
                    <span class="captain-name ${trustClass}">${boat.captain} ${trustIcon} ${"★".repeat(loyaltyStars)}</span>
                    <span class="captain-flavor">${boat.captainFlavor || ''}</span>
                </div>
            </div>
            <div class="catch-info">
                <div class="price-highlight">
                    <span class="price-per-lb">$${boat.pricePerLb.toFixed(2)}/lb</span>
                    <div class="price-tags">${tagsHtml}</div>
                </div>
                <p class="catch-details">${boat.catchAmount} lbs • Total: $${formatMoney(totalCost)}</p>
            </div>
            <div class="boat-actions">
                <button class="btn btn-primary buy-all-btn">Buy All ($${formatMoney(totalCost)})</button>
                <button class="btn buy-half-btn">Half ($${formatMoney(halfCost)})</button>
                <button class="btn btn-secondary pass-btn">Pass</button>
            </div>
        `;
        container.appendChild(div);

        // Event listeners handled via delegation in initEventHandlers()

        // Start timer if not already started
        if (!boat.timerStarted) {
            boat.timerStarted = true;
            startBoatTimer(boat);
        }
    });
}

// Update dock empty state context message
function updateDockContext() {
    const contextEl = document.getElementById('dock-empty-context');
    if (!contextEl) return;

    // Choose context message based on game state
    let message = '';

    // Weather-based messages
    if (gameState.weather === 'stormy') {
        message = "Storms are keeping the fleet offshore.";
    } else if (gameState.weather === 'foggy') {
        message = "The fog may be slowing boats down.";
    } else if (gameState.weather === 'rainy') {
        message = "Rain might keep some captains home.";
    }
    // Reputation-based messages (if weather is fine)
    else if (gameState.repTier === 'Dock Nobody') {
        message = "No one prioritizes you yet.";
    }
    // Time-based messages
    else if (gameState.day <= 3) {
        message = "You're still learning the rhythm of the dock.";
    }
    // Default
    else {
        message = "Boats come and go. Patience pays.";
    }

    contextEl.textContent = message;
}

// Update dock ambient pressure indicator
function updateDockAmbient() {
    const ambientEl = document.getElementById('dock-ambient');
    const timeEl = document.getElementById('dock-time-of-day');
    const pressureEl = document.getElementById('dock-pressure-hint');

    if (!ambientEl) return;

    // Show ambient only when dock is empty
    ambientEl.style.display = gameState.boats.length === 0 ? 'block' : 'none';

    // Time of day based on actions taken
    if (timeEl) {
        const actions = (gameState.dailySpent > 0 || gameState.dailyEarned > 0) ? 'Afternoon' : 'Morning';
        timeEl.textContent = actions;
    }

    // Pressure hint based on inventory
    if (pressureEl) {
        const total = getTotalInventory();
        const freshness = getAverageFreshness();

        if (total === 0) {
            pressureEl.textContent = "Your tanks are empty. Buy before you can sell.";
        } else if (freshness < 70) {
            pressureEl.textContent = "Freshness dropping. Sell soon or lose stock.";
        } else if (total > gameState.tankCapacity * 0.8) {
            pressureEl.textContent = "Tanks nearly full. Time to sell.";
        } else {
            pressureEl.textContent = "Freshness is holding... for now.";
        }
    }
}

// Start countdown timer for a boat
function startBoatTimer(boat) {
    // Ensure boatTimers object exists
    if (!gameState.boatTimers) gameState.boatTimers = {};
    if (!boat.id) return; // No boat id
    if (gameState.boatTimers[boat.id]) return; // Already has timer

    const intervalId = setInterval(() => {
        boat.timeLeft--;

        // Update timer display
        const boatCard = document.querySelector(`[data-boat-id="${boat.id}"]`);
        if (boatCard) {
            const timerBar = boatCard.querySelector('.boat-timer-bar');
            const timerFill = boatCard.querySelector('.timer-fill');
            const timerText = boatCard.querySelector('.timer-text');

            if (timerFill) {
                timerFill.style.width = `${(boat.timeLeft / (boat.boatTypeData?.timer || 40)) * 100}%`;
            }
            if (timerText) {
                timerText.textContent = `${boat.timeLeft}s`;
            }
            if (timerBar) {
                timerBar.classList.toggle('timer-urgent', boat.timeLeft <= 10);
                timerBar.classList.toggle('timer-warning', boat.timeLeft > 10 && boat.timeLeft <= 20);
            }
        }

        // Time's up - boat leaves to Slick Rick!
        if (boat.timeLeft <= 0) {
            clearInterval(intervalId);
            delete gameState.boatTimers[boat.id];
            boatLostToRival(boat);
        }
    }, 1000);

    gameState.boatTimers[boat.id] = { intervalId, boat };
}

// Handle boat arrival delays
function processBoatArrivals() {
    gameState.boats.forEach(boat => {
        if (!boat.arrived && boat.arrivalDelay > 0) {
            boat.arrivalDelay--;
            if (boat.arrivalDelay <= 0) {
                boat.arrived = true;
                // Announce arrival
                const boatEmoji = boat.boatTypeData ? boat.boatTypeData.emoji : '🚤';
                log(`${boatEmoji} ${boat.name} has arrived at the dock!`);
                updateDockUI();
            }
        }
    });
}

// Boat lost to rival dealer (timer expired)
function boatLostToRival(boat) {
    const boatIndex = gameState.boats.indexOf(boat);
    if (boatIndex === -1) return;

    // Track as missed opportunity
    const potentialValue = Math.round(boat.catchAmount * boat.pricePerLb);
    gameState.missedBoats.push({
        name: boat.name,
        captain: boat.captain,
        catchAmount: boat.catchAmount,
        value: potentialValue,
        reason: 'timeout'
    });
    gameState.boatsLostToRival++;
    gameState.stats.lostToRivals++;

    // Remove from active boats
    gameState.boats.splice(boatIndex, 1);

    // Taunt from Slick Rick!
    const taunt = randomChoice(CONFIG.rivalDealer.taunt);
    log(`⏰ ${taunt}`, "negative");

    updateDockUI();
}

// Start boat arrival processing
let boatArrivalInterval = null;

function startBoatArrivalProcessing() {
    if (boatArrivalInterval) clearInterval(boatArrivalInterval);
    boatArrivalInterval = setInterval(processBoatArrivals, 1000);
}

function stopBoatArrivalProcessing() {
    if (boatArrivalInterval) {
        clearInterval(boatArrivalInterval);
        boatArrivalInterval = null;
    }
}

// Clear all boat timers (called on day change)
function clearAllBoatTimers() {
    if (gameState.boatTimers) {
        for (const timerId in gameState.boatTimers) {
            clearInterval(gameState.boatTimers[timerId].intervalId);
        }
    }
    gameState.boatTimers = {};
    stopBoatArrivalProcessing();
}

function updateBuyersUI() {
    const container = document.getElementById("buyers-list");
    if (!container) return;

    // Remove only buyer cards, keep empty state
    container.querySelectorAll('.buyer-card').forEach(el => el.remove());

    // Show/hide empty state
    const emptyState = document.getElementById("buyers-empty");
    if (emptyState) {
        emptyState.style.display = gameState.buyers.length === 0 ? 'block' : 'none';
    }

    if (gameState.buyers.length === 0) {
        return;
    }

    const hasGradingTable = hasEquipment('gradingTable');

    gameState.buyers.forEach((buyer, index) => {
        const total = getTotalInventory();
        const canSell = total > 0;
        const trustStars = Math.floor((buyer.trust || 0) / 25);

        // Build grade requirement text
        let gradeText;
        if (buyer.acceptsRun && !hasGradingTable) {
            gradeText = "run";  // Will buy ungraded
        } else if (buyer.acceptsRun) {
            gradeText = "any";  // Will buy anything
        } else if (buyer.acceptsGrades) {
            // Map grade keys to short names
            const gradeNames = buyer.acceptsGrades.map(g => {
                const data = CONFIG.grades[g];
                return data ? data.shortName : g;
            });
            gradeText = gradeNames.join("/");
        } else {
            gradeText = "graded";
        }

        // Check if this buyer can be sold to (has matching inventory)
        let canSellToThisBuyer = canSell;
        if (!hasGradingTable && !buyer.acceptsRun) {
            canSellToThisBuyer = false;
        }

        const div = document.createElement("div");
        div.className = "buyer-card";
        div.innerHTML = `
            <div class="buyer-info">
                <span class="buyer-emoji">${buyer.emoji}</span>
                <span class="buyer-name">${buyer.name} ${"★".repeat(trustStars)}</span>
                <span class="buyer-type">(${buyer.type})</span>
            </div>
            <div class="buyer-offer">
                Wants ${buyer.wantsAmount} lbs (${gradeText}) @ $${buyer.pricePerLb.toFixed(2)}/lb
            </div>
            <button class="btn btn-primary sell-btn" data-buyer="${index}" ${canSellToThisBuyer ? '' : 'disabled'}>Sell</button>
        `;
        container.appendChild(div);
    });

    container.querySelectorAll(".sell-btn").forEach(btn => {
        btn.addEventListener("click", () => sellToBuyer(parseInt(btn.dataset.buyer)));
    });
}

function updateShopUI() {
    const container = document.getElementById("equipment-list");
    if (!container) return;
    container.innerHTML = "";

    const categories = { tanks: "Tanks", vehicles: "Vehicles", processing: "Processing" };

    for (const [catId, catName] of Object.entries(categories)) {
        const header = document.createElement("h3");
        header.textContent = catName;
        container.appendChild(header);

        for (const [id, equip] of Object.entries(EQUIPMENT)) {
            if (equip.category !== catId) continue;

            const owned = hasEquipment(id);
            const canBuy = !owned && gameState.cash >= equip.cost &&
                          (!equip.requires || hasEquipment(equip.requires));

            const div = document.createElement("div");
            div.className = `equipment-item ${owned ? 'owned' : ''}`;
            div.innerHTML = `
                <div class="equip-info">
                    <span class="equip-name">${owned ? '✓ ' : ''}${equip.name}</span>
                    <span class="equip-desc">${equip.description}</span>
                </div>
                ${owned ? '<span class="owned-badge">Owned</span>' :
                  `<button class="btn ${canBuy ? 'btn-primary' : ''} buy-equip-btn"
                    data-equip="${id}" ${canBuy ? '' : 'disabled'}>
                    $${formatMoney(equip.cost)}
                  </button>`}
            `;
            container.appendChild(div);
        }
    }

    container.querySelectorAll(".buy-equip-btn").forEach(btn => {
        btn.addEventListener("click", () => buyEquipment(btn.dataset.equip));
    });
}

// ============================================
// MODALS
// ============================================
function openShop() {
    document.getElementById("shop-modal").style.display = "flex";
    updateShopUI();
}

function closeShop() {
    document.getElementById("shop-modal").style.display = "none";
}

function openBank() {
    document.getElementById("bank-modal").style.display = "flex";
    updateBankUI();
}

function closeBank() {
    document.getElementById("bank-modal").style.display = "none";
}

function updateBankUI() {
    const maxLoan = Math.max(5000, gameState.cash * 2);
    document.getElementById("bank-cash").textContent = formatMoney(gameState.cash);
    document.getElementById("bank-debt").textContent = formatMoney(gameState.debt);
    document.getElementById("max-loan").textContent = formatMoney(maxLoan);
    document.getElementById("interest-rate").textContent = (gameState.interestRate * 100).toFixed(0);

    document.getElementById("loan-btn").disabled = gameState.debt > 0;
    document.getElementById("pay-btn").disabled = gameState.debt === 0 || gameState.cash === 0;
}

function openStats() {
    document.getElementById("stats-modal").style.display = "flex";
    updateStatsUI();
}

function closeStats() {
    document.getElementById("stats-modal").style.display = "none";
}

// Badge/License Modal
const BADGE_TIERS = {
    "Dock Nobody": {
        frame: "badge-paper",
        emblem: "📋",
        flavor: "Temporary license. Nobody knows your name."
    },
    "Local Regular": {
        frame: "badge-plastic",
        emblem: "🪪",
        flavor: "Licensed dealer. The captains are starting to remember you."
    },
    "Known Dealer": {
        frame: "badge-metal",
        emblem: "🏅",
        flavor: "Official state license. Your reputation precedes you."
    },
    "Regional Player": {
        frame: "badge-engraved",
        emblem: "🎖️",
        flavor: "Premium dealer certification. The coast knows your name."
    },
    "Statewide Power": {
        frame: "badge-gilded",
        emblem: "👑",
        flavor: "Master Dealer. You ARE the Maine lobster trade."
    }
};

function openBadgeModal() {
    document.getElementById("badge-modal").style.display = "flex";
    updateBadgeUI();
}

function closeBadgeModal() {
    document.getElementById("badge-modal").style.display = "none";
}

function openHowToPlay() {
    document.getElementById("how-to-play-modal").style.display = "flex";
}

function closeHowToPlay() {
    document.getElementById("how-to-play-modal").style.display = "none";
}

function updateBadgeUI() {
    const tier = gameState.repTier || "Dock Nobody";
    const badgeData = BADGE_TIERS[tier] || BADGE_TIERS["Dock Nobody"];

    // Update badge artwork
    const artwork = document.getElementById("badge-artwork");
    if (artwork) {
        artwork.innerHTML = `
            <div class="badge-frame ${badgeData.frame}">
                <span class="badge-emblem">${badgeData.emblem}</span>
            </div>
        `;
    }

    // Update tier title and flavor
    const tierTitle = document.getElementById("badge-tier-title");
    if (tierTitle) tierTitle.textContent = tier;

    const flavor = document.getElementById("badge-flavor");
    if (flavor) flavor.textContent = badgeData.flavor;

    // Update status strip badge
    const badgeVisual = document.getElementById("badge-visual");
    if (badgeVisual) badgeVisual.textContent = badgeData.emblem;

    const stripRep = document.getElementById("strip-reputation");
    if (stripRep) stripRep.textContent = tier;

    // Update progress bar
    const tierIndex = TIER_ORDER.indexOf(tier);
    const nextTierIndex = tierIndex + 1;

    // Calculate progress within current tier
    const repThresholds = [0, 20, 50, 100, 200]; // Rep needed for each tier
    const currentThreshold = repThresholds[tierIndex] || 0;
    const nextThreshold = repThresholds[nextTierIndex] || repThresholds[repThresholds.length - 1];

    let progressPercent = 100;
    if (nextTierIndex < TIER_ORDER.length) {
        const tierProgress = gameState.reputation - currentThreshold;
        const tierRange = nextThreshold - currentThreshold;
        progressPercent = Math.min(100, Math.max(0, (tierProgress / tierRange) * 100));
    }

    const repFill = document.getElementById("badge-rep-fill");
    if (repFill) repFill.style.width = `${progressPercent}%`;

    const repNext = document.getElementById("badge-rep-next");
    if (repNext) {
        if (nextTierIndex < TIER_ORDER.length) {
            repNext.textContent = `Next: ${TIER_ORDER[nextTierIndex]}`;
        } else {
            repNext.textContent = "Maximum rank achieved!";
        }
    }
}

function updateStatsUI() {
    const stats = gameState.stats;

    // Trading stats
    document.getElementById("stat-bought").textContent = `${formatMoney(stats.totalLobstersBought)} lbs`;
    document.getElementById("stat-sold").textContent = `${formatMoney(stats.totalLobstersSold)} lbs`;
    document.getElementById("stat-earned").textContent = `$${formatMoney(stats.totalMoneyEarned)}`;
    document.getElementById("stat-spent").textContent = `$${formatMoney(stats.totalMoneySpent)}`;

    // Total profit
    const totalProfit = stats.totalMoneyEarned - stats.totalMoneySpent;
    const profitEl = document.getElementById("stat-profit");
    if (totalProfit >= 0) {
        profitEl.textContent = `+$${formatMoney(totalProfit)}`;
        profitEl.className = "stat-value positive";
    } else {
        profitEl.textContent = `-$${formatMoney(Math.abs(totalProfit))}`;
        profitEl.className = "stat-value negative";
    }

    // Records
    document.getElementById("stat-best-day").textContent = `+$${formatMoney(stats.bestDayProfit)}`;
    document.getElementById("stat-worst-day").textContent = stats.worstDayLoss < 0
        ? `-$${formatMoney(Math.abs(stats.worstDayLoss))}`
        : `$${formatMoney(stats.worstDayLoss)}`;

    // Relationships
    const favCaptain = getFavoriteCaptain();
    const bestBuyer = getBestBuyer();
    document.getElementById("stat-fav-captain").textContent = favCaptain.count > 0
        ? `${favCaptain.name} (${favCaptain.count} deals)`
        : "None yet";
    document.getElementById("stat-best-buyer").textContent = bestBuyer.count > 0
        ? `${bestBuyer.name} (${bestBuyer.count} sales)`
        : "None yet";

    // Competition
    document.getElementById("stat-rivals-beat").textContent = stats.rivalsOutbid;
    document.getElementById("stat-rivals-lost").textContent = stats.lostToRivals;

    // Retirement section
    updateRetirementUI();
}

function updateRetirementUI() {
    const section = document.getElementById("retirement-section");
    const container = document.getElementById("retirement-options");
    if (!section || !container) return;

    // Check if any retirement option is available
    const availableOptions = Object.entries(RETIREMENT_OPTIONS).filter(([id, option]) =>
        gameState.cash >= option.requirement
    );

    if (availableOptions.length === 0) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";
    container.innerHTML = "";

    for (const [optionId, option] of Object.entries(RETIREMENT_OPTIONS)) {
        const canAfford = gameState.cash >= option.requirement;
        const div = document.createElement("div");
        div.className = `retirement-option ${canAfford ? 'available' : 'locked'}`;
        div.innerHTML = `
            <div class="retirement-header">
                <span class="retirement-name">${option.name || optionId}</span>
                <span class="retirement-prestige">+${option.prestige} ⭐</span>
            </div>
            <div class="retirement-req">Requires: $${formatMoney(option.requirement)}</div>
            ${canAfford ? `<button class="btn btn-primary retire-btn" data-option="${optionId}">Retire</button>` : '<span class="locked-label">Not yet...</span>'}
        `;
        container.appendChild(div);
    }

    // Add click handlers for retire buttons
    container.querySelectorAll(".retire-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const optionId = btn.dataset.option;
            if (confirm(`Are you sure you want to retire with the "${RETIREMENT_OPTIONS[optionId].name || optionId}" ending? This will end your current game.`)) {
                retire(optionId);
            }
        });
    });
}

function updateRivalsUI() {
    const container = document.getElementById("rivals-list");
    if (!container) return; // Element removed - leaderboard replaces this
    container.innerHTML = "";

    const playerCash = gameState.cash;

    for (const [rivalId, state] of Object.entries(gameState.rivals)) {
        const rival = RIVALS[rivalId];
        if (!rival) continue;

        // Determine relative standing
        let statusClass, statusText;
        if (state.cash > playerCash + 2000) {
            statusClass = "winning";
            statusText = "Ahead";
        } else if (state.cash < playerCash - 2000) {
            statusClass = "losing";
            statusText = "Behind";
        } else {
            statusClass = "tied";
            statusText = "Even";
        }

        const div = document.createElement("div");
        div.className = "rival-card";
        div.innerHTML = `
            <span class="rival-emoji">${rival.emoji}</span>
            <div class="rival-info">
                <span class="rival-name">${rival.name}</span>
                <span class="rival-stats">$${formatMoney(state.cash)} | ${state.inventory} lbs</span>
            </div>
            <span class="rival-status ${statusClass}">${statusText}</span>
        `;
        container.appendChild(div);
    }
}

function updateLocationUI() {
    const town = getCurrentTown();
    if (!town) return;

    const locEmoji = document.getElementById("location-emoji");
    const locName = document.getElementById("location-name");
    const locTraits = document.getElementById("location-traits");
    const buyModEl = document.getElementById("buy-mod");
    const sellModEl = document.getElementById("sell-mod");

    if (locEmoji) locEmoji.textContent = town.emoji;
    if (locName) locName.textContent = town.name;

    // Format traits for display
    if (locTraits) {
        const traitsDisplay = town.traits.map(t => t.replace('_', ' ')).join(' / ');
        locTraits.textContent = traitsDisplay;
    }

    // Format price modifiers
    const buyModPercent = Math.round((town.buyMod - 1) * 100);
    const sellModPercent = Math.round((town.sellMod - 1) * 100);

    if (buyModEl) {
        buyModEl.textContent = buyModPercent >= 0 ? `+${buyModPercent}%` : `${buyModPercent}%`;
    }
    if (sellModEl) {
        sellModEl.textContent = sellModPercent >= 0 ? `+${sellModPercent}%` : `${sellModPercent}%`;
    }
}

// ============================================
// MARKETS PANEL (Desktop Left Column)
// ============================================
function updateMarketsPanel() {
    const marketsList = document.getElementById("markets-list");
    if (!marketsList) return;

    const currentTown = getCurrentTown();
    if (!currentTown) return;

    // Update current location card
    const locIcon = document.getElementById("markets-location-icon");
    const locNameEl = document.getElementById("markets-location-name");
    const buyModEl = document.getElementById("markets-buy-mod");
    const sellModEl = document.getElementById("markets-sell-mod");

    if (locIcon) locIcon.textContent = currentTown.emoji;
    if (locNameEl) locNameEl.textContent = currentTown.name;

    const buyModPercent = Math.round((currentTown.buyMod - 1) * 100);
    const sellModPercent = Math.round((currentTown.sellMod - 1) * 100);

    if (buyModEl) {
        buyModEl.textContent = buyModPercent >= 0 ? `+${buyModPercent}%` : `${buyModPercent}%`;
    }
    if (sellModEl) {
        sellModEl.textContent = sellModPercent >= 0 ? `+${sellModPercent}%` : `${sellModPercent}%`;
    }

    // Build list of other towns
    marketsList.innerHTML = "";

    const hasVan = hasEquipment('deliveryVan');

    for (const [townId, town] of Object.entries(TOWNS)) {
        const isCurrent = townId === gameState.currentLocation;

        const buyModPercent = Math.round((town.buyMod - 1) * 100);
        const sellModPercent = Math.round((town.sellMod - 1) * 100);

        const div = document.createElement("div");
        div.className = `market-town${isCurrent ? ' current' : ''}`;
        div.innerHTML = `
            <span class="market-town-name">
                <span>${town.emoji}</span>
                <span>${town.name}</span>
            </span>
            <span class="market-town-prices">
                <span class="buy">${buyModPercent >= 0 ? '+' : ''}${buyModPercent}%</span>
                <span class="sell">${sellModPercent >= 0 ? '+' : ''}${sellModPercent}%</span>
            </span>
        `;

        // Click to travel (if not current and has van)
        if (!isCurrent && hasVan) {
            div.style.cursor = "pointer";
            div.addEventListener("click", () => {
                if (canTravelTo(townId)) {
                    travelTo(townId);
                    updateMarketsPanel();
                } else {
                    log("Can't travel there right now.", "warning");
                }
            });
        } else if (!isCurrent && !hasVan) {
            div.style.opacity = "0.6";
            div.title = "Need Delivery Van to travel";
        }

        marketsList.appendChild(div);
    }
}

// ============================================
// MAP MODAL
// ============================================
function openMap() {
    document.getElementById("map-modal").style.display = "flex";
    updateMapUI();
}

function closeMap() {
    document.getElementById("map-modal").style.display = "none";
}

function updateMapUI() {
    const mapVisual = document.getElementById("map-visual");
    const townList = document.getElementById("town-list");
    const travelInfo = document.getElementById("travel-info");

    const hasVan = hasEquipment('deliveryVan');

    // Update travel info
    const travelsRemaining = 2 - (gameState.dailyTravels || 0);

    if (!hasVan) {
        travelInfo.className = "travel-info";
        travelInfo.innerHTML = `<p class="travel-requirement">Requires: Delivery Van ($5,000)</p>
            <p style="font-size: 7px; margin-top: 6px; color: var(--ocean-foam);">
                Buy a Delivery Van from the Shop to travel between towns.
            </p>`;
    } else if (travelsRemaining <= 0) {
        travelInfo.className = "travel-info exhausted";
        travelInfo.innerHTML = `<p class="travel-requirement" style="color: var(--danger);">No more travel today!</p>
            <p style="font-size: 7px; margin-top: 6px; color: var(--dock-wood);">
                You've already made a round trip. Wait until tomorrow to travel again.
            </p>`;
    } else {
        travelInfo.className = "travel-info has-van";
        travelInfo.innerHTML = `<p class="travel-requirement">Delivery Van: Ready to travel!</p>
            <p style="font-size: 7px; margin-top: 6px; color: var(--ocean-foam);">
                ${travelsRemaining === 1 ? 'One trip remaining today. ' : ''}Click a town to travel there.
                ${travelsRemaining === 1 ? 'Returning to a visited town means no new boats.' : ''}
            </p>`;
    }

    // Clear and rebuild map markers
    const existingMarkers = mapVisual.querySelectorAll('.town-marker');
    existingMarkers.forEach(m => m.remove());

    // Clear and rebuild town list
    townList.innerHTML = "";

    for (const [townId, town] of Object.entries(TOWNS)) {
        const isCurrent = townId === gameState.currentLocation;
        const canTravel = canTravelTo(townId);

        // Create map marker
        const marker = document.createElement("div");
        marker.className = `town-marker ${isCurrent ? 'current-location' : ''} ${canTravel ? 'can-travel' : ''} ${!hasVan && !isCurrent ? 'locked' : ''}`;
        marker.style.left = `${town.x}%`;
        marker.style.top = `${town.y}%`;
        marker.innerHTML = `
            <span class="marker-icon">${town.emoji}</span>
            <span class="marker-name">${town.name}</span>
        `;

        if (canTravel) {
            marker.addEventListener("click", () => {
                travelTo(townId);
                closeMap();
            });
        }

        mapVisual.appendChild(marker);

        // Create town list item
        const buyModPercent = Math.round((town.buyMod - 1) * 100);
        const sellModPercent = Math.round((town.sellMod - 1) * 100);

        const townItem = document.createElement("div");
        townItem.className = `town-item ${isCurrent ? 'current' : ''} ${canTravel ? 'can-travel' : ''} ${!hasVan && !isCurrent ? 'locked' : ''}`;
        townItem.innerHTML = `
            <div class="town-item-header">
                <span class="town-item-emoji">${town.emoji}</span>
                <span class="town-item-name">${town.name}</span>
                ${isCurrent ? '<span style="font-size:6px;color:var(--gold);">(HERE)</span>' : ''}
            </div>
            <div class="town-item-desc">${town.description}</div>
            <div class="town-item-stats">
                <span class="buy">Buy: ${buyModPercent >= 0 ? '+' : ''}${buyModPercent}%</span>
                <span class="sell">Sell: ${sellModPercent >= 0 ? '+' : ''}${sellModPercent}%</span>
                ${!isCurrent ? `<span class="cost">Travel: $${town.travelCost}</span>` : ''}
            </div>
            ${canTravel ? `
                <div class="town-item-action">
                    <button class="btn btn-primary travel-btn" data-town="${townId}">Travel ($${town.travelCost})</button>
                </div>
            ` : ''}
        `;
        townList.appendChild(townItem);
    }

    // Add event listeners for travel buttons
    townList.querySelectorAll(".travel-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            travelTo(btn.dataset.town);
            closeMap();
        });
    });
}

// ============================================
// ACHIEVEMENTS SYSTEM
// ============================================
function checkAchievements() {
    for (const [achievementId, achievement] of Object.entries(ACHIEVEMENTS)) {
        // Skip already unlocked
        if (gameState.achievements[achievementId]) continue;

        // Check condition
        if (achievement.condition(gameState)) {
            unlockAchievement(achievementId, achievement);
        }
    }
}

function unlockAchievement(achievementId, achievement) {
    gameState.achievements[achievementId] = {
        unlocked: true,
        day: gameState.day
    };

    // Apply reward
    if (achievement.reward) {
        switch (achievement.reward.type) {
            case "cash":
                gameState.cash += achievement.reward.amount;
                gameState.dailyEarned += achievement.reward.amount;
                break;
            case "reputation":
                gameState.reputation = Math.min(100, (gameState.reputation || 50) + achievement.reward.amount);
                break;
            case "prestige":
                gameState.prestige += achievement.reward.amount;
                break;
        }
    }

    // Log it (this will show a toast on mobile)
    log(`🏆 Achievement Unlocked: ${achievement.name}!`, "positive");

    // On mobile, skip the big popup and celebration to reduce clutter
    if (!isMobile()) {
        showAchievementPopup(achievement);
        fishermanSays(getAchievementComment(achievement.tier));
        createCelebrationEffect();
    }
}

function showAchievementPopup(achievement) {
    const popup = document.createElement("div");
    popup.className = `achievement-popup tier-${achievement.tier}`;
    popup.innerHTML = `
        <div class="achievement-glow"></div>
        <div class="achievement-icon">${achievement.emoji}</div>
        <div class="achievement-info">
            <div class="achievement-unlocked">Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${achievement.reward ? `<div class="achievement-reward">+${achievement.reward.amount} ${achievement.reward.type}</div>` : ''}
        </div>
    `;

    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add("show"), 10);

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 500);
    }, 5000);
}

function getAchievementComment(tier) {
    const comments = {
        bronze: [
            "That's a good start there!",
            "Every journey begins with a single step!",
            "You're gettin' the hang of it!"
        ],
        silver: [
            "Now you're cookin' with gas!",
            "Impressive work there, friend!",
            "The other dealers are takin' notice!"
        ],
        gold: [
            "Hot diggity! That's legendary!",
            "They'll be tellin' stories about you!",
            "You're makin' history here!"
        ]
    };
    return randomChoice(comments[tier] || comments.bronze);
}

function getAchievementProgress() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = Object.keys(gameState.achievements).length;
    return { unlocked, total, percent: Math.round((unlocked / total) * 100) };
}

// ============================================
// CAPTAIN STORYLINES
// ============================================
function checkCaptainStories() {
    if (gameState.activeStory) return; // Already showing a story

    // Check each boat's captain for story triggers
    for (const boat of gameState.boats) {
        const captain = boat.captain;

        for (const [storyId, story] of Object.entries(CAPTAIN_STORIES)) {
            // Skip completed stories (except repeatable ones)
            const storyKey = `${storyId}_${captain}`;
            if (gameState.completedStories.includes(storyKey)) continue;

            // Check trigger
            if (story.trigger(gameState, captain)) {
                showCaptainStory(storyId, story, captain);
                return; // Only one story at a time
            }
        }
    }
}

function showCaptainStory(storyId, story, captain) {
    gameState.activeStory = { storyId, story, captain };

    const modal = document.createElement("div");
    modal.className = "modal story-modal";
    modal.id = "story-modal";
    modal.innerHTML = `
        <div class="modal-content story-content">
            <div class="story-header">
                <span class="story-icon">📖</span>
                <h2>${story.title}</h2>
            </div>
            <div class="story-text">${story.story(captain)}</div>
            <div class="story-choices" id="story-choices">
                ${story.choices.map((choice, index) => `
                    <button class="btn story-choice ${choice.cost > gameState.cash ? 'disabled' : ''}"
                            data-index="${index}"
                            ${choice.cost > gameState.cash ? 'disabled' : ''}>
                        ${choice.text}
                        ${choice.cost > 0 ? `<span class="choice-cost">$${formatMoney(choice.cost)}</span>` : ''}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    // Add choice handlers
    modal.querySelectorAll(".story-choice").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            resolveStoryChoice(index);
        });
    });
}

function resolveStoryChoice(choiceIndex) {
    const { storyId, story, captain } = gameState.activeStory;
    const choice = story.choices[choiceIndex];

    // Deduct cost
    if (choice.cost > 0) {
        gameState.cash -= choice.cost;
        gameState.dailySpent += choice.cost;
    }

    // Apply effect
    const result = choice.effect(gameState, captain);

    // Mark story as completed
    const storyKey = `${storyId}_${captain}`;
    gameState.completedStories.push(storyKey);

    // Close story modal and show result
    const modal = document.getElementById("story-modal");
    if (modal) {
        modal.innerHTML = `
            <div class="modal-content story-content">
                <div class="story-header">
                    <span class="story-icon">📖</span>
                    <h2>Outcome</h2>
                </div>
                <div class="story-result">${result}</div>
                <button class="btn btn-primary" id="close-story-btn">Continue</button>
            </div>
        `;

        document.getElementById("close-story-btn").addEventListener("click", () => {
            modal.remove();
            gameState.activeStory = null;
            updateUI();
        });
    }
}

// Process special delivery from big catch story
function processSpecialDeliveries() {
    if (gameState.pendingSpecialDelivery && gameState.pendingSpecialDelivery.day === gameState.day) {
        const delivery = gameState.pendingSpecialDelivery;
        gameState.inventory[delivery.grade] += delivery.amount;
        log(`🎁 Special delivery from Captain ${delivery.captain}: ${delivery.amount} lbs of ${delivery.grade}-grade lobster!`, "positive");
        fishermanSays(`Here's that special catch I promised ya!`);
        gameState.pendingSpecialDelivery = null;
    }
}

// ============================================
// MARKET MANIPULATION
// ============================================
function initializeMarketSupply() {
    for (const townId of Object.keys(TOWNS)) {
        gameState.marketSupply[townId] = MARKET_CONFIG.baseSupply;
    }
}

function updateMarketSupply() {
    const currentTown = gameState.currentLocation;

    // Recover supply in all towns
    for (const townId of Object.keys(TOWNS)) {
        const currentSupply = gameState.marketSupply[townId] || MARKET_CONFIG.baseSupply;
        const maxSupply = MARKET_CONFIG.baseSupply;
        const recovery = Math.floor(maxSupply * MARKET_CONFIG.supplyRecoveryRate);
        gameState.marketSupply[townId] = Math.min(maxSupply, currentSupply + recovery);
    }
}

function getMarketShareInTown(townId) {
    const totalSupply = MARKET_CONFIG.baseSupply;
    const currentSupply = gameState.marketSupply[townId] || totalSupply;
    const boughtUp = totalSupply - currentSupply;
    return boughtUp / totalSupply;
}

function getMarketManipulationPriceModifier() {
    const townId = gameState.currentLocation;
    const marketShare = getMarketShareInTown(townId);

    if (marketShare < MARKET_CONFIG.priceImpactThreshold) {
        return 1.0; // No impact
    }

    // Price increases as you control more of the market
    const impactRatio = (marketShare - MARKET_CONFIG.priceImpactThreshold) /
                        (1 - MARKET_CONFIG.priceImpactThreshold);
    const priceIncrease = impactRatio * MARKET_CONFIG.maxPriceImpact;

    return 1.0 + priceIncrease;
}

function recordMarketPurchase(amount) {
    const townId = gameState.currentLocation;
    gameState.marketSupply[townId] = Math.max(0, (gameState.marketSupply[townId] || MARKET_CONFIG.baseSupply) - amount);

    // Check for market corner achievement
    const marketShare = getMarketShareInTown(townId);
    if (marketShare >= MARKET_CONFIG.cornerThreshold) {
        if (!gameState.stats.marketsCornered) {
            gameState.stats.marketsCornered = 0;
        }
        gameState.stats.marketsCornered++;
        log(`🎭 You've cornered the ${TOWNS[townId].name} market! Prices will rise!`, "positive");
        fishermanSays("Careful now - corner the market too hard and folks'll get angry!");
    }
}

// ============================================
// PRESTIGE & LEGACY SYSTEM
// ============================================
function getPrestigeLevel() {
    const prestige = gameState.prestige || 0;
    let level = 0;
    for (const [p, reward] of Object.entries(PRESTIGE_REWARDS)) {
        if (prestige >= parseInt(p)) {
            level = parseInt(p);
        }
    }
    return level;
}

function getPrestigeTitle() {
    const level = getPrestigeLevel();
    return PRESTIGE_REWARDS[level]?.name || "Newcomer";
}

function getPrestigeBonuses() {
    const prestige = gameState.prestige || 0;
    const bonuses = {
        startingCash: 0,
        startingReputation: 0,
        priceBonus: 0,
        startingEquipment: null
    };

    for (const [p, reward] of Object.entries(PRESTIGE_REWARDS)) {
        if (prestige >= parseInt(p)) {
            switch (reward.bonus) {
                case "startingCash":
                    bonuses.startingCash += reward.amount;
                    break;
                case "startingReputation":
                    bonuses.startingReputation += reward.amount;
                    break;
                case "priceBonus":
                    bonuses.priceBonus += reward.amount;
                    break;
                case "startingEquipment":
                    bonuses.startingEquipment = reward.item;
                    break;
            }
        }
    }

    return bonuses;
}

function canRetire(optionId) {
    const option = RETIREMENT_OPTIONS[optionId];
    if (!option) return false;
    return gameState.cash >= option.requirement;
}

function retire(optionId) {
    const option = RETIREMENT_OPTIONS[optionId];
    if (!canRetire(optionId)) return;

    // Award prestige
    gameState.prestige += option.prestige;
    gameState.gamesCompleted++;
    gameState.lifetimeEarnings += gameState.stats.totalMoneyEarned;

    // Save prestige to localStorage for persistence
    savePrestige();

    // Show retirement ending
    showRetirementEnding(option);
}

function savePrestige() {
    const prestigeData = {
        prestige: gameState.prestige,
        lifetimeEarnings: gameState.lifetimeEarnings,
        gamesCompleted: gameState.gamesCompleted,
        achievements: gameState.achievements
    };
    localStorage.setItem('lobsterTycoon_prestige', JSON.stringify(prestigeData));
}

function loadPrestige() {
    const saved = localStorage.getItem('lobsterTycoon_prestige');
    if (saved) {
        const data = JSON.parse(saved);
        return data;
    }
    return null;
}

function showRetirementEnding(option) {
    const modal = document.getElementById("game-over-modal");
    const title = document.getElementById("game-over-title");
    const msg = document.getElementById("game-over-message");

    title.textContent = `🎊 ${option.name}!`;
    title.style.color = "var(--gold)";
    msg.innerHTML = `
        <div class="retirement-ending">
            <p class="ending-story">${option.ending}</p>
            <div class="ending-stats">
                <p>Days in Business: ${gameState.day}</p>
                <p>Final Cash: $${formatMoney(gameState.cash)}</p>
                <p>Prestige Earned: +${option.prestige} ⭐</p>
                <p>Total Prestige: ${gameState.prestige} ⭐</p>
            </div>
        </div>
    `;

    // Change button to "New Game+"
    const btn = document.getElementById("restart-btn");
    btn.textContent = "New Game+ (Keep Prestige)";

    modal.style.display = "flex";
    gameState.gameOver = true;

    createCelebrationEffect();
}

// ============================================
// VISUAL EFFECTS
// ============================================
function createCelebrationEffect() {
    const container = document.createElement("div");
    container.className = "celebration-container";

    // Create confetti particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "confetti";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.backgroundColor = randomChoice([
            '#ffd700', '#ff6b6b', '#50c878', '#4a9cc7', '#ff69b4', '#ffa500'
        ]);
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${2 + Math.random() * 2}s`;
        container.appendChild(particle);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 5000);
}

function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
        sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
}

function pulseElement(element) {
    element.classList.add("pulse-effect");
    setTimeout(() => element.classList.remove("pulse-effect"), 500);
}

function shakeElement(element) {
    element.classList.add("shake-effect");
    setTimeout(() => element.classList.remove("shake-effect"), 500);
}

// Screen flash for big events
function screenFlash(color = "white") {
    const flash = document.createElement("div");
    flash.className = "screen-flash";
    flash.style.backgroundColor = color;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
}

// ============================================
// SCENE ANIMATIONS
// ============================================

// Boat arrival animation
function playBoatArrival() {
    const boatEl = document.getElementById("boat-arrival");
    if (!boatEl) return;

    // Reset and play
    boatEl.classList.remove("active");
    void boatEl.offsetWidth; // Force reflow
    boatEl.classList.add("active");

    // Remove after animation
    setTimeout(() => {
        boatEl.classList.remove("active");
    }, 3500);
}

// Truck travel animation
function playTruckTravel() {
    const truckEl = document.getElementById("truck-travel");
    if (!truckEl) return;

    truckEl.classList.remove("active");
    void truckEl.offsetWidth;
    truckEl.classList.add("active");

    setTimeout(() => {
        truckEl.classList.remove("active");
    }, 3000);
}

// Weather effects
function updateWeatherEffects() {
    const weatherEl = document.getElementById("weather-effects");
    if (!weatherEl) return;

    // Clear existing effects
    weatherEl.innerHTML = "";
    weatherEl.className = "weather-effects";

    const weather = gameState.weather;

    if (weather === "rainy") {
        weatherEl.classList.add("rainy");
        // Add rain drops
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement("div");
            drop.className = "rain-drop";
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 0.8}s`;
            drop.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;
            weatherEl.appendChild(drop);
        }
    } else if (weather === "stormy") {
        weatherEl.classList.add("stormy");
        // Add storm clouds
        const clouds = document.createElement("div");
        clouds.className = "storm-clouds";
        weatherEl.appendChild(clouds);

        // Add heavy rain
        for (let i = 0; i < 80; i++) {
            const drop = document.createElement("div");
            drop.className = "rain-drop";
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 0.5}s`;
            drop.style.animationDuration = `${0.4 + Math.random() * 0.3}s`;
            drop.style.height = "20px";
            weatherEl.appendChild(drop);
        }

        // Occasional lightning
        scheduleRandomLightning(weatherEl);
    } else if (weather === "foggy") {
        weatherEl.classList.add("foggy");
    } else if (weather === "cloudy") {
        // Light clouds
        const clouds = document.createElement("div");
        clouds.className = "storm-clouds";
        clouds.style.opacity = "0.3";
        weatherEl.appendChild(clouds);
    }
}

function scheduleRandomLightning(container) {
    if (gameState.weather !== "stormy") return;

    const delay = 3000 + Math.random() * 7000; // 3-10 seconds
    setTimeout(() => {
        if (gameState.weather !== "stormy") return;

        const lightning = document.createElement("div");
        lightning.className = "lightning";
        container.appendChild(lightning);
        setTimeout(() => lightning.remove(), 300);

        // Schedule next
        scheduleRandomLightning(container);
    }, delay);
}

// Add ambient seagulls
function addAmbientSeagulls() {
    const overlay = document.getElementById("scene-overlay");
    if (!overlay) return;

    // Remove existing seagulls
    overlay.querySelectorAll(".seagull").forEach(s => s.remove());

    // Add 1-3 seagulls with random delays
    const numGulls = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numGulls; i++) {
        const gull = document.createElement("div");
        gull.className = "seagull";
        gull.textContent = "🐦";
        gull.style.animationDelay = `${Math.random() * 10}s`;
        gull.style.top = `${5 + Math.random() * 15}%`;
        overlay.appendChild(gull);
    }
}

// ============================================
// TUTORIAL SYSTEM
// ============================================
let currentTutorialStep = 0;
let tutorialActive = false;
let shownHelperTips = {};

function startTutorial() {
    tutorialActive = true;
    currentTutorialStep = 0;
    showTutorialStep(0);
}

function showTutorialStep(stepIndex) {
    const overlay = document.getElementById("tutorial-overlay");
    const box = document.getElementById("tutorial-box");
    const highlight = document.getElementById("tutorial-highlight");
    const step = TUTORIAL_STEPS[stepIndex];

    if (!step || !overlay) return;

    overlay.style.display = "block";

    // Update content
    document.getElementById("tutorial-step").textContent = `${stepIndex + 1}/${TUTORIAL_STEPS.length}`;
    document.getElementById("tutorial-title").textContent = step.title;
    document.getElementById("tutorial-message").textContent = step.message;

    // Update button text
    const nextBtn = document.getElementById("tutorial-next");
    nextBtn.textContent = stepIndex === TUTORIAL_STEPS.length - 1 ? "Start Playing!" : "Next";

    // Position box and highlight
    box.className = "tutorial-box " + step.position;

    if (step.highlight) {
        const targetEl = document.querySelector(step.highlight);
        if (targetEl) {
            const rect = targetEl.getBoundingClientRect();
            highlight.style.display = "block";
            highlight.style.top = (rect.top - 5) + "px";
            highlight.style.left = (rect.left - 5) + "px";
            highlight.style.width = (rect.width + 10) + "px";
            highlight.style.height = (rect.height + 10) + "px";
        } else {
            highlight.style.display = "none";
        }
    } else {
        highlight.style.display = "none";
    }
}

function nextTutorialStep() {
    currentTutorialStep++;
    if (currentTutorialStep >= TUTORIAL_STEPS.length) {
        endTutorial();
    } else {
        showTutorialStep(currentTutorialStep);
    }
}

function endTutorial() {
    tutorialActive = false;
    const overlay = document.getElementById("tutorial-overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
    // Save that tutorial was completed
    localStorage.setItem('lobsterTycoon_tutorialDone', 'true');
}

function skipTutorial() {
    endTutorial();
}

function replayTutorial() {
    // Close any open modals
    document.getElementById("stats-modal").style.display = "none";
    // Reset tutorial state and start
    tutorialActive = false;
    currentTutorialStep = 0;
    startTutorial();
}

// ============================================
// HELPER TIPS SYSTEM
// ============================================
function checkHelperTips() {
    if (tutorialActive) return; // Don't show tips during tutorial

    // Don't show tips while welcome screen is visible
    const welcomeScreen = document.getElementById("welcome-screen");
    if (welcomeScreen && !welcomeScreen.classList.contains("hidden")) return;

    for (const [tipId, tip] of Object.entries(HELPER_TIPS)) {
        // Skip if already shown (for one-time tips)
        if (tip.once && shownHelperTips[tipId]) continue;

        // Check condition
        try {
            if (tip.condition(gameState)) {
                showHelperTip(tip);
                if (tip.once) {
                    shownHelperTips[tipId] = true;
                }
                break; // Only show one tip at a time
            }
        } catch (e) {
            // Condition check failed, skip
        }
    }
}

function showHelperTip(tip) {
    // Remove existing tip if any
    const existing = document.querySelector(".helper-tip");
    if (existing) existing.remove();

    const tipEl = document.createElement("div");
    tipEl.className = "helper-tip";

    // Handle dynamic message
    let message = tip.message;
    if (typeof message === 'function') {
        message = message(gameState);
    }

    tipEl.innerHTML = `
        <button class="helper-tip-close">✕</button>
        <span>${message}</span>
    `;

    document.body.appendChild(tipEl);

    // Close button
    tipEl.querySelector(".helper-tip-close").addEventListener("click", () => {
        tipEl.remove();
    });

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
        if (tipEl.parentNode) {
            tipEl.style.opacity = "0";
            tipEl.style.transition = "opacity 0.3s";
            setTimeout(() => tipEl.remove(), 300);
        }
    }, 8000);
}

// ============================================
// GOAL & COUNTDOWN SYSTEM
// ============================================
function updateGoalUI() {
    const daysLeft = Math.max(0, CONFIG.summerLength - gameState.day + 1);
    const daysLeftEl = document.getElementById("days-left");
    const countdownEl = document.getElementById("countdown");
    const totalDaysEl = document.getElementById("total-days");
    const goalBarEl = document.getElementById("goal-bar");
    const goalTierEl = document.getElementById("goal-tier");

    if (daysLeftEl) daysLeftEl.textContent = daysLeft;
    if (totalDaysEl) totalDaysEl.textContent = CONFIG.summerLength;

    // Update countdown urgency
    if (countdownEl) {
        if (daysLeft <= 5) {
            countdownEl.classList.add("urgent");
        } else {
            countdownEl.classList.remove("urgent");
        }
    }

    // Find current goal tier
    const tiers = CONFIG.goalTiers;
    let currentTier = null;
    let nextTier = tiers[0];

    for (let i = 0; i < tiers.length; i++) {
        if (gameState.cash >= tiers[i].cash) {
            currentTier = tiers[i];
            nextTier = tiers[i + 1] || tiers[i];
        } else {
            nextTier = tiers[i];
            break;
        }
    }

    // Update goal bar
    if (goalBarEl) {
        const prevCash = currentTier ? currentTier.cash : 0;
        const targetCash = nextTier.cash;
        const progress = Math.min(100, ((gameState.cash - prevCash) / (targetCash - prevCash)) * 100);
        goalBarEl.style.width = Math.max(0, progress) + "%";
    }

    // Update tier display
    if (goalTierEl) {
        const stars = "⭐".repeat(nextTier.stars);
        goalTierEl.textContent = `${stars} $${formatMoney(nextTier.cash / 1000)}K`;
    }
}

// ============================================
// DAY SUMMARY MODAL (Mobile)
// ============================================
function showDaySummary() {
    const modal = document.getElementById("day-summary-modal");
    if (!modal) {
        console.error("Day summary modal not found!");
        return;
    }

    // Use stored previous day data (saved before reset in nextDay)
    const prevData = gameState.previousDayData;
    if (!prevData) {
        // Create minimal data if none exists (shouldn't happen, but failsafe)
        console.warn("No previous day data, creating minimal summary");
        gameState.previousDayData = {
            day: gameState.day - 1,
            earned: 0,
            spent: 0,
            hadActivity: false,
            missedBoats: [],
            missedBuyers: [],
            boatsLostToRival: 0,
            totalMissedValue: 0,
            rankUp: null
        };
    }

    const data = gameState.previousDayData;
    const dailyProfit = data.earned - data.spent;

    // Update summary content
    document.getElementById("summary-day").textContent = data.day;
    document.getElementById("summary-spent").textContent = `$${formatMoney(data.spent)}`;
    document.getElementById("summary-earned").textContent = `$${formatMoney(data.earned)}`;

    const netEl = document.getElementById("summary-net");
    if (dailyProfit >= 0) {
        netEl.textContent = `+$${formatMoney(dailyProfit)}`;
        netEl.className = "summary-value positive";
    } else {
        netEl.textContent = `-$${formatMoney(Math.abs(dailyProfit))}`;
        netEl.className = "summary-value negative";
    }

    document.getElementById("summary-total-cash").textContent = `$${formatMoney(gameState.cash)}`;
    document.getElementById("summary-next-day").textContent = gameState.day;

    // Inventory status
    const stockEl = document.getElementById("summary-stock");
    const freshnessEl = document.getElementById("summary-stock-freshness");
    const totalStock = getTotalInventory();
    if (stockEl) stockEl.textContent = `${totalStock} lbs`;
    if (freshnessEl) {
        const freshness = getOverallFreshness();
        freshnessEl.textContent = `${freshness}%`;
        if (freshness >= 70) {
            freshnessEl.className = "summary-value positive";
        } else if (freshness >= 40) {
            freshnessEl.className = "summary-value";
        } else {
            freshnessEl.className = "summary-value negative";
        }
    }

    // Tomorrow's forecast
    const weatherEl = document.getElementById("summary-weather");
    const marketEl = document.getElementById("summary-market");
    if (weatherEl) {
        const weatherData = CONFIG.weather[gameState.weather];
        weatherEl.textContent = `${weatherData.icon} ${weatherData.name}`;
    }
    if (marketEl) {
        let marketText = "➡️ Stable";
        if (gameState.marketTrend > 0) {
            marketText = "📈 Rising - good for selling!";
            marketEl.className = "summary-value positive";
        } else if (gameState.marketTrend < 0) {
            marketText = "📉 Falling - good for buying";
            marketEl.className = "summary-value";
        } else {
            marketEl.className = "summary-value";
        }
        marketEl.textContent = marketText;
    }

    // Missed opportunities section
    const missedSection = document.getElementById("summary-missed-section");
    const missedBoatsEl = document.getElementById("summary-missed-boats");
    const rivalLossesEl = document.getElementById("summary-rival-losses");
    const missedValueEl = document.getElementById("summary-missed-value");

    const missedBoats = data.missedBoats || [];
    const boatsLostToRival = data.boatsLostToRival || 0;
    const totalMissedValue = data.totalMissedValue || 0;

    if (missedBoats.length > 0 || boatsLostToRival > 0) {
        missedSection.style.display = "block";

        // Show missed boats summary
        if (missedBoats.length > 0) {
            const boatsByReason = {
                passed: missedBoats.filter(b => b.reason === 'passed'),
                timeout: missedBoats.filter(b => b.reason === 'timeout'),
                dayEnd: missedBoats.filter(b => b.reason === 'dayEnd')
            };

            let boatsHtml = '';
            if (boatsByReason.passed.length > 0) {
                boatsHtml += `<p class="missed-item">👋 Passed on ${boatsByReason.passed.length} boat(s)</p>`;
            }
            if (boatsByReason.timeout.length > 0) {
                boatsHtml += `<p class="missed-item">⏰ ${boatsByReason.timeout.length} boat(s) left (too slow!)</p>`;
            }
            if (boatsByReason.dayEnd.length > 0) {
                boatsHtml += `<p class="missed-item">🌙 ${boatsByReason.dayEnd.length} boat(s) still at dock</p>`;
            }
            missedBoatsEl.innerHTML = boatsHtml;
        } else {
            missedBoatsEl.innerHTML = '';
        }

        // Show Slick Rick losses
        if (boatsLostToRival > 0) {
            rivalLossesEl.style.display = "flex";
            document.getElementById("summary-rival-count").textContent = boatsLostToRival;
        } else {
            rivalLossesEl.style.display = "none";
        }

        // Show total missed value
        missedValueEl.textContent = `$${formatMoney(totalMissedValue)}`;
    } else {
        missedSection.style.display = "none";
    }

    // Rank-up section (shown when tier increases)
    const rankupSection = document.getElementById("summary-rankup-section");
    if (rankupSection) {
        if (data.rankUp) {
            rankupSection.style.display = "block";
            const newTier = data.rankUp.newTier;
            const badgeData = BADGE_TIERS[newTier] || BADGE_TIERS["Dock Nobody"];

            const rankupIcon = document.getElementById("rankup-icon");
            if (rankupIcon) rankupIcon.textContent = badgeData.emblem;

            const rankupTier = document.getElementById("rankup-tier");
            if (rankupTier) rankupTier.textContent = newTier;

            const rankupFlavor = document.getElementById("rankup-flavor");
            if (rankupFlavor) rankupFlavor.textContent = badgeData.flavor;

            // Also update the badge UI
            updateBadgeUI();
        } else {
            rankupSection.style.display = "none";
        }
    }

    // Verdict emoji - now considers missed opportunities
    const verdictEl = document.getElementById("summary-verdict");
    if (dailyProfit > 500 && missedBoats.length === 0) {
        verdictEl.textContent = "💰 Perfect day!";
    } else if (dailyProfit > 500) {
        verdictEl.textContent = "💰 Great day!";
    } else if (dailyProfit > 0 && boatsLostToRival > 0) {
        verdictEl.textContent = "😤 Rick got some...";
    } else if (dailyProfit > 0) {
        verdictEl.textContent = "👍 Profitable";
    } else if (dailyProfit === 0) {
        verdictEl.textContent = "😐 Break even";
    } else if (dailyProfit > -200) {
        verdictEl.textContent = "📉 Small loss";
    } else {
        verdictEl.textContent = "😰 Rough day";
    }

    modal.style.display = "flex";
}

function closeDaySummary() {
    const modal = document.getElementById("day-summary-modal");
    if (modal) modal.style.display = "none";
}

function checkSeasonEnd() {
    // Check if player reached Statewide Power (early victory)
    if (gameState.repTier === "Statewide Power" && !gameState.gameOver) {
        showStatewideVictory();
        return true;
    }

    if (gameState.day > CONFIG.summerLength) {
        showSeasonEndScreen();
        return true;
    }
    return false;
}

// Special victory screen for reaching Statewide Power tier
function showStatewideVictory() {
    gameState.gameOver = true;

    const modal = document.getElementById("game-over-modal");
    const title = document.getElementById("game-over-title");
    const msg = document.getElementById("game-over-message");

    title.textContent = "👑 STATEWIDE POWER!";
    title.style.color = "var(--gold)";

    // Calculate prestige bonus for early victory
    const daysRemaining = CONFIG.summerLength - gameState.day + 1;
    const prestigeBonus = 5 + Math.floor(daysRemaining / 5);

    gameState.prestige = (gameState.prestige || 0) + prestigeBonus;
    savePrestige();

    msg.innerHTML = `
        <div class="season-end-results victory-screen">
            <div class="season-end-stars">👑 ⭐⭐⭐⭐⭐ 👑</div>
            <div class="season-end-rank">LOBSTER TYCOON</div>
            <p>You've built an empire! The entire Maine coast knows your name.</p>
            <div class="season-end-stats">
                <p>Reputation: ${gameState.reputation} (${gameState.repTier})</p>
                <p>Final Cash: $${formatMoney(gameState.cash)}</p>
                <p>Days to Victory: ${gameState.day}</p>
                <p>Days Remaining: ${daysRemaining}</p>
                <p>Sellers Known: ${Object.keys(gameState.sellerNPCs).length}</p>
                <p>Buyers Known: ${Object.keys(gameState.buyerNPCs).length}</p>
                <p style="color: var(--gold);">Prestige Earned: +${prestigeBonus} ⭐</p>
            </div>
            <p class="victory-message">Your journey from "Dock Nobody" to "Statewide Power" is complete!</p>
        </div>
    `;

    modal.style.display = "flex";
    createCelebrationEffect();
}

function showSeasonEndScreen() {
    gameState.gameOver = true;

    // Calculate final tier
    const tiers = CONFIG.goalTiers;
    let finalTier = null;

    for (const tier of tiers) {
        if (gameState.cash >= tier.cash) {
            finalTier = tier;
        }
    }

    const modal = document.getElementById("game-over-modal");
    const title = document.getElementById("game-over-title");
    const msg = document.getElementById("game-over-message");

    title.textContent = "🏖️ Summer's Over!";
    title.style.color = "var(--gold)";

    const stars = finalTier ? "⭐".repeat(finalTier.stars) : "☆";
    const rankTitle = finalTier ? finalTier.title : "Struggling Newcomer";
    const rankDesc = finalTier ? finalTier.description : "Better luck next summer!";

    // Award prestige based on performance
    const prestigeEarned = finalTier ? finalTier.stars : 0;
    if (prestigeEarned > 0) {
        gameState.prestige = (gameState.prestige || 0) + prestigeEarned;
        savePrestige();
    }

    // Generate speed run summary
    const milestones = Object.entries(gameState.speedRunMilestones)
        .map(([amount, day]) => `$${formatMoney(parseInt(amount))} on Day ${day}`)
        .join(' • ');

    msg.innerHTML = `
        <div class="season-end-results">
            <div class="season-end-stars">${stars}</div>
            <div class="season-end-rank">${rankTitle}</div>
            <div class="season-end-nickname">"${generateNickname()}"</div>
            <p>${rankDesc}</p>
            <div class="season-end-stats">
                <p>Final Cash: $${formatMoney(gameState.cash)}</p>
                <p>Reputation: ${gameState.reputation} (${gameState.repTier})</p>
                <p>Best Streak: 🔥 ${gameState.bestStreak} days</p>
                <p>Perfect Days: ⭐ ${gameState.perfectDays}</p>
                <p>Days Played: ${gameState.day - 1}</p>
                <p>Lobsters Traded: ${formatMoney(gameState.stats.totalLobstersBought)} lbs</p>
                <p>Total Earned: $${formatMoney(gameState.stats.totalMoneyEarned)}</p>
                ${milestones ? `<p class="speed-run-milestones">Speed Run: ${milestones}</p>` : ''}
                ${prestigeEarned > 0 ? `<p style="color: var(--gold);">Prestige Earned: +${prestigeEarned} ⭐</p>` : ''}
            </div>
        </div>
    `;

    modal.style.display = "flex";

    if (finalTier && finalTier.stars >= 3) {
        createCelebrationEffect();
    }
}

// ============================================
// WELCOME SCREEN
// ============================================
function startGame() {
    const welcomeScreen = document.getElementById("welcome-screen");
    const storyScreen = document.getElementById("story-screen");

    // Fade out welcome screen
    welcomeScreen.style.opacity = "0";
    welcomeScreen.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
        welcomeScreen.classList.add("hidden");
        // Show story screen
        if (storyScreen) {
            storyScreen.style.display = "flex";
        }
    }, 500);
}

function startFromStory() {
    const storyScreen = document.getElementById("story-screen");

    // Fade out story screen
    if (storyScreen) {
        storyScreen.style.opacity = "0";
        storyScreen.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
            storyScreen.style.display = "none";
        }, 500);
    }

    // Initialize weather effects
    updateWeatherEffects();

    // Check if tutorial has been done before
    const tutorialDone = localStorage.getItem('lobsterTycoon_tutorialDone');

    if (!tutorialDone) {
        // Start tutorial after a short delay
        setTimeout(() => {
            startTutorial();
        }, 600);
    } else {
        // Show Bob's welcome message for returning players
        setTimeout(() => {
            fishermanSays("Welcome back! You've got 30 days of summer to make your fortune. Good luck!");
        }, 800);
    }
}

// ============================================
// EVENT HANDLERS
// ============================================
// Current workspace view
let currentWorkspaceView = 'dock';

function switchWorkspaceView(viewName) {
    currentWorkspaceView = viewName;

    // Hide all panels
    document.querySelectorAll('.workspace-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    // Show selected panel
    const targetPanel = document.getElementById(`${viewName}-view`);
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
    }

    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.view === viewName) {
            tab.classList.add('active');
        }
    });

    // Update content for specific views
    if (viewName === 'travel') {
        updateTravelView();
    } else if (viewName === 'tanks') {
        updateTanksView();
    } else if (viewName === 'buyers') {
        updateBuyersLocation();
    }
}

// Track selected port for travel
let selectedPort = null;

// Port unlock requirements by reputation tier
const PORT_UNLOCKS = {
    stonington: "Dock Nobody",
    rockland: "Dock Nobody",
    camden: "Local Regular",
    portland: "Local Regular",
    boothbay: "Known Dealer",
    barHarbor: "Known Dealer",
    kennebunkport: "Regional Player"
};

// Human narrative reasons for locked ports
const LOCK_NARRATIVES = {
    camden: "They don't deal with strangers.",
    portland: "You'll need a name around here.",
    boothbay: "The regulars here are tight-knit.",
    barHarbor: "Only serious dealers work this dock.",
    kennebunkport: "Serious money moves through this port."
};

const TIER_ORDER = ["Dock Nobody", "Local Regular", "Known Dealer", "Regional Player", "Statewide Power"];

function updateTravelView() {
    const mapPorts = document.getElementById('map-ports');
    const portsList = document.getElementById('travel-port-list');
    const currentPortName = document.getElementById('current-port-name');
    const travelReq = document.getElementById('travel-requirement');
    const map = document.getElementById('travel-map');

    const currentTown = getCurrentTown();
    if (currentPortName) currentPortName.textContent = currentTown.name;

    const hasVan = hasEquipment('deliveryVan');

    // Apply rep-tier class to map for mood styling
    if (map) {
        map.className = 'coastal-map';
        const repClass = 'rep-' + gameState.repTier.toLowerCase().replace(/\s+/g, '-');
        map.classList.add(repClass);

        // Cinematic first reveal
        if (!gameState.mapRevealed) {
            playMapReveal(map);
            gameState.mapRevealed = true;
        }
    }

    // Show/hide travel requirement
    if (travelReq) {
        travelReq.style.display = hasVan ? 'none' : 'block';
    }

    // Render route lines (if van owned)
    renderRoutes(hasVan);

    // Clear and rebuild map nodes
    if (mapPorts) {
        mapPorts.innerHTML = '';
        renderMapNodes(mapPorts, hasVan);
    }

    // Clear and rebuild port list
    if (portsList) {
        portsList.innerHTML = '';
        renderPortList(portsList, hasVan);
    }

    // Reset selection
    selectedPort = null;
    updatePortDetails(null);
}

function playMapReveal(map) {
    map.classList.add('map-revealing');

    // Sequential port light-up after a brief delay
    setTimeout(() => {
        const ports = document.querySelectorAll('.port-node:not(.locked)');
        ports.forEach((port, i) => {
            port.style.animationDelay = `${0.3 + i * 0.15}s`;
            port.classList.add('port-reveal');
        });
    }, 100);

    // Clean up after animation
    setTimeout(() => {
        map.classList.remove('map-revealing');
        const ports = document.querySelectorAll('.port-node.port-reveal');
        ports.forEach(p => {
            p.classList.remove('port-reveal');
            p.style.animationDelay = '';
        });
    }, 2000);
}

function renderRoutes(hasVan) {
    const svg = document.getElementById('map-routes');
    if (!svg) return;
    svg.innerHTML = '';

    // Only show routes if player has van
    if (!hasVan) return;

    const currentTierIndex = TIER_ORDER.indexOf(gameState.repTier);

    ROUTES.forEach(([from, to]) => {
        const fromTown = TOWNS[from];
        const toTown = TOWNS[to];
        if (!fromTown || !toTown) return;

        // Check if either port is locked
        const fromRequired = PORT_UNLOCKS[from] || "Dock Nobody";
        const toRequired = PORT_UNLOCKS[to] || "Dock Nobody";
        const fromLocked = TIER_ORDER.indexOf(fromRequired) > currentTierIndex;
        const toLocked = TIER_ORDER.indexOf(toRequired) > currentTierIndex;
        const isLocked = fromLocked || toLocked;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${fromTown.x}%`);
        line.setAttribute('y1', `${fromTown.y}%`);
        line.setAttribute('x2', `${toTown.x}%`);
        line.setAttribute('y2', `${toTown.y}%`);
        line.classList.add('route-line');
        line.classList.add(isLocked ? 'locked' : 'active');
        svg.appendChild(line);
    });
}

function renderMapNodes(container, hasVan) {
    const currentTierIndex = TIER_ORDER.indexOf(gameState.repTier);

    for (const [townId, town] of Object.entries(TOWNS)) {
        const isCurrent = townId === gameState.currentLocation;
        const requiredTier = PORT_UNLOCKS[townId] || "Dock Nobody";
        const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
        const isRepLocked = currentTierIndex < requiredTierIndex;
        const isVanLocked = !hasVan && !isCurrent;
        const isLocked = isVanLocked || isRepLocked;

        const node = document.createElement('div');
        node.className = `port-node ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`;
        node.id = `travel-port-node-${townId}`;
        node.style.left = `${town.x}%`;
        node.style.top = `${town.y}%`;

        node.innerHTML = `
            <div class="port-node-dot">${town.emoji}</div>
            <span class="port-node-label">${town.name}</span>
        `;

        node.addEventListener('click', () => selectPort(townId));
        container.appendChild(node);
    }
}

function renderPortList(container, hasVan) {
    const currentTierIndex = TIER_ORDER.indexOf(gameState.repTier);

    for (const [townId, town] of Object.entries(TOWNS)) {
        if (townId === gameState.currentLocation) continue;

        const buyMod = Math.round((town.buyMod - 1) * 100);
        const sellMod = Math.round((town.sellMod - 1) * 100);
        const buyLabel = getQualitativeLabel(buyMod, 'buy');
        const sellLabel = getQualitativeLabel(sellMod, 'sell');

        const requiredTier = PORT_UNLOCKS[townId] || "Dock Nobody";
        const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
        const isRepLocked = currentTierIndex < requiredTierIndex;
        const isVanLocked = !hasVan;
        const isLocked = isVanLocked || isRepLocked;

        let lockReason = '';
        if (isVanLocked) {
            lockReason = '🚚 Need Van';
        } else if (isRepLocked) {
            lockReason = `🔒 ${requiredTier}`;
        }

        const card = document.createElement('div');
        card.className = `port-card ${isLocked ? 'locked' : ''} ${selectedPort === townId ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="port-info">
                <span class="port-card-name">${town.emoji} ${town.name}</span>
                <div class="port-mods">
                    <span class="buy ${buyLabel.class}">${buyLabel.text}</span>
                    <span class="sell ${sellLabel.class}">${sellLabel.text}</span>
                </div>
            </div>
            <span class="port-cost">${isLocked ? lockReason : `$${town.travelCost}`}</span>
        `;

        card.addEventListener('click', () => selectPort(townId));
        container.appendChild(card);
    }
}

function selectPort(townId) {
    // Don't select current location
    if (townId === gameState.currentLocation) return;

    selectedPort = townId;

    // Update node selection visuals
    document.querySelectorAll('.port-node').forEach(node => {
        node.classList.remove('selected');
    });
    const selectedNode = document.getElementById(`travel-port-node-${townId}`);
    if (selectedNode) selectedNode.classList.add('selected');

    // Update port list selection
    document.querySelectorAll('.port-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Update details panel
    updatePortDetails(townId);
}

function updatePortDetails(townId) {
    const placeholder = document.querySelector('.details-placeholder');
    const content = document.getElementById('details-content');
    const confirmBtn = document.getElementById('travel-confirm-button');

    if (!townId) {
        if (placeholder) placeholder.style.display = 'block';
        if (content) content.style.display = 'none';
        return;
    }

    if (placeholder) placeholder.style.display = 'none';
    if (content) content.style.display = 'flex';

    const town = TOWNS[townId];
    if (!town) return;

    const hasVan = hasEquipment('deliveryVan');
    const currentTierIndex = TIER_ORDER.indexOf(gameState.repTier);
    const requiredTier = PORT_UNLOCKS[townId] || "Dock Nobody";
    const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
    const isRepLocked = currentTierIndex < requiredTierIndex;
    const isVanLocked = !hasVan;
    const isLocked = isVanLocked || isRepLocked;

    const buyMod = Math.round((town.buyMod - 1) * 100);
    const sellMod = Math.round((town.sellMod - 1) * 100);
    const buyLabel = getQualitativeLabel(buyMod, 'buy');
    const sellLabel = getQualitativeLabel(sellMod, 'sell');

    // Update details
    const emoji = document.getElementById('details-emoji');
    const name = document.getElementById('details-name');
    const buyEl = document.getElementById('details-buy');
    const sellEl = document.getElementById('details-sell');
    const desc = document.getElementById('details-desc');
    const lockDiv = document.getElementById('details-lock');
    const lockTier = document.getElementById('details-lock-tier');
    const lockReason = document.getElementById('details-lock-reason');
    const cost = document.getElementById('details-cost');

    if (emoji) emoji.textContent = town.emoji;
    if (name) name.textContent = town.name;
    if (buyEl) {
        buyEl.textContent = buyLabel.text;
        buyEl.className = `mod-value ${buyLabel.class}`;
    }
    if (sellEl) {
        sellEl.textContent = sellLabel.text;
        sellEl.className = `mod-value ${sellLabel.class}`;
    }
    if (desc) desc.textContent = town.description;
    if (cost) cost.textContent = town.travelCost;

    // Lock info
    if (lockDiv) {
        if (isLocked) {
            lockDiv.style.display = 'block';
            if (isVanLocked) {
                if (lockTier) lockTier.textContent = '🚚 Requires Delivery Van';
                if (lockReason) lockReason.textContent = 'Buy a van from the Shop to travel.';
            } else if (isRepLocked) {
                if (lockTier) lockTier.textContent = `🔒 Requires: ${requiredTier}`;
                if (lockReason) lockReason.textContent = LOCK_NARRATIVES[townId] || '';
            }
        } else {
            lockDiv.style.display = 'none';
        }
    }

    // Confirm button
    if (confirmBtn) {
        confirmBtn.disabled = isLocked || gameState.cash < town.travelCost;
        if (isLocked) {
            confirmBtn.textContent = isVanLocked ? 'Need Van' : `Requires ${requiredTier}`;
        } else if (gameState.cash < town.travelCost) {
            confirmBtn.textContent = 'Not Enough Cash';
        } else {
            confirmBtn.innerHTML = `Travel - $<span id="details-cost">${town.travelCost}</span>`;
        }
    }
}

function confirmTravel() {
    if (!selectedPort) return;
    const town = TOWNS[selectedPort];
    if (!town) return;

    const hasVan = hasEquipment('deliveryVan');
    const currentTierIndex = TIER_ORDER.indexOf(gameState.repTier);
    const requiredTier = PORT_UNLOCKS[selectedPort] || "Dock Nobody";
    const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
    const isLocked = !hasVan || currentTierIndex < requiredTierIndex;

    if (isLocked || gameState.cash < town.travelCost) return;

    travelTo(selectedPort);
    switchWorkspaceView('dock');
}

// Convert percentage modifiers to qualitative labels
function getQualitativeLabel(percent, type) {
    if (type === 'buy') {
        // For buying: negative = cheap (good), positive = expensive (bad)
        if (percent <= -15) return { text: 'Very Cheap', class: 'mod-great' };
        if (percent <= -5) return { text: 'Cheap', class: 'mod-good' };
        if (percent >= 15) return { text: 'Expensive', class: 'mod-bad' };
        if (percent >= 5) return { text: 'Pricey', class: 'mod-warn' };
        return { text: 'Fair', class: 'mod-neutral' };
    } else {
        // For selling: positive = premium prices, negative = low prices
        if (percent >= 15) return { text: 'Premium', class: 'mod-great' };
        if (percent >= 5) return { text: 'Good', class: 'mod-good' };
        if (percent <= -15) return { text: 'Low', class: 'mod-bad' };
        if (percent <= -5) return { text: 'Below Avg', class: 'mod-warn' };
        return { text: 'Fair', class: 'mod-neutral' };
    }
}

function updateTanksView() {
    const total = getTotalInventory();
    const capacity = gameState.tankCapacity;
    const fillPercent = (total / capacity) * 100;
    const avgFreshness = getAverageFreshness();

    // === TankHero Visual ===
    // Update water level
    const tankWater = document.getElementById('tank-water');
    if (tankWater) {
        tankWater.style.height = `${Math.min(100, fillPercent)}%`;
        // Set freshness color class
        tankWater.classList.remove('fresh', 'aging', 'stale', 'spoiling');
        if (avgFreshness >= 90) tankWater.classList.add('fresh');
        else if (avgFreshness >= 70) tankWater.classList.add('aging');
        else if (avgFreshness >= 50) tankWater.classList.add('stale');
        else tankWater.classList.add('spoiling');
    }

    // Update lobster icons (3-10 based on fullness)
    const tankLobsters = document.getElementById('tank-lobsters');
    if (tankLobsters) {
        const lobsterCount = total === 0 ? 0 : Math.min(10, Math.max(3, Math.floor(fillPercent / 10)));
        tankLobsters.innerHTML = Array(lobsterCount).fill('<span class="tank-lobster">🦞</span>').join('');
    }

    // === TankSummaryRow ===
    const tankCurrent = document.getElementById('tank-current');
    const tankMax = document.getElementById('tank-max');
    if (tankCurrent) tankCurrent.textContent = total;
    if (tankMax) tankMax.textContent = capacity;

    const tankFreshness = document.getElementById('tank-freshness');
    if (tankFreshness) {
        tankFreshness.textContent = `${avgFreshness}%`;
        tankFreshness.className = 'stat-value';
        if (avgFreshness < 50) tankFreshness.classList.add('danger');
        else if (avgFreshness < 70) tankFreshness.classList.add('warning');
    }

    // Capacity status label
    const capacityLabel = document.getElementById('tank-capacity-label');
    if (capacityLabel) {
        capacityLabel.classList.remove('tight', 'full');
        if (total === 0) {
            capacityLabel.textContent = 'Empty';
        } else if (fillPercent < 60) {
            capacityLabel.textContent = 'Plenty of room';
        } else if (fillPercent < 85) {
            capacityLabel.textContent = 'Getting tight';
            capacityLabel.classList.add('tight');
        } else {
            capacityLabel.textContent = 'Near full';
            capacityLabel.classList.add('full');
        }
    }

    // === RiskForecastCard ===
    const estimatedLossMin = Math.max(0, Math.floor(total * 0.02));
    const estimatedLossMax = estimatedLossMin + 2;

    const tankLoss = document.getElementById('tank-loss-estimate');
    if (tankLoss) tankLoss.textContent = `${estimatedLossMin}-${estimatedLossMax} lbs`;

    // Calculate dollar impact using current town's sell price
    const town = getCurrentTown();
    const basePrice = CONFIG.baseLobsterPrice;
    const effectivePrice = basePrice * town.sellMod;
    const dollarLossMin = Math.round(estimatedLossMin * effectivePrice);
    const dollarLossMax = Math.round(estimatedLossMax * effectivePrice);

    const tankLossDollars = document.getElementById('tank-loss-dollars');
    if (tankLossDollars) {
        tankLossDollars.textContent = dollarLossMax > 0 ? `~$${dollarLossMin}-${dollarLossMax}` : '$0';
        tankLossDollars.classList.toggle('danger', dollarLossMax >= 20);
    }

    // Risk trend
    const riskTrend = document.getElementById('risk-trend');
    if (riskTrend) {
        riskTrend.classList.remove('increasing', 'critical');
        if (avgFreshness < 50 || fillPercent > 90) {
            riskTrend.textContent = 'Critical';
            riskTrend.classList.add('critical');
        } else if (avgFreshness < 70 || fillPercent > 80) {
            riskTrend.textContent = 'Increasing';
            riskTrend.classList.add('increasing');
        } else {
            riskTrend.textContent = 'Stable';
        }
    }

    // Risk card warning state
    const riskCard = document.getElementById('risk-card');
    if (riskCard) {
        riskCard.classList.remove('warning-low', 'warning-high');
        if (estimatedLossMax >= 12 || avgFreshness < 60) {
            riskCard.classList.add('warning-high');
        } else if (estimatedLossMax >= 5) {
            riskCard.classList.add('warning-low');
        }
    }

    // === Do Nothing Preview ===
    const projectedFreshness = document.getElementById('projected-freshness');
    if (projectedFreshness) {
        const projected = Math.max(0, avgFreshness - 5); // Simple decay estimate
        projectedFreshness.textContent = `${projected}%`;
    }

    const projectedRisk = document.getElementById('projected-risk');
    if (projectedRisk) {
        const projected = Math.max(0, avgFreshness - 5);
        if (projected < 50) projectedRisk.textContent = 'High';
        else if (projected < 70) projectedRisk.textContent = 'Moderate';
        else projectedRisk.textContent = 'Low';
    }

    // === Inventory cards ===
    const invA = document.getElementById('inventory-a');
    const invB = document.getElementById('inventory-b');
    const invC = document.getElementById('inventory-c');
    const invRun = document.getElementById('inventory-run');
    if (invA) invA.textContent = `${gameState.inventory.select} lbs`;
    if (invB) invB.textContent = `${gameState.inventory.quarter} lbs`;
    if (invC) invC.textContent = `${gameState.inventory.chix} lbs`;
    if (invRun) invRun.textContent = `${gameState.inventory.run} lbs`;

    // === Decision Panel - Sell consequence ===
    const sellConsequence = document.getElementById('sell-consequence');
    if (sellConsequence) {
        const estRevenue = Math.round(total * effectivePrice);
        sellConsequence.innerHTML = `Est. revenue: <strong>$${formatMoney(estRevenue)}</strong>`;
    }

    // === Tank Warning ===
    const tankWarning = document.getElementById('tank-warning');
    if (tankWarning) {
        tankWarning.classList.toggle('hidden', fillPercent <= 80);
    }
}

function updateBuyersLocation() {
    const buyersLocation = document.getElementById('buyers-location');
    if (buyersLocation) {
        const town = getCurrentTown();
        buyersLocation.textContent = town.name;
    }
}

function initEventHandlers() {
    // Welcome screen
    document.getElementById("start-game-btn").addEventListener("click", startGame);

    // Story screen continue button
    const storyContinueBtn = document.getElementById("story-continue-btn");
    if (storyContinueBtn) storyContinueBtn.addEventListener("click", startFromStory);

    // Story screen how to play button
    const storyHowToPlayBtn = document.getElementById("story-how-to-play-btn");
    if (storyHowToPlayBtn) storyHowToPlayBtn.addEventListener("click", openHowToPlay);

    // Tutorial buttons
    document.getElementById("tutorial-next").addEventListener("click", nextTutorialStep);
    document.getElementById("tutorial-skip").addEventListener("click", skipTutorial);
    document.getElementById("replay-tutorial-btn").addEventListener("click", replayTutorial);

    // End Day button - single source of truth
    const endDayBtn = document.getElementById("end-day-button");
    if (endDayBtn) endDayBtn.addEventListener("click", nextDay);

    document.getElementById("restart-btn").addEventListener("click", resetGame);
    document.getElementById("shop-btn").addEventListener("click", openShop);
    document.getElementById("close-shop-btn").addEventListener("click", closeShop);
    document.getElementById("bank-btn").addEventListener("click", openBank);
    document.getElementById("close-bank-btn").addEventListener("click", closeBank);
    document.getElementById("stats-btn").addEventListener("click", openStats);
    document.getElementById("close-stats-btn").addEventListener("click", closeStats);
    document.getElementById("close-map-btn").addEventListener("click", closeMap);

    // Mobile overflow menu
    const moreMenuBtn = document.getElementById("more-menu-btn");
    const moreMenu = document.getElementById("more-menu");
    if (moreMenuBtn && moreMenu) {
        moreMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            moreMenu.classList.toggle("open");
        });
        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!moreMenu.contains(e.target) && e.target !== moreMenuBtn) {
                moreMenu.classList.remove("open");
            }
        });
    }

    // Mobile menu buttons - same actions as desktop
    const shopBtnMobile = document.getElementById("shop-btn-mobile");
    const bankBtnMobile = document.getElementById("bank-btn-mobile");
    const statsBtnMobile = document.getElementById("stats-btn-mobile");
    if (shopBtnMobile) shopBtnMobile.addEventListener("click", () => {
        moreMenu.classList.remove("open");
        openShop();
    });
    if (bankBtnMobile) bankBtnMobile.addEventListener("click", () => {
        moreMenu.classList.remove("open");
        openBank();
    });
    if (statsBtnMobile) statsBtnMobile.addEventListener("click", () => {
        moreMenu.classList.remove("open");
        openStats();
    });

    // Workspace navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchWorkspaceView(tab.dataset.view);
        });
    });

    // Workspace action buttons (switch views and actions)
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'switch-dock') switchWorkspaceView('dock');
            if (action === 'switch-tanks') switchWorkspaceView('tanks');
            if (action === 'switch-buyers') switchWorkspaceView('buyers');
            if (action === 'switch-travel') switchWorkspaceView('travel');
            if (action === 'end-day') nextDay();
        });
    });

    // Day summary continue button
    const summaryContinue = document.getElementById("summary-continue");
    if (summaryContinue) summaryContinue.addEventListener("click", closeDaySummary);

    document.getElementById("loan-btn").addEventListener("click", () => {
        const amount = parseInt(document.getElementById("loan-amount").value) || 5000;
        takeLoan(amount);
        updateBankUI();
    });

    document.getElementById("pay-btn").addEventListener("click", () => {
        const amount = parseInt(document.getElementById("pay-amount").value) || gameState.debt;
        payLoan(amount);
        updateBankUI();
    });

    // Travel confirm button
    const travelConfirmBtn = document.getElementById("travel-confirm-button");
    if (travelConfirmBtn) travelConfirmBtn.addEventListener("click", confirmTravel);

    // Badge modal
    const badgeIcon = document.getElementById("badge-icon");
    if (badgeIcon) badgeIcon.addEventListener("click", openBadgeModal);
    const closeBadgeBtn = document.getElementById("close-badge-btn");
    if (closeBadgeBtn) closeBadgeBtn.addEventListener("click", closeBadgeModal);

    // How to Play modal - accessible from status strip
    const helpBtn = document.getElementById("help-btn");
    if (helpBtn) helpBtn.addEventListener("click", openHowToPlay);
    const helpBtnMobile = document.getElementById("help-btn-mobile");
    if (helpBtnMobile) helpBtnMobile.addEventListener("click", () => {
        document.getElementById("more-menu").classList.remove("open");
        openHowToPlay();
    });
    const howToPlayBtn = document.getElementById("how-to-play-btn");
    if (howToPlayBtn) howToPlayBtn.addEventListener("click", openHowToPlay);
    const closeHowToPlayBtn = document.getElementById("close-how-to-play-btn");
    if (closeHowToPlayBtn) closeHowToPlayBtn.addEventListener("click", closeHowToPlay);

    // Close modals on outside click
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    // Boats container - use event delegation for dynamic buttons
    const boatsContainer = document.getElementById("boats-container");
    if (boatsContainer) {
        boatsContainer.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;

            const boatCard = btn.closest(".boat-card");
            if (!boatCard) return;

            const boatIndex = parseInt(boatCard.dataset.boatIndex);
            if (isNaN(boatIndex)) return;

            e.preventDefault();
            e.stopPropagation();

            if (btn.classList.contains("buy-all-btn")) {
                buyFromBoat(boatIndex);
            } else if (btn.classList.contains("buy-half-btn")) {
                const boat = gameState.boats[boatIndex];
                if (boat) {
                    buyFromBoat(boatIndex, Math.floor(boat.catchAmount / 2));
                }
            } else if (btn.classList.contains("pass-btn")) {
                passBoat(boatIndex);
            }
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    initEventHandlers();
    resetGame();
}

document.addEventListener("DOMContentLoaded", init);
