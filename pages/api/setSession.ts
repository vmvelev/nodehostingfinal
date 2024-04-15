import { supabase } from "@/helpers/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export type SetSessionResponse = {
  success: boolean;
  data?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SetSessionResponse>
) {
  const { zelId, cookie, expiresAt } = req.body;
  if (!zelId || !cookie || !expiresAt) {
    return res.status(400).json({ success: false, error: "Missing data." });
  }

  await supabase.from("sessions").insert({
    zelId,
    cookie,
    expiresAt,
  });

  return res.status(200).json({
    success: true,
    data: expiresAt,
  });
}
