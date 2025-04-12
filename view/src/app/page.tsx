'use client';

import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center font-sans text-black bg-white">
      <Header />

      <main className="flex flex-col items-center justify-center p-6 sm:p-16">
        <div className="border p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8 max-w-5xl w-full">
          <div className="flex flex-col gap-4 max-w-md text-center sm:text-left">
            <h2 className="text-3xl font-bold">
              Your Best Value<br />Proposition
            </h2>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut.
            </p>
            <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
              <button className="bg-black text-white px-6 py-2 rounded cursor-pointer transition hover:border hover:border-white">
                See More
              </button>
              <Link href="/login" className="border border-gray-400 px-6 py-2 rounded cursor-pointer transition hover:border-white">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="w-full sm:w-[250px] h-[180px] bg-gray-800 flex-shrink-0" />
        </div>
      </main>
      <section className="text-center text-xl sm:text-2xl font-semibold mt-12 px-4">
        É um Criador de Eventos?
      </section>
    </div>
  );
}
