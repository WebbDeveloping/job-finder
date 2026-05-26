"use server";

import { AuthError } from "next-auth";
import {
  registerUser,
  signIn,
  validateAuthCredentials,
} from "@/lib/auth";

export type AuthActionState = {
  error?: string;
};

function getStringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function getCallbackUrl(formData: FormData): string {
  const value = formData.get("callbackUrl");
  if (typeof value !== "string" || value === "" || !value.startsWith("/")) {
    return "/dashboard";
  }
  return value;
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");

  const validationError = validateAuthCredentials(email, password);
  if (validationError) {
    return validationError;
  }

  const callbackUrl = getCallbackUrl(formData);

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return {};
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");
  const name = getStringField(formData, "name");

  const result = await registerUser(email, password, name);
  if ("error" in result) {
    return { error: result.error };
  }

  const callbackUrl = getCallbackUrl(formData);

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created but sign-in failed. Try logging in." };
    }
    throw error;
  }

  return {};
}

export async function signOutAction() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}
