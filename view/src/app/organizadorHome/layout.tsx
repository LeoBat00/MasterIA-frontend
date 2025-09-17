import MenuLateral  from "@/components/MenuLateral";

export default function organizadorHomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen p-6">
            <MenuLateral />
            <main className="flex-1 pl-6">{children}</main>
        </div>
    );
}