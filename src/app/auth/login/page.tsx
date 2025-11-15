import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase text-slate-500">Welcome</p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Log in to fitfindr
        </h1>
        <p className="text-sm text-slate-500">
          Track favorite spots, add events, and join the community.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-slate-500">
          No account yet?{" "}
          <Link href="/auth/register" className="font-semibold text-brand">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
