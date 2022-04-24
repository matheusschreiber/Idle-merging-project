import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'
import crypto from 'crypto'

import { Player } from '../../../types/Player.types'

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player>){
  const { id, name, password, rank, aircrafts, wallet  } = req.body
  
  const [found] = await connection('players').where('id',id)
  
  if (!found) {
    res.status(404)
    throw Error('Player not found')
  }
  
  const hash = crypto.createHash('sha256')
  hash.update(password)
  const player = {id, name, password: hash.digest('hex'), rank, aircrafts, wallet}

  await connection('players').where('id',id).update(player)

  res.status(200).json(player)
}