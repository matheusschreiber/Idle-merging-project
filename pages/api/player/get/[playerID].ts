import { NextApiResponse, NextApiRequest } from "next";
import { connectToDatabase } from "../../../../lib/database";
import { Player } from "../../../../types/Player.types";
import { Error } from "../../../../types/Error.types";

import cors from "../../cors";
import { Aircraft } from "../../../../types/Aircraft.types";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");
  const aircrafts = database.collection("aircrafts");
  const playerID = req.query.playerID;

  let player = null;

  if (playerID)
    player = await players.findOne({ _id: new ObjectId(playerID as string) });

  if (!player) {
    return res
      .status(404)
      .json({ error: "Player with id '" + playerID + "' not found" });
  }

  let player_aircrafts: Aircraft[] = [];
  const cursor = aircrafts.find({
    player_id: new ObjectId(playerID as string),
  });
  await cursor.forEach((a: any) => {
    player_aircrafts.push(a);
  });

  return res.status(200).json({
    _id: player._id.toString(),
    name: player.name,
    wallet: player.wallet,
    password: player.password,
    rank: player.rank,
    aircrafts: player_aircrafts,
  });
}
