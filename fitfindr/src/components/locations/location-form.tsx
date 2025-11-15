"use client";

import type { ReactNode } from "react";
import { LocationCategory } from "@prisma/client";
import { useFormState, useFormStatus } from "react-dom";

import { createLocationAction } from "@/actions/location-actions";
import { defaultActionState } from "@/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  categories: LocationCategory[];
};

export function LocationForm({ categories }: Props) {
  const [state, action] = useFormState(
    createLocationAction,
    defaultActionState,
  );
  const errorFor = (field: string) => state.errors?.[field]?.[0];

  return (
    <form
      action={action}
      className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4">
        <Field label="Name" error={errorFor("name")}>
          <Input name="name" placeholder="FitFoundry Studio" required />
        </Field>
        <Field label="Description" error={errorFor("description")}>
          <Textarea
            name="description"
            placeholder="Tell people what makes this place special..."
            rows={4}
            required
          />
        </Field>
        <Field label="Category" error={errorFor("category")}>
          <Select name="category" required defaultValue={categories[0]}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replaceAll("_", " ")}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Address line 1" error={errorFor("addressLine1")}>
          <Input name="addressLine1" placeholder="123 Fitness Ave" required />
        </Field>
        <Field label="Address line 2">
          <Input name="addressLine2" placeholder="Suite 200" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" error={errorFor("city")}>
            <Input name="city" placeholder="Austin" required />
          </Field>
          <Field label="State" error={errorFor("state")}>
            <Input name="state" placeholder="TX" required />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Postal code" error={errorFor("postalCode")}>
            <Input name="postalCode" placeholder="78701" required />
          </Field>
          <Field label="Country" error={errorFor("country")}>
            <Input name="country" placeholder="USA" required />
          </Field>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitude" error={errorFor("latitude")}>
          <Input name="latitude" placeholder="30.2711" />
        </Field>
        <Field label="Longitude" error={errorFor("longitude")}>
          <Input name="longitude" placeholder="-97.7437" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Website" error={errorFor("websiteUrl")}>
          <Input name="websiteUrl" placeholder="https://fitfoundry.com" />
        </Field>
        <Field label="Phone" error={errorFor("phone")}>
          <Input name="phone" placeholder="(555) 555-5555" />
        </Field>
      </div>

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
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      Publish location
    </Button>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
    </label>
  );
}
