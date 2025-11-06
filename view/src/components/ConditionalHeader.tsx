"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ConditionalHeader() {
  const pathname = usePathname() || "/";

  const hiddenOnPrefixes = [
    "/organizadorHome",
    "/login",
    "/registro"
  ];

  const shouldHide = hiddenOnPrefixes.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;
  return <Header />;
}

