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
import { Button } from "@/components/ui/button";

export default function Nodes(props: any) {
  let availableCumulus = null;
  let availableNimbus = null;
  let availableStratus = null;
  props.nodesAvailable.data.forEach((node: any) => {
    if (node.name === "cumulus") {
      availableCumulus = node.available;
    } else if (node.name === "nimbus") {
      availableNimbus = node.available;
    } else if (node.name === "stratus") {
      availableStratus = node.available;
    }
  });
  if (availableCumulus === 0) {
    availableCumulus = "Out of stock";
  } else {
    if (availableCumulus === 1) {
      availableCumulus = `${availableCumulus} node available`;
    } else {
      availableCumulus = `${availableCumulus} nodes available`;
    }
  }
  if (availableNimbus === 0) {
    availableNimbus = "Out of stock";
  } else {
    if (availableNimbus === 1) {
      availableNimbus = `${availableNimbus} node available`;
    } else {
      availableNimbus = `${availableNimbus} nodes available`;
    }
  }
  if (availableStratus === 0) {
    availableStratus = "Out of stock";
  } else {
    if (availableStratus === 1) {
      availableStratus = `${availableStratus} node available`;
    } else {
      availableStratus = `${availableStratus} nodes available`;
    }
  }
  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar session={props.session} />
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
              <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                <div className="container grid grid-cols-1 lg:grid-cols-3 items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                  <Card className="w-full min-w-64 bg-black bg-opacity-70">
                    <CardHeader className="text-center text-white">
                      <CardTitle className="lg:text-xl">Cumulus</CardTitle>
                      <CardDescription className="text-white">
                        {availableCumulus}
                      </CardDescription>
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
                        {availableNimbus}
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
                      <CardDescription className="text-white">
                        {availableStratus}
                      </CardDescription>
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
  const nodesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/getNodeStock`
  );
  const nodesAvailable = await nodesResponse.json();
  const parsedCookies = cookie.parse(req.headers.cookie || "");
  if (!parsedCookies.zelcore) {
    return {
      props: {
        nodesAvailable,
      },
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
      props: {
        nodesAvailable,
      },
    };
  }
  return {
    props: { session, nodesAvailable },
  };
};
