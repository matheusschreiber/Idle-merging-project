import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

type Data = {
  aircrafts: Object
}

export default async function handler(req:NextApiRequest, res:NextApiResponse<Data>){
  const aircrafts = await connection('aircrafts').select('*')
  res.status(200).json({aircrafts})
}