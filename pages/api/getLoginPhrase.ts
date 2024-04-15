import type { NextApiRequest, NextApiResponse } from "next";

export type LoginPhraseResponse = {
  success: boolean;
  data?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginPhraseResponse>
) {
  const phraseRes = await fetch("https://api.runonflux.io/id/loginphrase");
  const phrase = await phraseRes.json();
  if (phrase.status === "success") {
    return res.status(200).json({ success: true, data: phrase.data });
  }
  return res
    .status(500)
    .json({ success: false, error: "Unable to get a login phrase." });
}
