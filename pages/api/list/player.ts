import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'

type PlayerList = Player[]

import cors from '../cors'

export default async function handler(req:NextApiRequest, res:NextApiResponse<PlayerList>){
  await cors(req,res)
  const players = await connection('players').select('*')
  res.status(200).json(players)
}