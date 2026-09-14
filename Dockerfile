# God's Eye View runs as the Vite dev server: the API proxies are Vite
# middleware and client keys are injected when the config loads.
# The Node version must match .node-version: the spec gates stop on any other
# version because V8 versions give different coverage counts.
FROM node:24.21.0-bookworm-slim

# The spec gates read the Git history.
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer is a QA-only devDependency; skip its Chrome download.
ENV PUPPETEER_SKIP_DOWNLOAD=1 \
    NODE_ENV=development \
    HOST=0.0.0.0 \
    PORT=4173

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force

COPY --chown=node:node . .
RUN mkdir -p .gev-cache .gev-logs

EXPOSE 4173

CMD ["npm", "run", "dev"]
