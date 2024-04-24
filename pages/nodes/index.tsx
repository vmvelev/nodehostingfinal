import { NavBar } from "@/components/ui/navbar";
import { DateTime } from "luxon";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { SessionData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Nodes({ session }: SessionData) {
  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar session={session} />
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
              <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                <div className="container grid grid-cols-1 lg:grid-cols-3 items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                  <Card className="w-full min-w-64 bg-black bg-opacity-70">
                    <CardHeader className="text-center text-white">
                      <CardTitle className="lg:text-xl">Cumulus</CardTitle>
                    </CardHeader>
                    <CardContent className="text-white">
                      <div>
                        <div className="flex justify-between">
                          <p>Cores</p>
                          <p>4</p>
                        </div>
                        <div className="flex justify-between">
                          <p>RAM</p>
                          <p>8 GB</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Storage</p>
                          <p>220 GB</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Write speed</p>
                          <p>{">"}500 MB/s</p>
                        </div>
                        <div className="flex justify-between">
                          <p>EPS</p>
                          <p>{">"}700</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Bandwidth</p>
                          <p>{">"}500Mb</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button>Deploy</Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-full min-w-64 bg-black bg-opacity-70">
                    <CardHeader className="text-center text-white">
                      <CardTitle className="lg:text-xl">Nimbus</CardTitle>
                      <CardDescription className="text-white">
                        Out of stock
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-white">
                      <div>
                        <div className="flex justify-between">
                          <p>Cores</p>
                          <p>8</p>
                        </div>
                        <div className="flex justify-between">
                          <p>RAM</p>
                          <p>32 GB</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Storage</p>
                          <p>440 GB</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Write speed</p>
                          <p>{">"}500 MB/s</p>
                        </div>
                        <div className="flex justify-between">
                          <p>EPS</p>
                          <p>{">"}700</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Bandwidth</p>
                          <p>{">"}500Mb</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button>Deploy</Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-full min-w-64 bg-black bg-opacity-70">
                    <CardHeader className="text-center text-white">
                      <CardTitle className="lg:text-xl">Stratus</CardTitle>
                    </CardHeader>
                    <CardContent className="text-white">
                      <div>
                        <div className="flex justify-between">
                          <p>Cores</p>
                          <p>16</p>
                        </div>
                        <div className="flex justify-between">
                          <p>RAM</p>
                          <p>64 GB</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Storage</p>
                          <p>880 GB</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Write speed</p>
                          <p>{">"}500 MB/s</p>
                        </div>
                        <div className="flex justify-between">
                          <p>EPS</p>
                          <p>{">"}1520</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Bandwidth</p>
                          <p>{">"}500Mb</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button>Deploy</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </section>
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
