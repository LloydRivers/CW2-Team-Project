export interface SessionData {
  sessionType: string;
  round: number;
  date: string;
  time: string;
  url: string;
  raceId: string;
  raceName: string;
  circuit: Circuit;
  results: Result[];
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  country: string;
  city: string;
  circuitLength: string;
  corners: number;
  firstParticipationYear: number;
  lapRecord: string;
  fastestLapDriverId: string;
  fastestLapTeamId: string;
  fastestLapYear: number;
  url: string;
}

export interface Result {
  position: any;
  points: number;
  grid: any;
  time: string;
  fastLap: string;
  retired: any;
  driver: Driver;
  team: Team;
}

export interface Driver {
  driverId: string;
  number: number;
  shortName: string;
  url: string;
  name: string;
  surname: string;
  nationality: string;
  birthday: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  nationality: string;
  firstAppareance: number;
  constructorsChampionships?: number;
  driversChampionships?: number;
  url: string;
}
