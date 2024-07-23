# MERN

This is a simple NodeJS + Express + React + MongoDB application. This application serves as a basic template for a mern applications.

What does this application do?
-------------------------------
This application serves a simple MERN based TODO application to demonstrate the use of MERN stack. This application uses following technologies:
- MongoDB: used as database
- Express: used as web application framework
- React: used as frontend framework to build UI
- NodeJS: used as backend server


## How to run

Before running the application, make sure all dependencies are installed. 

1. Install server & client dependencies, run following command in terminal:
   > `npm install; cd client && npm install && cd ..`

2. Run following command to start both server and client:
   > `npm run dev`

3. Refresh the URL in simple browser to see the output. As shown below
   ![](https://static.onecompiler.com/images/posts/3zzkbysj7/mern-reload.png)



## FAQs & Debugging

### 1. Node server failing to connect to Database

   Ensure Mongo_DB_URI is set in .env file. If not, create a new file named `.env` in root directory and add following line:
   > `MONGO_DB_URI=<YOUR_MONGO_DB_URI>`

   Once the studio is connected to your workspace, `MONGO_DB_URI` should be automatically set in your `.env` file.

   Alternatively, you can create `MONGO_DB_URI` using value present in the file **.vscode/.studio/studio-env.json**.
   MONGO_DB_URI typically looks like this:
> `mongodb://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>`

### 2. Can I start server and client separately?   
   `npm run dev` starts both server and client. If you want to start them separately, you can use following commands:
   - `npm run server`: to start server
   - `npm run client`: to start client
