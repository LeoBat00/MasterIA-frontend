import Header from "@/components/Header";

export default function layoutCadastroEventos({ children, }: { children: React.ReactNode; }) {


    return <div>
        <Header/>
        {children}
    </div>;


}