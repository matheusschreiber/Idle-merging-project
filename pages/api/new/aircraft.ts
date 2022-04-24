// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'

export default async function handler(req: NextApiRequest,res: NextApiResponse<Aircraft>) {
  const { player_id, level, money_per_second, bonus_multiplier } = req.body;
  const aircraftTemplate = {
    player_id,
    level,
    money_per_second,
    bonus_multiplier,
  }

  let [ player ] = await connection('players').where('id',player_id)
  
  if (!player) {
    res.status(404)
    throw Error('Player with id ' + player_id + ' not found')
  }

  const [ id ] = await connection('aircrafts').insert(aircraftTemplate)

  //inserir mecanismo para adicionar a aircraft na lista do player

  const aircraft:Aircraft = { 
    id,
    player_id:aircraftTemplate.player_id,
    level:aircraftTemplate.level,
    money_per_second:aircraftTemplate.money_per_second,
    bonus_multiplier:aircraftTemplate.bonus_multiplier,
  }
  
  res.status(200).json(aircraft)
}
