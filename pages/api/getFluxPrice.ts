import { NextApiRequest, NextApiResponse } from "next";

export type GetFluxPriceResponse = {
  success: boolean;
  data?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetFluxPriceResponse>
) {
  try {
    const response = await fetch("https://explorer.runonflux.io/api/currency", {
      headers: { "Cache-Control": "no-cache" },
    });
    const data = await response.json();
    console.log(data);
    res.status(200).json({ success: true, data: data.data.rate });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Unable to get the FLUX price" });
  }
}
