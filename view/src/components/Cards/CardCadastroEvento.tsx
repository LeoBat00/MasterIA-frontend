import { formatarData } from "@/app/util";
import { Evento } from "@/types/evento";
import Image from "next/image";
import { FaStore } from "react-icons/fa";

export default function CardCadastroEvento(evento: Evento) {
    return (
        <div className="">
            <div className="bg-[#080809] p-4 rounded-lg border-l-1 border-[#A7AEFF]">
                <div className="flex justify-between">
                    <Image
                        src="/cardEvento.png"
                        alt="Evento"
                        width={197}
                        height={210}
                        className="rounded-lg w-3/4"
                    />
                    <div className="text-right texto-small"> Faltam <br></br> <span className="font-bold text-[21px] ">8 dias</span> </div>
                </div>
                <div className="text-white text-lg text-right mt-10 pr-1">eu quero participar!</div>
            </div>

            <div className="mt-2">
                <div className="texto-small-info flex items-center gap-2 mb-1">
                    <FaStore /> {evento?.NomeLoja ? evento.NomeLoja : evento.lojaId}
                </div>
                <div className="texto-small">{evento.nmEvento}</div>
                <div className="texto-small">{evento.cdEvento}</div>
                <div className="texto-small-info">{formatarData(evento.dtInicio)}</div>
            </div>

        </div>
    );
}