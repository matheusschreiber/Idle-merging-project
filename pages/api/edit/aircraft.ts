import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'
import { Error } from "../../../types/Error.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft | Error>){
  const { id, player_id, level, money_per_second, bonus_multiplier } = req.body
  if (!id) {
    console.log('NO ID INFORMED')
    return res.status(404).json({error:'id not found'})
  }
  const found = await connection('aircrafts').where('id',id).select('*')

  if (!found) {
    res.status(404).json({error:'Aircraft not found'})
  }
  
  const aircraft = {id, player_id, level, money_per_second, bonus_multiplier}

  if (
    !aircraft.id || 
    !aircraft.player_id ||
    !aircraft.level ||
    !aircraft.money_per_second ||
    !aircraft.bonus_multiplier
    ) {
      res.status(403).json({error: 'Missing information'})
    }

  await connection('aircrafts').where('id',id).update(aircraft)

  res.status(200).json(aircraft)
}