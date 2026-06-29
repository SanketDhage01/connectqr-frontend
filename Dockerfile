# Stage 1: Build Vite bundle
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Inject build time envs if needed (Vite loads VITE_* variables)
# We default to relative ports but can be overridden in build params
ARG VITE_API_URL=/api
ARG VITE_SOCKET_URL=/

RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Replace default configuration with custom router-friendly one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
