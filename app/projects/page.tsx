import type { Metadata } from "next";
import ProjectsPage from "@/components/ProjectsPage";

export const metadata: Metadata = { title: "Build & earn: AI project ideas" };

export default function Page() {
  return <ProjectsPage />;
}
