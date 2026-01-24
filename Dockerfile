# Use official Node.js image
FROM node:22-slim

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install app dependencies
RUN npm install --production

# Copy app source
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
