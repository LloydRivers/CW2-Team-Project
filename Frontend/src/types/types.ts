import type { Driver, FeaturedDriver } from "./drivers";
import type { SeasonData } from "./seasons";
import type { SessionData } from "./sessions";

export interface Team {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance: string | null;
  constructorsChampionships: number | null;
  driversChampionships: number | null;
  url: string;
}

export interface FeaturedTeam extends Team {}

export interface Highlight {
  title?: string;
  category?: string;
  date?: string;
  description?: string;
  video_url?: string;
}

export interface AppData {
  drivers: Driver[];
  featuredDrivers: FeaturedDriver | null;
  featuredTeams: FeaturedTeam | null;
  highlights: Highlight | null;
  teams: Team[];
  seasons: SeasonData | null;
  sessions: SessionData | null;
}
