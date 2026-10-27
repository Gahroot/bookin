FROM node:24-slim
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
# Codex CLI (pinned): runs on the owner's ChatGPT subscription. Auth lives on the /data volume, never in the image.
RUN npm i -g @openai/codex@0.164.0 && codex --version
ENV CODEX_HOME=/data/codex
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY config ./config
COPY start.sh ./start.sh
ENV NODE_ENV=production
CMD ["sh", "start.sh"]
