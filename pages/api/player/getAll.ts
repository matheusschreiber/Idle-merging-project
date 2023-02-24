import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
import { Error } from '../../../types/Error.types'

type PlayerList = Player[]

import cors from '../cors'

export default async function handler(req:NextApiRequest, res:NextApiResponse<PlayerList | Error>){
  await cors(req,res)
  try{
    let players = await connection('players').select('*')
    await Promise.all(
      players.map(async(player)=>{
        const aircrafts = await connection('aircrafts').select('*').where('player_id', player.id)
        player["aircrafts"] = [...aircrafts]
      })
    )
    return res.status(200).json(players)
  } catch(err){
    return res.status(404).json({error: (err as string)})
  }
}