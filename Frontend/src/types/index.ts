export interface AppData {
  drivers: Driver[];
  teams: Team[];
  seasons: Season | null;
  highlights: Highlight[];
  sessions: SessionData | null;
  featuredDrivers: Driver[];
  featuredTeams: Team[];
}

export interface Driver {
  name?: string;
  full_name?: string;
  number?: number;
  team?: string;
  nationality?: string;
  points?: number;
  position?: number;
}

export interface Team {
  name?: string;
  team_name?: string;
  base?: string;
  headquarters?: string;
  points?: number;
  team_principal?: string;
  principal?: string;
  drivers?: string;
  position?: number;
}

export interface Season {
  status?: string;
  race_count?: number;
  // races?: number;
  current_round?: string;
  champion?: string;
  races?: Race[];
}

export interface Race {
  name?: string;
  circuit?: string;
  date?: string;
  country?: string;
  winner?: string;
}

export interface Highlight {
  title?: string;
  category?: string;
  date?: string;
  description?: string;
  video_url?: string;
}

export interface SessionResult {
  driver?: string;
  time?: string;
  lap_time?: string;
  gap?: string;
}

export interface FastestLap {
  driver?: string;
  time?: string;
  speed?: string;
}

export interface SessionData {
  type?: string;
  session_type?: string;
  circuit?: string;
  track?: string;
  date?: string;
  session_date?: string;
  weather?: string;
  track_temp?: string;
  results?: SessionResult[];
  fastest_lap?: FastestLap;
}
