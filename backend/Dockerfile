# Node 18 LTS
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
