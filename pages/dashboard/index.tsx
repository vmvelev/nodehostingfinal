import { NavBar } from "@/components/ui/navbar";
import { DateTime } from "luxon";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionData } from "@/lib/types";

export default function Nodes({ session }: SessionData) {
  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar session={session} />
          <main className="flex-1"></main>
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
    res.setHeader("Location", "/");
    res.statusCode = 302;
    res.end();
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
