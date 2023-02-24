// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'
import { Error } from "../../../types/Error.types";

import cors from '../cors'

export default async function handler(req: NextApiRequest,res: NextApiResponse<Aircraft | Error>) {
  await cors(req,res)
  const { player_id, level, money_per_second, bonus_multiplier } = req.body;
  const aircraftTemplate = {
    player_id,
    level,
    money_per_second,
    bonus_multiplier,
  }

  let [ player ] = await connection('players').where('id',player_id)
  
  if (!player) {
    return res.status(404).json({error:'Player with id ' + player_id + ' not found'})
  }

  const player_aircrafts = await connection("aircrafts")
    .where("player_id", player_id)
    .select("*");

  if (player_aircrafts.length >= 6) {
    return res.status(403).json({error:'Player has reached maximum amount of aircrafts'})
  }

  const new_aircraft_id = await connection('aircrafts').insert(aircraftTemplate)
  
  return res.status(200).json({
    id: new_aircraft_id[0],
    ...aircraftTemplate,
  });
}
