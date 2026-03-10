FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run build && node dist/main.js; else npm run start:dev; fi"]

