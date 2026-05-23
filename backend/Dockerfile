FROM node:22
WORKDIR /app

COPY package* .

RUN npm install

COPY . .
RUN npm run build

EXPOSE 8000

CMD ["node", "server.js"]