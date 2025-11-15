"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import { ActionState } from "@/actions/types";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function registerAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const values = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return {
      success: false,
      message: "An account with that email already exists.",
    };
  }

  const passwordHash = await hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  revalidatePath("/");

  return {
    success: true,
    message: "Account created! You can log in now.",
  };
}
