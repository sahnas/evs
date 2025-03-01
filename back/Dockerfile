FROM node:20-alpine as builder

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

RUN pnpm nx build back

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist/back ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "main.js"]
