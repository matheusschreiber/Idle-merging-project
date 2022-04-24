import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
import { Error } from "../../../types/Error.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  const { id } = req.body
  
  const [ player ] = await connection('players').where('id',id)
  
  if (!player) {
    res.status(404).json({error:'Player with id ' + id + ' not found'})
  }
  res.status(200).json(player)
}