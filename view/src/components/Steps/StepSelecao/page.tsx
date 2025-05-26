export default function StepSelecao({
    titulo,
    opcoes,
    selecionados,
    setSelecionados,
    busca,
    setBusca,
    prev,
    onSubmit,
    botaoLabel
}: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">{titulo}</h2>

            <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                {opcoes
                    .filter((item: any) => item.nome.toLowerCase().includes(busca.toLowerCase()))
                    .map((item: any) => {
                        const ativo = selecionados.includes(item.nome);
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (ativo) {
                                        setSelecionados(selecionados.filter((s: string) => s !== item.nome));
                                    } else if (selecionados.length < 5) {
                                        setSelecionados([...selecionados, item.nome]);
                                    }
                                }}
                                className={`rounded-lg px-4 py-2 text-sm font-medium border transition ${ativo ? "bg-indigo-600 text-white border-indigo-600" : "bg-[#2A2A3D] text-gray-300 border-[#3E3A5E] hover:bg-[#35344a]"
                                    }`}
                            >
                                {item.nome}
                            </button>
                        );
                    })}
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={prev} className="text-gray-400 hover:text-white transition">Voltar</button>
                <button
                    onClick={onSubmit}
                    className="bg-green-500 px-6 py-2 rounded-xl hover:bg-green-600 transition"
                >
                    {botaoLabel}
                </button>
            </div>
        </div>
    );
}
