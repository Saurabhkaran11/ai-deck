import type { Metadata } from "next";
import ToolsBrowser from "@/components/ToolsBrowser";

export const metadata: Metadata = { title: "AI tools" };

export default function Page() {
  return <ToolsBrowser />;
}
