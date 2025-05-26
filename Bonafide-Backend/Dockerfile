FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    && apk add --no-cache \
    cairo-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

# Set environment variables (can be overridden in docker-compose)
ENV NODE_ENV=production \
    PORT=4000


EXPOSE 4000

CMD ["node", "server.js"]