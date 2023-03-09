import { NextApiResponse, NextApiRequest } from "next";
import { connectToDatabase } from "../../../lib/database";
import { Player } from "../../../types/Player.types";
import { Error } from "../../../types/Error.types";

type PlayerList = Player[];

import cors from "../cors";
import { Aircraft } from "../../../types/Aircraft.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlayerList | Error>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");
  const aircrafts = database.collection("aircrafts");
  try {
    let player_list: Player[] = [];

    const cursorPlayers = players.find();
    await cursorPlayers.forEach((a: any) => {
      player_list.push(a);
    });

    await Promise.all(
      player_list.map(async (player) => {
        let player_aircrafts: Aircraft[] = [];
        const cursorAircrafts = aircrafts.find({ player_id: player._id });
        await cursorAircrafts.forEach((a: any) => {
          player_aircrafts.push(a);
        });

        player["aircrafts"] = player_aircrafts;
      })
    );
    return res.status(200).json(player_list);
  } catch (err) {
    return res.status(404).json({ error: err as string });
  }
}
