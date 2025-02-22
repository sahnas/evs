FROM node:20-alpine as builder
RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .
RUN pnpm nx build front

FROM nginx:alpine
COPY --from=builder /app/dist/front /usr/share/nginx/html

COPY front/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/front/browser /usr/share/nginx/html 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
