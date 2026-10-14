import type { Metadata } from "next";
import TopicPage from "@/components/TopicPage";
import { PLAIN } from "@/lib/plain";
import { PATH_IDS } from "@/lib/paths";

export function generateStaticParams() {
  return PATH_IDS.map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = PLAIN[params.id];
  return { title: p?.title ?? "Your topic", description: p?.simple };
}

export default function Page({ params }: { params: { id: string } }) {
  return <TopicPage id={params.id} />;
}
