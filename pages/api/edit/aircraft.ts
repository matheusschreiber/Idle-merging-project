import { NextApiResponse,NextApiRequest } from "next";
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

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft | Error>){
  await cors(req,res)
  const { id, player_id, level, money_per_second, bonus_multiplier } = req.body
  if (!id) {
    console.log('NO ID INFORMED')
    return res.status(404).json({error:'id not found'})
  }
  const found = await connection('aircrafts').where('id',id).select('*')

  if (!found) {
    return res.status(404).json({error:'Aircraft not found'})
  }
  
  const aircraft = {id, player_id, level, money_per_second, bonus_multiplier}

  if (
    !aircraft.id || 
    !aircraft.player_id ||
    !aircraft.level ||
    !aircraft.money_per_second ||
    !aircraft.bonus_multiplier
    ) {
      return res.status(403).json({error: 'Missing information'})
    }

  await connection('aircrafts').where('id',id).update(aircraft)

  return res.status(200).json(aircraft)
}