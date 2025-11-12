"use client";
import { formatarData, obterEnderecoCompleto } from "@/app/util";
import { useParams, useRouter } from "next/navigation";
import { useEventosAtivosStore } from "@/stores/eventosAtivosStore";
import { FaStore, FaClock, FaCertificate, FaArrowLeft } from "react-icons/fa";
import Button from "@/components/UI/Button";
import { useEffect, useMemo, useState } from "react";
import { Loja } from "@/types/loja";
import { http } from "@/api/http";
import { endpoints } from "@/api/endpoints";
import StepDadosPessoais from "@/components/Inscricao/StepDadosPessoais";
import StepPreferencias from "@/components/Inscricao/StepPreferencias";
import StepEstiloJogo from "@/components/Inscricao/StepEstiloJogo";
import StepEstiloJogo2 from "@/components/Inscricao/StepEstiloJogo2";
import StepUniverso1 from "@/components/Inscricao/StepUniverso1";
import StepUniverso2 from "@/components/Inscricao/StepUniverso2";
import Footer from "@/components/Footer";

export default function InscricaoEventoPage() {
  const params = useParams();
  const router = useRouter();
  const { eventos, fetch } = useEventosAtivosStore();
  const idParam = params?.id as string | string[] | undefined;
  const id = Number(Array.isArray(idParam) ? idParam[0] : idParam);

  const [loja, setLoja] = useState<Loja | null>(null);
  const [loadingLoja, setLoadingLoja] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  const handleSubmit = () => {
    console.log("Enviar inscrição");
  };

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
          setLoadingLoja(true);
          const { data } = await http.get<Loja>(
            endpoints.loja.getById(evento.lojaId)
          );
          setLoja(data);
        } catch {
          setLoja(null);
        } finally {
          setLoadingLoja(false);
        }
      }
    };
    run();
  }, [evento?.lojaId]);

  return (
    <>
      <div className="min-h-screen bg-[#1C172E] pt-25 pb-10 px-4 md:px-20">
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
                  {loadingLoja
                    ? "Carregando local..."
                    : loja
                    ? obterEnderecoCompleto(loja)
                    : evento?.nomeLoja}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1 texto-medium-info !text-[#D9E8FF] !text-[18px]">
                <FaClock />
                <span className="whitespace-nowrap">Dia do Evento</span>
                <span className="!text-[#ABB3BF]">
                  {evento ? formatarData(evento.dtInicio) : ""}
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

          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-stretch gap-4 px-0 md:px-20">
            <h1 className="titulo-pagina-evento text-center">
              Processo de inscrição
            </h1>
            <div className="w-full flex justify-center items-center">
              <div className="rounded-full w-fit px-8 py-1 bg-[var(--background-color-3)]">
                <p className="text-xs text-center bg-[var(--text-color-1)] bg-clip-text text-transparent">{`Passo ${step} de ${totalSteps}`}</p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-zinc-600" />

            {step === 1 && <StepDadosPessoais next={() => setStep(2)} />}
            {step === 2 && (
              <StepPreferencias
                prev={() => setStep(1)}
                next={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <StepEstiloJogo prev={() => setStep(2)} next={() => setStep(4)} />
            )}
            {step === 4 && (
              <StepEstiloJogo2 prev={() => setStep(3)} next={() => setStep(5)} />
            )}
            {step === 5 && (
              <StepUniverso1 prev={() => setStep(4)} next={() => setStep(6)} />
            )}
            {step === 6 && (
              <StepUniverso2 prev={() => setStep(5)} next={handleSubmit} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
