FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variable for build
ENV VITE_BASE_PATH=/dashboard

# Build the frontend
RUN pnpm build

# Ensure dist directory exists
RUN ls -la dist/ || echo "No dist directory found"

# Expose port (adjust if your backend uses a different port)
EXPOSE 3031

# Start the application
CMD ["pnpm", "start"]