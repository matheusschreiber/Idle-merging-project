// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../../database/connection'

type Data = {
  aircraft: Object
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
  const { level, money_per_second, bonus_multiplier, owner } = req.body;
  const aircraft = {
    level,
    money_per_second,
    bonus_multiplier,
    owner
  }

  await connection('aircrafts').insert(aircraft)
  res.status(200).json(req.body)
}
