import StepSelecao from "../StepSelecao/page";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";

export default function Step3Mecanicas({ todasMecanicas, next, prev }: any) {
    const { perfil, setPerfil } = usePerfilUsuarioStore();

    return (
        <StepSelecao
            titulo="Escolha até 5 Mecânicas"
            opcoes={todasMecanicas.map((m: any) => ({ id: m.id, nome: m.nmMecanica }))}
            selecionados={perfil.mecanicasSelecionadas}
            setSelecionados={(val: string[]) => setPerfil({ mecanicasSelecionadas: val })}
            busca={perfil.buscaMecanica || ""}
            setBusca={(val: string) => setPerfil({ buscaMecanica: val })}
            prev={prev}
            onSubmit={() => {
                if (!perfil.mecanicasSelecionadas.length) {
                    alert("Selecione ao menos uma mecânica para continuar.");
                    return;
                }
                next();
            }}
            botaoLabel="Próximo"
        />
    );
}