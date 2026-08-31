"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { PIN_LENGTH } from "@/features/auth/domain/pin";
import { type PinSetupState, updatePin } from "./actions";

const initialState: PinSetupState = {
  message: "",
  error: false,
  success: false,
};

export function PinSetupForm() {
  const [state, action, pending] = useActionState(updatePin, initialState);

  return (
    <form action={action} className="security-form">
      <div>
        <label htmlFor="pin" className="login-label">
          PIN baru
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          pattern="[0-9]*"
          minLength={PIN_LENGTH}
          maxLength={PIN_LENGTH}
          required
          placeholder="••••••"
          className="login-input pin-input mt-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="confirmation" className="login-label">
          Ulangi PIN
        </label>
        <input
          id="confirmation"
          name="confirmation"
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          pattern="[0-9]*"
          minLength={PIN_LENGTH}
          maxLength={PIN_LENGTH}
          required
          placeholder="••••••"
          className="login-input pin-input mt-2 w-full"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 w-full rounded-xl sm:w-auto"
      >
        {pending ? "Menyimpan..." : "Simpan PIN"}
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
  );
}
