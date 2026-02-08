# Maine Lobster Dealer Tycoon

Browser-based tycoon game built with vanilla JavaScript, HTML5, and CSS. No frameworks, no build system.

## What the game is
A 30-day summer challenge where you start with $5,000 on the Stonington fish pier and try to build a lobster dealing empire. Buy from boats, sell to buyers, travel between Maine coastal towns, manage freshness/spoilage risk, build reputation.

## Tech stack
- Single-page app: `index.html`, `css/style.css`, `js/main.js`
- No dependencies, no bundler — just open index.html
- Google Analytics (G-T964PW0X9P) for tracking
- Hosted at lobstertycoon.com

## Key game mechanics
- **Buying:** Lobster boats arrive at dock with timed offers (dory, lobster boat, trawler)
- **Grades:** Selects (2+ lb), Quarters (1.25-2 lb), Chix (1-1.25 lb), Run (ungraded)
- **Selling:** Restaurants, tourists, wholesalers with different preferences
- **Travel:** 6 Maine ports (Stonington, Rockland, Camden, Belfast, Bar Harbor, Portland) — buy low in fishing villages, sell high in tourist towns
- **Weather:** Sunny, cloudy, rainy, stormy, foggy — affects boat arrivals and prices
- **Freshness:** Lobsters degrade over time, spoilage risk increases with inventory size
- **Reputation:** 5 tiers from "Dock Nobody" to "Lobster Legend" — unlocks ports and buyers
- **Equipment:** Shop items (delivery van, tank upgrades, grading table, ice machine, etc.)
- **Bank:** Loans with weekly interest

## Running locally
Open `index.html` in a browser. That's it.
