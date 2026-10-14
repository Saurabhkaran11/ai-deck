/* Shared types for the AI Deck resource agents. */

/** What a resource is and where it lands on the site. */
export type Kind =
  | "course"   // topic → Free courses tab
  | "paid"     // topic → paid option
  | "video"    // topic → Videos tab
  | "repo"     // topic → Free projects tab
  | "badge"    // topic → Certificates tab (+ Certificates page)
  | "tool"     // tool group → AI Tools page
  | "glossary" // AI words page
  | "step"     // job track → Careers page
  | "project"  // Projects page
  | "link";    // reference only (cert board, project tools); indexed, never applied

export type Origin = "site" | "research" | "manual";

/**
 * Lifecycle: site (already on the website) | pending (researched, waiting for review)
 * | approved (reviewed, waiting for apply) | added (applied to the website) | rejected
 */
export type Status = "site" | "pending" | "approved" | "added" | "rejected";

export type Entry = {
  uid: string;
  kind: Kind;
  target: string;          // topic id, tool group id, track id, "glossary" or "projects"
  title: string;
  url?: string;
  note?: string;
  extra?: Record<string, unknown>;
  origin: Origin;
  status: Status;
  firstSeen: string;
  addedAt?: string;
  http?: number;           // last HTTP status (0 = network error)
  finalUrl?: string;       // after redirects, when different
  checkedAt?: string;
  linkState?: "ok" | "blocked" | "broken" | "unchecked";
  history?: { at: string; change: string }[];
};

export type AgentConfig = {
  id: string;
  name: string;
  scope: "level" | "feature";
  dir: string;
  targets: string[];
  kinds: Kind[];
  trustedDomains: string[];
  focus: string;
  maxNew: number;
  autoApprove: boolean;
  raw: Record<string, string>;
};

export type Counts = { indexed: number; fetched: number; researched: number; approved: number; rejected: number; added: number; updated: number };
export const ZERO: Counts = { indexed: 0, fetched: 0, researched: 0, approved: 0, rejected: 0, added: 0, updated: 0 };
