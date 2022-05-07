import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'
import { Error } from "../../../types/Error.types";


export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft[] | Error>){
  const { player_id } = req.body
  
  let aircrafts:Aircraft[] = []

  if (!player_id) aircrafts = await connection('aircrafts').select('*')
  else {
    let [{aircrafts:player_aircrafts_string}] = await connection('players').where('id',player_id).select('aircrafts')
    player_aircrafts_string = player_aircrafts_string.split(',')

    await Promise.all(player_aircrafts_string.map(async(i:string)=>{
      const [ aircraft ] = await connection('aircrafts').where('id', parseInt(i))
      aircrafts.push(aircraft)
    }))
  }

  
  
  return res.status(200).json(aircrafts)
}