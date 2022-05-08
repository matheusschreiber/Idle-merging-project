import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
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

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  await cors(req,res)
  const { id, rank, aircrafts, wallet  } = req.body
  
  const [found] = await connection('players').where('id',id)
  
  if (!found) {
    return res.status(404).json({error:'Player not found'})
  }
  
  await connection('players').where('id',id).update({rank, aircrafts, wallet})

  return res.status(200).json({...found, rank, aircrafts, wallet})
}