# syntax=docker/dockerfile:1

# Node 22 LTS, pinned to today's digest for reproducible builds.
# To bump: docker pull node:22-alpine && docker image inspect node:22-alpine --format '{{index .RepoDigests 0}}'
FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Dependency layer: only invalidated when the manifest or lockfile changes.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so they must be provided as build args, not runtime env.
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_API_URL=/api
ARG API_URL_INTERNAL=http://backend:5000
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_PROJECTS_COMPLETED
ARG NEXT_PUBLIC_HAPPY_CUSTOMERS
ARG NEXT_PUBLIC_YEARS_OF_EXPERIENCE
ARG NEXT_PUBLIC_TYPES_OF_CURTAINS

ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    API_URL_INTERNAL=$API_URL_INTERNAL \
    NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID \
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID \
    NEXT_PUBLIC_PROJECTS_COMPLETED=$NEXT_PUBLIC_PROJECTS_COMPLETED \
    NEXT_PUBLIC_HAPPY_CUSTOMERS=$NEXT_PUBLIC_HAPPY_CUSTOMERS \
    NEXT_PUBLIC_YEARS_OF_EXPERIENCE=$NEXT_PUBLIC_YEARS_OF_EXPERIENCE \
    NEXT_PUBLIC_TYPES_OF_CURTAINS=$NEXT_PUBLIC_TYPES_OF_CURTAINS

RUN npm run build

# Runtime image: only the standalone server and static assets.
FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Rewrites from next.config.js are resolved at build time; the value below is
# informational for operators. Changing the backend URL requires a rebuild.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider "http://127.0.0.1:${PORT:-3000}/" || exit 1

CMD ["node", "server.js"]
