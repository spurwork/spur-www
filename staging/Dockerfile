# Staging preview image: static site behind the shared-code gate.
# Build context is this folder; ./site holds the built static files.
FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./
COPY site ./site
ENV ROOT=/app/site PORT=8080 NODE_ENV=production
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
