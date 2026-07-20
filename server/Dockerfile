# Use the official Node.js 22 image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package files first (better Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose backend port
EXPOSE 5005

# Start the server
CMD ["npm", "start"]