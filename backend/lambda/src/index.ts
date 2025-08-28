import http from 'http';
import app from './app';
import { env } from './config/env';
import { initSocketServer } from './sockets/socket';
import { connectDB } from './db/connect';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
dotenv.config();
const server = http.createServer(app);
const io = initSocketServer(server);
const serverlessHandler = serverless(app);
export const handler = async (event: any, context: any) => {
    await connectDB(env.MONGODB_URI);
    return serverlessHandler(event, context);
};
const start = async () => {
    try {
        await connectDB(env.MONGODB_URI);
        server.listen(env.PORT, () => {
            console.log(`Server listening on http://localhost:${env.PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

if (process.env.IS_LOCAL) {
    start();

}
export { io };
