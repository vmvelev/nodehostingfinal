import { NavBar } from "@/components/ui/navbar";
import { Session } from "@/lib/types";
import { DateTime } from "luxon";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { NodeSuccessResponse } from "@/pages/api/getNodeInfo";
import { useRouter } from "next/router";
import { formatPrice } from "@/pages/nodes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

const checkForMismatchInPrice = (
  fluxNodePriceFromRouter: string,
  nodePriceFromDb: string,
  fluxPriceFromDb: number
) => {
  const actualPrice = formatPrice(nodePriceFromDb.toString(), fluxPriceFromDb);
  const expectedPrice = parseFloat(fluxNodePriceFromRouter);
  return actualPrice !== expectedPrice;
};

const Order: React.FC<Props> = ({
  nodesAvailable,
  session,
  fluxPrice,
  error,
}) => {
  const router = useRouter();
  const { node, price } = router.query;
  const nodeData = nodesAvailable.data.find(
    (nodeData) => nodeData.name === node
  ) as NodeData;

  if (error) {
    console.log(error);
    return (
      <div className="w-full">
        <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
          <div className="flex flex-col min-h-[100vh]">
            <NavBar session={session} />
            <main className="flex-1">
              <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
                <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                  <p className="text-center text-xl">
                    There was an error loading the data
                  </p>
                </div>
              </section>
            </main>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar session={session} />
          <div className="w-1/3 justify-center flex flex-col items-center mx-auto">
            {checkForMismatchInPrice(
              price as string,
              nodeData.price,
              fluxPrice
            ) && (
              <Alert className="text-center">
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  There was a price change for this node. Please proceed only if
                  you are okay with it.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
              <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10"></div>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
};

export default Order;

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

    // Parallel fetching of nodes and flux price
    const [nodesResponse, fluxPriceResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/getNodeInfo`),
      fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/getFluxPrice`),
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
