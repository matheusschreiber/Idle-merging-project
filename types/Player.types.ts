import { Aircraft } from "./Aircraft.types"

export type Player = {
  id: number,
  name: string,
  password: string,
  rank: number,
  aircrafts: Aircraft[],
  wallet: number
}