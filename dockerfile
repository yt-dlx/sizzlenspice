FROM ubuntu:latest

# Update and install necessary packages
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl gnupg2 apt-utils git && \
    apt-get clean

# Add NodeSource repository and install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Install npm and Yarn
RUN apt-get install -y npm && \
    npm install -g yarn && \
    apt-get clean

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies and build your application
RUN yarn install && \
    yarn build

# Expose the port your app runs on
EXPOSE 8000

# Command to run your application
CMD ["yarn", "start"]
