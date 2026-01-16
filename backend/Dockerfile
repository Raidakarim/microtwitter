FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "src/server.js"]
