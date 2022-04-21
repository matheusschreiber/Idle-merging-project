import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

type Data = {
  aircraft: Object
}

export default async function handler(req:NextApiRequest, res:NextApiResponse<Data>){
  const { id, level, money_per_second, bonus_multiplier } = req.body
  const aircraft = await connection('aircrafts').where('id',id)

  if (!aircraft) res.status(404).json({aircraft:'not found'})
  
  await connection('aircrafts').where('id',id).update({id,level,money_per_second,bonus_multiplier})
}