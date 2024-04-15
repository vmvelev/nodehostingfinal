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
  const { cookie } = req.body;
  if (!cookie) {
    return res.status(400).json({ success: false, error: "Missing data." });
  }

  await supabase.from("sessions").delete().eq("cookie", cookie);

  return res.status(200).json({
    success: true,
  });
}
