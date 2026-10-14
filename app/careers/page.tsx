import type { Metadata } from "next";
import CareersPage from "@/components/CareersPage";

export const metadata: Metadata = { title: "AI careers and job tracks" };

export default function Page() {
  return <CareersPage />;
}
