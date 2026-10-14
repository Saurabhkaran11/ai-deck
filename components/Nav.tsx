"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Bits";

const ITEMS = [
  { href: "/", label: "Home", icon: Icon.home },
  { href: "/learn", label: "Learn", icon: Icon.learn },
  { href: "/projects", label: "Projects", icon: Icon.projects },
  { href: "/careers", label: "Careers", icon: Icon.careers },
  { href: "/tools", label: "AI Tools", icon: Icon.tools },
  { href: "/certificates", label: "Certificates", icon: Icon.cert },
  { href: "/notes", label: "My Notes", icon: Icon.notes },
  { href: "/tracker", label: "Tracker", icon: Icon.tracker, desktopOnly: true },
];

export default function Nav() {
  const path = usePathname() || "/";
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link href="/" className="logo" aria-label="AI Deck home">
            <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
            AI <span>Deck</span>
          </Link>
          <nav className="toplinks" aria-label="Main">
            {ITEMS.map((it) => (
              <Link key={it.href} href={it.href} className={active(it.href) ? "on" : ""} aria-current={active(it.href) ? "page" : undefined}>
                {it.label}
              </Link>
            ))}
          </nav>
          <Link href="/learn" className="btn solid sm top-cta">Start learning</Link>
        </div>
      </header>
      <nav className="tabbar" aria-label="Main">
        {ITEMS.filter((it) => it.href !== "/" && !("desktopOnly" in it)).map((it) => (
          <Link key={it.href} href={it.href} className={active(it.href) ? "on" : ""} aria-current={active(it.href) ? "page" : undefined}>
            {it.icon}
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
