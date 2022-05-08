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
  const { id } = req.body

  const [ aircraft ] = await connection('aircrafts').where('id',id).select('*')

  if (!aircraft) {
    return res.status(404).json({error:'not found'})
  }

  const [ player ] = await connection('players').where('id', aircraft.player_id).select('*')

  let aircrafts:string[] = player.aircrafts.split(',')
  aircrafts.map((a,pos)=>{
    if (parseInt(a)===id) aircrafts.splice(pos,1);
  })

  await connection('players').where('id', aircraft.player_id).update({aircrafts:aircrafts.join()}) 

  await connection('aircrafts').where('id',id).del()

  return res.status(200).json(aircraft)
}