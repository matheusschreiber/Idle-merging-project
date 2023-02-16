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

  let player_aircrafts:Number[] = []
  if (player.aircrafts) player.aircrafts.split(',').map((i:string)=>player_aircrafts.push(parseInt(i)))

  if (player_aircrafts.length === 6) {
    return res.status(403).json({error:'Player has reached maximum amount of aircrafts'})
  }

  await connection('aircrafts').insert(aircraftTemplate)

  const player_id_aircrafts = await connection('aircrafts').where('player_id',player_id).select('id')
  
  player_aircrafts = []
  let last_id:number = 0
  player_id_aircrafts.map((a)=>{
    player_aircrafts.push(a.id)
    last_id = a.id
  })

  await connection('players').where('id',player_id).update({aircrafts:String(player_aircrafts)})
  
  const aircraft:Aircraft = { 
    id:last_id,
    player_id:aircraftTemplate.player_id,
    level:aircraftTemplate.level,
    money_per_second:aircraftTemplate.money_per_second,
    bonus_multiplier:aircraftTemplate.bonus_multiplier,
  }
  
  return res.status(200).json(aircraft)
}
