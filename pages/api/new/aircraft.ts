// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'
import { Error } from "../../../types/Error.types";

//Importing cors middleware necessities
import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

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

  const [ id ] = await connection('aircrafts').insert(aircraftTemplate)
  
  player_aircrafts.push(id)
  await connection('players').where('id',player_id).update({aircrafts:String(player_aircrafts)})
  
  const aircraft:Aircraft = { 
    id,
    player_id:aircraftTemplate.player_id,
    level:aircraftTemplate.level,
    money_per_second:aircraftTemplate.money_per_second,
    bonus_multiplier:aircraftTemplate.bonus_multiplier,
  }
  
  return res.status(200).json(aircraft)
}
