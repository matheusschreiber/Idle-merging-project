import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Aircraft } from '../../../types/Aircraft.types'

export default async function handler(req:NextApiRequest, res:NextApiResponse<Aircraft>){
  const { id } = req.body
  
  const [ aircraft ] = await connection('aircrafts').where('id',id)
  
  if (!aircraft) {
    res.status(404)
    throw Error('Aircraft with id ' + id + ' not found')
  }

  await connection('aircrafts').where('id',id).del()

  res.status(200).json(aircraft)
}