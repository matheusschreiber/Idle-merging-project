import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
import { Error } from "../../../types/Error.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  const { id, name } = req.body

  let player;
  
  if (id) [ player ] = await connection('players').where('id',id)
  else if (name) [ player ] = await connection('players').where('name', name)
  
  if (!player) {
    res.status(404).json({error:'Player with id ' + id + ' not found'})
  }
  res.status(200).json(player)
}