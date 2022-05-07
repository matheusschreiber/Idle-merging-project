import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'
import { Error } from "../../../types/Error.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft | Error>){
  const { id } = req.body

  const [ aircraft ] = await connection('aircrafts').where('id',id).select('*')

  if (!aircraft) {
    return res.status(404).json({error:'not found'})
  }

  const [ player ] = await connection('players').where('id', aircraft.player_id).select('*')

  let aircrafts:string[] = player.aircrafts.split(',')
  aircrafts.map((a,pos)=>{
    if (parseInt(a)===id) aircrafts.splice(pos,1);
  })

  await connection('players').where('id', aircraft.player_id).update({aircrafts:aircrafts.join()}) 

  await connection('aircrafts').where('id',id).del()

  return res.status(200).json(aircraft)
}