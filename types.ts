
export enum ProgramType {
  DSAI = 'DSAI',
  NCS = 'NCS',
  IMES = 'IMES',
  DMT = 'DMT',
  GD = 'GD'
}

export interface Student {
  nama: string;
  nrp: string;
  email: string;
  program: ProgramType;
  aboutMe: string;
  myCourse: string;
  myExperiences: string;
  photoUrl: string;
}

export interface Friend {
  id: number;
  nrp: string;
}
