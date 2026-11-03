import type { Metadata } from "next";
import TopicPage from "@/components/TopicPage";
import { PLAIN } from "@/lib/plain";
import { PATH_IDS } from "@/lib/paths";

export function generateStaticParams() {
  return PATH_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PLAIN[id];
  return { title: p?.title ?? "Your topic", description: p?.simple };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TopicPage id={id} />;
}
