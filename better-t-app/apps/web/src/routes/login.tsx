import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex min-h-[calc(100svh-64px)] items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-gold uppercase mb-2">
            Nobel Laureate Archive
          </p>
          <h1 className="font-serif text-[28px] leading-[36px] text-foreground">
            {tab === "signin" ? "Welcome back" : "Create account"}
          </h1>
        </div>

        {/* タブ切り替え */}
        <div className="flex border-b border-border mb-6">
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === "signin"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === "signup"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* フォーム */}
        <div className="bg-card border border-border p-8">
          {tab === "signin" ? (
            <SignInForm onSwitchToSignUp={() => setTab("signup")} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setTab("signin")} />
          )}
        </div>
      </div>
    </div>
  );
}
