import { supabase } from "@/helpers/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";

export type GetFluxPriceResponse = {
  success: boolean;
  data?: number;
  error?: string;
};

const insertFluxPrice = async () => {
  try {
    const response = await fetch("https://explorer.runonflux.io/api/currency");
    const data = await response.json();
    await supabase.from("fluxPrice").upsert({
      id: 3,
      rate: data.data.rate,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to insert the FLUX price", error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetFluxPriceResponse>
) {
  try {
    const { data, error } = await supabase
      .from("fluxPrice")
      .select("*")
      .single();

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    const lastUpdatedAt = DateTime.fromISO(data.updatedAt);
    const now = DateTime.now();
    const fiveMinutesAgo = now.minus({ minutes: 5 });
    if (lastUpdatedAt < fiveMinutesAgo) {
      await insertFluxPrice();
      const { data: updatedData, error: updatedError } = await supabase
        .from("fluxPrice")
        .select()
        .single();

      if (updatedError) {
        throw new Error(updatedError.message);
      }

      res.status(200).json({ success: true, data: updatedData.rate });
    } else {
      res.status(200).json({ success: true, data: data.rate });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Unable to get the FLUX price" });
  }
}
