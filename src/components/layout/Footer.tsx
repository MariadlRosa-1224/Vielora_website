"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/codex", label: "Codex" },
  { href: "/characters", label: "Characters" },
  { href: "/editor/new-entry", label: "Create entry" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Footer() {
  const { data: sessionData } = authClient.useSession();
  const router = useRouter();



  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#111120] px-8 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-[Spectral_SC] text-sm uppercase tracking-wider text-white/70">
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
          {sessionData && (
            <button
              onClick={handleLogout}
              className="text-white/70 transition hover:text-[#fff48e]"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </footer>
  );
}