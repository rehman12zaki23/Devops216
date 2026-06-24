# older version of dockerfile
# FROM node:22
# WORKDIR /app
# COPY . . 
# RUN npm install 
# EXPOSE 5000
# CMD ["npm", "start"]

# newer version of dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json .
# COPY .env .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm","start"]

