import { http } from "../../api/http";
import { endpoints } from "../../api/endpoints";
import { Organizador } from "../../stores/organizador";

export type LoginPayload = { email: string; senha: string };
export type LoginResponse = { token: string };

export async function login(payload: LoginPayload): Promise<string> {
    const { data } = await http.post<LoginResponse>(endpoints.auth.login, payload);
    return data.token;
}

export async function register(payload: Organizador) {
    const { data } = await http.post(endpoints.organizador.create, payload);
    return data;
}
