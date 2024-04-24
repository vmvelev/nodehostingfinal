import { supabase } from "@/helpers/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export type GetnodesStockResponse = {
  success: boolean;
  data?: {
    id: number;
    name: string;
    available: number;
  }[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetnodesStockResponse>
) {
  await supabase
    .from("nodesAvailable")
    .select("*")
    .then((response) => {
      if (response.error) {
        res.status(500).json({ success: false, error: response.error.message });
      } else {
        const nodesData = response.data;
        res.status(200).json({ success: true, data: response.data });
      }
    });
}
