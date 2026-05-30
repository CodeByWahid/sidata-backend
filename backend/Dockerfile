FROM node:18-alpine
WORKDIR /app

# install only production deps
COPY package.json package-lock.json* ./
RUN npm install --production || npm install

COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
