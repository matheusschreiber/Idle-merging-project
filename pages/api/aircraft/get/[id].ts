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
  const id = req.query.id;

  const aircraft = await aircrafts.findOne({ _id: new ObjectId(id as string) });

  if (!aircraft) {
    return res
      .status(404)
      .json({ error: "Aircraft with id '" + id + "' not found" });
  }

  return res.status(200).json({
    _id: id as string,
    player_id: aircraft.player_id,
    level: aircraft.level,
    money_per_second: aircraft.money_per_second,
    bonus_multiplier: aircraft.bonus_multiplier,
  });
}
