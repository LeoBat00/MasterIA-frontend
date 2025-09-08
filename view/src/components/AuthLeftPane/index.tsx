'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Paladino3D from "@/components/Paladino3D";

export default function AuthLeftPane() {
    return (
        <div className="relative hidden md:flex flex-col h-full justify-start bg-gradient-to-b from-[#12121B] to-[#04041D] w-full p-8 px-14">
            <div className="absolute top-0 right-0 h-full w-3 bg-gradient-to-r from-[#951FFB] to-[#685BFF]" />

            <div className="flex flex-col items-start">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-md transition hover:brightness-110 hover:shadow-lg mb-6"
                >
                    <ArrowLeft size={18} />
                    Voltar
                </Link>

                <h1 className="text-5xl font-regular mb-4">
                    Inicie sua jornada
                    <span className="block text-6xl font-semibold">no MasterIA</span>
                </h1>
                <p className="text-[#8E8E8E] text-xl">
                    Controle seus eventos com agilidade e clareza.
                </p>

                <div className="flex w-[80%] items-center justify-center mt-6">
                    <Paladino3D />
                </div>
            </div>
        </div>
    );
}
