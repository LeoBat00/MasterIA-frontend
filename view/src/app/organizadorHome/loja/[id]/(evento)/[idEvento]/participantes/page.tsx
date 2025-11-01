'use client';

import { participanteGrupo } from '@/types/participante';

export default function participantesEvento() {

    // const { eventoSelecionado } = useEventoStore();

    // const participantes = eventoSelecionado?.grupos.flatMap(grupo => grupo.participantes) || [];

    const participantesMockados : participanteGrupo[] = [
        {
            id : 1,
            nome: "João",
            sobrenome: "Silva",
            genero: "Masculino",
            email: "email@emai.com",
            telefone: "11999999999",
        },
        {
            id : 2,
            nome: "Maria",
            sobrenome: "Oliveira",
            genero: "Feminino",
            email: "email@email.com",
            telefone: "11888888888",
        },
    ];

    return (
        <div className="page">
            <h1>Participantes do Evento</h1>

            {participantesMockados.length === 0 ? (
                <p>Nenhum participante inscrito neste evento.</p>
            ) : (
                participantesMockados.map((participante) => (
                    <div key={participante.id} className="p-4 mb-4 border border-gray-700 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">{participante.nome + ' ' + participante.sobrenome}</h2>
                        <p className="text-sm text-gray-400">Email: {participante.email}</p>
                        <p className="text-sm text-gray-400">Telefone: {participante.telefone}</p>
                    </div>
                ))
            )
            }

        </div>
    );
}