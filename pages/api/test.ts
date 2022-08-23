import { NextApiResponse,NextApiRequest } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  res.status(200).json({message:"lol"})
}