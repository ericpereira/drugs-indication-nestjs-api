# Dockerfile
FROM node:18-alpine

# Defines the work directory
WORKDIR /app

# Copies the package files and package-lock.json
COPY package*.json ./

# Install the premises
RUN npm install

# Copy the whole project
COPY . .

# Compiles the project
RUN npm run build

# Exposes the standard gate of NESTJS
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "start:prod"]
