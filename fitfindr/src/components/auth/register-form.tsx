"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { registerAction } from "@/actions/auth-actions";
import { defaultActionState } from "@/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const [state, action] = useFormState(registerAction, defaultActionState);
  const errorFor = (field: string) => state.errors?.[field]?.[0];

  return (
    <form
      action={action}
      className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <Field label="Name" error={errorFor("name")}>
        <Input name="name" placeholder="Jordan Sparks" required />
      </Field>
      <Field label="Email" error={errorFor("email")}>
        <Input name="email" type="email" placeholder="you@email.com" required />
      </Field>
      <Field label="Password" error={errorFor("password")}>
        <Input name="password" type="password" placeholder="••••••••" required />
      </Field>

      {state.message && (
        <p
          className={
            state.success
              ? "text-sm font-semibold text-brand"
              : "text-sm font-semibold text-rose-600"
          }
        >
          {state.message}
        </p>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-brand">
          Log in
        </Link>
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      Create account
    </Button>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="space-y-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
    </label>
  );
}
