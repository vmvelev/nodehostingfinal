import { supabase } from "@/helpers/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export type GetSessionResponse = {
  success: boolean;
  data?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetSessionResponse>
) {
  const uuid = req.query.uuid as string;
  await supabase
    .from("sessions")
    .select("*")
    .eq("cookie", uuid)
    .then((response) => {
      if (response.error) {
        return res
          .status(500)
          .json({ success: false, error: response.error.message });
      }
      return res.status(200).json({ success: true, data: response.data[0] });
    });
}
