import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
import { Error } from "../../../types/Error.types";

import cors from '../cors'

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  await cors(req,res)
  const { id } = req.body
  
  const [ player ] = await connection('players').where('id',id)
  
  if (!player) {
    return res.status(404).json({error:'Player with id ' + id + ' not found'})
  }

  await connection('players').where('id',id).del()

  return res.status(200).json(player)
}