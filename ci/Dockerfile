# Use latest node version 16.15.1
FROM node:20.11.1-slim AS builder

# create app directory in container
RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

# Copy Project to app directory
COPY . .

RUN npm install
RUN npm run build


# ################
# Create Runtime Docker Image
FROM node:20.11.1-slim
WORKDIR /app

COPY --from=builder /app/ .

RUN npm install --production

EXPOSE 3001

# cmd to start service
CMD [ "npm", "run", "start:prod" ]

