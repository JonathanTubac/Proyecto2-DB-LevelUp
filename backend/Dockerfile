FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --omit=dev --ignore-scripts

COPY . .

RUN npx prisma generate

EXPOSE 3000

USER node

CMD ["node", "src/index.js"]