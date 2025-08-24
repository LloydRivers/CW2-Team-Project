// Types for F1 API responses
export interface Driver {
  name?: string;
  full_name?: string;
  number?: number;
  team?: string;
  nationality?: string;
  points?: number;
  position?: number;
}

export interface FeaturedDriver {
  driverId: string;
  name: string;
  surname: string;
  nationality: string;
  birthday: string;
  number: number | null;
  shortName: string | null;
  url: string;
  teamId: string;
}

export interface FeaturedTeam {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance: number | null;
  constructorsChampionships: number | null;
  driversChampionships: number | null;
  url: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance: string | null;
  constructorsChampionships: number | null;
  driversChampionships: number | null;
  url: string;
}

export interface Season {
  status?: string;
  race_count?: number;
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

interface SessionResult {
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

export interface AppData {
  drivers: Driver[];
  featuredDrivers: FeaturedDriver | null;
  featuredTeams: FeaturedTeam | null;
  highlights: Highlight | null;
  teams: Team[];
  seasons: Season | null;
  sessions: SessionData | null;
}
