import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
import { Error } from "../../../types/Error.types";

import cors from '../cors'
import { Aircraft } from "../../../types/Aircraft.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  await cors(req,res)
  const { id, rank, aircrafts, wallet  } = req.body
  
  const [found] = await connection('players').where('id',id)
  
  if (!found) {
    return res.status(404).json({error:'Player not found'})
  }

  //updating player's aircrafts, if given
  if (aircrafts) {
    const registeredAircrafts = await connection("aircrafts")
      .where("player_id", id)
      .select("*");
    await Promise.all(
      registeredAircrafts.map(async (aircraftregistered) => {
        let discarted = true
        
        await Promise.all(
          aircrafts.map(async (aircraftunregistered: Aircraft) => {
            // if aircraft exists, then just update it
            if (aircraftregistered.id == aircraftunregistered.id) {
              discarted=false
              await connection("aircrafts")
                .where("id", aircraftregistered.id)
                .update({
                  level: aircraftunregistered.level,
                  money_per_second: aircraftunregistered.money_per_second,
                  bonus_multiplier: aircraftunregistered.bonus_multiplier,
                });

            // if it doesn't, then create one with the given specs
            } else {
              if (found.aircrafts.length > 6)
                return res
                  .status(403)
                  .json({
                    error: "Player has reached maximum amount of aircrafts",
                  });

              const aircraftTemplate = {
                player_id: found.id,
                level: aircraftunregistered.level,
                money_per_second: aircraftunregistered.money_per_second,
                bonus_multiplier: aircraftunregistered.bonus_multiplier,
              };

              await connection("aircrafts").insert(aircraftTemplate);
            }
          })
        );

        // if registered aircraft is no longer alive (suffered merging)
        if (discarted) await connection("aircrafts").where('id', aircraftregistered.id).del()
      })
    );
  }
  
  await connection('players').where('id',id).update({rank, wallet})
  return res.status(200).json({...found, rank, wallet})
}