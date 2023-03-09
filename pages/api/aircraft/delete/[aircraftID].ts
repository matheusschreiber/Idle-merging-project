import { ObjectId } from "mongodb";
import { NextApiResponse, NextApiRequest } from "next";
import { connectToDatabase } from "../../../../lib/database";

import { Aircraft } from "../../../../types/Aircraft.types";
import { Error } from "../../../../types/Error.types";

import cors from "../../cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Aircraft | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const aircrafts = database.collection("aircrafts");
  const id = req.query.aircraftID;

  const deleted = await aircrafts.findOneAndDelete({
    _id: new ObjectId(id as string),
  });

  if (deleted.value)
    return res.status(200).json({
      _id: id as string,
      player_id: deleted.value.player_id,
      level: deleted.value.level,
      money_per_second: deleted.value.money_per_second,
      bonus_multiplier: deleted.value.bonus_multiplier,
    });
  else
    return res.status(404).json({
      error: "Couldn't edit aircraft",
    });
}
