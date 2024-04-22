import { useEffect, useState } from "react";
import { LoginPhraseResponse } from "../api/getLoginPhrase";
import { NextRouter, useRouter } from "next/router";
import { v4 } from "uuid";
import { supabase } from "@/helpers/supabaseClient";
import { NavBar } from "@/components/ui/navbar";

async function getLoginPhrase(): Promise<string> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/getLoginPhrase`
  );
  const loginPhraseResponse: LoginPhraseResponse = await response.json();
  if (!loginPhraseResponse.data) {
    throw new Error("Unable to get a login phrase.");
  }
  return loginPhraseResponse.data;
}

async function handleClick(router: NextRouter, loginPhrase: string) {
  router.push(
    `zel:?action=sign&message=${loginPhrase}&icon=http%3A%2F%2Fzelid.io%2Fimg%2FzelID.svg&callback=${process.env.NEXT_PUBLIC_DOMAIN}/api/loginCallback`
  );
}

async function verifySignature(
  address: string,
  message: string,
  signature: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/verifySignature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        message,
        signature,
      }),
    }
  );
  const verifyRes = await response.json();
  if (!verifyRes.success) {
    throw new Error(verifyRes.error);
  }
  return verifyRes.success;
}

async function setSession(zelId: string, cookie: string, expiresAt: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/setSession`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zelId,
        cookie,
        expiresAt,
      }),
    }
  );
  const setSessionRes = await response.json();
  if (!setSessionRes.success) {
    throw new Error(setSessionRes.error);
  }
  return setSessionRes.data;
}

export default function Login() {
  const router = useRouter();
  const [loginPhrase, setLoginPhrase] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLoginPhrase().then((phrase) => {
      setLoginPhrase(phrase);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const res = supabase
      .channel("zelcore logins")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "loginWithZelcore",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new?.message === loginPhrase) {
              verifySignature(
                payload.new.address,
                payload.new.message,
                payload.new.signature
              )
                .then((response) => {
                  if (response) {
                    // Create a cookie with random uuid
                    const cookie = v4();
                    // Expire in 7 days
                    const expires = new Date();
                    expires.setDate(expires.getDate() + 7);
                    document.cookie = `zelcore=${cookie}; expires=${expires.toUTCString()}; path=/`;
                    // Set session in database
                    setSession(
                      payload.new.address,
                      cookie,
                      expires.toISOString()
                    );
                    // Redirect to home page
                    router.push("/");
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(res);
    };
  }, [loginPhrase, router]);

  if (loading) {
    return (
      <div className="w-full">
        <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
          <div className="flex flex-col min-h-[100vh]">
            <NavBar />
            <main className="flex-1">
              <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50"></section>
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
          <NavBar />
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 text-gray-50">
              <button
                onClick={() => handleClick(router, loginPhrase!)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Button
              </button>
              <h1>{loginPhrase}</h1>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
}
