#Node.js image as parent image
FROM node:14

#Copy files
COPY package*.json ./

#Install dependencies
RUN npm install 

#Copy the rest of the application code
COPY . . 

#Expose port 3000 to access the React app
EXPOSE 3000

#Command to start the React app
CMD [ "node", "app.js" ]