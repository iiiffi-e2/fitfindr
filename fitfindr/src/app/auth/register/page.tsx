import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase text-slate-500">
          Join the community
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Create your fitfindr account
        </h1>
        <p className="text-sm text-slate-500">
          Save places you love, add new ones, and publish events.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        <RegisterForm />
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-brand">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
