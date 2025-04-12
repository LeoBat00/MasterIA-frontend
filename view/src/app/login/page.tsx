'use client';

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
import { ArrowBigLeftDash, } from "lucide-react";

export default function LoginPage() {
    const [step, setStep] = useState(1);

    return (
        <>
            <Header />

            <div className="absolute top-25 left-6 z-10">
                <Link href="/" className="group">
                    <div className="p-2 rounded-full bg-[#9F9F9F] opacity-60 shadow-md shadow-gray-500 transition duration-200 group-hover:shadow-lg group-hover:brightness-110">
                        <ArrowBigLeftDash className="text-white w-5 h-5" />
                    </div>
                </Link>
            </div>

            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white pt-8 md:pt-0">
                <div className="hidden md:flex flex-col justify-start mt-32 items-center p-8 border-r">
                    <div className="max-w-md w-full text-left">
                        <h1 className="text-3xl font-bold mb-4 text-[#171717]">Your Best Value Proposition</h1>
                        <p className="text-gray-600 mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        </p>
                        <div className="w-full h-64 border bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">ainda sem, gerar com gpt</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start mt-32 items-center px-6 py-12 sm:p-12">
                    <div className="w-full max-w-sm " >
                        <h2 className="text-xl font-semibold text-[#171717] text-center mb-2">BEM-VINDO!</h2>
                        <p className="text-xs text-center text-[#171717] mb-6">Passo {step} de 3</p>

                        <form className="flex flex-col gap-4">
                            <div>
                                <label className="block text-[#171717] text-xs font-semibold mb-1">LABEL</label>
                                <input
                                    type="text"
                                    placeholder="Lorem Ipsum"
                                    maxLength={32}
                                    className="w-full border text-black px-3 py-2 rounded outline-none focus:ring-2 focus:ring-black placeholder-[#868686]"
                                />
                                <p className="text-right text-xs text-gray-400 mt-1">0/32</p>
                            </div>

                            <div>
                                <label className="block text-xs text-[#171717] font-semibold mb-1">LABEL</label>
                                <input
                                    type="text"
                                    placeholder="Lorem Ipsum"
                                    maxLength={32}
                                    className="w-full border text-black px-3 py-2 rounded outline-none focus:ring-2 focus:ring-black placeholder-[#868686]"
                                />
                                <p className="text-right text-xs text-gray-400 mt-1">0/32</p>
                            </div>

                            <button
                                type="button"
                                className="bg-black text-white py-2 rounded hover:opacity-90 mt-4"
                                onClick={() => setStep(step + 1 <= 3 ? step + 1 : 1)}
                            >
                                Start
                            </button>
                        </form>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            Lorem ipsum <strong>dolor</strong> sit amet, consectetur
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
