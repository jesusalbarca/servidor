# Use the official Node.js runtime as the base image
FROM node:14

# Create a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your application is listening on
EXPOSE 3000

# Command to run your Node.js application
CMD ["node", "server.js"]
