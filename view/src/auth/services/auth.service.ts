import { http, setAccessToken } from "../../api/http";
import { endpoints } from "../../api/endpoints";
import { useAuthStore } from "../../stores/auth";
import { Organizador } from "../../stores/organizador";
import { useOrganizadorStore } from "../../stores/organizador";

export type LoginPayload = { email: string; senha: string };
export type LoginResponse = { token: string };

export async function login(payload: LoginPayload): Promise<string> {
    const { data } = await http.post<LoginResponse>(endpoints.auth.login, payload);

    const claims = useAuthStore.getState().claims;
    const nameid = claims?.nameid ? Number(claims.nameid) : undefined;
    if (nameid && Number.isFinite(nameid)) {
        await useOrganizadorStore.getState().fetchOrganizador(nameid);
    }

    return data.token;
}

export async function register(payload: Organizador) {
    const { data } = await http.post(endpoints.organizador.create, payload);
    return data;
}
