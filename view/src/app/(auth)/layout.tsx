import AuthLeftPane from "@/components/AuthLeftPane";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] pt-8 md:pt-0">
                <div className="bg-[var(--background-color-1)]">
                    <AuthLeftPane />
                </div>
                <div className="flex flex-col justify-start bg-[#040404] items-center px-6 py-12  sm:p-12">
                    <div className="w-full pt-10 max-w-sm">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
