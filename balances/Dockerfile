# Etapa de build
FROM node:22.17.1 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
COPY . .

ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

RUN npm install --frozen-lockfile \
  && npx prisma generate \
  && npm run build

FROM node:22.17.1

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
