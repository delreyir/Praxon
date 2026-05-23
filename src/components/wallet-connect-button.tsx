"use client";

import { useState } from "react";
import { ChevronDown, Loader2, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/wallet-provider";
import { shortAddress } from "@/lib/utils";

export function WalletConnectButton() {
  const { active, accounts, isConnecting, connect, disconnect, setActive, error } =
    useWallet();
  const [open, setOpen] = useState(false);

  if (!active) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button onClick={connect} disabled={isConnecting} size="md">
          {isConnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          {isConnecting ? "Connecting…" : "Connect Wallet"}
        </Button>
        {error ? (
          <span className="text-xs text-[var(--destructive)] max-w-[260px] text-right">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="md"
        onClick={() => setOpen((v) => !v)}
        className="font-mono"
      >
        <Wallet className="h-4 w-4 text-[var(--primary)]" />
        {active.name ?? shortAddress(active.address)}
        <ChevronDown className="h-4 w-4 opacity-60" />
      </Button>
      {open ? (
        <div
          className="absolute right-0 top-full z-30 mt-2 w-[300px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="px-2 py-1.5 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
            Accounts
          </div>
          <div className="max-h-[260px] overflow-y-auto">
            {accounts.map((a) => (
              <button
                key={a.address}
                onClick={() => {
                  setActive(a.address);
                  setOpen(false);
                }}
                className={`flex w-full flex-col items-start rounded-md px-2 py-2 text-left hover:bg-[var(--muted)] ${
                  a.address === active.address ? "bg-[var(--muted)]" : ""
                }`}
              >
                <span className="text-sm font-medium">
                  {a.name ?? "Unnamed"}
                </span>
                <span className="font-mono text-xs text-[var(--muted-foreground)]">
                  {shortAddress(a.address)}
                </span>
                <span className="mt-0.5 text-[10px] uppercase text-[var(--muted-foreground)]">
                  {a.source}
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-[var(--border)] mt-1 pt-1">
            <button
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--destructive)] hover:bg-[var(--muted)]"
            >
              <LogOut className="h-4 w-4" /> Disconnect
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
