FROM node:20-alpine as builder
RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then \
    pnpm nx build front --configuration=production; \
    else \
    pnpm nx build front --configuration=development; \
    fi

FROM nginx:alpine
COPY --from=builder /app/dist/front/browser /usr/share/nginx/html 
COPY front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
