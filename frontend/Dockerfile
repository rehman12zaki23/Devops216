# older version of dockerfile
# FROM node:22
# WORKDIR /app
# COPY . .
# RUN npm install
# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
# newer version of dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . . 
RUN npm run build
# satage 2: of dockerfile
FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]