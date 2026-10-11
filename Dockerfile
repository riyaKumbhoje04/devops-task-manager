# Use lightweight official Node.js runtime
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose application port
EXPOSE 3000

# Run the app
CMD ["node", "app.js"]
