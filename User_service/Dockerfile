# ---- build stage ----
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- runtime stage ----
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY openapi.yaml ./openapi.yaml   
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]