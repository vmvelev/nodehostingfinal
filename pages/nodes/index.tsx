import { NavBar } from "@/components/ui/navbar";
import { DateTime } from "luxon";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NodeSuccessResponse } from "../api/getNodeInfo";
import { Session } from "@/lib/types";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";

interface NodeData extends NodeSuccessResponse {
  availableString: string;
  price: string;
}

interface Props {
  nodesAvailable: { data: NodeSuccessResponse[] };
  session: Session;
  fluxPrice: number;
  error?: string;
}

const formatAvailability = (available: number): string => {
  if (available === 0) return "Out of stock";
  return `${available} node${available === 1 ? "" : "s"} available`;
};

/**
 * Formats the price by multiplying it with the fluxPrice and rounding it to 2 decimal places.
 * If the price or fluxPrice is not a valid number, returns "N/A".
 *
 * @param price - The price to be formatted as a string.
 * @param fluxPrice - The fluxPrice to multiply with the price.
 * @returns The formatted price as a number or "N/A" if the price or fluxPrice is not a valid number.
 */
export const formatPrice = (
  price: string,
  fluxPrice: number
): number | string => {
  const priceFloat = parseFloat(price);
  const bigPrice = new BigNumber(priceFloat);
  const bigFluxPrice = new BigNumber(fluxPrice);
  if (bigPrice.isNaN() || bigFluxPrice.isNaN()) return "N/A";
  const bigTotal = bigPrice.times(bigFluxPrice);
  return bigTotal.decimalPlaces(2).toNumber();
};

const Nodes: React.FC<Props> = ({
  nodesAvailable,
  session,
  fluxPrice,
  error,
}) => {
  const router = useRouter();
  if (error) {
    return (
      <div>
        <div className="w-full">
          <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
            <div className="flex flex-col min-h-[100vh]">
              <NavBar session={session} />
              <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
                  <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                    <div className="container grid items-center justify-center px-4 md:px-6 lg:gap-10">
                      <p className="text-center text-xl">
                        There was an error loading the data
                      </p>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </section>
        </div>
      </div>
    );
  }
  const nodeData: Record<string, NodeData> = {
    cumulus: {
      id: 0,
      name: "",
      available: 0,
      cores: "",
      ram: "",
      storage: "",
      writeSpeed: "",
      eps: "",
      bandwidth: "",
      price: "",
      availableString: "Out of stock",
    },
    nimbus: {
      id: 0,
      name: "",
      available: 0,
      cores: "",
      ram: "",
      storage: "",
      writeSpeed: "",
      eps: "",
      bandwidth: "",
      price: "",
      availableString: "Out of stock",
    },
    stratus: {
      id: 0,
      name: "",
      available: 0,
      cores: "",
      ram: "",
      storage: "",
      writeSpeed: "",
      eps: "",
      bandwidth: "",
      price: "",
      availableString: "Out of stock",
    },
  };

  nodesAvailable.data.forEach((node) => {
    if (node.name in nodeData) {
      nodeData[node.name] = {
        ...node,
        availableString: formatAvailability(node.available),
      };
    }
  });

  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar session={session} />
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
              <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                <div className="container grid grid-cols-1 lg:grid-cols-3 items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                  {Object.values(nodeData).map((node) => (
                    <Card
                      key={node.name}
                      className="w-full min-w-64 bg-black bg-opacity-70"
                    >
                      <CardHeader className="text-center text-white">
                        <CardTitle className="lg:text-xl">
                          {node.name.charAt(0).toUpperCase() +
                            node.name.slice(1)}
                        </CardTitle>
                        <CardDescription className="text-white">
                          {node.availableString}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-white">
                        <div className="flex justify-between">
                          <p>Cores</p>
                          <p>{node.cores}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>RAM</p>
                          <p>{node.ram}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Storage</p>
                          <p>{node.storage}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Write speed</p>
                          <p>{node.writeSpeed}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>EPS</p>
                          <p>{node.eps}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Bandwidth</p>
                          <p>{node.bandwidth}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Price</p>
                          <p>{formatPrice(node.price, fluxPrice)} FLUX</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        {node.available > 0 ? (
                          <Button
                            onClick={() => {
                              const nodeType = node.name;
                              const price = formatPrice(node.price, fluxPrice);
                              router.push(`/order/${nodeType}/${price}`);
                            }}
                            variant="secondary"
                          >
                            Purchase
                          </Button>
                        ) : (
                          <Button variant="secondary" disabled>
                            Out of stock
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
};

export default Nodes;

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  try {
    // Parse cookies early to check for required cookie
    const cookies = cookie.parse(req.headers.cookie || "");
    const userUuid = cookies.zelcore;

    // Parallel fetching of nodes and flux price without caching
    const [nodesResponse, fluxPriceResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/getNodeInfo`, {
        headers: { "Cache-Control": "no-cache" },
      }),
      fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/getFluxPrice`, {
        headers: { "Cache-Control": "no-cache" },
      }),
    ]);

    if (!nodesResponse.ok || !fluxPriceResponse.ok) {
      return { props: { error: "Failed to load data" } };
    }
    // Process responses
    const nodesAvailable = await nodesResponse.json();
    const fluxPriceJson = await fluxPriceResponse.json();
    const fluxPrice = fluxPriceJson.data;

    // Early return if no user session cookie is present
    if (!userUuid) {
      return { props: { nodesAvailable, fluxPrice } };
    }

    // Fetch session details
    const sessionRes = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/getSession?uuid=${userUuid}`
    );
    const session = await sessionRes.json();

    // Check session validity and handle expired sessions
    if (DateTime.fromISO(session.data.expiresAt) < DateTime.now()) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("zelcore", "", { path: "/", expires: new Date(0) })
      );
      return { props: { nodesAvailable, fluxPrice } };
    }

    // Return all data if session is valid
    return { props: { session, nodesAvailable, fluxPrice } };
  } catch (error) {
    // Handle possible errors gracefully
    console.error("Failed to fetch API:", error);
    return { props: { error: "Failed to load data" } };
  }
}
