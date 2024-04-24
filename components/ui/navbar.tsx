import Link from "next/link";
import { useRouter } from "next/router";
import { SessionData } from "@/lib/types";

function onLogoutClick() {
  document.cookie = `zelcore=; expires=${new Date(0).toISOString()}; path=/`;
  window.location.href = "/";
}

export const NavBar: React.FC<SessionData> = ({ session }) => {
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
              onClick={() => onLogoutClick()}
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
