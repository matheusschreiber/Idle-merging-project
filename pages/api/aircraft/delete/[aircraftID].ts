import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../../database/connection'

import { Aircraft } from '../../../../types/Aircraft.types'
import { Error } from "../../../../types/Error.types";

import cors from '../../cors'

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft | Error>){
  await cors(req,res)
  const id = req.query.aircraftID

  const [ aircraft ] = await connection('aircrafts').where('id',id).select('*')

  if (!aircraft) {
    return res.status(404).json({error:'not found'})
  }

  await connection('aircrafts').where('id',id).del()

  return res.status(200).json(aircraft)
}