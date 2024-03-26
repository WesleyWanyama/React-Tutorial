# Setting up React App with Nginx on Docker (Nginx Reverse Proxy)
This is a documentation on the process of setting up a React app served by Nginx on Docker, with additional configurations for proxying requests and handling SSL.

## Steps:
### 1. Update React App Configuration
Before building the React app, make sure to adjust the 'package.json' file by adding '"homepage":"."'. This ensures that the React app will be served from the current directory and all asset paths are relative to 'index.html'
```
{
  "name": "react-app",
  "version": "0.1.0",
  "private": true,
  "homepage": ".",
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.6.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
}
```

### 2. Build the React App
Run the following command to create a build directory with a production build of your app.
```
npm run build
```

### 3. Create Nginx Configuration File
In the same directory as your React app, create an 'nginx.conf' file. This file is used to set the root directory from which Nginx will serve files. It also directs all requests to the root URL to 'index.html'.
```nginx
server {
    listen 80;

    root /usr/share/nginx/html/;
    index index.html;

    server_name _;

    location / {
        try_files $uri /index.html;
    }
}
```

### 4. Create Dockerfile for React App
Create a 'Dockerfile' in the React app directory which will be used to build the React app image using Nginx as the base image. The Nginx configuration will be copied in this file.
```Dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY build/ /usr/share/nginx/html/
EXPOSE 80
```

### 5. Build Docker Image
Build the docker image for the React up by running the following command:
```bash
docker build -t image_name .
```

### 6. Run Docker Container
Run a Docker container using the built image:
```bash
docker run -d --name container_name -p 82:80 image_name
```
This command runs the container and maps port 82 on the host to port 80 in the container.

### 7. Configure Nginx for Proxying
Create a second 'nginx.conf' file in a different directory with configurations for proxying requests. This configuration sets up Nginx to listen on HTTPS, handles SSL certificates, and proxies requests to different services based on the URL path.
```nginx
server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate /etc/nginx/conf.d/nginx-selfsigned.crt;
    ssl_certificate_key /etc/nginx/conf.d/nginx-selfsigned.key;

    location /api/ {
        proxy_pass http://backend:8080;
    }

    location /app/ {
        proxy_pass http://frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        #rewrite ^/app/(.*) /$1 break;
    }
}
```

### 8. Create Docker Compose File
Create a 'docker-compose.yml' file to orchestrate the Docker containers. 
```yaml
version: '3.8'

services:
  frontend:
    restart: always
    image: react-frontend:v10
    container_name: frontend
    ports:
      - "3000:80"

  backend:
    # Backend service configuration

  database:
    # Database service configuration

  nginx:
    image: nginx:alpine
    container_name: nginx
    volumes:
      - ./nginx:/etc/nginx/conf.d
    ports:
      - "443:443"
    depends_on:
      - frontend
      - backend
```
The Nginx service mounts the custom Nginx configuration directory.

### 9. Run Docker Compose
Use the following command to run the compose file 
```bash
docker-compose up -d
```

## Accessing the React App
After completing the setup, you can access the React app at the following URLs:
**. HTTPS**: https://localhost/app/
**. HTTP (React App)**: http://localhost:3000
**. HTTP (Nginx Proxy)**: http://localhost:82
