"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/lore", label: "Lore" },
  { href: "/locations", label: "Locations" },
  { href: "/world-information", label: "World information" },
  { href: "/races", label: "Races" },
  { href: "/milestones", label: "Milestones" },
  { href: "/codex", label: "Codex" },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-[#111120] text-white backdrop-blur pl-1 pr-1">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="font-[Spectral_SC] text-lg font-semibold tracking-wide text-white lg:hidden"
        >
          Vielora
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "text-sm font-medium transition-colors m-3",
                    "hover:text-[#FFF48E]",
                    isActive ? "text-[#FFF48E]" : "text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="https://discord.gg/example"
          className="hidden rounded-md border border-[#FFF48E] px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-[#FFF48E] hover:text-[#111120] lg:inline-flex"
        >
          Join the server
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-md border border-white/20 px-3 py-2 text-sm lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          Menu
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#111120] px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={[
                      "block text-sm font-medium transition-colors",
                      "hover:text-[#FFF48E]",
                      isActive ? "text-[#FFF48E]" : "text-white",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="https://discord.gg/example"
            className="mt-6 inline-flex w-full justify-center rounded-md border border-[#FFF48E] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FFF48E] hover:text-[#111120]"
          >
            Join the server
          </Link>
        </div>
      )}
    </header>
  );
}