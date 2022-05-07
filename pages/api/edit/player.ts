import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'
import crypto from 'crypto'

import { Player } from '../../../types/Player.types'
import { Error } from "../../../types/Error.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  const { id, name, password, rank, aircrafts, wallet  } = req.body
  
  const [found] = await connection('players').where('id',id)
  
  if (!found) {
    return res.status(404).json({error:'Player not found'})
  }
  
  const hash = crypto.createHash('sha256')
  hash.update(password)
  const player = {id, name, password: hash.digest('hex'), rank, aircrafts, wallet}

  await connection('players').where('id',id).update(player)

  return res.status(200).json(player)
}