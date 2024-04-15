import { NextRouter, useRouter } from "next/router";
import { LoginPhraseResponse } from "./api/getLoginPhrase";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

async function handleClick(router: NextRouter) {
  const response = await fetch("/api/getLoginPhrase");
  const loginPhraseResponse: LoginPhraseResponse = await response.json();
  const loginPhrase = loginPhraseResponse.data;
  router.push(
    `zel:?action=sign&message=${loginPhrase}&icon=http%3A%2F%2Fzelid.io%2Fimg%2FzelID.svg&callback=${process.env.NEXT_PUBLIC_DOMAIN}/api/loginCallback`
  );
}

export default function Home({ session }: any) {
  const router = useRouter();
  if (session) {
    return <div>Logged in!</div>;
  }
  return (
    <button
      onClick={() => handleClick(router)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Button
    </button>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const parsedCookies = cookie.parse(req.headers.cookie || "");
  if (!parsedCookies.zelcore) {
    return {
      props: {},
    };
  }
  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/getSession?uuid=${parsedCookies.zelcore}`
  );

  const session = await sessionRes.json();
  console.log(session);
  return {
    props: { session },
  };
};
