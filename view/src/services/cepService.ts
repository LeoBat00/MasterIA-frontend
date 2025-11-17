import { endpoints } from "@/api/endpoints";

export type CepAddress = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  ddd?: string;
  gia?: string;
  siafi?: string;
  erro?: boolean;
};

const CEP_REGEX = /^\d{8}$/;

export async function fetchAddressByCep(cep: string): Promise<CepAddress> {
  const normalized = cep.replace(/\D/g, "");
  if (!CEP_REGEX.test(normalized)) {
    throw new Error("CEP inválido");
  }

  const response = await fetch(endpoints.cep.viaCep(normalized));
  if (!response.ok) {
    throw new Error("Não foi possível consultar o CEP");
  }

  const data: CepAddress = await response.json();
  if (data?.erro) {
    throw new Error("CEP não encontrado");
  }

  return {
    cep: data.cep,
    logradouro: data.logradouro,
    complemento: data.complemento,
    bairro: data.bairro,
    localidade: data.localidade,
    uf: data.uf,
    ibge: data.ibge,
    ddd: data.ddd,
    gia: data.gia,
    siafi: data.siafi,
  };
}
