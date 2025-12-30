/**
 * Maine Lobster Dealer Tycoon
 * A tycoon-style game about the lobster dealer industry in Maine
 * Phase 2: Dynamic pricing, equipment, contracts, relationships, finance
 */

// ============================================
// GAME CONFIGURATION
// ============================================
const CONFIG = {
    startingCash: 5000,
    winCondition: 100000,
    bankruptcyThreshold: -5000,  // More forgiving threshold
    daysUntilBankruptcy: 3,      // Days of negative net worth before game over

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
    grades: {
        A: { name: "Premium", buyMod: 1.2, sellMod: 1.4, color: "#ffd700" },
        B: { name: "Standard", buyMod: 1.0, sellMod: 1.0, color: "#c0c0c0" },
        C: { name: "Budget", buyMod: 0.85, sellMod: 0.7, color: "#cd7f32" }
    },

    // Boat names
    boatNames: [
        "Mary Lou", "Downeast Dreamer", "Lucky Catch", "Sea Spray",
        "Morning Star", "Old Salt", "Coastal Runner", "Tide Rider",
        "Harbor Queen", "Misty Morning", "Wave Dancer", "Salty Dog",
        "Blue Horizon", "Lobster Lady", "Captain's Pride", "Sea Breeze"
    ],

    // Captain names
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
    }
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
        cost: 5000, description: "Unlock contracts, +15% delivery sales",
        effect: { contractsEnabled: true, deliveryBonus: 0.15 }
    },
    refrigeratedTruck: {
        id: "refrigeratedTruck", name: "Refrigerated Truck", category: "vehicles",
        cost: 12000, description: "Premium contracts, +25% delivery sales",
        effect: { premiumContracts: true, deliveryBonus: 0.25 }, requires: "deliveryVan"
    },
    dockRunner: {
        id: "dockRunner", name: "Dock Runner", category: "vehicles",
        cost: 3500, description: "Visit 2 boats per day",
        effect: { extraBoats: 1 }
    },

    // Processing
    scale: {
        id: "scale", name: "Commercial Scale", category: "processing",
        cost: 800, description: "+5% on all transactions",
        effect: { transactionBonus: 0.05 }
    },
    gradingTable: {
        id: "gradingTable", name: "Grading Table", category: "processing",
        cost: 1500, description: "See inventory breakdown by A/B/C grade",
        effect: { gradingEnabled: true }
    },
    bandingStation: {
        id: "bandingStation", name: "Banding Station", category: "processing",
        cost: 600, description: "Required for restaurant sales",
        effect: { restaurantEnabled: true }
    },
    packingEquipment: {
        id: "packingEquipment", name: "Packing Equipment", category: "processing",
        cost: 2500, description: "Unlock export contracts",
        effect: { exportEnabled: true }
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
        description: "Sell 200 lbs of A-grade",
        emoji: "⭐",
        condition: (state) => (state.stats.gradeASold || 0) >= 200,
        reward: { type: "reputation", amount: 10 },
        tier: "silver"
    },
    premiumOnly: {
        id: "premiumOnly",
        name: "Premium Only",
        description: "Sell 1,000 lbs of A-grade",
        emoji: "💎",
        condition: (state) => (state.stats.gradeASold || 0) >= 1000,
        reward: { type: "prestige", amount: 1 },
        tier: "gold"
    },

    // Contract achievements
    firstContract: {
        id: "firstContract",
        name: "Handshake Deal",
        description: "Complete your first contract",
        emoji: "🤝",
        condition: (state) => state.stats.contractsCompleted >= 1,
        reward: { type: "reputation", amount: 10 },
        tier: "bronze"
    },
    contractKing: {
        id: "contractKing",
        name: "Contract King",
        description: "Complete 20 contracts",
        emoji: "📋",
        condition: (state) => state.stats.contractsCompleted >= 20,
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
        description: "Be #1 on leaderboard for 7 days",
        emoji: "🥇",
        condition: (state) => (state.stats.daysAtTop || 0) >= 7,
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
        message: "Fishing boats arrive here with fresh lobsters. Click 'Buy All' or 'Buy Half' to purchase their catch. Buy low!",
        highlight: ".dock-panel",
        position: "right"
    },
    {
        id: "tank",
        title: "Your Tank",
        message: "Lobsters you buy are stored here. Watch your capacity! Lobsters can die if stored too long.",
        highlight: ".tank-panel",
        position: "right"
    },
    {
        id: "buyers",
        title: "Buyers",
        message: "Sell your lobsters to buyers who visit. Different buyers pay different prices. Sell high!",
        highlight: ".buyers-panel",
        position: "left"
    },
    {
        id: "nextday",
        title: "Next Day",
        message: "Click 'Next Day' to advance time. New boats and buyers arrive each day. Watch the weather - storms mean fewer boats!",
        highlight: "#next-day-btn",
        position: "top"
    },
    {
        id: "shop",
        title: "Upgrades",
        message: "Visit the Shop to buy equipment upgrades. A Delivery Van lets you travel to other towns for better prices!",
        highlight: "#shop-btn",
        position: "bottom"
    },
    {
        id: "ready",
        title: "You're Ready!",
        message: "Good luck! Remember: Buy Low, Sell High, and watch the calendar. Summer won't last forever!",
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
            const total = state.inventory.A + state.inventory.B + state.inventory.C;
            const cap = state.tankCapacity;
            return total > cap * 0.8 && total < cap;
        },
        message: "💡 Tip: Your tank is getting full! Sell some lobsters or upgrade your tank in the Shop.",
        once: true
    },
    haveLobstersNoBuyers: {
        id: "haveLobstersNoBuyers",
        condition: (state) => {
            const total = state.inventory.A + state.inventory.B + state.inventory.C;
            return total > 0 && state.buyers.length === 0;
        },
        message: "💡 Tip: No buyers today, but you have lobsters. They'll keep until tomorrow (though quality may drop).",
        once: true
    },
    goodSellPrice: {
        id: "goodSellPrice",
        condition: (state) => state.marketTrend > 0 && state.inventory.A + state.inventory.B + state.inventory.C > 50,
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
        message: "📅 Halfway through summer! You have 15 days left. Current cash: $" + (state => formatMoney(state.cash)),
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
            const totalInv = getTotalInventory();
            const lost = Math.floor(totalInv * lostPercent);
            // Lose proportionally from each grade
            const lostA = Math.floor(state.inventory.A * lostPercent);
            const lostB = Math.floor(state.inventory.B * lostPercent);
            const lostC = Math.floor(state.inventory.C * lostPercent);
            state.inventory.A -= lostA;
            state.inventory.B -= lostB;
            state.inventory.C -= lostC;
            return { lost: lostA + lostB + lostC };
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
            // Downgrade some A to B and B to C
            const downgradeA = Math.floor(state.inventory.A * randomFloat(0.1, 0.25));
            const downgradeB = Math.floor(state.inventory.B * randomFloat(0.1, 0.25));
            state.inventory.A -= downgradeA;
            state.inventory.B += downgradeA - downgradeB;
            state.inventory.C += downgradeB;
            return { downgraded: downgradeA + downgradeB };
        },
        message: (data) => `Temperature fluctuation! ${data.downgraded} lbs dropped in quality.`,
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
            // Add as B grade
            state.inventory.B += amount;
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
                minGrade: "B",
                pricePerLb: calculateSellPrice('A') * premium,
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
        x: 75,  // Map position (percentage)
        y: 55,
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
        x: 58,
        y: 52,
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
        x: 52,
        y: 48,
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
        x: 28,
        y: 72,
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
        x: 38,
        y: 60,
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
        x: 85,
        y: 35,
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
        x: 18,
        y: 82,
        buyMod: 1.15,
        sellMod: 1.30,
        boatBonus: 0,
        buyerPenalty: -1,
        travelCost: 250,
        traits: ["wealthy", "exclusive"]
    }
};

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

    // Inventory by quality
    inventory: { A: 0, B: 0, C: 0 },
    tankCapacity: 500,
    baseMortalityRate: 0.05,
    qualityDecayRate: 0.1, // 10% chance per day to drop a grade

    // Equipment owned
    equipment: {},

    // Current dock boats
    boats: [],
    maxBoats: 1,

    // Buyers available today
    buyers: [],

    // Contracts
    contracts: [],
    availableContracts: [],

    // Relationships
    fishermenRelations: {}, // captainName -> loyalty (0-100)
    buyerRelations: {}, // buyerName -> trust (0-100)

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

    // Statistics tracking
    stats: {
        totalLobstersBought: 0,
        totalLobstersSold: 0,
        totalMoneyEarned: 0,
        totalMoneySpent: 0,
        bestDayProfit: 0,
        worstDayLoss: 0,
        contractsCompleted: 0,
        contractsFailed: 0,
        dealsWithCaptains: {},  // captainName -> count
        salesToBuyers: {},      // buyerName -> count
        loansTotal: 0,
        interestPaid: 0,
        rivalsOutbid: 0,        // Times you beat a rival
        lostToRivals: 0,        // Times rival beat you
        gradeASold: 0,          // Premium lobster sold
        gradeBSold: 0,
        gradeCSold: 0,
        daysAtTop: 0,           // Days as #1 on leaderboard
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

    // Reputation (affects prices and relationships)
    reputation: 50,          // 0-100, starts at neutral

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

    // Leaderboard tracking
    lastLeaderboardPosition: 0,

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

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function formatMoney(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getTotalInventory() {
    return gameState.inventory.A + gameState.inventory.B + gameState.inventory.C;
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

    // Also show as popup
    showBobPopup(message);
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
    // 15% chance of random chatter
    if (Math.random() < 0.15) {
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

        case "contractComplete":
            stats.contractsCompleted++;
            break;

        case "contractFail":
            stats.contractsFailed++;
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

    // Grade modifier
    price *= CONFIG.grades[grade].buyMod;

    // Location modifier - fishing hubs are cheaper!
    price *= getLocationPriceModifier('buy');

    // Market trend
    price *= (1 + gameState.marketTrend * 0.1);

    // Random variation
    price += randomFloat(-0.50, 0.50);

    return Math.round(price * 100) / 100;
}

function calculateSellPrice(grade, isContract = false) {
    let price = CONFIG.baseLobsterPrice;

    // Season modifier
    price *= CONFIG.seasons[gameState.season].sellMod;

    // Grade modifier
    price *= CONFIG.grades[grade].sellMod;

    // Location modifier - tourist towns pay more!
    price *= getLocationPriceModifier('sell');

    // Market trend (inverse for selling - high demand = good prices)
    price *= (1 + gameState.marketTrend * 0.15);

    // Equipment bonuses
    const transactionBonus = getEquipmentEffect('transactionBonus', 0);
    price *= (1 + transactionBonus);

    // Contract bonus
    if (isContract) {
        const deliveryBonus = getEquipmentEffect('deliveryBonus', 0);
        price *= (1 + deliveryBonus);
    }

    // Random variation
    price += randomFloat(-0.30, 0.50);

    return Math.round(price * 100) / 100;
}

// ============================================
// BOAT GENERATION
// ============================================
function generateBoats() {
    const boats = [];
    const seasonData = CONFIG.seasons[gameState.season];
    const weatherData = CONFIG.weather[gameState.weather];

    // Location affects number of boats - fishing hubs have more!
    const locationBoatBonus = getLocationBoatBonus();
    const maxBoats = Math.max(1, gameState.maxBoats + getEquipmentEffect('extraBoats', 0) + locationBoatBonus);

    for (let i = 0; i < maxBoats; i++) {
        const boatChance = seasonData.boatChance * weatherData.boatMod;
        if (Math.random() > boatChance) continue;

        const captain = randomChoice(CONFIG.captainNames);
        const boatName = randomChoice(CONFIG.boatNames);

        // Boats sell ungraded lobsters - YOU grade them after purchase
        const catchAmount = randomInt(50, 300);

        // Get loyalty bonus
        const loyalty = gameState.fishermenRelations[captain] || 0;
        const loyaltyDiscount = loyalty * 0.001; // Up to 10% discount at max loyalty

        // Base price affected by season, weather, market, and loyalty
        let pricePerLb = calculateBuyPrice('B'); // Use B-grade as baseline
        pricePerLb = Math.round((pricePerLb * (1 - loyaltyDiscount)) * 100) / 100;

        boats.push({
            name: boatName,
            captain: captain,
            loyalty: loyalty,
            catchAmount: catchAmount,
            pricePerLb: pricePerLb
        });
    }

    return boats;
}

// ============================================
// BUYER GENERATION
// ============================================
function generateBuyers() {
    const buyers = [];
    const weatherData = CONFIG.weather[gameState.weather];
    const locationBuyerBonus = getLocationBuyerBonus(); // Positive = more buyers
    const town = getCurrentTown();

    // Restaurant buyer - more common in tourist/wealthy towns
    const restaurantChance = town.traits.includes('tourist') || town.traits.includes('wealthy') ? 0.2 : 0.3;
    if (hasEquipment('bandingStation') || Math.random() > restaurantChance) {
        const restaurantNames = ["Harbor Bistro", "The Clam Shack", "Oceanview Grill", "Pier 7", "Captain's Table"];
        const name = randomChoice(restaurantNames);
        const trust = gameState.buyerRelations[name] || 0;

        if (Math.random() < weatherData.buyerMod) {
            buyers.push({
                name: name,
                emoji: "🍽️",
                type: "restaurant",
                wantsAmount: randomInt(15, 40) + Math.floor(trust / 10) + (locationBuyerBonus * 5),
                minGrade: "B",
                pricePerLb: calculateSellPrice('B'),
                trust: trust
            });
        }
    }

    // Wholesaler buyer - always present
    const wholesalerNames = ["Portland Seafood Co.", "Maine Coast Dist.", "Atlantic Fresh", "NE Wholesale"];
    const wName = randomChoice(wholesalerNames);
    const wTrust = gameState.buyerRelations[wName] || 0;

    buyers.push({
        name: wName,
        emoji: "🏭",
        type: "wholesaler",
        wantsAmount: randomInt(80, 200) + Math.floor(wTrust / 5),
        minGrade: "C",
        pricePerLb: calculateSellPrice('C'),
        trust: wTrust
    });

    // Special buyer (tourists, events) - more common in tourist towns
    const specialChance = town.traits.includes('tourist') ? 0.3 : town.traits.includes('wealthy') ? 0.4 : 0.5;
    if (Math.random() > specialChance && weatherData.buyerMod > 0.7) {
        const specialNames = ["Tourist Group", "Private Yacht", "Wedding Caterer", "Food Festival"];
        buyers.push({
            name: randomChoice(specialNames),
            emoji: "⭐",
            type: "special",
            wantsAmount: randomInt(30, 80) + (locationBuyerBonus * 10),
            minGrade: "A",
            pricePerLb: calculateSellPrice('A'),
            trust: 0
        });
    }

    // Extra buyer in high-volume towns (Portland, Bar Harbor)
    if (locationBuyerBonus >= 1 && Math.random() > 0.5) {
        const extraNames = ["Local Market", "Cruise Ship Supply", "Hotel Chain", "Seafood Co-op"];
        buyers.push({
            name: randomChoice(extraNames),
            emoji: "🏪",
            type: "bulk",
            wantsAmount: randomInt(50, 150),
            minGrade: "B",
            pricePerLb: calculateSellPrice('B') * 0.95, // Slight discount for bulk
            trust: 0
        });
    }

    return buyers;
}

// ============================================
// CONTRACT SYSTEM
// ============================================
function generateContractOffers() {
    if (!hasEquipment('deliveryVan')) return [];

    const contracts = [];
    const names = ["Oceanview Resort", "Blue Wave Restaurant", "Coastal Markets", "Harbor Inn"];

    if (Math.random() > 0.5) {
        const name = randomChoice(names);
        contracts.push({
            id: Date.now(),
            buyer: name,
            emoji: "📋",
            amountPerWeek: randomInt(30, 80),
            pricePerLb: calculateSellPrice('B', true) * 0.95, // Slight discount for guaranteed
            weeksRemaining: randomInt(2, 4),
            delivered: 0,
            minGrade: "B"
        });
    }

    // Premium contract if has refrigerated truck
    if (hasEquipment('refrigeratedTruck') && Math.random() > 0.6) {
        contracts.push({
            id: Date.now() + 1,
            buyer: "Boston Premium Seafood",
            emoji: "🌟",
            amountPerWeek: randomInt(50, 120),
            pricePerLb: calculateSellPrice('A', true),
            weeksRemaining: randomInt(3, 6),
            delivered: 0,
            minGrade: "A"
        });
    }

    return contracts;
}

function acceptContract(index) {
    const contract = gameState.availableContracts[index];
    if (!contract) return false;

    gameState.contracts.push(contract);
    gameState.availableContracts.splice(index, 1);
    log(`Signed contract with ${contract.buyer}!`, "positive");
    updateUI();
    return true;
}

function deliverToContract(contractIndex) {
    const contract = gameState.contracts[contractIndex];
    if (!contract) return false;

    const needed = contract.amountPerWeek - contract.delivered;
    let delivered = 0;
    let revenue = 0;

    // Deliver from inventory, preferring the minimum grade
    const grades = contract.minGrade === 'A' ? ['A'] : contract.minGrade === 'B' ? ['B', 'A'] : ['C', 'B', 'A'];

    for (const grade of grades) {
        const amount = Math.min(gameState.inventory[grade], needed - delivered);
        if (amount > 0) {
            gameState.inventory[grade] -= amount;
            delivered += amount;
            revenue += amount * contract.pricePerLb;
        }
    }

    if (delivered > 0) {
        contract.delivered += delivered;
        const finalRevenue = Math.round(revenue);
        gameState.cash += finalRevenue;
        gameState.dailyEarned += finalRevenue;  // Track daily earnings
        log(`Delivered ${delivered} lbs to ${contract.buyer} for $${formatMoney(finalRevenue)}`, "positive");

        // Build relationship
        const currentTrust = gameState.buyerRelations[contract.buyer] || 0;
        gameState.buyerRelations[contract.buyer] = Math.min(100, currentTrust + 2);
    } else {
        log("No suitable inventory for this contract!", "negative");
    }

    updateUI();
    return delivered > 0;
}

// ============================================
// TANK MANAGEMENT
// ============================================
function processTankDaily() {
    const mortalityRate = getEquipmentEffect('mortalityRate', gameState.baseMortalityRate);
    const qualityDecayMod = getEquipmentEffect('qualityDecayMod', 1);

    let totalLost = 0;
    let qualityDropped = 0;

    // Process mortality
    for (const grade of ['A', 'B', 'C']) {
        const amount = gameState.inventory[grade];
        const lost = Math.floor(amount * mortalityRate);
        if (lost > 0) {
            gameState.inventory[grade] -= lost;
            totalLost += lost;
        }
    }

    // Process quality decay (A->B, B->C)
    const decayChance = gameState.qualityDecayRate * qualityDecayMod;

    const aDecay = Math.floor(gameState.inventory.A * decayChance);
    if (aDecay > 0) {
        gameState.inventory.A -= aDecay;
        gameState.inventory.B += aDecay;
        qualityDropped += aDecay;
    }

    const bDecay = Math.floor(gameState.inventory.B * decayChance);
    if (bDecay > 0) {
        gameState.inventory.B -= bDecay;
        gameState.inventory.C += bDecay;
        qualityDropped += bDecay;
    }

    if (totalLost > 0) {
        log(`Lost ${totalLost} lbs to mortality.`, "negative");
    }
    if (qualityDropped > 0) {
        log(`${qualityDropped} lbs dropped in quality.`, "warning");
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
    // Random distribution: ~20-30% A, ~45-55% B, remainder is C
    const aPercent = randomFloat(0.20, 0.30);
    const bPercent = randomFloat(0.45, 0.55);

    const gradeA = Math.round(amount * aPercent);
    const gradeB = Math.round(amount * bPercent);
    // C is the remainder to ensure total adds up exactly
    const gradeC = amount - gradeA - gradeB;

    return {
        A: gradeA,
        B: gradeB,
        C: Math.max(0, gradeC) // Ensure non-negative
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
    gameState.inventory.A += graded.A;
    gameState.inventory.B += graded.B;
    gameState.inventory.C += graded.C;

    // Build relationship with captain
    const currentLoyalty = gameState.fishermenRelations[boat.captain] || 0;
    gameState.fishermenRelations[boat.captain] = Math.min(100, currentLoyalty + 1);

    // Log message - show grades if player has grading table
    if (hasEquipment('gradingTable')) {
        log(`Bought ${buyAmount} lbs for $${formatMoney(cost)} (A:${graded.A} B:${graded.B} C:${graded.C})`, "warning");
    } else {
        log(`Bought ${buyAmount} lbs from ${boat.captain} for $${formatMoney(cost)}`, "warning");
    }

    // Fisherman commentary on the purchase
    if (Math.random() < 0.5) { // 50% chance of comment
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

    // Check for low cash warning
    if (gameState.cash < 500 && Math.random() < 0.4) {
        fishermanSays(getRandomComment(CONFIG.dockworker.low_cash));
    }

    // Remove boat if empty
    if (boat.catchAmount <= 0) {
        gameState.boats.splice(boatIndex, 1);
    }

    updateUI();
    return true;
}

function passBoat(boatIndex) {
    const boat = gameState.boats[boatIndex];
    if (boat) {
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

    // Sell from inventory, respecting minimum grade
    const grades = buyer.minGrade === 'A' ? ['A'] :
                   buyer.minGrade === 'B' ? ['A', 'B'] : ['A', 'B', 'C'];

    for (const grade of grades) {
        const amount = Math.min(gameState.inventory[grade], buyer.wantsAmount - sold);
        if (amount > 0) {
            // Price adjusted by grade
            const gradePrice = buyer.pricePerLb * CONFIG.grades[grade].sellMod;
            gameState.inventory[grade] -= amount;
            sold += amount;
            revenue += amount * gradePrice;
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

    // Build relationship
    if (buyer.name) {
        const currentTrust = gameState.buyerRelations[buyer.name] || 0;
        gameState.buyerRelations[buyer.name] = Math.min(100, currentTrust + 1);
    }

    log(`Sold ${sold} lbs to ${buyer.name} for $${formatMoney(finalRevenue)}`, "positive");

    // Fisherman commentary on the sale
    if (Math.random() < 0.5) { // 50% chance of comment
        const bob = CONFIG.dockworker;
        if (finalRevenue >= 500) {
            fishermanSays(getRandomComment(bob.selling.big_sale));
        } else if (buyer.type === 'special') {
            fishermanSays(getRandomComment(bob.selling.premium_buyer));
        } else {
            fishermanSays(getRandomComment(bob.selling.good_sale));
        }
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
    // Store current day for summary (before incrementing)
    const previousDay = gameState.day;

    // Show daily profit/loss summary for the day that just ended
    const dailyProfit = gameState.dailyEarned - gameState.dailySpent;
    if (gameState.dailyEarned > 0 || gameState.dailySpent > 0) {
        const profitText = dailyProfit >= 0
            ? `+$${formatMoney(dailyProfit)}`
            : `-$${formatMoney(Math.abs(dailyProfit))}`;
        const profitType = dailyProfit >= 0 ? "positive" : "negative";
        log(`━━━ Day ${previousDay} Summary: Earned $${formatMoney(gameState.dailyEarned)} | Spent $${formatMoney(gameState.dailySpent)} | Net: ${profitText} ━━━`, profitType);

        // Track best/worst day stats
        updateStats("dayEnd", { earned: gameState.dailyEarned, spent: gameState.dailySpent });
    }

    // Reset daily trackers for new day
    gameState.dailySpent = 0;
    gameState.dailyEarned = 0;
    gameState.dailyCosts = 0;
    gameState.dailyTravels = 0;
    gameState.visitedTownsToday = {};

    // Pay daily operating costs
    const operatingCost = 50 + Math.floor(getTotalInventory() * 0.05);
    gameState.cash -= operatingCost;
    log(`Operating costs: $${operatingCost}`, "warning");

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

    // Rival dealers try to buy boats before you can!
    if (gameState.boats.length > 0) {
        processRivalActions();
    }

    // Generate contract offers
    gameState.availableContracts = generateContractOffers();

    // Process random events (after boats/buyers generated)
    processRandomEvents();

    // Check for captain storylines
    checkCaptainStories();

    // Update market supply tracking
    updateMarketSupply();

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

        // Fisherman morning commentary (30% chance)
        if (Math.random() < 0.3) {
            fishermanSays(getRandomComment(CONFIG.dockworker.morning));
        }

        // Weather-specific commentary (40% chance)
        if (Math.random() < 0.4) {
            const weatherComments = CONFIG.dockworker.weather[gameState.weather];
            if (weatherComments) {
                fishermanSays(getRandomComment(weatherComments));
            }
        }

        // Market trend commentary (25% chance)
        if (Math.random() < 0.25) {
            const trendType = gameState.marketTrend > 0 ? 'rising' :
                              gameState.marketTrend < 0 ? 'falling' : 'stable';
            fishermanSays(getRandomComment(CONFIG.dockworker.market[trendType]));
        }

        // Season change commentary
        const oldSeason = getSeason(gameState.day - 1);
        if (oldSeason !== gameState.season) {
            fishermanSays(getRandomComment(CONFIG.dockworker.season[gameState.season]));
        }

        // Occasional idle chatter
        maybeIdleChatter();
    }

    updateUI();
}

function processWeeklyEvents() {
    log(`=== Week ${gameState.week} ===`, "");

    // Process contract deadlines
    for (let i = gameState.contracts.length - 1; i >= 0; i--) {
        const contract = gameState.contracts[i];
        if (contract.delivered < contract.amountPerWeek) {
            const penalty = Math.round((contract.amountPerWeek - contract.delivered) * contract.pricePerLb * 0.5);
            gameState.cash -= penalty;
            log(`Missed contract with ${contract.buyer}! Penalty: $${formatMoney(penalty)}`, "negative");

            // Lose trust
            const currentTrust = gameState.buyerRelations[contract.buyer] || 0;
            gameState.buyerRelations[contract.buyer] = Math.max(0, currentTrust - 20);

            // Track failed contract
            updateStats("contractFail", {});
        }

        contract.weeksRemaining--;
        contract.delivered = 0;

        if (contract.weeksRemaining <= 0) {
            log(`Contract with ${contract.buyer} completed!`, "positive");
            updateStats("contractComplete", {});
            gameState.contracts.splice(i, 1);
        }
    }

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
        // Quick check for severe bankruptcy during trading
        if (netWorth < CONFIG.bankruptcyThreshold) {
            endGame(false, "You've gone deeply bankrupt! The lobster business is brutal.");
            return true;
        }
        return false;
    }

    // Full bankruptcy check at day end - only increment once per day
    if (netWorth < 0 && lastBankruptcyCheckDay !== gameState.day) {
        lastBankruptcyCheckDay = gameState.day;
        gameState.daysInTrouble++;

        if (netWorth < CONFIG.bankruptcyThreshold) {
            // Immediate bankruptcy if severely in debt
            endGame(false, "You've gone deeply bankrupt! The lobster business is brutal.");
            return true;
        } else if (gameState.daysInTrouble >= CONFIG.daysUntilBankruptcy) {
            // Bankruptcy after grace period
            endGame(false, `You couldn't recover after ${CONFIG.daysUntilBankruptcy} days in the red. The bank has called in your debts.`);
            return true;
        } else {
            // Warning - player has time to recover
            const daysLeft = CONFIG.daysUntilBankruptcy - gameState.daysInTrouble;
            log(`⚠️ WARNING: Net worth negative ($${formatMoney(netWorth)})! ${daysLeft} day(s) to recover before bankruptcy!`, "negative");
            fishermanSays(`Things are lookin' rough! Better make some sales quick or the bank'll come knockin'!`);
        }
    } else if (netWorth >= 0) {
        // Reset trouble counter when back in positive
        if (gameState.daysInTrouble > 0) {
            gameState.daysInTrouble = 0;
            log(`Back in the black! Financial crisis averted.`, "positive");
            fishermanSays(`That's more like it! Keep your head above water!`);
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

    gameState = {
        cash: startingCash,
        debt: 0,
        day: 1,
        week: 1,
        season: "Summer",
        weather: "sunny",
        tomorrowWeather: generateWeather(),
        marketTrend: 0,
        currentLocation: "stonington", // Start in cheapest fishing village
        travelingTo: null,
        inventory: { A: 0, B: 0, C: 0 },
        tankCapacity: 500,
        baseMortalityRate: 0.05,
        qualityDecayRate: 0.1,
        equipment: {},
        boats: [],
        maxBoats: 1,
        buyers: [],
        contracts: [],
        availableContracts: [],
        fishermenRelations: {},
        buyerRelations: {},
        loanAvailable: true,
        maxLoan: 10000,
        interestRate: 0.05,
        dailySpent: 0,
        dailyEarned: 0,
        dailyCosts: 0,
        dailyTravels: 0,
        visitedTownsToday: {},
        stats: {
            totalLobstersBought: 0,
            totalLobstersSold: 0,
            totalMoneyEarned: 0,
            totalMoneySpent: 0,
            bestDayProfit: 0,
            worstDayLoss: 0,
            contractsCompleted: 0,
            contractsFailed: 0,
            dealsWithCaptains: {},
            salesToBuyers: {},
            loansTotal: 0,
            interestPaid: 0,
            rivalsOutbid: 0,
            lostToRivals: 0,
            gradeASold: 0,
            daysAtTop: 0,
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
    else if (message.includes("contract") || message.includes("Contract")) icon = "📋";
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
    // Header stats
    document.getElementById("cash").textContent = formatMoney(gameState.cash);
    document.getElementById("debt").textContent = formatMoney(gameState.debt);
    document.getElementById("day").textContent = gameState.day;
    document.getElementById("season").textContent = gameState.season;
    document.getElementById("weather-icon").textContent = CONFIG.weather[gameState.weather].icon;
    document.getElementById("weather-name").textContent = CONFIG.weather[gameState.weather].name;
    document.getElementById("tomorrow-weather").textContent = CONFIG.weather[gameState.tomorrowWeather].icon;

    // Market trend
    const trendEl = document.getElementById("market-trend");
    if (gameState.marketTrend > 0) {
        trendEl.textContent = "📈 Rising";
        trendEl.className = "trend-up";
    } else if (gameState.marketTrend < 0) {
        trendEl.textContent = "📉 Falling";
        trendEl.className = "trend-down";
    } else {
        trendEl.textContent = "➡️ Stable";
        trendEl.className = "trend-stable";
    }

    // Daily tracker
    document.getElementById("daily-spent").textContent = formatMoney(gameState.dailySpent);
    document.getElementById("daily-earned").textContent = formatMoney(gameState.dailyEarned);
    const dailyNet = gameState.dailyEarned - gameState.dailySpent;
    const profitEl = document.getElementById("daily-profit");
    if (dailyNet >= 0) {
        profitEl.textContent = `Net: +$${formatMoney(dailyNet)}`;
        profitEl.className = "daily-stat profit-positive";
    } else {
        profitEl.textContent = `Net: -$${formatMoney(Math.abs(dailyNet))}`;
        profitEl.className = "daily-stat profit-negative";
    }

    // Tank display
    const capacity = gameState.tankCapacity + getEquipmentEffect('capacityBonus', 0);
    const total = getTotalInventory();

    // Only show grade breakdown if player has grading table
    const breakdownEl = document.getElementById("inventory-breakdown");
    if (hasEquipment('gradingTable')) {
        breakdownEl.style.display = "flex";
        document.getElementById("inventory-a").textContent = gameState.inventory.A;
        document.getElementById("inventory-b").textContent = gameState.inventory.B;
        document.getElementById("inventory-c").textContent = gameState.inventory.C;
    } else {
        breakdownEl.style.display = "none";
    }

    document.getElementById("inventory-total").textContent = total;
    document.getElementById("capacity").textContent = capacity;

    const fillPercent = (total / capacity) * 100;
    document.getElementById("tank-fill").style.height = `${fillPercent}%`;

    const lobsterCount = Math.min(Math.floor(total / 25), 15);
    document.getElementById("lobster-icons").textContent = "🦞".repeat(lobsterCount);

    // Dock
    updateDockUI();

    // Buyers
    updateBuyersUI();

    // Contracts
    updateContractsUI();

    // Equipment shop
    updateShopUI();

    // Leaderboard (replaces old rivals panel)
    updateLeaderboardUI();

    // Location
    updateLocationUI();

    // Weather effects
    updateWeatherEffects();

    // Check achievements
    checkAchievements();
}

function updateDockUI() {
    const container = document.getElementById("boats-container");
    container.innerHTML = "";

    if (gameState.boats.length === 0) {
        container.innerHTML = '<p class="waiting">No boats at the dock...</p>';
        return;
    }

    gameState.boats.forEach((boat, index) => {
        const totalCost = Math.round(boat.catchAmount * boat.pricePerLb);
        const halfCost = Math.round((boat.catchAmount / 2) * boat.pricePerLb);
        const loyaltyStars = Math.floor(boat.loyalty / 25);

        const div = document.createElement("div");
        div.className = "boat-card";
        div.innerHTML = `
            <div class="boat-header">
                <span class="boat-emoji floating">🚤</span>
                <span class="boat-name">${boat.name}</span>
                <span class="captain-name">${boat.captain} ${"★".repeat(loyaltyStars)}</span>
            </div>
            <div class="catch-info">
                <p>${boat.catchAmount} lbs @ $${boat.pricePerLb.toFixed(2)}/lb</p>
                <p class="total-cost">Total: $${formatMoney(totalCost)}</p>
            </div>
            <div class="boat-actions">
                <button class="btn btn-primary buy-all-btn" data-boat="${index}">Buy All</button>
                <button class="btn buy-half-btn" data-boat="${index}">Buy Half ($${formatMoney(halfCost)})</button>
                <button class="btn btn-secondary pass-btn" data-boat="${index}">Pass</button>
            </div>
        `;
        container.appendChild(div);
    });

    // Event listeners
    container.querySelectorAll(".buy-all-btn").forEach(btn => {
        btn.addEventListener("click", () => buyFromBoat(parseInt(btn.dataset.boat)));
    });
    container.querySelectorAll(".buy-half-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const boat = gameState.boats[parseInt(btn.dataset.boat)];
            if (boat) buyFromBoat(parseInt(btn.dataset.boat), Math.floor(boat.catchAmount / 2));
        });
    });
    container.querySelectorAll(".pass-btn").forEach(btn => {
        btn.addEventListener("click", () => passBoat(parseInt(btn.dataset.boat)));
    });
}

function updateBuyersUI() {
    const container = document.getElementById("buyers-list");
    container.innerHTML = "";

    if (gameState.buyers.length === 0) {
        container.innerHTML = '<p class="waiting">No buyers today...</p>';
        return;
    }

    gameState.buyers.forEach((buyer, index) => {
        const total = getTotalInventory();
        const canSell = total > 0;
        const trustStars = Math.floor((buyer.trust || 0) / 25);

        const div = document.createElement("div");
        div.className = "buyer-card";
        div.innerHTML = `
            <div class="buyer-info">
                <span class="buyer-emoji">${buyer.emoji}</span>
                <span class="buyer-name">${buyer.name} ${"★".repeat(trustStars)}</span>
                <span class="buyer-type">(${buyer.type})</span>
            </div>
            <div class="buyer-offer">
                Wants ${buyer.wantsAmount} lbs (${buyer.minGrade}+ grade) @ $${buyer.pricePerLb.toFixed(2)}/lb
            </div>
            <button class="btn btn-primary sell-btn" data-buyer="${index}" ${canSell ? '' : 'disabled'}>Sell</button>
        `;
        container.appendChild(div);
    });

    container.querySelectorAll(".sell-btn").forEach(btn => {
        btn.addEventListener("click", () => sellToBuyer(parseInt(btn.dataset.buyer)));
    });
}

function updateContractsUI() {
    const activeContainer = document.getElementById("active-contracts");
    const availableContainer = document.getElementById("available-contracts");

    // Active contracts
    if (gameState.contracts.length === 0) {
        activeContainer.innerHTML = '<p class="waiting">No active contracts</p>';
    } else {
        activeContainer.innerHTML = "";
        gameState.contracts.forEach((contract, index) => {
            const progress = Math.round((contract.delivered / contract.amountPerWeek) * 100);
            const div = document.createElement("div");
            div.className = "contract-card";
            div.innerHTML = `
                <div class="contract-info">
                    <span>${contract.emoji} ${contract.buyer}</span>
                    <span>${contract.amountPerWeek} lbs/wk @ $${contract.pricePerLb.toFixed(2)}</span>
                    <span>Progress: ${contract.delivered}/${contract.amountPerWeek} (${progress}%)</span>
                    <span>${contract.weeksRemaining} weeks left</span>
                </div>
                <button class="btn btn-primary deliver-btn" data-contract="${index}">Deliver</button>
            `;
            activeContainer.appendChild(div);
        });

        activeContainer.querySelectorAll(".deliver-btn").forEach(btn => {
            btn.addEventListener("click", () => deliverToContract(parseInt(btn.dataset.contract)));
        });
    }

    // Available contracts
    if (!hasEquipment('deliveryVan')) {
        availableContainer.innerHTML = '<p class="waiting">Need Delivery Van for contracts</p>';
    } else if (gameState.availableContracts.length === 0) {
        availableContainer.innerHTML = '<p class="waiting">No contracts available today</p>';
    } else {
        availableContainer.innerHTML = "";
        gameState.availableContracts.forEach((contract, index) => {
            const div = document.createElement("div");
            div.className = "contract-card available";
            div.innerHTML = `
                <div class="contract-info">
                    <span>${contract.emoji} ${contract.buyer}</span>
                    <span>${contract.amountPerWeek} lbs/wk @ $${contract.pricePerLb.toFixed(2)}</span>
                    <span>Duration: ${contract.weeksRemaining} weeks</span>
                    <span>Min grade: ${contract.minGrade}</span>
                </div>
                <button class="btn btn-primary accept-btn" data-contract="${index}">Accept</button>
            `;
            availableContainer.appendChild(div);
        });

        availableContainer.querySelectorAll(".accept-btn").forEach(btn => {
            btn.addEventListener("click", () => acceptContract(parseInt(btn.dataset.contract)));
        });
    }
}

function updateShopUI() {
    const container = document.getElementById("equipment-list");
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
    document.getElementById("stat-contracts-done").textContent = stats.contractsCompleted;
    document.getElementById("stat-contracts-fail").textContent = stats.contractsFailed;

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

    document.getElementById("location-emoji").textContent = town.emoji;
    document.getElementById("location-name").textContent = town.name;

    // Format traits for display
    const traitsDisplay = town.traits.map(t => t.replace('_', ' ')).join(' / ');
    document.getElementById("location-traits").textContent = traitsDisplay;

    // Format price modifiers
    const buyModPercent = Math.round((town.buyMod - 1) * 100);
    const sellModPercent = Math.round((town.sellMod - 1) * 100);

    document.getElementById("buy-mod").textContent =
        buyModPercent >= 0 ? `+${buyModPercent}%` : `${buyModPercent}%`;
    document.getElementById("sell-mod").textContent =
        sellModPercent >= 0 ? `+${sellModPercent}%` : `${sellModPercent}%`;
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
// LEADERBOARD SYSTEM
// ============================================
function getLeaderboard() {
    const entries = [];

    // Add player
    const playerNetWorth = gameState.cash - gameState.debt + getTotalInventory() * 4;
    entries.push({
        id: "player",
        name: "You",
        emoji: "🧑",
        netWorth: playerNetWorth,
        inventory: getTotalInventory(),
        isPlayer: true
    });

    // Add rivals
    for (const [rivalId, state] of Object.entries(gameState.rivals)) {
        const rival = RIVALS[rivalId];
        if (!rival) continue;
        entries.push({
            id: rivalId,
            name: rival.name,
            emoji: rival.emoji,
            netWorth: state.cash + state.inventory * 4,
            inventory: state.inventory,
            isPlayer: false
        });
    }

    // Sort by net worth descending
    entries.sort((a, b) => b.netWorth - a.netWorth);

    // Add rank
    entries.forEach((entry, index) => {
        entry.rank = index + 1;
        entry.change = 0; // Will be calculated
    });

    return entries;
}

function updateLeaderboardTracking() {
    const leaderboard = getLeaderboard();
    const playerEntry = leaderboard.find(e => e.isPlayer);

    if (playerEntry) {
        // Track days at #1
        if (playerEntry.rank === 1) {
            gameState.stats.daysAtTop = (gameState.stats.daysAtTop || 0) + 1;
        }

        // Track position change
        const previousPosition = gameState.lastLeaderboardPosition || playerEntry.rank;
        playerEntry.change = previousPosition - playerEntry.rank; // Positive = moved up
        gameState.lastLeaderboardPosition = playerEntry.rank;
    }

    return leaderboard;
}

function updateLeaderboardUI() {
    const container = document.getElementById("leaderboard-list");
    if (!container) return;

    const leaderboard = getLeaderboard();
    container.innerHTML = "";

    leaderboard.forEach((entry, index) => {
        const div = document.createElement("div");
        div.className = `leaderboard-entry ${entry.isPlayer ? 'player-entry' : ''} ${index === 0 ? 'first-place' : ''}`;

        const rankEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${entry.rank}`;
        const changeIndicator = entry.change > 0 ? `<span class="rank-up">▲${entry.change}</span>` :
                               entry.change < 0 ? `<span class="rank-down">▼${Math.abs(entry.change)}</span>` : '';

        div.innerHTML = `
            <span class="lb-rank">${rankEmoji}</span>
            <span class="lb-emoji">${entry.emoji}</span>
            <span class="lb-name">${entry.name}${changeIndicator}</span>
            <span class="lb-worth">$${formatMoney(entry.netWorth)}</span>
        `;
        container.appendChild(div);
    });

    // Update prestige display
    const prestigeTitle = getPrestigeTitle();
    const prestigeTitleEl = document.getElementById("prestige-title");
    const prestigePointsEl = document.getElementById("prestige-points");

    if (prestigeTitleEl) {
        prestigeTitleEl.textContent = prestigeTitle;
    }
    if (prestigePointsEl) {
        prestigePointsEl.textContent = gameState.prestige || 0;
    }
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

    // Show achievement popup
    showAchievementPopup(achievement);

    // Log it
    log(`🏆 Achievement Unlocked: ${achievement.name}!`, "positive");

    // Bob comments
    fishermanSays(getAchievementComment(achievement.tier));

    // Play celebration effect
    createCelebrationEffect();
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
// WELCOME SCREEN
// ============================================
function startGame() {
    const welcomeScreen = document.getElementById("welcome-screen");
    welcomeScreen.style.opacity = "0";
    welcomeScreen.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
        welcomeScreen.classList.add("hidden");
    }, 500);

    // Add ambient seagulls
    addAmbientSeagulls();

    // Initialize weather effects
    updateWeatherEffects();

    // Show Bob's welcome message
    setTimeout(() => {
        fishermanSays("Welcome to the dock! I'm Old Barnacle Bob. Been fishin' these waters for 40 years. Let me show ya the ropes!");
    }, 800);
}

// ============================================
// EVENT HANDLERS
// ============================================
function initEventHandlers() {
    // Welcome screen
    document.getElementById("start-game-btn").addEventListener("click", startGame);

    document.getElementById("next-day-btn").addEventListener("click", nextDay);
    document.getElementById("restart-btn").addEventListener("click", resetGame);
    document.getElementById("shop-btn").addEventListener("click", openShop);
    document.getElementById("close-shop-btn").addEventListener("click", closeShop);
    document.getElementById("bank-btn").addEventListener("click", openBank);
    document.getElementById("close-bank-btn").addEventListener("click", closeBank);
    document.getElementById("stats-btn").addEventListener("click", openStats);
    document.getElementById("close-stats-btn").addEventListener("click", closeStats);
    document.getElementById("map-btn").addEventListener("click", openMap);
    document.getElementById("close-map-btn").addEventListener("click", closeMap);

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

    // Close modals on outside click
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    initEventHandlers();
    resetGame();
}

document.addEventListener("DOMContentLoaded", init);
