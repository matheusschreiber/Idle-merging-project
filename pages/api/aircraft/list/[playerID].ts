import { NextApiResponse, NextApiRequest } from "next";
import { connectToDatabase } from "../../../../lib/database";

import { Aircraft } from "../../../../types/Aircraft.types";
import { Error } from "../../../../types/Error.types";

import cors from "../../cors";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Aircraft[] | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");
  const aircrafts = database.collection("aircrafts");

  const player_id = req.query.playerID;

  let player_aircrafts: Aircraft[] = [];
  const cursor = aircrafts.find({
    player_id: new ObjectId(player_id as string),
  });
  await cursor.forEach((a: any) => {
    player_aircrafts.push(a);
  });

  return res.status(200).json(player_aircrafts);
}
