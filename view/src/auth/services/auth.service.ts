import { http, setAccessToken } from "../../api/http";
import { endpoints } from "../../api/endpoints";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = { accessToken: string };

export async function login(payload: LoginPayload) {
    const { data } = await http.post<LoginResponse>(endpoints.auth.login, payload);
    setAccessToken(data.accessToken); // guarda token
    return data;
}

export type Loja = {
    id: number;
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
    complemento?: string;
    numero?: string;
    status: string;
    hrAbertura: string;
    hrEncerramento: string;
    organizadorId: number;
}

export type Organizador = {
    id?: number;
    email: string;
    senha: string;
    cpfCnpj: string;
    telefone?: string;
    nome: string;
    lojas?: Loja[];
};

export async function register(payload: Organizador) {
    const { data } = await http.post(endpoints.auth.organizador, payload);
    return data;
}

export async function getMe() {
    const { data } = await http.get(endpoints.auth.organizador);
    return data as Organizador;
}
