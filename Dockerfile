# Build and production in single stage
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# First install dependencies
COPY package*.json ./

# Install all dependencies for build
RUN npm install

# Copy application source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD [ "node", "dist/src/main.js" ]