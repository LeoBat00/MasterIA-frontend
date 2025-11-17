"use client";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { FaStore, FaUser, FaDice } from "react-icons/fa";
import { useAuthStore } from "@/stores/auth";
import { useOrganizadorStore } from "@/stores/organizador";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const MenuLateral = () => {
  const { organizador } = useOrganizadorStore();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const menuItems = [
    {
      label: "Home",
      icon: <FaStore />,
      href: "/organizadorHome",
      onClick: () => router.push("/organizadorHome"),
    },
    {
      label: "Meu cadastro",
      icon: <FaUser />,
      href: "/organizador/cadastro",
      onClick: () => router.push("/organizador/cadastro"),
    },
    {
      label: "Jogos cadastrados",
      icon: <FaDice />,
      href: "/jogosCadastratos",
      onClick: () => router.push("/jogosCadastratos"),
    },
  ];

  const handleClickLogout = () => {
    logout();
    router.push("/");
  };

  const organizerNameRaw =
    organizador?.razaoSocial || organizador?.email || "Organizador";

  const formatOrganizerName = (value: string) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const organizerName = formatOrganizerName(organizerNameRaw);

  return (
    <aside
      className="sticky top-0 flex h-screen w-80 shrink-0 flex-col rounded-[12px] border-r border-[#53339A] bg-[#040405] p-5"
      aria-label="Menu do organizador"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F0F1A]">
          <Image
            src="/logoalt.png"
            alt="MasterIA"
            width={40}
            height={40}
            priority
          />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-regular tracking-wide text-[#B0B6BF]/90">
            Organizador
          </p>
          <p className="text-lg font-bold text-[#D9E8FF]/90">
            {organizerName}.
          </p>
        </div>
      </div>

      <div className="mb-5 h-px w-full bg-white/25" />
      <p className="px-1 text-sm font-light text-white/60">Principal</p>
      <div className="mb-4 h-px w-full bg-white/10" />

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive =
            item.href &&
            (pathname === item.href || pathname?.startsWith(`${item.href}/`));

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={clsx(
                "flex w-full items-center gap-2 cursor-pointer rounded-lg border text-left text-sm font-medium transition-all duration-200",
                isActive
                  ? "border-[2px] border-[#685BFF]/80 bg-[#1b1033] text-white"
                  : "border border-white/10 hover:border-white/30"
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md text-[#B0B6BF]">
                {item.icon}
              </span>
              <span className={isActive ? "text-white" : "text-white/60"}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <button
          className="flex w-full items-center cursor-pointer justify-center gap-4 rounded-lg border border-yellow-400/40 bg-yellow-500/10 px-4 py-3 text-sm font-regular text-yellow-300 transition hover:border-yellow-300 hover:bg-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          aria-label="Sair da conta"
          onClick={handleClickLogout}
        >
          <span>Sair da conta</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};

export default MenuLateral;
