export interface Driver {
  driverId: string;
  name: string;
  surname: string;
  nationality: string;
  birthday: string;
  number: number | null;
  shortName: string | null;
  url: string;
}

export interface FeaturedDriver extends Driver {
  teamId: string;
}
