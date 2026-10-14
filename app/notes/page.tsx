import type { Metadata } from "next";
import NotesPage from "@/components/NotesPage";

export const metadata: Metadata = { title: "My notes" };

export default function Page() {
  return <NotesPage />;
}
