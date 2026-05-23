/**
 * Konnex chain client (Polkadot.js / Substrate WSS).
 * Lazy singleton so we connect once per browser tab.
 */

import { ApiPromise, WsProvider } from "@polkadot/api";
import { KONNEX_CONFIG } from "./config";

let apiPromise: Promise<ApiPromise> | null = null;

export async function getKonnexApi(): Promise<ApiPromise> {
  if (apiPromise) return apiPromise;

  apiPromise = (async () => {
    const provider = new WsProvider(KONNEX_CONFIG.network.rpcWs);
    const api = await ApiPromise.create({ provider, throwOnConnect: false });
    await api.isReady;
    return api;
  })();

  return apiPromise;
}

export async function disconnectKonnexApi(): Promise<void> {
  if (!apiPromise) return;
  try {
    const api = await apiPromise;
    await api.disconnect();
  } finally {
    apiPromise = null;
  }
}

/**
 * Fetch raw chain state useful for landing-page stats.
 * Returns null fields if the chain rejects the call (gracefully degrade).
 */
export async function getChainSnapshot() {
  try {
    const api = await getKonnexApi();
    const [chain, nodeName, nodeVersion, header] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      api.rpc.chain.getHeader(),
    ]);
    return {
      chain: chain.toString(),
      nodeName: nodeName.toString(),
      nodeVersion: nodeVersion.toString(),
      blockNumber: header.number.toNumber(),
      blockHash: header.hash.toHex(),
    };
  } catch (err) {
    return {
      chain: KONNEX_CONFIG.network.name,
      nodeName: null,
      nodeVersion: null,
      blockNumber: null,
      blockHash: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Format a Substrate balance with decimals from chain metadata. */
export async function formatBalance(planck: bigint | string): Promise<string> {
  const api = await getKonnexApi();
  const decimals = api.registry.chainDecimals[0] ?? KONNEX_CONFIG.token.decimals;
  const symbol = api.registry.chainTokens[0] ?? KONNEX_CONFIG.token.symbol;
  const big = typeof planck === "string" ? BigInt(planck) : planck;
  const divisor = 10n ** BigInt(decimals);
  const whole = big / divisor;
  const frac = big % divisor;
  const fracStr = frac
    .toString()
    .padStart(decimals, "0")
    .slice(0, 4)
    .replace(/0+$/, "");
  return `${whole}${fracStr ? `.${fracStr}` : ""} ${symbol}`;
}
