# 📡 OpenF1 API Endpoints

This document summarizes the key API endpoints provided by **OpenF1**, an open-source service offering both historical and real-time Formula 1 data.

## 🏎️ Available Endpoints

### `/car_data`
- **Use case:** Real-time telemetry (speed, throttle, brake, RPM)
- **Query filters:** `driver_number`, `session_key`, `speed>=`, etc.
- **Example:** `GET https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed>=315`

### `/drivers`
- **Use case:** Driver metadata (name, team, country, headshots)
- **Filters available:** `driver_number`, `meeting_key`, `session_key`, etc.

### `/intervals`
- **Use case:** Session interval data (time gaps by lap)

### `/laps`
- **Use case:** Detailed lap times
- **Sample call:** `GET https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8`

### `/location`
- **Use case:** Positional coordinates of drivers during sessions (x, y, z data)

### `/meetings`
- **Use case:** Race weekend metadata
- **Important note:** Can be used to infer seasons and sessions gaps, recommended mechanism to enumerate available seasons

### `/pit`
- **Use case:** Pit stop data per session

### `/position`
- **Use case:** Positional ranking throughout sessions

### `/race_control`
- **Use case:** Race control messages and events

### `/sessions`
- **Use case:** Session information (FP1, Quali, Race) filtered by `year`, `session_key`, etc.

### `/session_result` *(beta)*
- **Use case:** Results summary per session, if available

### `/starting_grid` *(beta)*
- **Use case:** Grid position data per session

### `/stints`
- **Use case:** Segment breakdown of stints for each driver

### `/team_radio`
- **Use case:** Radio communications during races

### `/weather`
- **Use case:** Weather telemetry per lap or session frame

## 🔧 Authentication & Real-Time Access

- **Historical endpoints:** Usually accessible without credentials
- **Real-time endpoints:** Require an OAuth2 token via `POST https://api.openf1.org/token`
- Support for WebSocket or MQTT streaming for live data (push-style)

## 🎯 User Story Mapping

### **SCRUM-26: View driver and race data**
**Jira:** https://lloydrivers50.atlassian.net/browse/SCRUM-26

**Primary Endpoints:**
- `/drivers` - Core driver metadata (names, numbers, teams, headshots)
- `/meetings` - Race weekend information and metadata
- `/sessions` - Session details (FP1, FP2, FP3, Quali, Race)

**Supporting Endpoints:**
- `/session_result` - Final race results and standings
- `/starting_grid` - Grid positions for race sessions

### **SCRUM-27: Filter and search F1 data**
**Jira:** https://lloydrivers50.atlassian.net/browse/SCRUM-27

**Primary Endpoints:**
- `/drivers` - Filter by `driver_number`, `meeting_key`, `session_key`
- `/sessions` - Filter by `year`, `session_type`, `meeting_key`
- `/meetings` - Filter by year, location, circuit
- `/laps` - Filter by `driver_number`, `session_key`, `lap_number`

**Advanced Filtering:**
- `/car_data` - Complex telemetry filtering (speed, throttle, etc.)
- `/position` - Filter by position ranges and session segments
- `/weather` - Filter by weather conditions and time ranges

### **SCRUM-31: Dashboard data**
**Jira:** https://lloydrivers50.atlassian.net/browse/SCRUM-31

**Real-time Dashboard:**
- `/car_data` - Live telemetry for speed, throttle, brake, RPM
- `/position` - Current race positions and live updates
- `/intervals` - Gap times between drivers
- `/location` - Track position coordinates (x, y, z)

**Analytics Dashboard:**
- `/laps` - Lap time comparisons and analysis
- `/stints` - Tire strategy and stint performance
- `/pit` - Pit stop data and strategy analysis
- `/weather` - Weather impact on performance

**Communication Dashboard:**
- `/team_radio` - Radio communications during sessions
- `/race_control` - Official race control messages and flags

## 🧠 Quick Reference Table

| User Story | Primary Endpoints | Use Case |
|------------|------------------|----------|
| **View driver and race data** | `/drivers`, `/meetings`, `/sessions` | Basic data display and navigation |
| **Filter and search F1 data** | `/drivers`, `/sessions`, `/meetings`, `/laps` | Search functionality and data filtering |
| **Dashboard data** | `/car_data`, `/position`, `/intervals`, `/location` | Real-time updates and analytics |

## ✅ Express API Development Guide

**For SCRUM-26 (View Data):**
- Create GET routes that fetch from `/drivers`, `/meetings`, `/sessions`
- Implement basic CRUD operations for viewing race weekends and driver info

**For SCRUM-27 (Search/Filter):**
- Build query parameter handling for all major endpoints
- Implement search logic that combines multiple endpoint filters
- Add pagination for large result sets

**For SCRUM-31 (Dashboard):**
- Set up WebSocket connections for real-time `/car_data` and `/position`
- Create aggregated endpoints that combine multiple OpenF1 sources
- Implement caching for performance-critical dashboard queries