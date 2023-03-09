// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Aircraft } from "../../../types/Aircraft.types";
import { Error } from "../../../types/Error.types";
import { connectToDatabase } from "../../../lib/database";
import cors from "../cors";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Aircraft | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");
  const aircrafts = database.collection("aircrafts");

  const { player_id, level, money_per_second, bonus_multiplier } = req.body;

  let player = await players.findOne({
    _id: new ObjectId(player_id as string),
  });

  if (!player) {
    return res
      .status(404)
      .json({ error: "Player with id '" + player_id + "' not found" });
  }

  let player_aircrafts = [];
  const cursor = aircrafts.find({ player_id: new ObjectId(player._id) });
  await cursor.forEach((a: any) => {
    player_aircrafts.push(a);
  });

  if (player_aircrafts.length >= 6) {
    return res
      .status(403)
      .json({ error: "Player has reached maximum amount of aircrafts" });
  }

  const aircraftTemplate = {
    player_id: new ObjectId(player._id),
    level,
    money_per_second,
    bonus_multiplier,
  };

  const { insertedId } = await aircrafts.insertOne(aircraftTemplate);

  return res.status(200).json({
    _id: insertedId.toString(),
    player_id: player._id.toString(),
    level: aircraftTemplate.level,
    money_per_second: aircraftTemplate.money_per_second,
    bonus_multiplier: aircraftTemplate.bonus_multiplier,
  });
}
