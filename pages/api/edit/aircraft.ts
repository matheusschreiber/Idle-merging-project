import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'
import { Error } from "../../../types/Error.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft | Error>){
  const { id, player_id, level, money_per_second, bonus_multiplier } = req.body
  
  const found = await connection('aircrafts').where('id',id)
  
  if (!found) {
    res.status(404).json({error:'Aircraft not found'})
  }
  
  const aircraft = {id, player_id, level, money_per_second, bonus_multiplier}

  await connection('aircrafts').where('id',id).update(aircraft)

  res.status(200).json(aircraft)
}