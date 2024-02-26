# Start with the official Node.js Docker image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the project
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run npm start to start
CMD ["npm", "start"]