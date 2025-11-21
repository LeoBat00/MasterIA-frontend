export const pastelGroupColors: string[] = [
  "rgba(244, 67, 54, 0.45)",   // 0 - vermelho coral
  "rgba(255, 152, 0, 0.45)",   // 1 - laranja suave
  "rgba(255, 235, 59, 0.45)",  // 2 - amarelo pastel
  "rgba(139, 195, 74, 0.45)",  // 3 - verde lima
  "rgba(0, 188, 212, 0.45)",   // 4 - turquesa
  "rgba(63, 81, 181, 0.45)",   // 5 - azul índigo
  "rgba(156, 39, 176, 0.45)",  // 6 - roxo
  "rgba(233, 30, 99, 0.45)",   // 7 - rosa choque
  "rgba(121, 85, 72, 0.45)",   // 8 - marrom claro
  "rgba(96, 125, 139, 0.45)",  // 9 - azul acinzentado
  // tons complementares (mantêm pastel, mais discretos)
  "rgba(248, 215, 218, 0.35)", // 10
  "rgba(255, 224, 181, 0.35)", // 11
  "rgba(255, 244, 194, 0.35)", // 12
  "rgba(228, 245, 194, 0.35)", // 13
  "rgba(207, 240, 213, 0.35)", // 14
  "rgba(191, 232, 230, 0.35)", // 15
  "rgba(201, 239, 247, 0.35)", // 16
  "rgba(208, 225, 255, 0.35)", // 17
  "rgba(217, 212, 255, 0.35)", // 18
  "rgba(234, 215, 255, 0.35)", // 19
  "rgba(243, 217, 250, 0.35)", // 20
  "rgba(246, 213, 229, 0.35)", // 21
  "rgba(253, 224, 220, 0.35)", // 22
  "rgba(255, 233, 214, 0.35)", // 23
  "rgba(255, 242, 224, 0.35)", // 24
  "rgba(236, 243, 213, 0.35)", // 25
  "rgba(215, 242, 220, 0.35)", // 26
  "rgba(216, 248, 241, 0.35)", // 27
  "rgba(216, 233, 245, 0.35)", // 28
  "rgba(225, 222, 246, 0.35)", // 29
  "rgba(240, 221, 242, 0.35)", // 30
  "rgba(245, 226, 221, 0.35)", // extra segurança
];

export const getGroupColorByIndex = (index: number) =>
  pastelGroupColors[index % pastelGroupColors.length];
