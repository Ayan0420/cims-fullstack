# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the dependency files first
COPY package*.json ./

# Install server dependencies
RUN npm install

# Copy the entire app
COPY . .

# Install client dependencies and build client
RUN cd client && npm install && npm run build

# Build the NestJS backend
RUN npx nest build

# Expose the app port
EXPOSE 4444

# Start the app
CMD ["node", "dist/main"]
