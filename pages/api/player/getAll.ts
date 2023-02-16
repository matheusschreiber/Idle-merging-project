import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
import { Error } from '../../../types/Error.types'

type PlayerList = Player[]

import cors from '../cors'

export default async function handler(req:NextApiRequest, res:NextApiResponse<PlayerList | Error>){
  await cors(req,res)
  try{
    const players = await connection('players').select('*')
    res.status(200).json(players)
  } catch(err){
    res.status(404).json({error: (err as string)})
  }
}