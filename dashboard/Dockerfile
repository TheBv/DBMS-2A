# Use the official Node.js image as the base image
FROM node:20


WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .


# Expose the port that the Vite server will be running on
EXPOSE 5173

# Start the Vite server
CMD ["npm", "run", "dev"]
