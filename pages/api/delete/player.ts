import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player>){
  const { id } = req.body
  
  const [ player ] = await connection('players').where('id',id)
  
  if (!player) {
    res.status(404)
    throw Error('Player with id ' + id + ' not found')
  }

  await connection('players').where('id',id).del()

  // const player:Player = found[0]

  res.status(200).json(player)
}