# ---- deps stage: compile the better-sqlite3 native addon ----
FROM node:20-bookworm-slim AS deps

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ---- final stage: slim runtime image, no build tools ----
FROM node:20-bookworm-slim

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PORT=4004
EXPOSE 4004

CMD ["node", "server.js"]
