export const onlyDigits = (v: string) => v.replace(/\D/g, "");
const isRepeated = (digits: string) => /^(\d)\1+$/.test(digits);

export function isValidCPF(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11) return false;
  if (isRepeated(cpf)) return false; // 00000000000, 11111111111, ...

  const calcDigit = (slice: number) => {
    const factorStart = slice + 1; // 9->10, 10->11
    const sum = cpf
      .slice(0, slice)
      .split("")
      .reduce((acc, cur, idx) => acc + Number(cur) * (factorStart - idx), 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calcDigit(9);
  if (d1 !== Number(cpf[9])) return false;

  const d2 = calcDigit(10);
  return d2 === Number(cpf[10]);
}

export function isValidCNPJ(raw: string): boolean {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14) return false;
  if (isRepeated(cnpj)) return false;

  const calcDigit = (len: number) => {
    const nums = cnpj.slice(0, len).split("").map(Number);
    const weights = len === 12
      ? [5,4,3,2,9,8,7,6,5,4,3,2]
      : [6,5,4,3,2,9,8,7,6,5,4,3,2];
    const sum = nums.reduce((acc, n, i) => acc + n * weights[i], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calcDigit(12);
  if (d1 !== Number(cnpj[12])) return false;

  const d2 = calcDigit(13);
  return d2 === Number(cnpj[13]);
}
