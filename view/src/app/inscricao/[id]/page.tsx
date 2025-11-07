"use client";
import { formatarData, obterEnderecoCompleto } from "@/app/util";
import { useParams, useRouter } from "next/navigation";
import { useEventosAtivosStore } from "@/stores/eventosAtivosStore";
import {
  FaStore,
  FaClock,
  FaCertificate,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useEffect, useMemo, useState } from "react";
import { Loja } from "@/types/loja";
import { http } from "@/api/http";
import { endpoints } from "@/api/endpoints";

export default function InscricaoEventoPage() {
  const params = useParams();
  const router = useRouter();
  const { eventos, fetch } = useEventosAtivosStore();
  const idParam = params?.id as string | string[] | undefined;
  const id = Number(Array.isArray(idParam) ? idParam[0] : idParam);

  const [loja, setLoja] = useState<Loja | null>(null);

  useEffect(() => {
    if (!eventos || eventos.length === 0) fetch();
  }, [eventos?.length, fetch]);

  const evento = useMemo(
    () => (eventos || []).find((e) => e.id === id),
    [eventos, id]
  );

  useEffect(() => {
    const run = async () => {
      if (evento?.lojaId) {
        try {
          const { data } = await http.get<Loja>(
            endpoints.loja.getById(evento.lojaId)
          );
          setLoja(data);
        } catch {
          setLoja(null);
        }
      }
    };
    run();
  }, [evento?.lojaId]);

  return (
    <div className="min-h-screen bg-[#1C172E] pt-25 px-4 md:px-20">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outlineGhostPurple"
          className="!rounded-full"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>

        <div className="text-[#616EFF] text-xs">{evento?.cdEvento}</div>
      </div>

      <div className="grid grid-cols-12 gap-4 px-0 md:px-4">
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-2 h-auto justify-between lg:pr-10">
          <div>
            <span className="titulo-pagina-evento mb-10">
              {evento?.nmEvento}
            </span>
            <div className="flex gap-2 mb-1 texto-medium-info !text-[#D9E8FF]">
              <FaStore className="h-5 w-5" />
              <span className="whitespace-nowrap">Local do Evento</span>
              <span className="!text-[#ABB3BF]">
                {" "}
                {loja ? obterEnderecoCompleto(loja) : evento?.nomeLoja}{" "}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1 texto-medium-info !text-[#D9E8FF] !text-[18px]">
              <FaClock />
              <span className="whitespace-nowrap">Dia do Evento</span>
              <span className="!text-[#ABB3BF]">
                {" "}
                {evento ? formatarData(evento.dtInicio) : ""}{" "}
              </span>
            </div>

            <div className="mt-4 border-b border-zinc-600" />
          </div>
          <div className="texto-organizador flex justify-end gap-2">
            Organizador
            <span className="!font-semibold !text-[#616EFF]  flex items-center gap-1">
              {evento?.nomeLoja} <FaCertificate />
            </span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-center gap-6 px-0 md:px-20">
          <h1 className="titulo-pagina-evento ">Processo de inscrição</h1>
          <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
            <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">
              {"Passo 2 de 2"}
            </p>
          </div>
          <div className="mt-4 w-full h-[1px] bg-zinc-600" />

          <Input
            label="Nome Completo"
            containerClassName="!text-[#D9E8FF]"
            rightIcon={<FaUser />}
            onChange={(value) => {
              console.log(value);
            }}
            value=""
          />

          <Input
            label="Email"
            containerClassName="!text-[#D9E8FF]"
            rightIcon={<FaEnvelope />}
            onChange={(value) => {
              console.log(value);
            }}
            value=""
          />

          <Input
            label="Telefone"
            containerClassName="!text-[#D9E8FF]"
            rightIcon={<FaPhone />}
            onChange={(value) => {
              console.log(value);
            }}
            value=""
          />

          <div className=" flex justify-end gap-6 w-full mt-10">
            <Button
              variant="outlineGhost"
              className="min-w-30"
              onClick={() => router.back()}
            >
              Voltar
            </Button>

            <Button
              className="min-w-30"
              onClick={() => console.log("click prosseguir")}
            >
              Avançar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
