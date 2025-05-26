import { FiUser, FiMail, FiPhone, FiSliders } from "react-icons/fi";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";
import { formatNumber, validateEmail, validateTelefone } from "@/utils/formatar";
import { useState } from "react";

export default function Step1DadosPessoais({ next }: { next: () => void }) {
    const { perfil, setPerfil } = usePerfilUsuarioStore();
    const [errors, setErrors] = useState({ email: false, telefone: false });

    const handleNext = () => {
        const emailValido = validateEmail(perfil.email);
        const telValido = validateTelefone(perfil.telefone);

        setErrors({ email: !emailValido, telefone: !telValido });

        if (!perfil.nome.trim() || !perfil.sobrenome.trim() || !perfil.genero || !emailValido || !telValido) {
            alert("Preencha todos os campos corretamente.");
            return;
        }
        next();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiUser /> Nome</label>
                <input
                    value={perfil.nome}
                    onChange={(e) => setPerfil({ nome: e.target.value })}
                    type="text"
                    className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiUser /> Sobrenome</label>
                <input
                    value={perfil.sobrenome}
                    onChange={(e) => setPerfil({ sobrenome: e.target.value })}
                    type="text"
                    className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiSliders /> Gênero</label>
                <select
                    value={perfil.genero}
                    onChange={(e) => setPerfil({ genero: e.target.value })}
                    className="bg-[#2A2A3D] p-2 rounded-lg text-white outline-none"
                >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiMail /> E-mail</label>
                <input
                    value={perfil.email}
                    onChange={(e) => setPerfil({ email: e.target.value })}
                    type="email"
                    className={`bg-[#2A2A3D] p-2 rounded-lg outline-none ${errors.email ? "border border-red-500" : ""}`}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2"><FiPhone /> Telefone</label>
                <input
                    value={perfil.telefone}
                    onChange={(e) => setPerfil({ telefone: formatNumber(e.target.value) })}
                    type="tel"
                    className={`bg-[#2A2A3D] p-2 rounded-lg outline-none ${errors.telefone ? "border border-red-500" : ""}`}
                />
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={handleNext}
                    className="bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}