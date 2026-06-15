FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

RUN echo -e '#!/bin/sh\necho -e "\n\n condor_app: \x1b[1;34mhttp://localhost:8080\x1b[0m\n\n"' > /docker-entrypoint.d/99-print-link.sh && chmod +x /docker-entrypoint.d/99-print-link.sh

CMD ["nginx", "-g", "daemon off;"]