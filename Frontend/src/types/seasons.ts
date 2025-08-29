export interface SeasonData {
  championship: Championship;
  races: Race[];
}

export interface Championship {
  championshipId: string;
  championshipName: string;
  url: string;
  year: number;
}

export interface Race {
  raceId: string;
  championshipId: string;
  raceName: string;
  schedule: Schedule;
  laps: number;
  round: number;
  url: string;
  fast_lap: FastLap;
  circuit: Circuit;
  winner?: Winner;
  teamWinner?: TeamWinner;
}

export interface Schedule {
  race: Race2;
  qualy: Qualy;
  fp1: Fp1;
  fp2: Fp2;
  fp3: Fp3;
  sprintQualy: SprintQualy;
  sprintRace: SprintRace;
}

export interface Race2 {
  date: string;
  time: string;
}

export interface Qualy {
  date: string;
  time: string;
}

export interface Fp1 {
  date: string;
  time: string;
}

export interface Fp2 {
  date?: string;
  time?: string;
}

export interface Fp3 {
  date?: string;
  time?: string;
}

export interface SprintQualy {
  date?: string;
  time?: string;
}

export interface SprintRace {
  date?: string;
  time?: string;
}

export interface FastLap {
  fast_lap?: string;
  fast_lap_driver_id?: string;
  fast_lap_team_id?: string;
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  country: string;
  city: string;
  circuitLength: string;
  lapRecord: string;
  firstParticipationYear: number;
  corners: number;
  fastestLapDriverId: string;
  fastestLapTeamId: string;
  fastestLapYear: number;
  url: string;
}

export interface Winner {
  driverId: string;
  name: string;
  surname: string;
  country: string;
  birthday: string;
  number: number;
  shortName: string;
  url: string;
}

export interface TeamWinner {
  teamId: string;
  teamName: string;
  country: string;
  firstAppearance: number;
  constructorsChampionships: number;
  driversChampionships: number;
  url: string;
}
