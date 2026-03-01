FROM node:24-alpine3.21 AS deps

WORKDIR /back

RUN apk add --no-cache \
    python3 \
    make \
    g++

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps \
    npm install bcrypt --legacy-peer-deps \
    npm install -D @types/bcrypt --legacy-peer-deps

FROM node:24-alpine3.21 AS builder

WORKDIR /back

COPY --from=deps /back/node_modules ./node_modules
COPY . .

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npx prisma generate --schema=./schemas/undostres_prisma/schema.prisma
RUN npx prisma generate --schema=./schemas/accounts_schema/schema.prisma

#RUN npm run build
RUN node --max-old-space-size=1200 node_modules/.bin/nest build

FROM node:24-alpine3.21 AS runner

WORKDIR /back

COPY package.json package-lock.json ./

RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /back/node_modules ./node_modules
COPY --from=builder /back/dist ./dist
COPY --from=builder /back/prisma ./prisma
COPY --from=builder /back/schemas ./schemas

EXPOSE 3000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN chown -R appuser:appgroup /back

#change new to user
USER appuser

CMD ["npm", "run", "start:prod"]