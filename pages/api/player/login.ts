import { NextApiResponse, NextApiRequest } from "next";
import crypto from "crypto";
import { connectToDatabase } from "../../../lib/database";
import { Player } from "../../../types/Player.types";
import { Error } from "../../../types/Error.types";

import cors from "../cors";
import { Aircraft } from "../../../types/Aircraft.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");

  const { name, password } = req.body;

  let player = null;

  if (name) player = await players.findOne({ name });

  if (!player) {
    return res
      .status(404)
      .json({ error: 'Player with name "' + name + '" not found' });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (player.password == hashedPassword) {
    const aircrafts = database.collection("aircrafts");

    let player_aircrafts: Aircraft[] = [];

    const cursor = aircrafts.find({ player_id: player._id });
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
  } else return res.status(401).json({ error: "Name/password incorrect" });
}
