FROM node:22-alpine AS builder
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./ ./
RUN npm install
RUN npm run generate

FROM nginx:alpine
COPY --from=builder /usr/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]