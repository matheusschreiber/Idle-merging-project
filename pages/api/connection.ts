import { NextApiResponse, NextApiRequest } from "next";
import connection from "../../database/connection";

import cors from "./cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  await cors(req, res);
  
  try {
    
    const aircrafts = await connection("aircrafts").select('*');
    const players = await connection("players").select("*");
  
    if (aircrafts && players) {
      return res.status(200).json(true);
    }
  } catch (err) {}

  return res.status(500).json(false);
}
