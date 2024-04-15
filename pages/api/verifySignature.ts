import { NextApiRequest, NextApiResponse } from "next";

export type VerifyLoginResponse = {
  success: boolean;
  data?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyLoginResponse>
) {
  try {
    const { address, message, signature } = req.body;
    if (!address || !message || !signature) {
      return res.status(400).json({ success: false, error: "Missing data." });
    }

    const verifyRes = await fetch("https://api.runonflux.io/id/verifylogin", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        address,
        message,
        signature,
      }),
    });
    const response = await verifyRes.text();
    const verify = JSON.parse(response);
    if (verify.status === "success") {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}
