import { supabase } from "@/helpers/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, message, signature } = req.body;
  if (!address || !message || !signature) {
    return res.status(400).json({ success: false, error: "Missing data." });
  }

  await supabase.from("loginWithZelcore").insert({
    address,
    message,
    signature,
  });

  return res.status(200).json({
    success: true,
    data: {
      address,
      message,
      signature,
    },
  });
}
