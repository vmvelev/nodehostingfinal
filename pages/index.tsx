import { NextRouter, useRouter } from "next/router";
import { LoginPhraseResponse } from "./api/getLoginPhrase";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { SessionData } from "@/lib/types";

async function handleClick(router: NextRouter) {
  const response = await fetch("/api/getLoginPhrase");
  const loginPhraseResponse: LoginPhraseResponse = await response.json();
  const loginPhrase = loginPhraseResponse.data;
  router.push(
    `zel:?action=sign&message=${loginPhrase}&icon=http%3A%2F%2Fzelid.io%2Fimg%2FzelID.svg&callback=${process.env.NEXT_PUBLIC_DOMAIN}/api/loginCallback`
  );
}

export default function Home({ session }: SessionData) {
  const router = useRouter();
  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar session={session} />
          <main className="flex-1">
            <div className="container grid gap-10 py-20 md:py-32 lg:py-40">
              <div className="grid space-y-6 place-content-center items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                  DeNodeHost
                </h1>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">
                  Your node hosting solution with privacy in mind.
                </h2>
                <p className="text-lg md:text-xl text-gray-200 text-center">
                  Host your node without sharing any personal information.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href={"/nodes"}>
                    <Button variant="secondary">Get Started</Button>
                  </Link>
                  <Link href={"/about"}>
                    <Button variant="secondary">Learn More</Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
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
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/getSession?uuid=${parsedCookies.zelcore}`,
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );

  const session = await sessionRes.json();
  if (DateTime.fromISO(session.data.expiresAt) < DateTime.now()) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("zelcore", "", {
        path: "/",
        expires: new Date(0), // Set to a past date to delete the cookie
      })
    );
    await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/deleteSession`, {
      method: "POST",
      body: JSON.stringify({ cookie: parsedCookies.zelcore }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      props: {},
    };
  }
  return {
    props: { session },
  };
};
