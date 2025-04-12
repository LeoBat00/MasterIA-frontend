'use client';

import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full flex items-center justify-between px-8 py-4 border-b bg-white">
            <Link href="/" className="text-lg text-black font-bold hover:opacity-80 transition">
                LOGO
            </Link>
            <nav className="hidden sm:flex gap-4">
                <Link href="/login" className="bg-black text-white px-4 py-2 rounded-full transition hover:border hover:border-white">
                    Login
                </Link>
                <Link href="/login" className="bg-black text-white px-4 py-2 rounded-full transition hover:border hover:border-white">
                    Criar Conta
                </Link>
                <Link href="/contato" className="border text-black border-black px-4 py-2 rounded-full transition hover:border-white">
                    Contato
                </Link>
            </nav>
            <div className="sm:hidden">
                <Link href="/login" className="bg-black text-white px-4 py-2 rounded-full transition hover:border hover:border-white">
                    Login
                </Link>
            </div>
        </header>
    );
}
