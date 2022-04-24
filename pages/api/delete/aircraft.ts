import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'
import { Error } from "../../../types/Error.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft | Error>){
  const { id } = req.body
  
  const [ aircraft ] = await connection('aircrafts').where('id',id)
  
  if (!aircraft) {
    res.status(404).json({error:'Aircraft with id ' + id + ' not found'})
  }

  await connection('aircrafts').where('id',id).del()

  res.status(200).json(aircraft)
}