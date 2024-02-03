# Specify the base image
FROM node:20

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Generate schema types
RUN npx drizzle-kit generate:pg


# Expose a port
EXPOSE 3000

# Start the application
CMD [ "npm", "run", "docker" ]
