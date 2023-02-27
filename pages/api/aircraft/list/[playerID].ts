import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../../database/connection'

import { Aircraft } from '../../../../types/Aircraft.types'
import { Error } from "../../../../types/Error.types";


import cors from '../../cors'

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft[] | Error>){
  await cors(req,res)
  const player_id = req.query.playerID;
  
  const aircrafts = await connection("aircrafts").where("player_id",player_id).select("*")
  
  return res.status(200).json(aircrafts)
}