export function formatNumber(value: string): string {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }

    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

export function validateTelefone(telefone: string): boolean {
    const cleaned = telefone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
}
