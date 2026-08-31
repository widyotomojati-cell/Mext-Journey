"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { sendMagicLink, type LoginState } from "./actions";

const initialState: LoginState = { message: "", error: false };

export function LoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, initialState);

  return (
    <form action={action} className="login-form">
      <label htmlFor="email" className="login-label">
        Email utama lo
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="dio@email.com"
        className="login-input"
      />
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 w-full rounded-xl"
      >
        {pending ? "Mengirim..." : "Kirim magic link"}
      </Button>
      {state.message ? (
        <p
          className={
            state.error ? "login-message login-message--error" : "login-message"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
