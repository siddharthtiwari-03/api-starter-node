FROM node:24-alpine3.24 AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm ci

FROM deps AS development
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS prod-deps
RUN npm i --omit=dev && npm cache clean --force

FROM base AS production
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
# this copies files from local machine built AOT to container 
COPY dist ./dist 

USER node
EXPOSE 5800
CMD ["node", "dist/server.js"]