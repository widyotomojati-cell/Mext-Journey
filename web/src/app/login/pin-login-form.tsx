"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { PIN_LENGTH } from "@/features/auth/domain/pin";
import { signInWithPin, type LoginState } from "./actions";

const initialState: LoginState = { message: "", error: false };

export function PinLoginForm() {
  const [state, action, pending] = useActionState(signInWithPin, initialState);

  return (
    <>
      <form action={action} className="login-form">
        <label htmlFor="pin" className="login-label">
          PIN Dio
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          pattern="[0-9]*"
          minLength={PIN_LENGTH}
          maxLength={PIN_LENGTH}
          required
          autoFocus
          placeholder="••••••"
          className="login-input pin-input"
          aria-describedby="pin-help"
        />
        <p id="pin-help" className="login-help">
          Enam angka yang sama di seluruh device.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 w-full rounded-xl"
        >
          {pending ? "Memeriksa..." : "Masuk"}
        </Button>
        {state.message ? (
          <p
            className={
              state.error
                ? "login-message login-message--error"
                : "login-message"
            }
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </form>
      <Link href="/login?mode=email" className="login-switch">
        Lupa PIN? Pulihkan lewat email
      </Link>
    </>
  );
}
