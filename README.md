# Setting up React App with Nginx on Docker (Nginx Reverse Proxy)
This is a documentation on the process of setting up a React app served by Nginx on Docker, with additional configurations for proxying requests and handling SSL.

## Steps:
### 1. Update React App Configuration
Before building the React app, make sure to adjust the 'package.json' file by adding '"homepage":"."'. This ensures that the React app will be served from the current directory and all asset paths are relative to 'index.html'

### 2. Build the React App
Run the following command to create a build directory with a production build of your app.
```
npm run build
```

