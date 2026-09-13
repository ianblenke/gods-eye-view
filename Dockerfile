# God's Eye View runs as the Vite dev server: the API proxies are Vite
# middleware and client keys are injected when the config loads.
FROM node:24-bookworm-slim

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
