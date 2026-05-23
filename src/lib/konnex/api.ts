/**
 * Konnex HTTP API client.
 * Source: https://docs.konnex.world/sdk/http
 */

import { KONNEX_CONFIG } from "./config";
import type { TaskSubmitPayload, TaskSubmitResponse } from "./types";

class KonnexApiError extends Error {
  constructor(
    public status: number,
    public path: string,
    message: string,
  ) {
    super(`Konnex API ${status} on ${path}: ${message}`);
    this.name = "KonnexApiError";
  }
}

async function call<TBody, TResp>(
  path: string,
  body: TBody,
  init?: RequestInit,
): Promise<TResp> {
  const url = `${KONNEX_CONFIG.api.base}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init?.headers,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new KonnexApiError(res.status, path, text || res.statusText);
  }

  return (await res.json()) as TResp;
}

export const konnexApi = {
  /**
   * Submit a task to a subnet.
   * Mirrors the documented `POST /api/v1/tasks` contract:
   *   { subnet, prompt, rewardStable, stakeStable, deadline }
   */
  submitTask(payload: TaskSubmitPayload, init?: RequestInit) {
    return call<TaskSubmitPayload, TaskSubmitResponse>(
      KONNEX_CONFIG.api.paths.submitTask,
      payload,
      init,
    );
  },

  /** Validators verify a PoPW bundle. (used on the verifier side, not sponsor) */
  verifyBundle(payload: { jobId: string; bundleUri: string }, init?: RequestInit) {
    return call<typeof payload, unknown>(
      KONNEX_CONFIG.api.paths.validatorVerify,
      payload,
      init,
    );
  },
};

export { KonnexApiError };
