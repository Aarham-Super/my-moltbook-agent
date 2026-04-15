# 1. Use Node.js version 20
FROM node:20

# 2. Create app directory
WORKDIR /app

# 3. Copy package files and install
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your code
COPY . .

# 5. UNLOCK THE PORT (This fixes the error you just got)
EXPOSE 3000

# 6. Start the bot
CMD ["node", "moltbook-auto.js"]
