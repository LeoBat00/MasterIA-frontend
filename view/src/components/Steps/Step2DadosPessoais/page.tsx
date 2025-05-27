import { FiStar, FiUsers, FiClock, FiCalendar } from "react-icons/fi";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";

export default function Step2PerfilJogador({ next, prev }: { next: () => void; prev: () => void }) {
    const { perfil, setPerfil } = usePerfilUsuarioStore();

    const handleNext = () => {
        if (
            perfil.experience <= 0 ||
            !perfil.qntPessoas ||
            !perfil.tempoJogo ||
            !perfil.idade ||
            parseInt(perfil.idade) <= 0
        ) {
            alert("Preencha todos os campos corretamente.");
            return;
        }
        next();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiStar /> Nível de Experiência</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <button
                            key={level}
                            onClick={() => setPerfil({ experience: level })}
                            className={`text-2xl transition ${perfil.experience >= level ? "text-yellow-400" : "text-gray-500"}`}
                        >★</button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiUsers /> Quantidade de jogadores</label>
                <select
                    value={perfil.qntPessoas}
                    onChange={(e) => setPerfil({ qntPessoas: e.target.value })}
                    className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                >
                    <option value="">Selecione</option>
                    {[2, 3, 4, 5, "6+"].map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiClock /> Tempo médio de jogo</label>
                <select
                    value={perfil.tempoJogo}
                    onChange={(e) => setPerfil({ tempoJogo: e.target.value })}
                    className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                >
                    <option value="">Selecione</option>
                    <option value="1">Jogos rápidos (10–20 min)</option>
                    <option value="2">Jogos médios (30–40 min)</option>
                    <option value="3">Jogos longos (50–60 min)</option>
                    <option value="4">Jogos muito longos (60+ min)</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiCalendar /> Idade</label>
                <input
                    type="number"
                    value={perfil.idade}
                    onChange={(e) => setPerfil({ idade: e.target.value })}
                    className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                    placeholder="Digite sua idade"
                />
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={prev} className="text-gray-400 hover:text-white transition">Voltar</button>
                <button onClick={handleNext} className="bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 cursor-pointer transition">Próximo</button>
            </div>
        </div>
    );
}