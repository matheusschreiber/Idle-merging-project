import { ObjectId } from "mongodb";
import { NextApiResponse, NextApiRequest } from "next";
import { connectToDatabase } from "../../../lib/database";

import { Aircraft } from "../../../types/Aircraft.types";
import { Error } from "../../../types/Error.types";

import cors from "../cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Aircraft | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const aircrafts = database.collection("aircrafts");

  const { id, player_id, level, money_per_second, bonus_multiplier } = req.body;

  if (!id) {
    return res.status(404).json({ error: "id not informed" });
  }
  const found = await aircrafts.findOne({ _id: new ObjectId(id as string) });

  if (!found) {
    return res.status(404).json({ error: "Aircraft not found" });
  }

  const aircraft = { player_id, level, money_per_second, bonus_multiplier };

  if (
    !aircraft.player_id ||
    !aircraft.level ||
    !aircraft.money_per_second ||
    !aircraft.bonus_multiplier
  ) {
    return res.status(403).json({ error: "There are missing fields" });
  }

  const replaced = await aircrafts.findOneAndUpdate(
    { _id: new ObjectId(id as string) },
    {
      $set: {
        player_id: new ObjectId(aircraft.player_id as string),
        level: aircraft.level,
        money_per_second: aircraft.money_per_second,
        bonus_multiplier: aircraft.bonus_multiplier,
      },
    }
  );

  if (replaced.value)
    return res.status(200).json({
      _id: id as string,
      player_id: replaced.value.player_id,
      level: replaced.value.level,
      money_per_second: replaced.value.money_per_second,
      bonus_multiplier: replaced.value.bonus_multiplier,
    });
  else
    return res.status(404).json({
      error: "Couldn't edit aircraft",
    });
}
