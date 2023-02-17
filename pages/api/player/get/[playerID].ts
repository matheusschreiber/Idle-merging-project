import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../../database/connection';

import { Player } from '../../../../types/Player.types';
import { Error } from "../../../../types/Error.types";

import cors from '../../cors'


export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  await cors(req, res)
  const playerID = req.query.playerID

  let player=null;
  
  if (playerID) [player] = await connection("players").where("id", playerID);
  
  if (!player) {
    return res
      .status(404)
      .json({ error: 'Player with id "' + playerID + '" not found' });
  }
  
  const aircrafts = await connection('aircrafts').select('*').where('player_id', player.id)
  player["aircrafts"] = [...aircrafts]
  return res.status(200).json(player)
}