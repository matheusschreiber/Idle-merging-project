import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection';
import crypto from "crypto";

import { Player } from '../../../types/Player.types';
import { Error } from "../../../types/Error.types";

import cors from '../cors'


export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  await cors(req, res)
  const { name, password } = req.body

  let player=null;
  
  if (name) [ player ] = await connection('players').where('name', name)
  
  if (!player) {
    return res.status(404).json({error:'Player with name "' + name + '" not found'})
  }
  
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  if (player.password == hashedPassword){
    const aircrafts = await connection('aircrafts').select('*').where('player_id', player.id)
    player["aircrafts"] = [...aircrafts]
    return res.status(200).json(player)
  } else return res.status(401).json({error:'Name/password incorrect'})
}