import { NextApiResponse, NextApiRequest } from "next";
import { connectToDatabase } from "../../../../lib/database";

import { Player } from "../../../../types/Player.types";
import { Error } from "../../../../types/Error.types";

import cors from "../../cors";
import { ObjectId } from "mongodb";
import { Aircraft } from "../../../../types/Aircraft.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");
  const aircrafts = database.collection("aircrafts");
  const id = req.query.playerID;

  let player = null;

  if (id) player = await players.findOne({ _id: new ObjectId(id as string) });

  if (!player) {
    return res
      .status(404)
      .json({ error: "Player with id '" + id + "' not found" });
  }

  let player_aircrafts: Aircraft[] = [];
  const cursor = aircrafts.find({ player_id: new ObjectId(id as string) });
  await cursor.forEach((a: any) => {
    player_aircrafts.push(a);
  });

  player.aircrafts = [...player_aircrafts];

  await Promise.all(
    player_aircrafts.map(async (aircraft: Aircraft) => {
      await aircrafts.findOneAndDelete({ _id: new ObjectId(aircraft._id) });
    })
  );

  await players.findOneAndDelete({ _id: new ObjectId(id as string) });

  return res.status(200).json({
    _id: player._id.toString(),
    name: player.name,
    wallet: player.wallet,
    password: player.password,
    rank: player.rank,
    aircrafts: player.aircrafts,
  });
}
