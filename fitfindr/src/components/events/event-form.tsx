"use client";

import type { ReactNode } from "react";
import { EventType, type Location } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createEventAction } from "@/actions/event-actions";
import { defaultActionState } from "@/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  locations: Location[];
  defaultLocationId?: string;
};

export function EventForm({ locations, defaultLocationId }: Props) {
  const router = useRouter();
  const [state, action] = useActionState(createEventAction, defaultActionState);
  const errorFor = (field: string) => state.errors?.[field]?.[0];
  const resolvedLocationId =
    (defaultLocationId &&
      locations.find((location) => location.id === defaultLocationId)?.id) ||
    locations[0]?.id;

  // Redirect to the event page on success
  useEffect(() => {
    if (state.success && state.data?.id) {
      router.push(`/events/${state.data.id}`);
    }
  }, [state.success, state.data?.id, router]);

  return (
    <form
      action={action}
      className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <Field label="Title" error={errorFor("title")}>
        <Input name="title" placeholder="Sunrise Social Run" required />
      </Field>
      <Field label="Description" error={errorFor("description")}>
        <Textarea
          name="description"
          placeholder="What should people know before they show up?"
          rows={4}
          required
        />
      </Field>
      <Field label="Event type" error={errorFor("eventType")}>
        <Select name="eventType" defaultValue={EventType.CLASS} required>
          {Object.values(EventType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Location" error={errorFor("locationId")}>
        <Select name="locationId" required defaultValue={resolvedLocationId}>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} · {location.city}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date & time" error={errorFor("startDateTime")}>
          <Input name="startDateTime" type="datetime-local" required />
        </Field>
        <Field label="End date & time" error={errorFor("endDateTime")}>
          <Input name="endDateTime" type="datetime-local" />
        </Field>
      </div>
      <Field label="Recurring rule">
        <Input
          name="recurringRule"
          placeholder="Every Tuesday at 7pm"
          autoComplete="off"
        />
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
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      Publish event
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
