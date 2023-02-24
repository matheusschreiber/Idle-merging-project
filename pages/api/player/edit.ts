import { NextApiResponse,NextApiRequest } from "next";
import connection from '../../../database/connection'

import { Player } from '../../../types/Player.types'
import { Error } from "../../../types/Error.types";

import cors from '../cors'
import { Aircraft } from "../../../types/Aircraft.types";

export default async function handler(req:NextApiRequest, res:NextApiResponse<Player | Error>){
  await cors(req,res)
  const { id, rank, aircrafts, wallet  } = req.body
  
  const [player] = await connection('players').where('id',id)
  
  if (!player) {
    return res.status(404).json({error:'Player not player'})
  }

  let aircraftsToBeRegistered:Aircraft[] = []

  //updating player's aircrafts, if given
  if (aircrafts) {
    let registeredAircrafts = await connection("aircrafts")
      .where("player_id", id)
      .select("*");

    if (!registeredAircrafts.length) {
     aircraftsToBeRegistered=[...aircrafts] 
    }
    
    // updating existing aircrafts
    await Promise.all(
      registeredAircrafts.map(async (aircraftregistered) => {
        let discarted = true
        await Promise.all(
          aircrafts.map(async (aircraftunregistered: Aircraft) => {
            if (aircraftregistered.id == aircraftunregistered.id) {
              discarted=false
              await connection("aircrafts")
                .where("id", aircraftregistered.id)
                .update({
                  level: aircraftunregistered.level,
                  money_per_second: aircraftunregistered.money_per_second,
                  bonus_multiplier: aircraftunregistered.bonus_multiplier,
                });
            } else if (
              //here we check if its a valid aircraft, not registered and not queue to register yet, respectively
              aircraftunregistered.id > 0 &&
              aircraftunregistered.id.toString().includes(".") &&
              !aircraftsToBeRegistered.includes(aircraftunregistered)
            ) {
              //adding aircraft to be registered if it isn't yet
              aircraftsToBeRegistered.push(aircraftunregistered);
            }
          })
        );

        // if registered aircraft is no longer alive (suffered merging)
        if (discarted) await connection("aircrafts").where('id', aircraftregistered.id).del()
      })
    );

    registeredAircrafts = await connection("aircrafts")
      .where("player_id", id)
      .select("*");

    //creating all the new aircrafts
    await Promise.all(
      aircraftsToBeRegistered.map(async(aircraftunregistered: Aircraft) => {
        if (registeredAircrafts.length > 6)
          return res.status(403).json({
            error: "Player has reached maximum amount of aircrafts",
          });

        const aircraftTemplate = {
          player_id: player.id,
          level: aircraftunregistered.level,
          money_per_second: aircraftunregistered.money_per_second,
          bonus_multiplier: aircraftunregistered.bonus_multiplier,
        };

        await connection("aircrafts").insert(aircraftTemplate);
      })
    );
  }
  
  await connection('players').where('id',id).update({rank, wallet})
  return res.status(200).json({...player, rank, wallet})
}