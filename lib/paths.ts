import { Topic } from "./data";
import { LEVELS, PLAIN } from "./plain";

/** Every topic on the learning path, in order. */
export const PATH_IDS = LEVELS.flatMap((l) => l.topics);
export const nameOf = (t: Topic) => PLAIN[t.id]?.title ?? [t.pre, t.key, t.post].filter(Boolean).join(" ");
export const techName = (t: Topic) => [t.pre, t.key, t.post].filter(Boolean).join(" ");
export const levelOf = (id: string) => LEVELS.find((l) => l.topics.includes(id));
