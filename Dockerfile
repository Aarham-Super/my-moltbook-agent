# 1. Use the official Node.js image
FROM node:20

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your bot code
COPY . .

# 5. Start the bot using your script name
CMD ["node", "moltbook-auto.js"]
