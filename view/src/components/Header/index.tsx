"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 sm:px-10 py-4 bg-[#161622] border-b border-[#2E2A45] shadow-sm z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-gray-100 text-lg font-semibold tracking-wide hover:opacity-80 transition">
          MasterIA
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Bolinhas decorativas */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
        </div>

        {/* Botão de login */}
        <Link
          href="/login"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-md transition hover:brightness-110 hover:shadow-lg"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
