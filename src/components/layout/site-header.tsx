import Link from "next/link";
import type { Session } from "next-auth";

import { LogoutButton } from "@/components/auth/logout-button";

const primaryLinks = [
  { href: "/locations", label: "Locations" },
  { href: "/events", label: "Events" },
];

const authLinks = [
  { href: "/locations/new", label: "Add location" },
  { href: "/events/new", label: "Add event" },
];

type Props = {
  session: Session | null;
};

export function SiteHeader({ session }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="text-xl font-bold text-slate-900">
          fitfindr
          <span className="ml-2 text-sm font-normal text-brand">
            find your fitness
          </span>
        </Link>

        <div className="flex flex-1 flex-wrap items-center gap-3 sm:justify-end">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            {session &&
              authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full bg-slate-100 px-3 py-1 text-slate-900 hover:bg-slate-200"
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="hidden text-slate-900 hover:text-brand hover:underline sm:inline"
                >
                  Hi, {session.user.name ?? "friend"}
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-4 py-2 text-slate-600 hover:bg-slate-100"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
                >
                  Join free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
