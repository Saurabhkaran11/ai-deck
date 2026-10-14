import Home from "@/components/Home";
import { allCertificates, TOOL_COUNT } from "@/lib/catalog";

export default function Page() {
  const freeCerts = allCertificates().filter((c) => !c.paid && c.credential).length;
  return <Home toolCount={Math.floor(TOOL_COUNT / 10) * 10} freeCertCount={Math.floor(freeCerts / 5) * 5} />;
}
