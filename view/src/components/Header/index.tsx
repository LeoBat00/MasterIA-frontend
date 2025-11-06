"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { checkAuth } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const setHeaderVar = () => {
      const h = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setHeaderVar();
    window.addEventListener("resize", setHeaderVar);
    return () => window.removeEventListener("resize", setHeaderVar);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 w-full flex items-center justify-between px-6 sm:px-10 py-4 z-40 transition-colors duration-300
        ${scrolled
          ? "backdrop-blur-md bg-[#161622]/80 border-b border-[#2E2A45]/70 shadow-md"
          : "bg-[#161622] border-b border-[#2E2A45] shadow-sm"}
      `}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logoalt.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-gray-100 text-lg font-semibold tracking-wide hover:opacity-80 transition">
          Master<span className="text-[#FDC700] font-medium">IA</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
        </div>

        <Link
          href={checkAuth() ? "/organizadorHome" : "/login"}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-md transition hover:brightness-110 hover:shadow-lg"
        >
          {checkAuth() ? "Lojas" : "Login"}
        </Link>
      </div>
    </header>
  );
}
