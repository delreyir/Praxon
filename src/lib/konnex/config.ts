/**
 * Konnex network configuration.
 * Source: https://docs.konnex.world/participate/wallet
 */

export const KONNEX_CONFIG = {
  network: {
    name: "Konnex Testnet",
    chainId: "konnex-testnet",
    rpcWs: "wss://testnet-rpc1.konnex.world:39944",
    explorer: "https://subnets.testnet.konnex.world/explorer",
    faucet: "https://subnets.testnet.konnex.world/faucet",
    quest: "https://subnets.testnet.konnex.world/quest",
  },
  /**
   * Konnex HTTP API base URL.
   * Per docs (https://docs.konnex.world/sdk/http) the SDK exposes:
   *   POST /api/v1/tasks
   *   POST /api/v1/miners/models
   *   POST /api/v1/validators/verify
   *
   * The exact public host is published with testnet release notes.
   * Override at runtime via NEXT_PUBLIC_KONNEX_API_BASE.
   */
  api: {
    base:
      process.env.NEXT_PUBLIC_KONNEX_API_BASE ??
      "https://api.testnet.konnex.world",
    paths: {
      submitTask: "/api/v1/tasks",
      registerMinerModel: "/api/v1/miners/models",
      validatorVerify: "/api/v1/validators/verify",
    },
  },
  /**
   * Token / unit conventions.
   * testKNX uses Substrate-style decimals; treat as 12 by default unless the
   * chain metadata reports otherwise (Polkadot.js will surface this at runtime).
   */
  token: {
    symbol: "testKNX",
    decimals: 12,
  },
  /**
   * Platform sponsor wallet — aggregates pool contributions from sponsors and
   * submits tasks on their behalf via the Konnex HTTP API.
   * Set via NEXT_PUBLIC_PLATFORM_SPONSOR_ADDRESS (SS58 / Substrate address).
   */
  platformWallet: process.env.NEXT_PUBLIC_PLATFORM_SPONSOR_ADDRESS ?? "",
} as const;

export type KonnexConfig = typeof KONNEX_CONFIG;
