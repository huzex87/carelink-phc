# Multi-stage Dockerfile for CareLink PHC
# Designed for production stability and small image footprint

# --- Stage 1: Build ---
FROM node:20-slim AS builder
WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY tsconfig.json ./

# Copy sub-projects
COPY backend ./backend
COPY indicator-engine ./indicator-engine
COPY frontend ./frontend

# Install dependencies and build
RUN npm install
RUN cd backend && npm install && npm run build
RUN cd indicator-engine && npm install && npm run build
RUN cd frontend && npm install && npm run build

# --- Stage 2: Runtime (Backend/Indicator) ---
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/indicator-engine/dist ./indicator-engine/dist
COPY --from=builder /app/indicator-engine/package*.json ./indicator-engine/

# Install production dependencies only
RUN cd backend && npm install --omit=dev
RUN cd indicator-engine && npm install --omit=dev

# Expose API port
EXPOSE 3001

# Default command starts the backend service
CMD ["node", "backend/dist/index.js"]
