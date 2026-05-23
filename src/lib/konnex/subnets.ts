/**
 * Konnex live testnet subnets.
 * Source: https://docs.konnex.world/subnets-workload-classes/subnets
 */

export type SubnetId = "sn.roboarm.sim" | "sn.drone.nav" | "sn.slam.3d";

export interface Subnet {
  id: SubnetId;
  name: string;
  shortName: string;
  category: "manipulation" | "aerial" | "perception";
  description: string;
  /** Used to seed `prompt` examples in the create-bounty form. */
  promptExamples: string[];
  /** Suggested reward range in testKNX (rewardStable field on the API). */
  suggestedReward: { min: number; max: number };
  /** Suggested deadline range in seconds. */
  suggestedDeadline: { min: number; max: number };
  /** Scoring KPIs as documented for the workload class. */
  kpis: string[];
  emoji: string;
  accent: string;
}

export const SUBNETS: Record<SubnetId, Subnet> = {
  "sn.roboarm.sim": {
    id: "sn.roboarm.sim",
    name: "Roboarm VLA",
    shortName: "Roboarm",
    category: "manipulation",
    description:
      "Text-directed Vision-Language-Action manipulation. Bi-manual, kitchen-grade examples.",
    promptExamples: [
      "dice tomatoes and place into pan",
      "pick pepper, slice, sauté 2 minutes, plate",
      "open jar, pour contents into bowl, set jar aside",
      "stack three cups by size, largest at the bottom",
    ],
    suggestedReward: { min: 5, max: 50 },
    suggestedDeadline: { min: 60, max: 300 },
    kpis: ["safety", "task match", "efficiency"],
    emoji: "🦾",
    accent: "#00e5a0",
  },
  "sn.drone.nav": {
    id: "sn.drone.nav",
    name: "Drone Navigation",
    shortName: "Drone",
    category: "aerial",
    description:
      "Vision-language flight. Scoring on task match, safety, and execution under subnet rules.",
    promptExamples: [
      "fly to waypoint A, hold 10s, return to launch",
      "inspect north wall of building, capture overlapping frames",
      "follow river bend for 200m at 30m altitude, log GPS",
      "patrol perimeter, flag any moving object > 1m",
    ],
    suggestedReward: { min: 10, max: 100 },
    suggestedDeadline: { min: 120, max: 600 },
    kpis: ["task match", "safety", "execution"],
    emoji: "🚁",
    accent: "#4f8cff",
  },
  "sn.slam.3d": {
    id: "sn.slam.3d",
    name: "SLAM 3D Map",
    shortName: "SLAM",
    category: "perception",
    description:
      "Sensor bundles → mesh / semantic 3D map quality vs ground truth.",
    promptExamples: [
      "scan room, output dense point cloud at 5cm resolution",
      "build semantic mesh of warehouse aisle, label shelves",
      "reconstruct facade from drone pass, orthomosaic + 3D",
      "map orchard row, segment trees with bounding boxes",
    ],
    suggestedReward: { min: 8, max: 80 },
    suggestedDeadline: { min: 180, max: 900 },
    kpis: ["mesh quality", "semantic accuracy", "completeness"],
    emoji: "🗺️",
    accent: "#b266ff",
  },
};

export const SUBNET_LIST: Subnet[] = Object.values(SUBNETS);
