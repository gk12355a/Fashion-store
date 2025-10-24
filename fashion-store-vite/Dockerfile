# Stage build
FROM node:22.21.0-alpine AS build

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Stage runtime
FROM nginx:alpine

# Sao chép file build từ stage build
COPY --from=build /app/dist /usr/share/nginx/html

# Sao chép nginx.conf vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
