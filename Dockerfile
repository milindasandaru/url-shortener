# Use Node.js v18 (lightweight Alpine base image)
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY src ./src

# Create data folder for SQLite
RUN mkdir -p /app/data

# Expose the app port
EXPOSE 3000

# Set environment variable
ENV PUBLIC_BASE_URL=http://localhost:3000

# Run the app
CMD ["node", "src/index.js"]
