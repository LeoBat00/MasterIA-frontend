# Etapa 1 — build da aplicação
FROM node:20-alpine AS builder
WORKDIR /app

# Copia apenas o que precisa para instalar dependências
COPY package*.json ./
RUN npm ci

# Copia o restante do código e faz o build
COPY . .
RUN npm run build

# Etapa 2 — imagem leve de runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Define o ambiente de produção
ENV NODE_ENV=production

# Copia apenas o build e dependências necessárias
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
