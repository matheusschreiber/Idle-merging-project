// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../../database/connection'

export default async function handler(req: NextApiRequest,res: NextApiResponse<void>) {
  const { id } = req.body;

  const aircraft = await connection('aircrafts').where('id',id).select('id')
  
  if (!aircraft[0]) return res.status(404).json()
  
  await connection('aircrafts').where('id',aircraft[0].id).del()
  res.status(200).json()
}
