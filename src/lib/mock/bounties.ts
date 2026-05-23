/**
 * Mock bounties for local development & visual QA.
 * Replace with Supabase queries once DB is provisioned.
 */

import type { Bounty, BountyContribution } from "@/lib/konnex/types";

const now = Date.now();
const iso = (msAgo: number) => new Date(now - msAgo).toISOString();

export const MOCK_BOUNTIES: Bounty[] = [
  {
    id: "bnty_01HK6RJ8N4M2TQXP",
    title: "Roboarm: dice tomatoes & plate",
    description:
      "Demo task to stress-test the kitchen-grade VLA pipeline. Sponsoring this gives newer miners a low-stake task to build reputation on.",
    subnet: "sn.roboarm.sim",
    prompt: "dice tomatoes and place into pan",
    targetReward: 12.5,
    stake: 5,
    deadlineSeconds: 120,
    pooled: 7.4,
    contributorCount: 4,
    status: "draft",
    createdAt: iso(1000 * 60 * 12),
    createdBy: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
  {
    id: "bnty_01HK6S2X8YN1AQRK",
    title: "Drone perimeter patrol — community park",
    description:
      "Public-good drone navigation: fly the perimeter of a simulated park, flag moving objects > 1m. Output published openly for benchmark dataset use.",
    subnet: "sn.drone.nav",
    prompt:
      "patrol perimeter, flag any moving object > 1m, return to launch",
    targetReward: 45,
    stake: 10,
    deadlineSeconds: 300,
    pooled: 45,
    contributorCount: 11,
    status: "open",
    createdAt: iso(1000 * 60 * 60 * 3),
    createdBy: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    jobId: "job_8af2c1d3e5b09f4a72e0",
    jobHash: "0x7ba93f0a8c5d1e2f4b6a8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2c4d6e8f0a",
  },
  {
    id: "bnty_01HK6T9P5L3RZWQK",
    title: "SLAM warehouse aisle — 5cm resolution",
    description:
      "High-resolution semantic mesh of a warehouse aisle. Validators score against ground-truth point cloud held by the test counterparty.",
    subnet: "sn.slam.3d",
    prompt:
      "build semantic mesh of warehouse aisle, label shelves, output dense point cloud at 5cm resolution",
    targetReward: 60,
    stake: 12,
    deadlineSeconds: 600,
    pooled: 60,
    contributorCount: 7,
    status: "matched",
    createdAt: iso(1000 * 60 * 60 * 5),
    createdBy: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
    jobId: "job_c4d6e8f0a2b4c6d8e0f2",
    jobHash: "0x3e5a7c9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c",
  },
  {
    id: "bnty_01HK6V0M2K8QXNRT",
    title: "Roboarm: stack cups by size",
    description:
      "Manipulation primitive — verifies grasp planning under varied object sizes. Settled successfully.",
    subnet: "sn.roboarm.sim",
    prompt: "stack three cups by size, largest at the bottom",
    targetReward: 18,
    stake: 6,
    deadlineSeconds: 180,
    pooled: 18,
    contributorCount: 5,
    status: "settled",
    createdAt: iso(1000 * 60 * 60 * 24),
    createdBy: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw",
    jobId: "job_a1b2c3d4e5f6789012ab",
    jobHash: "0x9f8e7d6c5b4a3928176504e3d2c1b0a9f8e7d6c5b4a3928176504e3d2c1b0a98",
    bundleUri: "ipfs://QmPoPW8x3kL2nM4vR7tY9wB1cE5dF6gH8jK0sL3pQ2mN4o",
    score: {
      safety: 9.4,
      taskMatch: 9.1,
      efficiency: 8.6,
      coherence: 9.0,
      overall: 9.0,
    },
  },
  {
    id: "bnty_01HK6W7Q4N5PXRJK",
    title: "Drone facade reconstruction",
    description:
      "Capture overlapping frames of north building wall; produce orthomosaic + sparse 3D. Settled with high marks.",
    subnet: "sn.drone.nav",
    prompt:
      "inspect north wall of building, capture overlapping frames, return to launch",
    targetReward: 38,
    stake: 8,
    deadlineSeconds: 240,
    pooled: 38,
    contributorCount: 9,
    status: "settled",
    createdAt: iso(1000 * 60 * 60 * 38),
    createdBy: "5CFRopjz1AfKpJHeoKf48nfdj5XfA9R4uhjgUQzm6dMvVqXM",
    jobId: "job_77ac3e9d1b5f8a4c2e60",
    jobHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    bundleUri: "ipfs://QmSkY7d3pL2nMq8vR1tY9wB4cE6dF7gH8jK0sL3pQ2mN5w",
    score: {
      safety: 9.7,
      taskMatch: 9.5,
      efficiency: 8.9,
      coherence: 9.2,
      overall: 9.3,
    },
  },
  {
    id: "bnty_01HK6XK0Z9PMNXAB",
    title: "SLAM orchard row segmentation",
    description:
      "Failed: deadline missed by miner, evidence bundle incomplete. Stake slashed per contract.",
    subnet: "sn.slam.3d",
    prompt: "map orchard row, segment trees with bounding boxes",
    targetReward: 25,
    stake: 8,
    deadlineSeconds: 480,
    pooled: 25,
    contributorCount: 6,
    status: "failed",
    createdAt: iso(1000 * 60 * 60 * 50),
    createdBy: "5EYCAe5ijiYfyeZ2JJRAg94qn7WkL3XjsLnvQoBqdoMVbYSf",
    jobId: "job_dead0001beef0002fail",
    jobHash: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  },
  {
    id: "bnty_01HK6Y4PXQ8MRLNV",
    title: "Roboarm: open jar & pour contents",
    description:
      "Currently being verified by validator council. Awaiting score release.",
    subnet: "sn.roboarm.sim",
    prompt: "open jar, pour contents into bowl, set jar aside",
    targetReward: 22,
    stake: 7,
    deadlineSeconds: 200,
    pooled: 22,
    contributorCount: 8,
    status: "proving",
    createdAt: iso(1000 * 60 * 60 * 8),
    createdBy: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mDV7hEM73Y",
    jobId: "job_prove0123abcd4567ef",
    jobHash: "0xabcd1234ef567890abcd1234ef567890abcd1234ef567890abcd1234ef567890",
    bundleUri: "ipfs://QmProving8x3kL2nM4vR7tY9wB1cE5dF6gH8jK0sL3pQ2mN8z",
  },
  {
    id: "bnty_01HK6Z2RW7NXMQAT",
    title: "Drone: river bend GPS log",
    description:
      "Follow river bend for 200m at 30m altitude, log GPS waypoints. Open for contributions.",
    subnet: "sn.drone.nav",
    prompt:
      "follow river bend for 200m at 30m altitude, log GPS",
    targetReward: 30,
    stake: 8,
    deadlineSeconds: 360,
    pooled: 14.2,
    contributorCount: 6,
    status: "draft",
    createdAt: iso(1000 * 60 * 30),
    createdBy: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
];

export const MOCK_CONTRIBUTIONS: Record<string, BountyContribution[]> = {
  bnty_01HK6S2X8YN1AQRK: [
    { bountyId: "bnty_01HK6S2X8YN1AQRK", contributor: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", amount: 10, at: iso(1000 * 60 * 60 * 3), txHash: "0x4f1a..." },
    { bountyId: "bnty_01HK6S2X8YN1AQRK", contributor: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy", amount: 8, at: iso(1000 * 60 * 60 * 2.5), txHash: "0x2a7c..." },
    { bountyId: "bnty_01HK6S2X8YN1AQRK", contributor: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw", amount: 5, at: iso(1000 * 60 * 60 * 2), txHash: "0x9b3e..." },
    { bountyId: "bnty_01HK6S2X8YN1AQRK", contributor: "5CFRopjz1AfKpJHeoKf48nfdj5XfA9R4uhjgUQzm6dMvVqXM", amount: 12, at: iso(1000 * 60 * 90), txHash: "0xc1d2..." },
    { bountyId: "bnty_01HK6S2X8YN1AQRK", contributor: "5EYCAe5ijiYfyeZ2JJRAg94qn7WkL3XjsLnvQoBqdoMVbYSf", amount: 4, at: iso(1000 * 60 * 60), txHash: "0xe8f9..." },
    { bountyId: "bnty_01HK6S2X8YN1AQRK", contributor: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mDV7hEM73Y", amount: 6, at: iso(1000 * 60 * 30), txHash: "0x3a4b..." },
  ],
  bnty_01HK6V0M2K8QXNRT: [
    { bountyId: "bnty_01HK6V0M2K8QXNRT", contributor: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw", amount: 5, at: iso(1000 * 60 * 60 * 24), txHash: "0xaaaa..." },
    { bountyId: "bnty_01HK6V0M2K8QXNRT", contributor: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", amount: 4, at: iso(1000 * 60 * 60 * 23), txHash: "0xbbbb..." },
    { bountyId: "bnty_01HK6V0M2K8QXNRT", contributor: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", amount: 3, at: iso(1000 * 60 * 60 * 22), txHash: "0xcccc..." },
    { bountyId: "bnty_01HK6V0M2K8QXNRT", contributor: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy", amount: 4, at: iso(1000 * 60 * 60 * 21), txHash: "0xdddd..." },
    { bountyId: "bnty_01HK6V0M2K8QXNRT", contributor: "5CFRopjz1AfKpJHeoKf48nfdj5XfA9R4uhjgUQzm6dMvVqXM", amount: 2, at: iso(1000 * 60 * 60 * 20), txHash: "0xeeee..." },
  ],
};

export function getBounty(id: string): Bounty | undefined {
  return MOCK_BOUNTIES.find((b) => b.id === id);
}

export function getContributions(bountyId: string): BountyContribution[] {
  return MOCK_CONTRIBUTIONS[bountyId] ?? [];
}
