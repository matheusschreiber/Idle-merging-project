// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

import { Player } from "../../../types/Player.types";
import { Error } from "../../../types/Error.types";

import cors from "../cors";
import { connectToDatabase } from "../../../lib/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");

  const { name, password } = req.body;

  const playerfound = await players.findOne({ name });

  if (playerfound)
    return res.status(401).json({ error: "Name already in use" });

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const playerTemplate = {
    rank: 0,
    wallet: 10,
    name,
    password: hashedPassword,
  };

  await players.insertOne(playerTemplate);

  const player_created = await players.findOne({ name });

  if (player_created) {
    res.status(200).json({
      _id: player_created._id.toString(),
      name: player_created.name,
      wallet: player_created.wallet,
      password: player_created.password,
      rank: player_created.rank,
      aircrafts: [],
    });
  } else {
    res.status(404).json({
      error: "Player was not created",
    });
  }
}
