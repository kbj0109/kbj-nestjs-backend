# Use latest node version 16.15.1
FROM node:20.11.1-slim AS builder

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# Copy Project to app directory
COPY ./src /app/src
COPY .env ./
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm install
RUN npm run build


# ################
# Create Runtime Docker Image
FROM node:20.11.1-slim
RUN npm install -g pm2
WORKDIR /app

COPY --from=builder /app/dist ./src
COPY --from=builder /app/.env ./
COPY --from=builder /app/package.json ./package.json
COPY pm2.json ./

RUN npm install --productiond

EXPOSE 3000

# cmd to start service
CMD [ "pm2-runtime", "start", "pm2.json" ]

