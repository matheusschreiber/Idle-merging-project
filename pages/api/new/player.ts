// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../../database/connection'
import crypto from 'crypto'

import { Player } from '../../../types/Player.types'

//Importing cors middleware necessities
import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async function handler(req: NextApiRequest,res: NextApiResponse<Player>) {
  await cors(req,res)
  const { name, password } = req.body;
  
  const hash = crypto.createHash('sha256');
  hash.update(password)   
  
  const playerTemplate = {
    rank:0,
    wallet:10,
    aircrafts:'',
    name,
    password: hash.digest("hex")
  }

  const [ id ] = await connection('players').insert(playerTemplate)
  
  const player:Player = {
    id,
    rank:playerTemplate.rank,
    wallet:playerTemplate.wallet,
    aircrafts:playerTemplate.aircrafts,
    name:playerTemplate.name,
    password:playerTemplate.password,
  }

  res.status(200).json(player)
}
