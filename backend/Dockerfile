FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:22-alpine AS production

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

CMD ["node", "dist/main.js"]

