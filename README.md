# CipherCollector App

https://ryanperera.github.io/ciphercollector/

## Progress

### `10/3/2023`

- Added script to insert icons into card skill descriptions
- Added OAuth sign in via google and github
- Fixed issue causing lag on 3D card animations
- Added various visual effects for different card rarities

### `10/9/2023`

- Implemented collections table, allowing authorized users to add cards to their collection
- Cards you don't own will now appear dull
- Switched from regular title text to tooltip components for better functionality
- Added pagination when searching
- Refactored search tools

### `10/12/2023`

- Overhaul of search functions, allowing for less strict searching by name, multi-select for other options

### `4/08/2026`

- Swapped to TypeScript
- Complete UI overhaul, implemented Tailwind CSS and ShadCN App-wide
- Fixes to pagination, using TanStack Query for fetching/caching now
- Images now lazy-load dynamically
- Can now cycle through cards in full-view, keyboard navigation also

### `4/09/2026`

- Added wishlist feature
- Can now specify amount of each card in collection
- Collection/wishlist filters in card search

## Future Updates

- [ ] Complete search functionality
- [ ] Visual overhaul of login/profile functions
- [ ] Mobile optimization\*\*
- [ ] Wishlist/Star feature
- [ ] Add tooltips for all attack icons
- [ ] Deck builder
- [ ] Scrape and implement quote text and illustrator data for cards
