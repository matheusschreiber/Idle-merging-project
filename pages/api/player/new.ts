// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../../database/connection'
import crypto from 'crypto'

import { Player } from '../../../types/Player.types'
import { Error } from "../../../types/Error.types";

import cors from '../cors'

export default async function handler(req: NextApiRequest,res: NextApiResponse<Player | Error>) {
  await cors(req,res)
  const { name, password } = req.body;

  const playerfound = await connection('players').where('name', name)
  
  if (playerfound.length!=0) return res.status(401).json({error:'Name already in use'})
  
  const hashedPassword = crypto.createHash('sha256').update(password).digest("hex") 
  
  const playerTemplate = {
    rank:0,
    wallet:10,
    name,
    password: hashedPassword
  }

  await connection('players').insert(playerTemplate);
  
  const player_created = await connection('players').where('name',name).select('*');

  res.status(200).json(player_created[0])
}
