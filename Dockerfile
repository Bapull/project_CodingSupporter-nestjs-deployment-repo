FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install @nestjs/cli @nestjs/typeorm typeorm mysql2

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]