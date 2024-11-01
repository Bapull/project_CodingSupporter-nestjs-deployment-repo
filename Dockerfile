# Build and production in single stage
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install and only production deps
RUN npm ci --only=production

# Copy application source
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD [ "node", "dist/src/main.js" ]