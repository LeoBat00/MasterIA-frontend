"use client";
import { motion } from "framer-motion";
export default function AuthLeftPane() {
  return (
    <div className="relative hidden md:flex flex-col h-full justify-start w-full p-8 md:p-0  ">
      <div className="flex flex-col items-start">
        <h1 className="text-5xl font-regular mb-4">
          Inicie sua jornada no
          <span className="block text-6xl font-semibold text-[#616EFF]">
            MasterIA
          </span>
        </h1>
        <p className="text-[#8E8E8E] text-xl">
          O seu espaço para criar eventos, descobrir jogos e jogar junto.
        </p>
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-10 mb-6 w-full flex justify-center"
        >
          <img className=" max-w-[303px]" src="/heroMasteria.png"></img>
        </motion.div>
      </div>
    </div>
  );
}
