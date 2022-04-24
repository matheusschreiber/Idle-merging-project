import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'

type AircraftList = Aircraft[]

export default async function handler(req:NextApiRequest, res:NextApiResponse<AircraftList>){
  const aircrafts = await connection('aircrafts').select('*')
  
  res.status(200).json(aircrafts)
}