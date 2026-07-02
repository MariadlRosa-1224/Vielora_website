import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/codex", label: "Codex" },
  { href: "/characters", label: "Characters" },
  { href: "/editor/new-entry", label: "Create entry" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111120] px-8 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-sm uppercase tracking-wider text-white/70">
          Isles of Vielora
        </p>

        <nav className="flex flex-wrap gap-6 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/70 transition hover:text-[#fff48e]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}