# ---------- BUILD STAGE ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# копируем prisma schema ДО npm install
COPY prisma ./prisma

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/src/main.js"]