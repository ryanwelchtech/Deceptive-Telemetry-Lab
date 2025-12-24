FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine
WORKDIR /app
RUN addgroup -S detel && adduser -S detel -G detel
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN chown -R detel:detel /app
USER detel
EXPOSE 8084
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8084/health || exit 1
CMD ["node","index.js"]
