# syntax=docker/dockerfile:1.4
# We use a specific Node.js version to ensure consistent builds
FROM node:24-alpine3.22

# Use production environment by default
ENV NODE_ENV dev
# ENV NODE_ENV prod

# Set the working directory
WORKDIR /app

# Copy only the dependency manifest files first to leverage build cache
COPY package*.json .

# Give the 'node' user ownership of the /app directory
# This step is critical and must be done as 'root' before switching users
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Install dependencies in a separate layer
# This step is the most time-consuming; caching it is crucial
# RUN npm ci --omit=dev
RUN npm ci

# Copy the rest of the application source code
COPY --chown=node:node . .

# Expose the application port
EXPOSE 5800

# Start the application
# CMD [ "npm", "start" ]
CMD [ "npm", "run", "dev" ]