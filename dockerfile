FROM ubuntu:latest

# Update package lists and upgrade installed packages
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl gnupg2 && \
    apt-get install -y --no-install-recommends apt-utils && \
    apt-get clean

# Install Node.js and npm using NodeSource setup script
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs npm git && \
    apt-get clean

# Install Yarn globally
RUN npm install -g yarn

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to WORKDIR
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build your application (if necessary)
RUN yarn build

# Expose port 8000
EXPOSE 8000

# Command to run your application
CMD ["yarn", "run", "start"]
