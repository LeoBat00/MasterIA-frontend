import StepSelecao from "../StepSelecao/page";
import { usePerfilUsuarioStore } from "@/stores/perfilUsuarioStore";

export default function Step4Temas({ todosTemas, finalizar, prev }: any) {
    const { perfil, setPerfil } = usePerfilUsuarioStore();

    return (
        <StepSelecao
            titulo="Escolha até 5 Temas"
            opcoes={todosTemas.map((t: any) => ({ id: t.id, nome: t.nmTema }))}
            selecionados={perfil.temasSelecionados}
            setSelecionados={(val: string[]) => setPerfil({ temasSelecionados: val })}
            busca={perfil.buscaTema || ""}
            setBusca={(val: string) => setPerfil({ buscaTema: val })}
            prev={prev}
            onSubmit={() => {
                if (!perfil.temasSelecionados.length) {
                    alert("Selecione ao menos um tema para continuar.");
                    return;
                }
                finalizar();
            }}
            botaoLabel="Finalizar"
        />
    );
}
