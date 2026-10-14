import type { Metadata } from "next";
import LearnPath from "@/components/LearnPath";

export const metadata: Metadata = { title: "Learning path" };

export default function Page() {
  return <LearnPath />;
}
