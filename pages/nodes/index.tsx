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

interface NodeData extends NodeSuccessResponse {
  availableString: string;
}

interface Props {
  nodesAvailable: { data: NodeSuccessResponse[] };
  session: Session;
}

const formatAvailability = (available: number): string => {
  if (available === 0) return "Out of stock";
  return `${available} node${available === 1 ? "" : "s"} available`;
};

const Nodes: React.FC<Props> = ({ nodesAvailable, session }) => {
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

  const router = useRouter();

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
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        {node.available > 0 ? (
                          <Button
                            onClick={() => {
                              router.push(`/order?node=${node.name}`);
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
  // Simplified data fetching and session handling
  const nodesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/getNodeInfo`
  );
  const nodesAvailable = await nodesResponse.json();
  const parsedCookies = cookie.parse(req.headers.cookie || "");

  if (!parsedCookies.zelcore) {
    return { props: { nodesAvailable } };
  }

  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/getSession?uuid=${parsedCookies.zelcore}`
  );
  const session = await sessionRes.json();

  if (DateTime.fromISO(session.data.expiresAt) < DateTime.now()) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("zelcore", "", { path: "/", expires: new Date(0) })
    );
    return { props: { nodesAvailable } };
  }

  return { props: { session, nodesAvailable } };
}
