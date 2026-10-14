import type { Metadata } from "next";
import CertBrowser from "@/components/CertBrowser";
import { allCertificates } from "@/lib/catalog";

export const metadata: Metadata = { title: "Certificates" };

export default function Page() {
  return <CertBrowser items={allCertificates()} />;
}
