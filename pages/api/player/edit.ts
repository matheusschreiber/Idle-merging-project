import { NextApiResponse, NextApiRequest } from "next";

import { connectToDatabase } from "../../../lib/database";

import { Player } from "../../../types/Player.types";
import { Error } from "../../../types/Error.types";

import cors from "../cors";
import { Aircraft } from "../../../types/Aircraft.types";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");
  const aircraftsCollection = database.collection("aircrafts");

  const { id, rank, aircrafts, wallet } = req.body;

  const player = await players.findOne({ _id: new ObjectId(id as string) });

  if (!player) {
    return res.status(404).json({ error: "Player not player" });
  }

  //updating player's aircrafts, if given
  if (aircrafts) {
    let aircraftsToBeRegistered: Aircraft[] = [];
    let registeredAircrafts: Aircraft[] = [];
    const cursorAircraftsBefore = aircraftsCollection.find({
      player_id: player._id,
    });
    await cursorAircraftsBefore.forEach((a: any) => {
      registeredAircrafts.push(a);
    });

    if (!registeredAircrafts.length) {
      aircraftsToBeRegistered = [...aircrafts];
    }

    // updating existing aircrafts
    await Promise.all(
      registeredAircrafts.map(async (aircraftregistered) => {
        let discarted = true;
        await Promise.all(
          aircrafts.map(async (aircraftunregistered: Aircraft) => {
            if (aircraftregistered._id == aircraftunregistered._id) {
              discarted = false;
              await aircraftsCollection.findOneAndUpdate(
                { _id: new ObjectId(aircraftregistered._id as string) },
                {
                  $set: {
                    level: aircraftunregistered.level,
                    money_per_second: aircraftunregistered.money_per_second,
                    bonus_multiplier: aircraftunregistered.bonus_multiplier,
                  },
                }
              );
            } else if (
              //here we check if its a valid aircraft, not registered and not queue to register yet, respectively
              typeof aircraftunregistered._id == "string" &&
              aircraftunregistered._id.toString().includes("toRegister") &&
              !aircraftsToBeRegistered.includes(aircraftunregistered)
            ) {
              //adding aircraft to be registered if it isn't yet
              aircraftsToBeRegistered.push(aircraftunregistered);
            }
          })
        );

        // if registered aircraft is no longer alive (suffered merging)
        if (discarted)
          await aircraftsCollection.findOneAndDelete({
            _id: new ObjectId(aircraftregistered._id as string),
          });
      })
    );

    registeredAircrafts = [];
    const cursorAircraftsAfter = aircraftsCollection.find({
      player_id: player._id,
    });
    await cursorAircraftsAfter.forEach((a: any) => {
      registeredAircrafts.push(a);
    });

    //creating all the new aircrafts
    await Promise.all(
      aircraftsToBeRegistered.map(async (aircraftunregistered: Aircraft) => {
        if (registeredAircrafts.length > 6)
          return res.status(403).json({
            error: "Player has reached maximum amount of aircrafts",
          });

        const aircraftTemplate = {
          player_id: new ObjectId(player._id),
          level: aircraftunregistered.level,
          money_per_second: aircraftunregistered.money_per_second,
          bonus_multiplier: aircraftunregistered.bonus_multiplier,
        };

        await aircraftsCollection.insertOne(aircraftTemplate);

        registeredAircrafts.push(aircraftunregistered);
      })
    );
  }

  const replaced = await players.findOneAndUpdate(
    { _id: new ObjectId(id as string) },
    {
      $set: {
        rank,
        wallet,
      },
    }
  );

  let finalAircrafts: Aircraft[] = [];
  const cursorAircrafts = aircraftsCollection.find({
    player_id: player._id,
  });
  await cursorAircrafts.forEach((a: any) => {
    finalAircrafts.push(a);
  });

  if (replaced.value) {
    return res.status(200).json({
      _id: replaced.value._id.toString(),
      name: replaced.value.name,
      wallet: replaced.value.wallet,
      password: replaced.value.password,
      rank: replaced.value.rank,
      aircrafts: finalAircrafts,
    });
  } else {
    return res.status(404).json({
      error: "Couldn't edit player",
    });
  }
}
