FROM node:20-alpine as builder

RUN npm install -g pnpm@latest

WORKDIR /app

# Copie des fichiers nécessaires (à la racine du repo Nx)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installation
RUN pnpm install

# Copie du reste du code
COPY . .

# Build Nx pour le projet "back"
RUN pnpm nx build back

FROM node:20-alpine
WORKDIR /app

# On copie le dist et les node_modules depuis l'étape de build
COPY --from=builder /app/dist/back ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "main.js"]
