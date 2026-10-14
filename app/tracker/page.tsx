import type { Metadata } from "next";
import TrackerPage from "@/components/TrackerPage";

export const metadata: Metadata = { title: "Resource tracker" };

export default function Page() {
  return <TrackerPage />;
}
