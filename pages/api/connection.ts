import { NextApiResponse, NextApiRequest } from "next";
import { connectToDatabase } from "../../lib/database";
import cors from "./cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  await cors(req, res);
  const { database } = await connectToDatabase();
  const players = database.collection("players");
  const aircrafts = database.collection("aircrafts");

  try {
    let player_list = [];
    const cursorPlayer = players.find();
    await cursorPlayer.forEach((a: any) => {
      player_list.push(a);
    });

    let aircraft_list = [];
    const cursorAircraft = players.find();
    await cursorAircraft.forEach((a: any) => {
      aircraft_list.push(a);
    });

    if (player_list.length && aircraft_list.length) {
      return res.status(200).json(true);
    }
  } catch (err) {}

  return res.status(500).json(false);
}
