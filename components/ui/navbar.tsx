import { NextApiRequest, NextApiResponse } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cookie from "cookie";
import { DateTime } from "luxon";

function onLogoutClick() {
  // Delete the session cookie
  document.cookie = `zelcore=; expires=${new Date(0).toUTCString()}; path=/`;
  // Redirect to the home page
  window.location.href = "/";
}

export const NavBar: React.FC = ({ session }: any) => {
  session = "test";
  const router = useRouter();
  const currentRoute = router.pathname;
  const activeClass =
    "text-gray-300 transition-colors hover:underline underline underline-offset-2";
  const inactiveClass =
    "text-gray-300 transition-colors hover:underline underline-offset-2";
  // Apply the active class to the current route
  const getActiveClass = (route: string) =>
    currentRoute === route ? activeClass : inactiveClass;
  return (
    <header className="sticky top-0 flex justify-center h-12 items-center gap-4 px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-bold md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 lg:text-md">
        <Link href="/" className={getActiveClass("/")}>
          Home
        </Link>
        <Link href="/nodes" className={getActiveClass("/nodes")}>
          Nodes
        </Link>
        <Link href="/about" className={getActiveClass("/about")}>
          About
        </Link>
        {session ? (
          <>
            <Link href="/dashboard" className={getActiveClass("/dashboard")}>
              Dashboard
            </Link>
            <Link
              className={getActiveClass("/logout")}
              href=""
              onClick={() => onLogoutClick}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link href="/login" className={getActiveClass("/login")}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

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
