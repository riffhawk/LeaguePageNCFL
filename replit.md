# LeaguePageNCFL

## Overview
A fantasy football league page for the National Chivos Fantasy Football League (NCFL), built with SvelteKit and Vite.

## Project Structure
- `src/` - SvelteKit application source code
- `static/` - Static assets (images, PWA icons, CSS)
- `vite.config.js` - Vite configuration (port 5000, allows all hosts)
- `svelte.config.js` - SvelteKit configuration (using node adapter)

## Tech Stack
- **Framework**: SvelteKit 2.x
- **Build Tool**: Vite 6.x
- **UI Components**: SMUI (Svelte Material UI)
- **Node.js**: v20+

## Running the Application
The app runs on port 5000 in development mode using `npm run dev`.

## Deployment
Uses the Node adapter for production builds. Build command: `npm run build`

## Sleeper API Routes

**League IDs:**
- 2024 League: `1082055802648637440`
- 2025 League: `1201635512016699392`

**Endpoints:**
| Endpoint | Description |
|----------|-------------|
| `https://api.sleeper.app/v1/league/{league_id}` | Get league info |
| `https://api.sleeper.app/v1/league/{league_id}/users` | Get league users |
| `https://api.sleeper.app/v1/league/{league_id}/rosters` | Get league rosters |
| `https://api.sleeper.app/v1/league/{league_id}/winners_bracket` | Get championship playoff bracket |
| `https://api.sleeper.app/v1/league/{league_id}/loses_bracket` | Get toilet bowl bracket |
| `https://api.sleeper.app/v1/league/{league_id}/matchups/{week}` | Get matchups for a specific week |
| `https://api.sleeper.app/v1/players/nfl` | Get all NFL players |

## Recent Changes
- 2026-01-28: Added historical roster display fix for Rafa and Aris (fetches 2024 rosters from correct league)
- 2026-01-26: Initial Replit setup - configured for port 5000, enabled all hosts for proxy support
