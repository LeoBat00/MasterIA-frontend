'use client';

import { useEventoStore } from "@/stores/evento";
export default function Grupo() {

    const { grupoSelecionado } = useEventoStore();

    return (
        <div>

            {grupoSelecionado && (
                <div>
                    <h1>{grupoSelecionado.nmGrupo}</h1>
                    <p>{grupoSelecionado.descricao}</p>
                    <p>Quantidade Máxima: {grupoSelecionado.qntMaxima}</p>

                    <h1>Participantes</h1>

                    {grupoSelecionado.participantes.length !== 0 ? (
                        grupoSelecionado.participantes.map((participante) => (
                            <div key={participante.id} className="p-4 mb-4 border border-gray-700 rounded-lg">
                                <h2 className="text-lg font-semibold mb-2">{participante.nome + ' ' + participante.sobrenome}</h2>
                                <p className="text-sm text-gray-400">Email: {participante.email}</p>
                                <p className="text-sm text-gray-400">Telefone: {participante.telefone}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum participante neste grupo.</p>
                    )}

                    <h1>Jogos do Grupo</h1>

                    {grupoSelecionado.jogosGrupos.length !== 0 ? (
                        grupoSelecionado.jogosGrupos.map((jogo) => (
                            <div key={jogo.id} className="p-4 mb-4 border border-gray-700 rounded-lg">
                                <h2 className="text-lg font-semibold mb-2">{jogo.nmJogo}</h2>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum jogo neste grupo.</p>
                    )}

                </div>

            )}

        </div>
    );
}