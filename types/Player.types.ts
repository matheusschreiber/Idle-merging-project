import { Aircraft } from "./Aircraft.types";

export type Player = {
  _id: string;
  name: string;
  password: string;
  rank: number;
  aircrafts: Aircraft[];
  wallet: number;
};
