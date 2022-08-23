import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../database/connection'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  const t = await connection('players').select('*')
  res.status(200).json({message:"lol", t})
}