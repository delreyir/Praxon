"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface WalletAccount {
  address: string;
  name?: string;
  source: string; // "subwallet-js" | "polkadot-js" | "talisman" | ...
}

interface WalletState {
  isReady: boolean;       // dapp library imported
  isConnecting: boolean;
  accounts: WalletAccount[];
  active: WalletAccount | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setActive: (address: string) => void;
}

const WalletContext = createContext<WalletState | null>(null);

const APP_NAME = "Praxon";
const ACTIVE_KEY = "praxon:active-address";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [active, setActiveState] = useState<WalletAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isReady = typeof window !== "undefined";

  const connect = useCallback(async () => {
    if (typeof window === "undefined") return;
    setIsConnecting(true);
    setError(null);
    try {
      const { web3Enable, web3Accounts } = await import(
        "@polkadot/extension-dapp"
      );
      const extensions = await web3Enable(APP_NAME);
      if (extensions.length === 0) {
        throw new Error(
          "No Polkadot wallet found. Please install SubWallet or Talisman, then reload.",
        );
      }
      const found = await web3Accounts();
      const mapped: WalletAccount[] = found.map((a) => ({
        address: a.address,
        name: a.meta.name,
        source: a.meta.source,
      }));
      setAccounts(mapped);

      const stored =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(ACTIVE_KEY)
          : null;
      const next =
        mapped.find((a) => a.address === stored) ?? mapped[0] ?? null;
      setActiveState(next);
      if (next && typeof localStorage !== "undefined") {
        localStorage.setItem(ACTIVE_KEY, next.address);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
      setAccounts([]);
      setActiveState(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccounts([]);
    setActiveState(null);
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }, []);

  const setActive = useCallback(
    (address: string) => {
      const next = accounts.find((a) => a.address === address) ?? null;
      setActiveState(next);
      if (next && typeof localStorage !== "undefined") {
        localStorage.setItem(ACTIVE_KEY, next.address);
      }
    },
    [accounts],
  );

  // Auto-reconnect if we previously connected (active address present)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(ACTIVE_KEY);
    if (stored) {
      void connect();
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<WalletState>(
    () => ({
      isReady,
      isConnecting,
      accounts,
      active,
      error,
      connect,
      disconnect,
      setActive,
    }),
    [isReady, isConnecting, accounts, active, error, connect, disconnect, setActive],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
}
